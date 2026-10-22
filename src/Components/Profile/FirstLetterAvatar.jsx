import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../Context/ThemeContext';
import { fontFamily } from '../../Themes/Themes';

/**
 * Circular initial avatar (redesign 02) — primary fill, onPrimary initial.
 * Props preserved: input, width, height, fontSize.
 */
const FirstLetterAvatar = ({ input, width = 70, height = 70, fontSize = 28 }) => {
  const { theme } = useTheme();
  if (!input || typeof input !== 'string') {
    return null;
  }

  const firstLetter = input.charAt(0).toUpperCase();

  return (
    <View style={[styles.container, { width, height, borderRadius: width / 2, backgroundColor: theme.primary }]}>
      <Text style={[styles.text, { fontSize, color: theme.onPrimary }]}>{firstLetter}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { justifyContent: 'center', alignItems: 'center' },
  text: { fontFamily: fontFamily.semibold },
});

export default FirstLetterAvatar;
