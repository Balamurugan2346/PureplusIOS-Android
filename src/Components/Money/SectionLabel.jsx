import React from 'react';
import AppText from '../AppText';
import { useTheme } from '../../Context/ThemeContext';

/** Small uppercase section label (prompt 05): badge style, inkMuted, letterSpacing 0.6. */
const SectionLabel = ({ children, color, style }) => {
  const { theme } = useTheme();
  return (
    <AppText variant="badge" color={color || theme.inkMuted} style={[{ letterSpacing: 0.6 }, style]}>
      {children}
    </AppText>
  );
};

export default SectionLabel;
