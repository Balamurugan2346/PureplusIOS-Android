import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import Fonts from '../../../assets/fonts/Fonts';
import { useTheme } from '../../Context/ThemeContext';

/**
 * Product list-item card for the dashboard rail (CUS-10).
 * Redesigned 2026-10-10 (layout + info hierarchy only — theme colors unchanged):
 *   • taller, cleaner image well with overlay chips (info + in-cart)
 *   • 2-line title with reserved height so cards align in the rail
 *   • a single clear "pack" info chip (1 unit = N cans)
 *   • a price block with a prominent per-unit price + quiet per-can secondary
 *   • a full "ADD" pill (tappable target) that flips to an in-cart state
 * Props: product, onPress (open detail / add), onInfoClick (optional quick-view).
 * Behaviour is unchanged — onPress still opens the detail screen where qty is chosen.
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
  const inCart = quantity > 0;

  const image =
    product?.imageUrls && product.imageUrls.length > 0
      ? { uri: product.imageUrls[0] }
      : require('../../../assets/images/no_image.png');

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: inCart ? theme.primary : 'transparent',
          opacity: pressed ? 0.92 : 1,
        },
      ]}
    >
      {/* IMAGE WELL */}
      <View style={styles.imageWrapper}>
        <Image source={image} style={styles.image} resizeMode="cover" />

        {onInfoClick && (
          <TouchableOpacity style={styles.infoBtn} onPress={onInfoClick} hitSlop={8}>
            <Ionicons name="information-circle" size={20} color={theme.primary} />
          </TouchableOpacity>
        )}

        {inCart && (
          <View style={[styles.cartBadge, { backgroundColor: theme.primary }]}>
            <Ionicons name="cart" size={11} color={theme.buttonText} />
            <Text style={[styles.cartBadgeText, { color: theme.buttonText }]}>{quantity}</Text>
          </View>
        )}
      </View>

      {/* NAME */}
      <Text style={[styles.title, { color: theme.highlightedText }]} numberOfLines={2}>
        {name}
      </Text>

      {/* PACK INFO CHIP */}
      {unitCount != null && (
        <View style={[styles.unitBox, { backgroundColor: `${theme.primary}14` }]}>
          <Ionicons name="cube-outline" size={12} color={theme.primary} />
          <Text style={[styles.unitText, { color: theme.primary }]} numberOfLines={1}>
            1 unit = {unitCount} cans
          </Text>
        </View>
      )}

      {/* PRICE + ADD */}
      <View style={styles.footer}>
        <View style={styles.priceCol}>
          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: theme.highlightedText }]}>₹{unitPrice}</Text>
            <Text style={[styles.perUnit, { color: theme.secondaryText }]}> /unit</Text>
          </View>
          {basePrice != null && (
            <Text style={[styles.perCan, { color: theme.secondaryText }]}>₹{basePrice} / can</Text>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.addBtn,
            inCart
              ? { backgroundColor: `${theme.primary}1A`, borderColor: theme.primary, borderWidth: 1 }
              : { backgroundColor: theme.primary },
          ]}
          onPress={onPress}
          activeOpacity={0.85}
        >
          <Ionicons
            name={inCart ? 'checkmark' : 'add'}
            size={16}
            color={inCart ? theme.primary : theme.buttonText}
          />
          <Text
            style={[styles.addText, { color: inCart ? theme.primary : theme.buttonText }]}
          >
            {inCart ? 'Added' : 'Add'}
          </Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 176,
    borderRadius: 20,
    padding: 12,
    marginHorizontal: 8,
    marginVertical: 10,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  imageWrapper: {
    backgroundColor: '#EEF3F9',
    borderRadius: 16,
    height: 118,
    marginBottom: 10,
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  infoBtn: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 12,
  },
  cartBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  cartBadgeText: { fontSize: 10, fontFamily: Fonts.family.semiBold },
  title: {
    fontSize: 14,
    fontFamily: Fonts.family.semiBold,
    lineHeight: 18,
    marginBottom: 8,
    minHeight: 36,
  },
  unitBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  unitText: { fontSize: 11, fontFamily: Fonts.family.medium },
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  priceCol: { flexShrink: 1, marginRight: 6 },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end' },
  price: { fontSize: 19, fontFamily: Fonts.family.bold },
  perUnit: { fontSize: 12, marginBottom: 2 },
  perCan: { fontSize: 11, marginTop: 2, fontFamily: Fonts.family.regular },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
  },
  addText: { fontSize: 13, fontFamily: Fonts.family.semiBold },
});
