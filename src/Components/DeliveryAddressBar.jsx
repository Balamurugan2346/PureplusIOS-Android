import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppText from './AppText';
import { useTheme } from '../Context/ThemeContext';
import { spacing, radius } from '../Themes/Themes';

/**
 * Reusable delivery-address bar — TRIGGER ONLY (presentational).
 *
 * Shows the currently selected delivery address with a "Change" button. It does NOT own the
 * bottom sheet: the parent renders the shared AddressScreen inside a <BottomSheet> at the
 * SCREEN ROOT (the exact pattern CartScreen uses with PayButtonWithAddressBar). This keeps the
 * sheet's absolute-fill overlay full-screen instead of being clipped inside a ScrollView.
 *
 * (Distinct from the older display-only `AddressBar` pill used on the Dashboard.)
 *
 * Props:
 *   - address  (object|null)  the selected address object; null → "Add" state.
 *   - onPress  ()             open the address bottom sheet (parent-owned).
 *   - surface  (optional)     color overrides for white screens, e.g. `lightSurface`.
 *                             Brand accent always comes from the active theme's `primary`.
 *   - style    (optional)     extra container style.
 */
const DeliveryAddressBar = ({ address, onPress, surface, style }) => {
  const { theme } = useTheme();
  // Surface overrides let this render on a white screen; brand primary stays from the theme.
  const c = { ...theme, ...(surface || {}) };

  const hasAddr = !!address;
  const tag = address?.tag || address?.addressType || 'Home';
  const line1 = address?.addressLine1 || address?.address || '';
  const pincode = address?.pincode || address?.pinCode || address?.pin_code;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: c.cardContainer || '#FFFFFF',
          borderColor: hasAddr ? (c.divider || '#E5E8EF') : (c.error || '#FF4C4C'),
        },
        style,
      ]}
    >
      <View style={styles.row}>
        <View style={[styles.iconWrap, { backgroundColor: `${theme.primary}22` }]}>
          <Ionicons name="location" color={theme.primary} size={22} />
        </View>

        <View style={styles.body}>
          <AppText variant="label" color={c.secondaryText}>
            {hasAddr ? `Delivering to · ${tag}` : 'Address required'}
          </AppText>
          <AppText variant="bodyStrong" color={c.text} numberOfLines={2} style={{ marginTop: 2 }}>
            {hasAddr ? line1 : 'Add a delivery address to continue'}
          </AppText>
          {hasAddr && pincode ? (
            <AppText variant="caption" color={c.secondaryText} style={{ marginTop: 2 }}>
              {pincode}
            </AppText>
          ) : null}
        </View>

        <TouchableOpacity
          onPress={onPress}
          style={[styles.changeBtn, { borderColor: theme.primary }]}
          activeOpacity={0.8}
        >
          <AppText variant="bodyStrong" color={theme.primary}>
            {hasAddr ? 'Change' : 'Add'}
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.md,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1, marginLeft: spacing.md },
  changeBtn: {
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginLeft: spacing.sm,
  },
});

export default DeliveryAddressBar;
