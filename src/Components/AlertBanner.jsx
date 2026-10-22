import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../Context/ThemeContext';
import { fontFamily, radius, spacing } from '../Themes/Themes';

/**
 * Banner (00-foundation, new) — an inline tone banner.
 *
 * NOTE: named `AlertBanner` because `Components/Banner.jsx` already exists (a promo
 * ad banner). This is the small success/danger/warning/info message row.
 *
 *   tone    - 'success' | 'danger' | 'warning' | 'info'
 *   text    - message
 *   icon    - optional Ionicons name (defaults per tone)
 *   style   - override
 */
const TONE_ICON = {
  success: 'checkmark-circle-outline',
  danger: 'alert-circle-outline',
  warning: 'warning-outline',
  info: 'information-circle-outline',
};

const AlertBanner = ({ tone = 'info', text, icon, style }) => {
  const { theme } = useTheme();
  const bg = theme[`${tone}Tint`] || theme.infoTint;
  const fg = theme[tone] || theme.info;
  return (
    <View style={[styles.row, { backgroundColor: bg }, style]}>
      <Ionicons name={icon || TONE_ICON[tone] || TONE_ICON.info} size={18} color={fg} />
      <Text style={[styles.text, { color: fg }]}>{text}</Text>
    </View>
  );
};

export default AlertBanner;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.sm,
  },
  text: { flex: 1, fontFamily: fontFamily.medium, fontSize: 13, lineHeight: 18 },
});
