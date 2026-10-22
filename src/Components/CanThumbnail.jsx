import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useTheme } from '../Context/ThemeContext';
import { radius } from '../Themes/Themes';

const FALLBACK = require('../../assets/images/30L.png');

/**
 * CanThumbnail (00-foundation, new): a product image well.
 *   uri   - optional remote image url
 *   size  - 44 | 52 | 60 (default 52)
 *   style - override
 * Falls back to the bundled 30L can image when no uri is given.
 */
const CanThumbnail = ({ uri, size = 52, style }) => {
  const { theme } = useTheme();
  return (
    <View style={[styles.well, { width: size, height: size, backgroundColor: theme.sky200 }, style]}>
      <Image
        source={uri ? { uri } : FALLBACK}
        defaultSource={FALLBACK}
        resizeMode="contain"
        style={{ width: size - 8, height: size - 8 }}
      />
    </View>
  );
};

export default CanThumbnail;

const styles = StyleSheet.create({
  well: {
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
