import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../Context/ThemeContext';
import { fontFamily, radius, spacing } from '../Themes/Themes';

/**
 * SegmentedControl (00-foundation, new).
 *   options  - array of { label, value } (or plain strings)
 *   value    - selected value
 *   onChange - (value) => void
 *   style    - override
 */
const SegmentedControl = ({ options = [], value, onChange, style }) => {
  const { theme } = useTheme();
  const items = options.map((o) => (typeof o === 'string' ? { label: o, value: o } : o));

  return (
    <View style={[styles.track, { backgroundColor: theme.surfaceSunken }, style]}>
      {items.map((item) => {
        const selected = item.value === value;
        return (
          <TouchableOpacity
            key={String(item.value)}
            activeOpacity={0.8}
            onPress={() => onChange?.(item.value)}
            style={[
              styles.item,
              selected && { backgroundColor: theme.surfaceCard, borderColor: theme.primary, borderWidth: 1.5 },
            ]}
          >
            <Text
              style={[
                styles.label,
                { color: theme.ink },
                selected && { color: theme.primary, fontFamily: fontFamily.semibold },
              ]}
              numberOfLines={1}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default SegmentedControl;

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    borderRadius: radius.pill,
    padding: spacing.xs,
  },
  item: {
    flex: 1,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontFamily: fontFamily.medium, fontSize: 14, lineHeight: 20 },
});
