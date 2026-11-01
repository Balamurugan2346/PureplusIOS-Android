import { useEffect, useState } from 'react';
import { Image } from 'react-native';
import { PLACEHOLDER, resolveProductImageSource } from '../../Utils/productImage';

/**
 * A product image that falls back to the bundled placeholder when there is no usable
 * image URL (empty / non-image link) OR when a valid-looking URL fails to load at runtime
 * (broken link, 404). Used by product detail, cart, orders list and order detail so image
 * handling is identical everywhere.
 *
 * Props:
 *  - imageUrls   the raw field (array | JSON-string array | single string) — the first valid
 *                image is shown; pass this for single-thumb use.
 *  - uri         a single, already-validated URL (for galleries that map over several).
 *  - style / resizeMode  standard RN Image props.
 */
export default function ProductImage({ imageUrls, uri, style, resizeMode = 'cover' }) {
  const target = uri ? { uri } : resolveProductImageSource(imageUrls);
  const targetKey = target && target.uri ? target.uri : 'placeholder';
  const [failed, setFailed] = useState(false);

  // Reset the error state if the underlying image changes (e.g. list row recycled).
  useEffect(() => { setFailed(false); }, [targetKey]);

  return (
    <Image
      source={failed ? PLACEHOLDER : target}
      style={style}
      resizeMode={resizeMode}
      onError={() => setFailed(true)}
    />
  );
}
