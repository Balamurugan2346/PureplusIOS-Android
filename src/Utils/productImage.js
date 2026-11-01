/**
 * Product image resolution (shared by product detail, cart, orders list, order detail).
 *
 * The backend returns product images as an `imageUrls` array (ProductListResponse,
 * CartListResponse, OrderListResponse, OrderDetailResponse). Entries are RELATIVE server
 * paths (e.g. "/uploads/products/<guid>.png"), so each valid entry is made absolute by
 * prefixing the API base URL. A URL is only shown when:
 *   1. the array is non-empty, AND
 *   2. the entry looks like a real image — it ends in a known image extension
 *      (jpg, jpeg, png, gif, webp, bmp, heic, heif, avif), optionally with a ?query,
 *      or is a data:image URL.
 * Anything else (empty, non-image link, malformed) falls back to the bundled placeholder.
 */
import { API_BASE_URL } from '../API/Client';

// Bundled fallback shown when there is no usable product image.
export const PLACEHOLDER = require('../../assets/images/placeholder.png');

// Image URL/path ending in an image extension (ignoring any ?query / #hash).
const IMAGE_EXT = /\.(jpe?g|png|gif|webp|bmp|heic|heif|avif)(\?.*)?$/i;

/** Make a server-relative path absolute against the API base; absolute/data URLs are left as-is. */
export function toAbsoluteImageUrl(u) {
  const s = String(u || '').trim();
  if (!s) return s;
  if (s.startsWith('data:') || /^https?:\/\//i.test(s) || s.startsWith('//')) return s;
  const base = String(API_BASE_URL || '').replace(/\/+$/, '');
  return s.startsWith('/') ? base + s : base + '/' + s;
}

/** Normalise the many shapes the field can arrive in (array, JSON-string array, single string) to an array. */
function toArray(input) {
  if (!input) return [];
  if (Array.isArray(input)) return input;
  if (typeof input === 'string') {
    const s = input.trim();
    if (!s) return [];
    if (s.startsWith('[')) {
      try {
        const parsed = JSON.parse(s);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [s];
  }
  return [];
}

/** True when the string points at an image file by extension (absolute URL, relative path, or data:image). */
export function isValidImageUrl(u) {
  if (typeof u !== 'string') return false;
  const s = u.trim();
  if (!s) return false;
  if (s.startsWith('data:image/')) return true;
  return IMAGE_EXT.test(s.split('#')[0]);
}

/** Every valid image URL in the input, in order, made absolute (for galleries / multi-image rows). */
export function filterValidImageUris(input) {
  return toArray(input)
    .map((u) => (typeof u === 'string' ? u.trim() : ''))
    .filter(isValidImageUrl)
    .map(toAbsoluteImageUrl);
}

/** The first valid image URL, or null. */
export function pickProductImageUri(input) {
  const valid = filterValidImageUris(input);
  return valid.length > 0 ? valid[0] : null;
}

/** An <Image> `source` — `{ uri }` for the first valid image, else the bundled placeholder. */
export function resolveProductImageSource(input) {
  const uri = pickProductImageUri(input);
  return uri ? { uri } : PLACEHOLDER;
}
