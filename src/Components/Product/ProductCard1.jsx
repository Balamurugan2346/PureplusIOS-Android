import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import Fonts from '../../../assets/fonts/Fonts';
import { useTheme } from '../../Context/ThemeContext';

/**
 * Clean product card for the dashboard rail.
 * Props: product, onPress (open detail), onInfoClick (optional quick-view).
 */
export default function ProductCard1({ product, onPress, onInfoClick }) {
  const { theme } = useTheme();
  const { cartItems } = useSelector((state) => state.cart);

  const name = product?.name ?? product?.productName ?? 'Product';
  const unitCount = product?.unitCount;
  const unitPrice = product?.unitPrice;
  const basePrice = product?.basePrice;

  const cartItem = cartItems?.find((item) => item.productId === product?.productId);
  const quantity = cartItem ? cartItem.quantity : 0;

  const image =
    product?.imageUrls && product.imageUrls.length > 0
      ? { uri: product.imageUrls[0] }
      : require('../../../assets/images/no_image.png');

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.card, opacity: pressed ? 0.92 : 1 },
      ]}
    >
      {/* IMAGE */}
      <View style={styles.imageWrapper}>
        <Image source={image} style={styles.image} resizeMode="cover" />

        {onInfoClick && (
          <TouchableOpacity style={styles.infoBtn} onPress={onInfoClick} hitSlop={8}>
            <Ionicons name="information-circle" size={20} color={theme.primary} />
          </TouchableOpacity>
        )}

        {quantity > 0 && (
          <View style={[styles.cartBadge, { backgroundColor: theme.primary }]}>
            <Text style={styles.cartBadgeText}>{quantity} in cart</Text>
          </View>
        )}
      </View>

      {/* NAME */}
      <Text style={[styles.title, { color: theme.highlightedText }]} numberOfLines={2}>
        {name}
      </Text>

      {/* UNIT CHIP */}
      {unitCount != null && (
        <View style={[styles.unitBox, { backgroundColor: `${theme.primary}1A` }]}>
          <Ionicons name="cube-outline" size={12} color={theme.primary} />
          <Text style={[styles.unitText, { color: theme.primary }]}>
            1 Unit · {unitCount} Cans
          </Text>
        </View>
      )}

      {/* PRICE + ADD */}
      <View style={styles.footer}>
        <View>
          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: theme.highlightedText }]}>₹{unitPrice}</Text>
            <Text style={[styles.perUnit, { color: theme.secondaryText }]}> / unit</Text>
          </View>
          {basePrice != null && (
            <Text style={[styles.perCan, { color: theme.secondaryText }]}>₹{basePrice} / can</Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: theme.primary }]}
          onPress={onPress}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={20} color={theme.buttonText} />
        </TouchableOpacity>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 172,
    borderRadius: 20,
    padding: 12,
    marginHorizontal: 8,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  imageWrapper: {
    backgroundColor: '#EEF3F9',
    borderRadius: 16,
    height: 110,
    marginBottom: 10,
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  infoBtn: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
  },
  cartBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  cartBadgeText: { color: '#fff', fontSize: 10, fontFamily: Fonts.family.semiBold },
  title: {
    fontSize: 14,
    fontFamily: Fonts.family.semiBold,
    marginBottom: 8,
    minHeight: 38,
  },
  unitBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  unitText: { fontSize: 11, fontFamily: Fonts.family.medium },
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end' },
  price: { fontSize: 19, fontFamily: Fonts.family.bold },
  perUnit: { fontSize: 12, marginLeft: 2, marginBottom: 2 },
  perCan: { fontSize: 11, marginTop: 2, fontFamily: Fonts.family.regular },
  addBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
