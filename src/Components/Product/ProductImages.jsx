import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

/**
 * Product gallery images (redesign 02). Each image is full screen-width so the
 * parent's paging ScrollView snaps one image per page. Props preserved: imageUrls.
 */
const ProductImages = ({ imageUrls }) => {
  if (imageUrls && imageUrls.length > 0) {
    return (
      <View style={styles.row}>
        {imageUrls.map((img, index) => (
          <Image key={index} source={{ uri: img }} style={styles.productImage} resizeMode="contain" />
        ))}
      </View>
    );
  }

  return (
    <View style={styles.placeholder}>
      <Image source={require('../../../assets/images/no_image.png')} style={styles.productImage} resizeMode="contain" />
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  productImage: { width, height: 300 },
  placeholder: { width, height: 300, alignItems: 'center', justifyContent: 'center' },
});

export default ProductImages;
