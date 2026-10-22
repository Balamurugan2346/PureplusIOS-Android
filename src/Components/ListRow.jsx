import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppText from './AppText';
import { radius, spacing } from '../Themes/Themes';
import { useTheme } from '../Context/ThemeContext';

/**
 * Shared account/menu row (prompt 04). Pressable row: 40×40 tone-tint icon well +
 * label + chevron. A 1px top divider separates rows (hidden on the first).
 *
 * Props: icon (Ionicons name), label, tone ('primary'|'success'|'warning'|'info'|'neutral'),
 *        onPress, first (bool — suppress the top divider), labelColor (optional override).
 */
const ListRow = ({ icon, label, tone = 'primary', onPress, first = false, labelColor }) => {
  const { theme } = useTheme();
  const color = theme[tone] || theme.primary;
  const tint = theme[`${tone}Tint`] || theme.primaryTint;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.row,
        !first && { borderTopWidth: 1, borderTopColor: theme.borderSubtle },
      ]}
    >
      <View style={[styles.well, { backgroundColor: tint }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <AppText variant="bodyStrong" color={labelColor || theme.ink} style={styles.label}>{label}</AppText>
      <Ionicons name="chevron-forward" size={18} color={theme.inkMuted} />
    </TouchableOpacity>
  );
};

export default ListRow;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    gap: spacing.md,
  },
  well: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { flex: 1, fontWeight: '500' },
});
