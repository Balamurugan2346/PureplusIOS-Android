import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../Context/ThemeContext';
import { fontFamily, radius, spacing } from '../Themes/Themes';

/**
 * RadioOption (00-foundation, new): a selectable row with a radio ring.
 *   label     - primary label
 *   caption   - optional secondary line
 *   icon      - optional Ionicons name (leading)
 *   selected  - selected state (primaryTint fill, primary border, filled radio)
 *   onPress   - handler
 *   style     - override
 */
const RadioOption = ({ label, caption, icon, selected = false, onPress, style }) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.row,
        {
          backgroundColor: selected ? theme.primaryTint : theme.surfaceCard,
          borderColor: selected ? theme.primary : theme.borderSubtle,
          borderWidth: selected ? 1.5 : 1,
        },
        style,
      ]}
    >
      {icon ? <Ionicons name={icon} size={20} color={selected ? theme.primary : theme.inkMuted} /> : null}

      <View style={{ flex: 1 }}>
        <Text style={[styles.label, { color: theme.ink }]}>{label}</Text>
        {caption ? <Text style={[styles.caption, { color: theme.inkMuted }]}>{caption}</Text> : null}
      </View>

      <View style={[styles.ring, { borderColor: selected ? theme.primary : theme.borderStrong }]}>
        {selected ? <View style={[styles.dot, { backgroundColor: theme.primary }]} /> : null}
      </View>
    </TouchableOpacity>
  );
};

export default RadioOption;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
  },
  label: { fontFamily: fontFamily.medium, fontSize: 15, lineHeight: 22 },
  caption: { fontFamily: fontFamily.regular, fontSize: 12, lineHeight: 16, marginTop: 2 },
  ring: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
});
