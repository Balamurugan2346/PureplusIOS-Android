import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '../AppText';
import BrandShape from '../BrandShape';
import { useTheme } from '../../Context/ThemeContext';
import { radius, spacing } from '../../Themes/Themes';

/**
 * Product hero card (redesign 02): brandBlue card with decorative shapes and ink
 * text (never white on brandBlue). Props preserved: title, description.
 */
const ImageWithTitleDesc = ({
  title = 'Pure & Safe Hydration',
  description = 'Our commitment to your well-being.',
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.brandBlue }]}>
      <BrandShape shape="drop" size={170} color={theme.brandBlueLight} style={{ right: -40, top: -30 }} />
      <BrandShape shape="leaf" size={110} color={theme.brandGreen} style={{ right: 24, top: 10 }} />
      <View style={styles.text}>
        <AppText variant="price" color={theme.ink} style={styles.title}>{title}</AppText>
        <AppText variant="caption" color={theme.ink}>{description}</AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    aspectRatio: 16 / 9,
    justifyContent: 'flex-end',
  },
  text: { padding: spacing.xl, gap: 4 },
  title: { fontSize: 20, lineHeight: 26, fontWeight: '700' },
});

export default ImageWithTitleDesc;
