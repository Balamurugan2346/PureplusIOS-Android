import React from 'react';
import { View } from 'react-native';
import TopAppBar from './TopAppBar';
import { spacing } from '../Themes/Themes';
import { useTheme } from '../Context/ThemeContext';

/**
 * Standard screen shell (00-foundation): the light TopAppBar (back + title) + a
 * padded body on `surface`. Everything is light now, but the `background` prop is
 * still accepted (overrides the body background) so callers keep working.
 *
 *   <NavScreen title="Wallet" navigation={navigation}>...</NavScreen>
 */
const NavScreen = ({ title, navigation, children, padded = true, style, background, right }) => {
  const { theme } = useTheme();
  const bodyBg = background ?? theme.surface;
  return (
    <View style={{ flex: 1, backgroundColor: bodyBg }}>
      <TopAppBar title={title} navigation={navigation} right={right} />
      <View
        style={[
          { flex: 1, paddingTop: spacing.sm, backgroundColor: bodyBg },
          padded && { paddingHorizontal: spacing.xl },
          style,
        ]}
      >
        {children}
      </View>
    </View>
  );
};

export default NavScreen;
