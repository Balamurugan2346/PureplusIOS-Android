// Generates a solid-black-on-transparent PNG glyph for "Bulk / Event" order.
// Pure Node (zlib only). Vector shapes rasterized with supersampling + even-odd fill.
// Concept: a stack of two crates/boxes (bulk) with a small 4-point star accent (event).
const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

const OUT = process.argv[2] || path.join(__dirname, '..', 'assets', 'images', 'bulk-event.png');
const SIZE = 512;   // final size
const SS = 4;       // supersample factor
const W = SIZE * SS;
const H = SIZE * SS;

// ---------- geometry helpers (design space is 0..24 viewBox, like UI icons) ----------
const VB = 24;
const scale = W / VB;
const YSHIFT = 1.2; // nudge whole design down for vertical centering
const P = (x, y) => [x * scale, (y + YSHIFT) * scale];

// rectangle (with optional corner rounding via segment approximation)
function rect(x, y, w, h, r = 0) {
  if (r <= 0) return [P(x, y), P(x + w, y), P(x + w, y + h), P(x, y + h)];
  const pts = [];
  const k = 8; // segments per corner
  const corners = [
    [x + w - r, y + r, -Math.PI / 2, 0],
    [x + w - r, y + h - r, 0, Math.PI / 2],
    [x + r, y + h - r, Math.PI / 2, Math.PI],
    [x + r, y + r, Math.PI, Math.PI * 1.5],
  ];
  for (const [cx, cy, a0, a1] of corners) {
    for (let i = 0; i <= k; i++) {
      const a = a0 + (a1 - a0) * (i / k);
      pts.push(P(cx + Math.cos(a) * r, cy + Math.sin(a) * r));
    }
  }
  return pts;
}

// n-pointed star
function star(cx, cy, outer, inner, points, rot = -Math.PI / 2) {
  const pts = [];
  for (let i = 0; i < points * 2; i++) {
    const rad = i % 2 === 0 ? outer : inner;
    const a = rot + (Math.PI * i) / points;
    pts.push(P(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad));
  }
  return pts;
}

// ---------- the design ----------
// Even-odd fill: outer polygon fills, inner polygons (holes) punch out.
// We build a list of polygons; winding/even-odd handles holes.
const polys = [];

// Bottom crate (wider, back) — slightly behind
const bx = 3.0, by = 11.8, bw = 14.5, bh = 8.0;
polys.push(rect(bx, by, bw, bh, 1.0));
// hole = inner panel to make it read as a box outline + internal cross
const inset = 1.3;
polys.push(rect(bx + inset, by + inset, bw - 2 * inset, bh - 2 * inset, 0.5));
// re-add a center vertical divider + horizontal slat inside the bottom crate
const cvx = bx + bw / 2 - 0.45;
polys.push(rect(cvx, by + inset, 0.9, bh - 2 * inset, 0)); // vertical bar (fills inside hole)
polys.push(rect(bx + inset, by + bh / 2 - 0.45, bw - 2 * inset, 0.9, 0)); // horizontal bar

// Top crate (narrower, sitting on top-left), offset to show a stack
const tx = 4.2, ty = 4.4, tw = 10.6, th = 7.4;
polys.push(rect(tx, ty, tw, th, 0.9));
polys.push(rect(tx + inset, ty + inset, tw - 2 * inset, th - 2 * inset, 0.5));
const tcvx = tx + tw / 2 - 0.42;
polys.push(rect(tcvx, ty + inset, 0.84, th - 2 * inset, 0));
polys.push(rect(tx + inset, ty + th / 2 - 0.42, tw - 2 * inset, 0.84, 0));

// Event accent: a star badge in the upper-right corner
const scx = 18.4, scy = 5.0;
polys.push(star(scx, scy, 3.6, 1.55, 4, -Math.PI / 2)); // 4-point sparkle star

// ---------- rasterize (even-odd, supersampled) ----------
// Alpha buffer at full-res, then box-downsample to SIZE.
const hi = new Uint8Array(W * H); // 0/1 coverage per hi-res pixel

function fillPolys(polygons) {
  // bounds
  let minY = H, maxY = 0;
  for (const poly of polygons) for (const [, y] of poly) { if (y < minY) minY = y; if (y > maxY) maxY = y; }
  minY = Math.max(0, Math.floor(minY));
  maxY = Math.min(H - 1, Math.ceil(maxY));

  for (let y = minY; y <= maxY; y++) {
    const yc = y + 0.5;
    const xs = [];
    for (const poly of polygons) {
      const n = poly.length;
      for (let i = 0; i < n; i++) {
        const [x1, y1] = poly[i];
        const [x2, y2] = poly[(i + 1) % n];
        if ((y1 <= yc && y2 > yc) || (y2 <= yc && y1 > yc)) {
          const t = (yc - y1) / (y2 - y1);
          xs.push(x1 + t * (x2 - x1));
        }
      }
    }
    xs.sort((a, b) => a - b);
    for (let i = 0; i + 1 < xs.length; i += 2) {
      let xa = Math.ceil(xs[i] - 0.5);
      let xb = Math.floor(xs[i + 1] - 0.5);
      if (xa < 0) xa = 0;
      if (xb > W - 1) xb = W - 1;
      const row = y * W;
      for (let x = xa; x <= xb; x++) hi[row + x] = 1;
    }
  }
}

// Even-odd across ALL polygons at once gives us holes automatically.
fillPolys(polys);

// Downsample to SIZE x SIZE, producing an 8-bit alpha value.
const out = Buffer.alloc(SIZE * SIZE * 4, 0);
for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    let acc = 0;
    for (let sy = 0; sy < SS; sy++) {
      const row = (y * SS + sy) * W + x * SS;
      for (let sx = 0; sx < SS; sx++) acc += hi[row + sx];
    }
    const a = Math.round((acc / (SS * SS)) * 255);
    const idx = (y * SIZE + x) * 4;
    // solid black fill, alpha = coverage (premultiplied-safe: RGB=0)
    out[idx] = 0;
    out[idx + 1] = 0;
    out[idx + 2] = 0;
    out[idx + 3] = a;
  }
}

// ---------- PNG encode (RGBA, 8-bit, color type 6) ----------
function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xEDB88320 & -(c & 1));
  }
  return (~c) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
  const t = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([t, data])), 0);
  return Buffer.concat([len, t, data, crc]);
}
const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(SIZE, 0); ihdr.writeUInt32BE(SIZE, 4);
ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

// add filter byte (0) per scanline
const raw = Buffer.alloc(SIZE * (SIZE * 4 + 1));
for (let y = 0; y < SIZE; y++) {
  raw[y * (SIZE * 4 + 1)] = 0;
  out.copy(raw, y * (SIZE * 4 + 1) + 1, y * SIZE * 4, (y + 1) * SIZE * 4);
}
const idat = zlib.deflateSync(raw, { level: 9 });
const png = Buffer.concat([
  sig,
  chunk('IHDR', ihdr),
  chunk('IDAT', idat),
  chunk('IEND', Buffer.alloc(0)),
]);
fs.writeFileSync(OUT, png);
console.log('WROTE', OUT, png.length, 'bytes', SIZE + 'x' + SIZE + ' RGBA');
