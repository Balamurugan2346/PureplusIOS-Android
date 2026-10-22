import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../Context/ThemeContext';
import AppText from '../AppText';
import { radius, spacing } from '../../Themes/Themes';

const money = (n) => `₹${(Number(n) || 0).toFixed(2)}`;

/**
 * Bill summary for a placed order (prompt 03 restyle). Values are the persisted snapshot
 * returned by GET /api/customer/orders/{id} — this screen never re-derives a number.
 * Zero rows (floor / surcharge / deposit) are hidden to keep it clean.
 */
export default function OrderSummary({ isOrderDetails = false, order }) {

    const { theme } = useTheme()

    const num = (v) => Number(v) || 0;

    const subTotal = num(order?.subTotal);
    const taxAmount = num(order?.taxAmount);
    const floorCharge = num(order?.floorCharge);
    const deliveryCharge = num(order?.deliveryCharge);
    const convenienceFee = num(order?.convenienceFee);
    const deliverySurcharge = num(order?.deliverySurcharge);
    const depositAmount = num(order?.depositAmount);
    const orderAmount = num(order?.totalAmount); // booked amount, deposit EXCLUDED
    const collectAtDoor = order?.collectAtDoor != null ? num(order.collectAtDoor) : orderAmount + depositAmount;

    const floorNo = order?.floorNo ?? order?.floor;
    const hasLift = order?.hasLift ?? order?.lift;
    const floorHint = floorNo != null ? `Floor ${floorNo} · ${hasLift ? 'lift' : 'no lift'}` : undefined;

    const Row = ({ label, hint, value, valueColor }) => (
        <View style={styles.row}>
            <View style={{ flex: 1, marginRight: spacing.sm }}>
                <AppText variant="label" color={theme.inkMuted}>{label}</AppText>
                {hint ? <AppText variant="caption" color={theme.inkMuted} style={{ marginTop: 2 }}>{hint}</AppText> : null}
            </View>
            <AppText variant="label" color={valueColor || theme.ink}>{value}</AppText>
        </View>
    );

    return (
        <View style={[styles.cardContainer, { backgroundColor: theme.surfaceCard }]}>
            <AppText variant="title" color={theme.ink} style={{ marginBottom: spacing.md }}>Bill Summary</AppText>

            <Row label="Item Total" value={money(subTotal)} />
            <Row label="GST" value={money(taxAmount)} />
            {floorCharge > 0 && <Row label="Floor charge" hint={floorHint} value={money(floorCharge)} />}
            <Row
                label="Delivery charges"
                value={deliveryCharge > 0 ? money(deliveryCharge) : 'FREE'}
                valueColor={deliveryCharge > 0 ? undefined : theme.success}
            />
            <Row label="Handling charges" value={money(convenienceFee)} />
            {deliverySurcharge > 0 && <Row label="Delivery surcharge" value={money(deliverySurcharge)} />}
            {depositAmount > 0 && (
                <Row label="Refundable can deposit" hint="Refunded when cans are returned" value={money(depositAmount)} />
            )}

            <View style={[styles.divider, { backgroundColor: theme.borderSubtle }]} />

            {depositAmount > 0 && (
                <Row label="Order amount" hint="Excl. refundable deposit" value={money(orderAmount)} />
            )}

            <View style={styles.totalRow}>
                <View style={{ flex: 1, marginRight: spacing.sm }}>
                    <AppText variant="bodyStrong" color={theme.ink}>{isOrderDetails ? 'Total Bill' : 'To Pay'}</AppText>
                    <AppText variant="caption" color={theme.inkMuted} style={{ marginTop: 2 }}>
                        Collect at door · incl. taxes, charges &amp; deposit
                    </AppText>
                </View>
                <AppText variant="price" color={theme.ink}>{money(collectAtDoor)}</AppText>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        borderRadius: radius.lg,
        padding: spacing.lg,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 6,
    },
    divider: {
        width: '100%',
        height: 1,
        marginVertical: spacing.sm,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: spacing.sm,
    },
});
