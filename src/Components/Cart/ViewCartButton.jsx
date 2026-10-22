import { useTabBarVisibility } from '../../Context/BottomBarContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../Context/ThemeContext';
import { fontFamily, radius, spacing, floatShadow } from '../../Themes/Themes';
import formatCurrency from '../../Utils/formatCurrency';

/**
 * Floating "View Cart" bar above the tab bar (redesign 02). Props preserved:
 * cart (items array), navigation. Visibility is controlled by the parent.
 */
const ViewCartButton = ({ cart, navigation }) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const count = cart?.length || 0;
  const total = (cart || []).reduce(
    (s, i) => s + (Number(i?.totalPrice ?? i?.amount ?? (i?.unitPrice != null && i?.quantity != null ? i.unitPrice * i.quantity : 0)) || 0),
    0
  );
  const subtitle = `${count} ${count > 1 ? 'items' : 'item'}${total > 0 ? ` · ${formatCurrency(total)}` : ''}`;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => navigation.navigate('CartScreen')}
      style={[styles.container, { backgroundColor: theme.primary, bottom: insets.bottom + 72 }, floatShadow]}
    >
      <Ionicons name="cart" size={24} color={theme.onPrimary} />

      <View style={styles.labels}>
        <Text style={[styles.title, { color: theme.onPrimary }]}>View Cart</Text>
        <Text style={[styles.subtitle, { color: theme.onPrimary }]}>{subtitle}</Text>
      </View>

      <View style={[styles.arrow, { backgroundColor: theme.surfaceCard }]}>
        <Ionicons name="arrow-forward" size={20} color={theme.primary} />
      </View>
    </TouchableOpacity>
  );
};

export default ViewCartButton;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.xl,
    right: spacing.xl,
    height: 60,
    borderRadius: radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    gap: spacing.md,
    zIndex: 10,
  },
  labels: { flex: 1 },
  title: { fontFamily: fontFamily.semibold, fontSize: 15, lineHeight: 20 },
  subtitle: { fontFamily: fontFamily.regular, fontSize: 12, lineHeight: 16 },
  arrow: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
