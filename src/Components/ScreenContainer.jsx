import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { spacing } from '../Themes/Themes';
import { useTheme } from '../Context/ThemeContext';

/**
 * Standard screen wrapper: safe-area + themed background + consistent padding.
 * Wrap every screen in this instead of a bare View, so background/insets are
 * uniform and a theme change is a one-line effect.
 *
 *   <ScreenContainer>
 *     ...screen content...
 *   </ScreenContainer>
 */
const ScreenContainer = ({ children, padded = true, edges = ['top', 'bottom'], style }) => {
  const { theme } = useTheme();
  return (
    <SafeAreaView edges={edges} style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={[styles.body, padded && { paddingHorizontal: spacing.lg }, style]}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  body: { flex: 1 },
});

export default ScreenContainer;
