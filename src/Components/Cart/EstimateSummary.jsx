import Fonts from '../../../assets/fonts/Fonts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../Context/ThemeContext';

/**
 * CUS-12 checkout estimate (live price breakdown) shown in the cart.
 *
 * Driven by POST /api/customer/checkout/estimate. The parent (CartScreen) refetches
 * whenever the cart or the selected delivery address changes, and passes the result here.
 *
 * Props:
 *  - estimate         CheckoutEstimateDto from the API (null until fetched)
 *  - loading / error  request state
 *  - isFirstOrder     from GET /api/customer/orders/is-first — drives the free-can note
 *  - addressSelected  false => we don't call the estimate API, so prompt for an address
 */
const money = (n) => `₹${(Number(n) || 0).toFixed(2)}`;

export default function EstimateSummary({ estimate, loading, error, isFirstOrder, addressSelected }) {
  const { theme } = useTheme();

  const headerConfig = { color: theme.greyText, fontFamily: Fonts.family.regular, fontSize: Fonts.size.xs };
  const paraConfig = { color: theme.secondaryText, fontFamily: Fonts.family.medium, fontSize: Fonts.size.xs };

  const Row = ({ label, value, strong, hint, valueColor }) => (
    <View style={styles.row}>
      <View style={{ flex: 1, marginRight: 8 }}>
        <Text style={[strong ? paraConfig : headerConfig, strong && { fontSize: Fonts.size.base, color: theme.greyText }]}>{label}</Text>
        {hint ? <Text style={[paraConfig, { fontSize: 10, marginTop: 2 }]}>{hint}</Text> : null}
      </View>
      <Text style={[paraConfig, strong && { fontSize: Fonts.size.base, fontWeight: 'bold' }, valueColor && { color: valueColor }]}>
        {value}
      </Text>
    </View>
  );

  // total complimentary cans across all lines (first-order gift)
  const freeCans = (estimate?.items || []).reduce((a, i) => a + (Number(i.freeCans) || 0), 0);
  const shortfalls = (estimate?.items || []).filter((i) => i && i.meetsMinimum === false);

  return (
    <View style={[styles.cardContainer, { backgroundColor: theme.cardContainer }]}>
      <Text style={[headerConfig, { fontSize: Fonts.size.base, marginBottom: 14 }]}>Bill Summary</Text>

      {/* First-order complimentary-can banner (shown as soon as we know it's a first order) */}
      {isFirstOrder && (
        <View style={[styles.banner, { backgroundColor: '#E8F7EC' }]}>
          <Ionicons name="gift" size={18} color="green" />
          <Text style={[paraConfig, { color: 'green', marginLeft: 8, flex: 1 }]}>
            First-order gift: we add {freeCans > 0 ? freeCans : 1} complimentary can of the same product, on us.
          </Text>
        </View>
      )}

      {/* unit -> can helper note (1 quantity = 1 unit; a unit is delivered as cans) */}
      <Text style={[paraConfig, { fontSize: 10, marginBottom: 10 }]}>
        Note: 1 quantity = 1 unit. Minimum order and cans are counted unit-wise.
      </Text>

      {!addressSelected ? (
        <View style={styles.center}>
          <Ionicons name="location-outline" size={20} color={theme.greyText} />
          <Text style={[headerConfig, { marginTop: 6, textAlign: 'center' }]}>
            Select a delivery address to see the price estimate.
          </Text>
        </View>
      ) : loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="small" color={theme.primary} />
          <Text style={[headerConfig, { marginTop: 6 }]}>Calculating estimate…</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={[headerConfig, { color: 'crimson', textAlign: 'center' }]}>{error}</Text>
        </View>
      ) : estimate ? (
        <>
          <Row label="Item Total" value={money(estimate.subtotal)} />
          <Row
            label="GST"
            hint={estimate.gstPercentApplied != null ? `@ ${estimate.gstPercentApplied}%` : undefined}
            value={money(estimate.gstAmount)}
          />
          <Row
            label={`Floor charge${estimate.floor ? ` (floor ${estimate.floor}${estimate.hasLift ? ', lift' : ''})` : ''}`}
            value={money(estimate.floorCharge)}
          />
          <Row
            label="Delivery charges"
            value={estimate.freeDeliveryApplied ? 'FREE' : money(estimate.deliveryCharge)}
            valueColor={estimate.freeDeliveryApplied ? 'green' : undefined}
          />
          <Row label="Handling charges" value={money(estimate.convenienceFee)} />
          <Row
            label="Refundable can deposit"
            hint="Refunded when cans are returned"
            value={money(estimate.totalDeposit)}
          />

          <View style={styles.divider} />

          <Row label="Order amount" hint="Excl. refundable deposit" value={money(estimate.payable)} />
          <Row label="To Pay at door" hint="Incl. all taxes, charges & deposit" value={money(estimate.grandTotal)} strong />

          {/* min-order not met => block checkout (parent also guards on allMinimumsMet) */}
          {shortfalls.length > 0 && (
            <View style={[styles.banner, { backgroundColor: '#FDECEA', marginTop: 12 }]}>
              <Ionicons name="alert-circle" size={18} color="crimson" />
              <Text style={[paraConfig, { color: 'crimson', marginLeft: 8, flex: 1 }]}>
                {shortfalls
                  .map((i) => `Product ${i.productId}: add ${i.shortfall} more can(s) (min ${i.applicableMin}).`)
                  .join(' ')}
              </Text>
            </View>
          )}
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 20,
    padding: 16,
    elevation: 3,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 9,
  },
  divider: { backgroundColor: 'grey', opacity: 0.12, width: '100%', height: 1, marginVertical: 8 },
  center: { alignItems: 'center', justifyContent: 'center', paddingVertical: 18 },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
});
