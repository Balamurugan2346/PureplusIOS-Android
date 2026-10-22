import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../Context/ThemeContext';
import { fontFamily, radius, spacing } from '../Themes/Themes';

/**
 * Chip (00-foundation, new): a pill filter/toggle.
 *   label     - chip text
 *   selected  - selected state (ink fill, onInk text)
 *   count     - optional count pill inside (primaryTint / primary)
 *   onPress   - handler
 *   style     - override
 */
const Chip = ({ label, selected = false, count, onPress, style }) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.chip,
        { backgroundColor: selected ? theme.ink : theme.surfaceCard },
        style,
      ]}
    >
      <Text style={[styles.label, { color: selected ? theme.onInk : theme.inkMuted }]}>{label}</Text>
      {count !== undefined && count !== null ? (
        <View style={[styles.countPill, { backgroundColor: theme.primaryTint }]}>
          <Text style={[styles.countText, { color: theme.primary }]}>{count}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

export default Chip;

const styles = StyleSheet.create({
  chip: {
    height: 40,
    paddingHorizontal: spacing.lg + 4,
    borderRadius: radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  label: { fontFamily: fontFamily.medium, fontSize: 14, lineHeight: 20 },
  countPill: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.pill },
  countText: { fontFamily: fontFamily.semibold, fontSize: 11, lineHeight: 14 },
});
