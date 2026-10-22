import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppText from './AppText';
import { useTheme } from '../Context/ThemeContext';
import { spacing, radius } from '../Themes/Themes';

/**
 * Reusable delivery-address bar — TRIGGER ONLY (presentational). The parent owns
 * the bottom sheet (see CartScreen / PayButtonWithAddressBar).
 *
 * Props preserved: address (object|null), onPress, surface (color overrides for
 * legacy white screens), style. (00-foundation restyle.)
 */
const DeliveryAddressBar = ({ address, onPress, surface, style }) => {
  const { theme } = useTheme();
  const c = { ...theme, ...(surface || {}) };

  const hasAddr = !!address;
  const tag = address?.tag || address?.addressType || 'Home';
  const line1 = address?.addressLine1 || address?.address || '';
  const pincode = address?.pincode || address?.pinCode || address?.pin_code;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: c.surfaceCard || c.cardContainer,
          borderColor: hasAddr ? 'transparent' : theme.danger,
          borderWidth: hasAddr ? 0 : 2,
        },
        style,
      ]}
    >
      <View style={[styles.iconWell, { backgroundColor: hasAddr ? theme.primaryTint : theme.dangerTint }]}>
        <Ionicons name="location-outline" color={hasAddr ? theme.primary : theme.danger} size={22} />
      </View>

      <View style={styles.body}>
        <AppText variant="label" color={hasAddr ? theme.inkMuted : theme.danger}>
          {hasAddr ? `Delivering to · ${tag}` : 'Address required'}
        </AppText>
        <AppText variant="bodyStrong" color={theme.ink} numberOfLines={1} style={{ marginTop: 2 }}>
          {hasAddr ? line1 : 'Add a delivery address to continue'}
        </AppText>
        {hasAddr && pincode ? (
          <AppText variant="caption" color={theme.inkMuted} style={{ marginTop: 2 }}>
            {pincode}
          </AppText>
        ) : null}
      </View>

      <View style={[styles.changeBtn, { borderColor: theme.borderStrong }]}>
        <AppText variant="label" color={theme.ink}>{hasAddr ? 'Change' : 'Add'}</AppText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  iconWell: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1 },
  changeBtn: {
    borderWidth: 1.5,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DeliveryAddressBar;
