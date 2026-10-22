import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { loadCartItems, updateCart } from '../../Redux/Slices/CartSlice';
import { useUserId } from '../../customHooks/useUserID';
import { useTheme } from '../../Context/ThemeContext';
import { useToast } from '../Toast/ToastProvider';
import AppButton from '../AppButton';
import QuantityStepper from '../QuantityStepper';
import { fontFamily, radius, spacing, floatShadow } from '../../Themes/Themes';
import formatCurrency from '../../Utils/formatCurrency';

/**
 * Sticky product bottom bar (redesign 02). Cart cart-icon + count → CartScreen;
 * then "Add to cart · ₹price" or, when in cart, a QuantityStepper + "View Cart".
 * All cart logic (updateCart / loadCartItems / useUserId / toasts) is unchanged;
 * the reanimated width animation was replaced with a plain state swap.
 */
export default function CartButton({ product, navigation }) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { cartItems } = useSelector((state) => state.cart);
  const { showToast } = useToast();

  const cartItem = cartItems?.find((item) => item.productId === product.productId);
  const quantity = cartItem ? cartItem.quantity : 0;
  const added = quantity > 0;

  const dispatch = useDispatch();
  const { userId, loading: userIDLoading } = useUserId();

  const handleAdd = () => {
    if (!added && !userIDLoading && userId) {
      dispatch(
        updateCart({
          cart: { productId: product.productId, quantity: 1 },
          onSuccess: () => {
            dispatch(loadCartItems());
          },
          onError: () => {
            showToast('Unable to update quantityyy !!', true, { alignTop: true });
          },
        })
      );
    } else {
      if (cartItem) {
        dispatch(
          updateCart({
            cart: { productId: cartItem.productId, quantity: cartItem.quantity + 1 },
            onSuccess: () => {
              dispatch(loadCartItems());
            },
            onError: () => {
              showToast('Unable to add quantity !!', true, { alignTop: true });
            },
          })
        );
      }
    }
  };

  const handleDecrement = () => {
    // At quantity 1, decreasing takes it to 0 — the backend `cart/add` upsert
    // (delete-at-0) removes the line entirely, so the item leaves the cart.
    if (cartItem && quantity >= 1) {
      dispatch(
        updateCart({
          cart: { productId: cartItem.productId, quantity: cartItem.quantity - 1 },
          onSuccess: () => {
            dispatch(loadCartItems());
          },
          onError: () => {
            showToast('Unable to remove quantity !!', true, { alignTop: true });
          },
        })
      );
    }
  };

  useEffect(() => {
    console.log('cart item', cartItem);
  }, []);

  const count = cartItems?.length || 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.surfaceCard, paddingBottom: insets.bottom + 28 }, floatShadow]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('CartScreen')}
        style={[styles.cartWell, { backgroundColor: theme.primaryTint }]}
      >
        <Ionicons name="cart" size={22} color={theme.primary} />
        {count > 0 && (
          <View style={[styles.badge, { backgroundColor: theme.danger, borderColor: theme.surfaceCard }]}>
            <Text style={[styles.badgeText, { color: theme.onInk }]}>{count}</Text>
          </View>
        )}
      </TouchableOpacity>

      {!added ? (
        <View style={{ flex: 1 }}>
          <AppButton title={`Add to cart · ${formatCurrency(product.unitPrice)}`} onAction={handleAdd} />
        </View>
      ) : (
        <>
          <QuantityStepper size="large" value={quantity} min={0} onIncrease={handleAdd} onDecrease={handleDecrement} />
          <View style={{ flex: 1 }}>
            <AppButton title="View Cart" onAction={() => navigation.navigate('CartScreen')} />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  cartWell: { width: 52, height: 52, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontFamily: fontFamily.semibold, fontSize: 11, lineHeight: 14 },
});
