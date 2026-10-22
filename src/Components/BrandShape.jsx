import React from 'react';
import { View } from 'react-native';

/**
 * BrandShape (00-foundation, new): the decorative drop / leaf shapes from the
 * logo, drawn in code — no image assets. A plain View with per-corner radii.
 *
 *   shape  - 'drop' | 'leaf'
 *   size   - px
 *   color  - a theme token VALUE (e.g. theme.brandBlue)
 *   rotate - optional rotation string (e.g. '135deg') for the map-pin use
 *   style  - absolute-positioning style
 *
 * Usage: <BrandShape shape="drop" size={230} color={theme.brandBlue} style={{ right: -50, top: 110 }} />
 * Parent containers that show shapes need overflow: 'hidden'.
 */
export default function BrandShape({ shape = 'drop', size = 200, color, rotate, style }) {
  const r = size / 2;
  const corners = shape === 'drop'
    ? { borderTopLeftRadius: r, borderTopRightRadius: 0, borderBottomRightRadius: r, borderBottomLeftRadius: r } // point at top-right, like the logo's drop
    : { borderTopLeftRadius: r, borderTopRightRadius: 0, borderBottomRightRadius: r, borderBottomLeftRadius: 0 }; // two opposite points, like the leaf
  return (
    <View
      pointerEvents="none"
      accessible={false}
      style={[
        { position: 'absolute', width: size, height: size, backgroundColor: color },
        corners,
        rotate ? { transform: [{ rotate }] } : null,
        style,
      ]}
    />
  );
}
