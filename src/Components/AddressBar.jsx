import Ionicons from 'react-native-vector-icons/Ionicons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../Context/ThemeContext';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { fontFamily, radius, spacing } from '../Themes/Themes';

/**
 * Dashboard address pill (00-foundation restyle). Props preserved: address
 * (string), onClick, loading. Now a white address-bar card matching
 * DeliveryAddressBar's look.
 */
const AddressBar = ({ address = 'No Address found', onClick, loading = false, style }) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onClick} style={[styles.card, { backgroundColor: theme.surfaceCard }, style]}>
      <View style={[styles.iconWell, { backgroundColor: theme.primaryTint }]}>
        <Ionicons name="location-outline" size={22} color={theme.primary} />
      </View>

      <View style={styles.body}>
        <Text style={[styles.kicker, { color: theme.inkMuted }]}>Delivering to</Text>
        {loading ? (
          <ShimmerPlaceholder
            shimmerColors={[theme.surfaceSunken, theme.surface, theme.surfaceSunken]}
            shimmerStyle={{ height: 16, width: '80%', borderRadius: 6, marginTop: 2 }}
          />
        ) : (
          <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.address, { color: theme.ink }]}>
            {address}
          </Text>
        )}
      </View>

      <View style={styles.caret}>
        <Ionicons name="chevron-down" size={20} color={theme.inkMuted} />
      </View>
    </TouchableOpacity>
  );
};

export default AddressBar;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  iconWell: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1 },
  kicker: { fontFamily: fontFamily.medium, fontSize: 12, lineHeight: 16 },
  address: { fontFamily: fontFamily.semibold, fontSize: 14, lineHeight: 20, marginTop: 2 },
  caret: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
