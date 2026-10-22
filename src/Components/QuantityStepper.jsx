import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../Context/ThemeContext';
import { fontFamily, radius, spacing } from '../Themes/Themes';

/**
 * QuantityStepper (00-foundation, new): − / + pill stepper.
 *   value      - current count
 *   onIncrease - handler
 *   onDecrease - handler
 *   size       - 'default' (40) | 'large' (52)
 *   min        - minimum value (decrease disabled at min; default 0)
 *   style      - override
 */
const QuantityStepper = ({ value = 0, onIncrease, onDecrease, size = 'default', min = 0, style }) => {
  const { theme } = useTheme();
  const large = size === 'large';
  const btn = large ? 40 : 32;
  const atMin = value <= min;

  return (
    <View style={[styles.track, { backgroundColor: theme.primaryTint, height: large ? 52 : 40 }, style]}>
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={atMin}
        onPress={onDecrease}
        style={[styles.button, { width: btn, height: btn, borderRadius: btn / 2, backgroundColor: theme.surfaceCard, opacity: atMin ? 0.5 : 1 }]}
      >
        <Ionicons name="remove" size={20} color={theme.primary} />
      </TouchableOpacity>

      <Text style={[styles.count, { color: theme.ink }]}>{value}</Text>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onIncrease}
        style={[styles.button, { width: btn, height: btn, borderRadius: btn / 2, backgroundColor: theme.surfaceCard }]}
      >
        <Ionicons name="add" size={20} color={theme.primary} />
      </TouchableOpacity>
    </View>
  );
};

export default QuantityStepper;

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.pill,
    padding: spacing.xs,
  },
  button: { alignItems: 'center', justifyContent: 'center' },
  count: { minWidth: 28, textAlign: 'center', fontFamily: fontFamily.semibold, fontSize: 15, lineHeight: 22 },
});
