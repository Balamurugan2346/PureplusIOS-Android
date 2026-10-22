import { StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppText from './AppText';
import { useTheme } from '../Context/ThemeContext';
import { radius, spacing } from '../Themes/Themes';

/**
 * Product perks row (redesign 02): two equal white tiles.
 */
export default function GlassyPerksContainer() {
  const { theme } = useTheme();

  return (
    <View style={styles.row}>
      <View style={[styles.tile, { backgroundColor: theme.surfaceCard }]}>
        <View style={[styles.well, { backgroundColor: theme.primaryTint }]}>
          <Ionicons name="bicycle-outline" size={20} color={theme.primary} />
        </View>
        <AppText variant="label" color={theme.ink}>Fast Delivery</AppText>
      </View>

      <View style={[styles.tile, { backgroundColor: theme.surfaceCard }]}>
        <View style={[styles.well, { backgroundColor: theme.successTint }]}>
          <Ionicons name="water-outline" size={20} color={theme.success} />
        </View>
        <AppText variant="label" color={theme.ink}>Pure Water</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md },
  tile: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.md, borderRadius: radius.md, padding: spacing.md },
  well: { width: 40, height: 40, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
});
