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
const NavScreen = ({ title, navigation, children, padded = true, style, background }) => {
  const { theme } = useTheme();
  // `background` lets a screen override the themed (dark) body — e.g. a white surface.
  const bodyBg = background ?? theme.background;
  return (
    <View style={{ flex: 1, backgroundColor: bodyBg }}>
      <TopAppBar title={title} navigation={navigation} />
      <View style={[{ flex: 1, paddingTop: spacing.md, backgroundColor: bodyBg }, padded && { paddingHorizontal: spacing.lg }, style]}>
        {children}
      </View>
    </View>
  );
};

export default NavScreen;
