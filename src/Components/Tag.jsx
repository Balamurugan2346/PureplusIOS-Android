import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../Context/ThemeContext';
import { fontFamily, radius, spacing } from '../Themes/Themes';

/**
 * Dashboard quick-action tile (redesign 02). White card, primaryTint icon well,
 * caption, optional danger count badge. Props preserved: title, icon, badgeNeed, onPress.
 */
const Tag = ({ title, onClick, icon, badgeNeed, onPress }) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.8} onPress={onPress}>
      <View style={[styles.card, { backgroundColor: theme.surfaceCard }]}>
        <View style={[styles.iconWell, { backgroundColor: theme.primaryTint }]}>
          <Image source={icon} style={{ width: 22, height: 22 }} tintColor={theme.primary} />
        </View>
        <Text numberOfLines={1} style={[styles.caption, { color: theme.inkMuted }]}>{title}</Text>
        {badgeNeed && (
          <View style={[styles.badge, { backgroundColor: theme.danger, borderColor: theme.surfaceCard }]}>
            <Text style={[styles.badgeText, { color: theme.onInk }]}>1</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default Tag;

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: {
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
    gap: 6,
  },
  iconWell: { width: 44, height: 44, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  caption: { fontFamily: fontFamily.medium, fontSize: 12, lineHeight: 16 },
  badge: {
    position: 'absolute',
    top: -4,
    right: 8,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontFamily: fontFamily.semibold, fontSize: 11, lineHeight: 14 },
});
