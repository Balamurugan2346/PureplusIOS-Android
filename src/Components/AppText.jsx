import React from 'react';
import { Text } from 'react-native';
import { typography } from '../Themes/Themes';
import { useTheme } from '../Context/ThemeContext';

/**
 * The single text primitive. No screen should set fontFamily/fontSize inline.
 *
 *   <AppText variant="h2">Title</AppText>
 *   <AppText variant="caption" color={theme.secondaryText}>Hint</AppText>
 *
 * variant: h1 | h2 | h3 | body | bodyStrong | caption | label | button | price
 */
const AppText = ({ variant = 'body', color, style, children, ...rest }) => {
  const { theme } = useTheme();
  const base = typography[variant] || typography.body;
  return (
    <Text style={[base, { color: color || theme.text }, style]} {...rest}>
      {children}
    </Text>
  );
};

export default AppText;
