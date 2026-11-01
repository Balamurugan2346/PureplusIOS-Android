import Ionicons from 'react-native-vector-icons/Ionicons';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../Context/ThemeContext';
import AppText from './AppText';
import ProductImage from './Product/ProductImage';
import { filterValidImageUris } from '../Utils/productImage';
import { radius, spacing } from '../Themes/Themes';

/**
 * Order history list card (prompt 03 restyle). Props:
 * onItemClick, status (raw backend order_status, e.g. 'OUT_FOR_DELIVERY'), amount
 * (collect-at-door total), date, images.
 */

// Real lifecycle states (§2.1) → human label + tone + icon. Tone is resolved to a theme colour below.
const STATUS_MAP = {
    PLACED: { label: 'Order Placed', tone: 'primary', icon: 'receipt-outline' },
    PENDING: { label: 'Order Placed', tone: 'primary', icon: 'receipt-outline' },
    ASSIGNED: { label: 'Driver Assigned', tone: 'primary', icon: 'person-outline' },
    LOADED: { label: 'Preparing Order', tone: 'primary', icon: 'cube-outline' },
    OUT_FOR_DELIVERY: { label: 'Out for Delivery', tone: 'warning', icon: 'bicycle-outline' },
    DELIVERED: { label: 'Delivered', tone: 'success', icon: 'checkmark-circle-outline' },
    DELIVERED_PAYMENT_PENDING: { label: 'Delivered', tone: 'success', icon: 'checkmark-circle-outline' },
    COMPLETED: { label: 'Completed', tone: 'success', icon: 'checkmark-circle-outline' },
    FAILED: { label: 'Delivery Failed', tone: 'danger', icon: 'close-circle-outline' },
    CANCELLED: { label: 'Cancelled', tone: 'danger', icon: 'close-circle-outline' },
    SKIPPED: { label: 'Skipped', tone: 'muted', icon: 'remove-circle-outline' },
    DISPUTED: { label: 'Disputed', tone: 'warning', icon: 'alert-circle-outline' },
};

// Prettify an unknown status (e.g. "SOME_NEW_STATE" → "Some New State") so we never render a raw enum.
const prettify = (s) =>
    String(s || '')
        .replace(/[_-]+/g, ' ')
        .trim()
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());

const OrderItem = ({ onItemClick, status, amount, date, images = [] }) => {

    const { theme } = useTheme();

    // Only show URLs that are actually images; if none are valid, show a single placeholder.
    const validImageUris = filterValidImageUris(images);

    // Resolve the real backend status to a label/tone/icon; fall back to a prettified raw value.
    const key = String(status || '').trim().toUpperCase().replace(/\s+/g, '_');
    const meta = STATUS_MAP[key] || { label: prettify(status) || 'Order', tone: 'muted', icon: 'ellipse-outline' };
    const toneColor = {
        primary: theme.primary,
        success: theme.success,
        danger: theme.danger,
        warning: theme.warning ?? theme.primary,
        muted: theme.inkMuted,
    }[meta.tone] || theme.primary;

    const displayStatus = meta.label;
    const color = toneColor;
    const icon = meta.icon;

    const formattedDate = date
        ? new Date(date).toLocaleString()
        : "";

    return (
        <TouchableOpacity onPress={onItemClick} activeOpacity={0.85} style={[styles.card, { backgroundColor: theme.surfaceCard }]}>

            {/* IMAGES SCROLL */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.imageRow}
            >
                {validImageUris.length > 0 ? (
                    validImageUris.map((uri, index) => (
                        <ProductImage key={index} uri={uri} style={[styles.productImage, { backgroundColor: theme.sky200 }]} resizeMode="contain" />
                    ))
                ) : (
                    <ProductImage imageUrls={[]} style={[styles.productImage, { backgroundColor: theme.sky200 }]} resizeMode="contain" />
                )}
            </ScrollView>

            {/* INFO ROW */}
            <View style={styles.infoRow}>

                <View style={{ flex: 1 }}>
                    <View style={styles.statusRow}>
                        <Ionicons name={icon} size={18} color={color} style={{ marginRight: 6 }} />
                        <AppText variant="bodyStrong" color={color}>
                            {displayStatus}
                        </AppText>
                    </View>

                    <AppText variant="caption" color={theme.inkMuted} style={{ marginTop: 4 }}>
                        Placed at {formattedDate}
                    </AppText>
                </View>

                <View style={styles.amountBox}>
                    <View style={{ alignItems: 'flex-end' }}>
                        <AppText variant="price" color={theme.ink}>₹{Number(amount ?? 0).toFixed(2)}</AppText>
                        <AppText variant="caption" color={theme.inkMuted}>to pay at door</AppText>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={theme.inkMuted} />
                </View>

            </View>

        </TouchableOpacity>
    );
};

export default OrderItem;

const styles = StyleSheet.create({
    card: {
        borderRadius: radius.lg,
        padding: spacing.lg,
        marginVertical: 6,
        marginHorizontal: spacing.xl,
    },

    imageRow: {
        flexDirection: 'row',
        gap: spacing.sm,
        paddingBottom: spacing.md,
    },

    productImage: {
        width: 52,
        height: 52,
        borderRadius: radius.sm,
    },

    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    amountBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
});
