import { useState } from 'react';
import Fonts from '../../../assets/fonts/Fonts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../Context/ThemeContext';
import AppModal from '../AppModal';

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
  const [tooltip, setTooltip] = useState({ visible: false, text: '' });

  const headerConfig = { color: theme.greyText, fontFamily: Fonts.family.regular, fontSize: Fonts.size.xs };
  const paraConfig = { color: theme.secondaryText, fontFamily: Fonts.family.medium, fontSize: Fonts.size.xs };

  const Row = ({ label, value, strong, hint, valueColor, info }) => (
    <View style={styles.row}>
      <View style={{ flex: 1, marginRight: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[strong ? paraConfig : headerConfig, { fontSize: strong ? Fonts.size.lg : Fonts.size.sm }, strong && { color: theme.greyText }]}>{label}</Text>
          {!!info && (
            <TouchableOpacity
              onPress={() => setTooltip({ visible: true, text: info })}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={{ marginLeft: 4 }}
            >
              <Ionicons name="information-circle-outline" size={13} color={theme.greyText} />
            </TouchableOpacity>
          )}
        </View>
        {hint ? <Text style={[paraConfig, { fontSize: 12, marginTop: 2 }]}>{hint}</Text> : null}
      </View>
      <Text style={[paraConfig, strong && { fontSize: Fonts.size.lg, fontWeight: 'bold' }, valueColor && { color: valueColor }]}>
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
        <View style={[styles.banner, { backgroundColor: theme.successTint }]}>
          <Ionicons name="gift" size={18} color={theme.success} />
          <Text style={[paraConfig, { color: theme.success, marginLeft: 8, flex: 1 }]}>
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
          <Text style={[headerConfig, { color: theme.danger, textAlign: 'center' }]}>{error}</Text>
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
            info="A small charge for delivering to upper floors without a lift. Covers the extra effort of carrying heavy water cans up the stairs."
          />
          <Row
            label="Delivery charges"
            value={estimate.freeDeliveryApplied ? 'FREE' : money(estimate.deliveryCharge)}
            valueColor={estimate.freeDeliveryApplied ? theme.success : undefined}
            info="Charged based on the distance from our store to your address. Free on eligible orders."
          />
          <Row
            label="Handling charges"
            value={money(estimate.convenienceFee)}
            info="A convenience fee covering order coordination and logistics."
          />
          <Row
            label="Refundable can deposit"
            hint="Refunded when cans are returned"
            value={money(estimate.totalDeposit)}
          />

          <View style={[styles.divider, { backgroundColor: theme.borderSubtle }]} />

          <Row label="Order amount" hint="Excl. refundable deposit" value={money(estimate.payable)} />
          <Row label="To Pay at door" hint="Incl. all taxes, charges & deposit" value={money(estimate.grandTotal)} strong />

          {/* min-order not met => block checkout (parent also guards on allMinimumsMet) */}
          {shortfalls.length > 0 && (
            <View style={[styles.banner, { backgroundColor: theme.dangerTint, marginTop: 12 }]}>
              <Ionicons name="alert-circle" size={18} color={theme.danger} />
              <Text style={[paraConfig, { color: theme.danger, marginLeft: 8, flex: 1 }]}>
                {shortfalls
                  .map((i) => `Product ${i.productId}: add ${i.shortfall} more can(s) (min ${i.applicableMin}).`)
                  .join(' ')}
              </Text>
            </View>
          )}
        </>
      ) : null}

      <AppModal
        visible={tooltip.visible}
        setModalVisible={(v) => setTooltip((t) => ({ ...t, visible: v }))}
        title="About this charge"
        description={tooltip.text}
        confirmText="Got it"
        hideCancel
      />
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 32,
    padding: 16,
    margin: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  divider: { width: '100%', height: 1, marginVertical: 8 },
  center: { alignItems: 'center', justifyContent: 'center', paddingVertical: 18 },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
});
