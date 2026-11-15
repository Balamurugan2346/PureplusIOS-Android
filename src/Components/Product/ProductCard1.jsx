import React from 'react';
import { View, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { useTheme } from '../../Context/ThemeContext';
import { fontFamily, radius, spacing } from '../../Themes/Themes';
import ProductImage from './ProductImage';

/**
 * Product list-item card for the dashboard rail (CUS-10, redesign 02).
 * Behaviour unchanged — onPress opens the detail screen where qty is chosen.
 * Props preserved: product, onPress, onInfoClick.
 */
export default function ProductCard1({ product, onPress, onInfoClick }) {
  const { theme } = useTheme();
  const { cartItems } = useSelector((state) => state.cart);

  const name = product?.name ?? product?.productName ?? 'Product';
  const unitCount = product?.unitCount;
  const unitPrice = product?.unitPrice;
  const uom = product?.uom;

  const cartItem = cartItems?.find((item) => item.productId === product?.productId);
  const quantity = cartItem ? cartItem.quantity : 0;
  const inCart = quantity > 0;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.surfaceCard,
          borderColor: inCart ? theme.primary : 'transparent',
          borderWidth: inCart ? 1.5 : 0,
          opacity: pressed ? 0.92 : 1,
        },
      ]}
    >
      {/* IMAGE WELL */}
      <View style={[styles.imageWell, { backgroundColor: theme.sky200 }]}>
        <ProductImage imageUrls={product?.imageUrls} style={styles.image} resizeMode="contain" />

        {onInfoClick && (
          <TouchableOpacity style={[styles.infoBtn, { backgroundColor: theme.surfaceCard }]} onPress={onInfoClick} hitSlop={8}>
            <Ionicons name="information-circle-outline" size={18} color={theme.ink} />
          </TouchableOpacity>
        )}

        {inCart && (
          <View style={[styles.cartBadge, { backgroundColor: theme.primary }]}>
            <Ionicons name="cart" size={14} color={theme.onPrimary} />
            <Text style={[styles.cartBadgeText, { color: theme.onPrimary }]}>{quantity}</Text>
          </View>
        )}
      </View>

      <View style={styles.body}>
        {/* NAME */}
        <Text style={[styles.title, { color: theme.ink }]} numberOfLines={2}>{name}</Text>

        {/* PACK INFO CHIP */}
        {unitCount != null && (
          <View style={[styles.unitChip, { backgroundColor: theme.primaryTint }]}>
            <Ionicons name="cube-outline" size={14} color={theme.primary} />
            <Text style={[styles.unitText, { color: theme.primary }]} numberOfLines={1}>1 unit = {unitCount} cans</Text>
          </View>
        )}

        {/* PRICE */}
        <View>
          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: theme.ink }]}>₹{unitPrice}</Text>
            <Text style={[styles.perUnit, { color: theme.inkMuted }]}> /unit</Text>
          </View>
          {uom ? (
            <View style={[styles.uomChip, { backgroundColor: theme.infoTint }]}>
              <Ionicons name="scale-outline" size={11} color={theme.info} />
              <Text style={[styles.uomText, { color: theme.info }]}>per {uom}</Text>
            </View>
          ) : null}
        </View>

        {/* ADD PILL */}
        <TouchableOpacity
          style={[
            styles.addBtn,
            inCart
              ? { backgroundColor: theme.surfaceCard, borderColor: theme.primary, borderWidth: 1.5 }
              : { backgroundColor: theme.primary },
          ]}
          onPress={onPress}
          activeOpacity={0.85}
        >
          <Ionicons name={inCart ? 'checkmark' : 'add'} size={16} color={inCart ? theme.primary : theme.onPrimary} />
          <Text style={[styles.addText, { color: inCart ? theme.primary : theme.onPrimary }]}>{inCart ? 'Added' : 'Add'}</Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { width: 184, borderRadius: radius.lg, padding: spacing.sm, marginRight: spacing.md, marginVertical: spacing.sm },
  imageWell: { height: 128, borderRadius: radius.md + 4, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  image: { width: '82%', height: '82%' },
  infoBtn: { position: 'absolute', top: 8, left: 8, borderRadius: radius.sm, padding: 4 },
  cartBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  cartBadgeText: { fontSize: 12, lineHeight: 16, fontFamily: fontFamily.semibold },
  body: { paddingHorizontal: spacing.sm, paddingTop: spacing.md, paddingBottom: spacing.xs, gap: spacing.sm },
  title: { fontSize: 15, lineHeight: 22, fontFamily: fontFamily.semibold, minHeight: 44 },
  unitChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4, paddingHorizontal: 10, borderRadius: radius.pill, alignSelf: 'flex-start' },
  unitText: { fontSize: 12, lineHeight: 16, fontFamily: fontFamily.medium },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end' },
  price: { fontSize: 16, lineHeight: 22, fontFamily: fontFamily.bold },
  perUnit: { fontSize: 12, marginBottom: 2 },
  uomChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 3, paddingHorizontal: 8, borderRadius: radius.pill, alignSelf: 'flex-start', marginTop: 4 },
  uomText: { fontSize: 11, lineHeight: 16, fontFamily: fontFamily.medium },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, height: 34, borderRadius: radius.pill },
  addText: { fontSize: 13, fontFamily: fontFamily.semibold },
});
