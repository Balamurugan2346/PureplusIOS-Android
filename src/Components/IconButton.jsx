import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../Context/ThemeContext';
import { fontFamily } from '../Themes/Themes';

/**
 * IconButton (00-foundation, new): a 44×44 circular icon button.
 *
 *   icon              - Ionicons name (required)
 *   onPress           - press handler
 *   variant           - 'default' (white, ink icon) | 'tint' (primaryTint, primary icon) | 'dark' (ink, onInk icon)
 *   count             - optional number → danger count badge (top-right)
 *   accessibilityLabel- required for a11y
 *   size              - icon glyph size (default 22)
 *   style             - style override
 */
const IconButton = ({
  icon,
  onPress,
  variant = 'default',
  count,
  accessibilityLabel,
  size = 22,
  style,
}) => {
  const { theme } = useTheme();

  let bg = theme.surfaceCard;
  let fg = theme.ink;
  if (variant === 'tint') {
    bg = theme.primaryTint;
    fg = theme.primary;
  } else if (variant === 'dark') {
    bg = theme.ink;
    fg = theme.onInk;
  }

  const showBadge = count !== undefined && count !== null && count > 0;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={[styles.button, { backgroundColor: bg }, style]}
    >
      <Ionicons name={icon} size={size} color={fg} />
      {showBadge ? (
        <View style={[styles.badge, { backgroundColor: theme.danger, borderColor: theme.surfaceCard }]}>
          <Text style={[styles.badgeText, { color: theme.onInk }]}>{count > 99 ? '99+' : count}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

export default IconButton;

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontFamily: fontFamily.semibold,
    fontSize: 11,
    lineHeight: 14,
  },
});
