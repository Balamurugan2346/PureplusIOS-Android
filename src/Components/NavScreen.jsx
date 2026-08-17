import React from 'react';
import { View } from 'react-native';
import TopAppBar from './TopAppBar';
import { spacing } from '../Themes/Themes';
import { useTheme } from '../Context/ThemeContext';

/**
 * Standard screen shell: the app's TopAppBar (back + title) + a themed,
 * padded body. Use on every stacked screen so the nav header is consistent.
 *
 *   <NavScreen title="Wallet" navigation={navigation}>...</NavScreen>
 */
const NavScreen = ({ title, navigation, children, padded = true, style }) => {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <TopAppBar title={title} navigation={navigation} />
      <View style={[{ flex: 1, paddingTop: spacing.md }, padded && { paddingHorizontal: spacing.lg }, style]}>
        {children}
      </View>
    </View>
  );
};

export default NavScreen;
