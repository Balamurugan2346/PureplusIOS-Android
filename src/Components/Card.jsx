import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../Context/ThemeContext';
import { radius, spacing } from '../Themes/Themes';

/**
 * Card (00-foundation, new): the standard surface container.
 * surfaceCard fill, radius 32 (lg), padding 16, NO shadow (cards never float).
 * `style` overrides; children render inside.
 */
const Card = ({ children, style }) => {
  const { theme } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: theme.surfaceCard }, style]}>
      {children}
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
});
