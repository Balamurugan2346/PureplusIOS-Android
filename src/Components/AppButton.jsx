import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../Context/ThemeContext';
import { fontFamily, radius, spacing } from '../Themes/Themes';

/**
 * Primary action button (00-foundation redesign).
 *
 * Props (all existing props preserved):
 *   title        - label text
 *   onAction     - press handler
 *   borderOnly   - legacy flag → outline variant (kept working)
 *   isLoading    - shows spinner + loadingText at FULL opacity
 *   loadingText  - label while loading (default "Loading...")
 *   style        - style override
 * Added optional props:
 *   variant      - 'primary' | 'borderOnly' | 'dark' | 'dangerSoft'
 *   size         - 'default' | 'small'  (small: height 36, 13px label)
 *   icon         - optional Ionicons name rendered left of the label (gap 8)
 *   disabled     - neutralTint fill, neutral text, no press
 */
const AppButton = ({
  title,
  onAction,
  borderOnly = false,
  style,
  isLoading = false,
  loadingText = 'Loading...',
  variant,
  size = 'default',
  icon,
  disabled = false,
}) => {
  const { theme } = useTheme();

  // borderOnly is the legacy way to ask for the outline variant.
  const resolved = variant || (borderOnly ? 'borderOnly' : 'primary');
  const small = size === 'small';

  let bg = theme.primary;
  let fg = theme.onPrimary;
  let borderColor = 'transparent';
  let borderWidth = 0;

  if (resolved === 'borderOnly') {
    bg = theme.surfaceCard;
    fg = theme.ink;
    borderColor = theme.borderStrong;
    borderWidth = 1.5;
  } else if (resolved === 'dark') {
    bg = theme.ink;
    fg = theme.onInk;
  } else if (resolved === 'dangerSoft') {
    bg = theme.dangerTint;
    fg = theme.danger;
  }

  if (disabled && !isLoading) {
    bg = theme.neutralTint;
    fg = theme.neutral;
    borderColor = 'transparent';
    borderWidth = 0;
  }

  const container = [
    styles.base,
    small ? styles.small : styles.default,
    { backgroundColor: bg, borderColor, borderWidth },
    style,
  ];

  const labelStyle = {
    color: fg,
    fontFamily: fontFamily.semibold,
    fontSize: small ? 13 : 15,
    lineHeight: 20,
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={isLoading || disabled}
      onPress={onAction}
      style={container}
    >
      {isLoading ? (
        <View style={styles.row}>
          <ActivityIndicator size="small" color={fg} />
          <Text style={labelStyle}>{loadingText}</Text>
        </View>
      ) : (
        <View style={styles.row}>
          {icon ? <Ionicons name={icon} size={small ? 16 : 18} color={fg} /> : null}
          <Text style={labelStyle}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default AppButton;

const styles = StyleSheet.create({
  base: {
    width: '100%',
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  default: { height: 52, paddingHorizontal: spacing.xl },
  small: { height: 36, paddingHorizontal: spacing.lg },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
});
