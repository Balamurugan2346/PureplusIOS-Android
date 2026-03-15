import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import Fonts from '../../../assets/fonts/Fonts';
import { useTheme } from '../../Context/ThemeContext';

export default function ProductCard1({ product, onPress }) {

  const { theme } = useTheme();
  const dispatch = useDispatch();

  const { cartItems } = useSelector((state) => state.cart);

  const cartItem = cartItems?.find(
    (item) => item.productId === product.productId
  );

  const quantity = cartItem ? cartItem.quantity : 0;

  const image =
    product.imageUrls && product.imageUrls.length > 0
      ? { uri: product.imageUrls[0] }
      : require('../../../assets/images/no_image.png');

  return (
    <Pressable onPress={onPress}>
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        
        {/* CART BADGE */}
        {quantity > 0 && (
          <View style={[styles.cartBadge, { backgroundColor: theme.primary }]}>
            <Text style={styles.cartBadgeText}>{quantity}</Text>
          </View>
        )}

        {/* IMAGE */}
        <View style={styles.imageWrapper}>
          <Image source={image} style={styles.image} resizeMode="cover" />
        </View>

        {/* PRODUCT NAME */}
        <Text
          style={[
            styles.title,
            { color: theme.text, fontFamily: Fonts.family.bold }
          ]}
          numberOfLines={2}
        >
          {product.name}
        </Text>

        {/* UNIT PACK INFO */}
        <View style={styles.unitBox}>
          <Text style={styles.unitText}>
            1 Unit = {product.unitCount} Cans
          </Text>
        </View>

        {/* PRICE SECTION */}
        <View style={styles.priceRow}>
          <Text
            style={[
              styles.price,
              { color: theme.text, fontFamily: Fonts.family.semiBold }
            ]}
          >
            ₹{product.unitPrice}
          </Text>

          <Text style={styles.perUnit}> / Unit</Text>
        </View>

        {/* PER CAN */}
        <Text style={styles.perCan}>
          ₹{product.basePrice} / Can
        </Text>

      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({

  card: {
    width: 170,
    borderRadius: 18,
    padding: 14,
    marginHorizontal: 10,
    marginVertical: 8,

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3
  },

  imageWrapper: {
    backgroundColor: '#F5F7FB',
    borderRadius: 14,
    // alignItems: 'center',
    // justifyContent: 'center',
    height: 90,
    marginBottom: 10
  },

  image: {
    width: 142,
    borderRadius:14,
    height: 90
  },

  title: {
    fontSize: 14,
    marginBottom: 6
  },

  unitBox: {
    backgroundColor: '#EEF6FF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 6
  },

  unitText: {
    fontSize: 11,
    color: '#3A6EA5',
    fontFamily: Fonts.family.medium
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end'
  },

  price: {
    fontSize: 18
  },

  perUnit: {
    fontSize: 12,
    color: '#888',
    marginLeft: 3
  },

  perCan: {
    fontSize: 12,
    color: '#777',
    marginTop: 2
  },

  cartBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center'
  },

  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700'
  }

});