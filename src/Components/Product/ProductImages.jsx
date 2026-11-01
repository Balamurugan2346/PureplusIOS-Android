import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import ProductImage from './ProductImage';
import { filterValidImageUris } from '../../Utils/productImage';

const { width } = Dimensions.get('window');

/**
 * Product gallery images (redesign 02). Each image is full screen-width so the
 * parent's paging ScrollView snaps one image per page. Only real image URLs are shown;
 * when none are valid a single placeholder page is rendered. Props preserved: imageUrls.
 */
const ProductImages = ({ imageUrls }) => {
  const uris = filterValidImageUris(imageUrls);

  if (uris.length > 0) {
    return (
      <View style={styles.row}>
        {uris.map((uri, index) => (
          <ProductImage key={index} uri={uri} style={styles.productImage} resizeMode="contain" />
        ))}
      </View>
    );
  }

  return (
    <View style={styles.placeholder}>
      <ProductImage imageUrls={[]} style={styles.productImage} resizeMode="contain" />
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  productImage: { width, height: 300 },
  placeholder: { width, height: 300, alignItems: 'center', justifyContent: 'center' },
});

export default ProductImages;
