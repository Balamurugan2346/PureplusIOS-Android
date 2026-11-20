import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../Context/ThemeContext';
import AppText from '../AppText';
import AppModal from '../AppModal';
import { radius, spacing } from '../../Themes/Themes';

const money = (n) => `₹${(Number(n) || 0).toFixed(2)}`;

/**
 * Bill summary for a placed order (prompt 03 restyle). Values are the persisted snapshot
 * returned by GET /api/customer/orders/{id} — this screen never re-derives a number.
 * Zero rows (floor / surcharge / deposit) are hidden to keep it clean.
 */
export default function OrderSummary({ isOrderDetails = false, order }) {

    const { theme } = useTheme();
    const [tooltip, setTooltip] = useState({ visible: false, text: '' });

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

    const Row = ({ label, hint, value, valueColor, info }) => (
        <View style={styles.row}>
            <View style={{ flex: 1, marginRight: spacing.sm }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <AppText variant="label" color={theme.inkMuted}>{label}</AppText>
                    {!!info && (
                        <TouchableOpacity
                            onPress={() => setTooltip({ visible: true, text: info })}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            style={{ marginLeft: 4 }}
                        >
                            <Ionicons name="information-circle-outline" size={13} color={theme.inkMuted} />
                        </TouchableOpacity>
                    )}
                </View>
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
            {floorCharge > 0 && (
                <Row
                    label="Floor charge"
                    hint={floorHint}
                    value={money(floorCharge)}
                    info="A small charge for delivering to upper floors without a lift."
                />
            )}
            <Row
                label="Delivery charges"
                value={deliveryCharge > 0 ? money(deliveryCharge) : 'FREE'}
                valueColor={deliveryCharge > 0 ? undefined : theme.success}
                info="Based on distance from our store to your address."
            />
            <Row
                label="Handling charges"
                value={money(convenienceFee)}
                info="A convenience fee covering order coordination."
            />
            {deliverySurcharge > 0 && (
                <Row
                    label="Delivery surcharge"
                    value={money(deliverySurcharge)}
                    info="An express fee for instant/ASAP delivery. No surcharge for scheduled delivery."
                />
            )}
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
