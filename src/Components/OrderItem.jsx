import Ionicons from 'react-native-vector-icons/Ionicons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../Context/ThemeContext';
import AppText from './AppText';
import ProductImage from './Product/ProductImage';
import { filterValidImageUris } from '../Utils/productImage';
import { radius, spacing } from '../Themes/Themes';

// Real lifecycle states → human label + tone. Tone drives the accent strip + status dot colour.
const STATUS_MAP = {
    PLACED:                    { label: 'Order Placed',    tone: 'primary', icon: 'receipt-outline' },
    PENDING:                   { label: 'Order Placed',    tone: 'primary', icon: 'receipt-outline' },
    ASSIGNED:                  { label: 'Driver Assigned', tone: 'orange',  icon: 'person-outline' },
    LOADED:                    { label: 'Preparing',       tone: 'orange',  icon: 'cube-outline' },
    OUT_FOR_DELIVERY:          { label: 'Out for Delivery',tone: 'warning', icon: 'bicycle-outline' },
    DELIVERED:                 { label: 'Delivered',       tone: 'success', icon: 'checkmark-circle-outline' },
    DELIVERED_PAYMENT_PENDING: { label: 'Delivered',       tone: 'success', icon: 'checkmark-circle-outline' },
    COMPLETED:                 { label: 'Completed',       tone: 'success', icon: 'checkmark-circle-outline' },
    FAILED:                    { label: 'Failed',          tone: 'danger',  icon: 'close-circle-outline' },
    CANCELLED:                 { label: 'Cancelled',       tone: 'danger',  icon: 'close-circle-outline' },
    SKIPPED:                   { label: 'Skipped',         tone: 'muted',   icon: 'remove-circle-outline' },
    DISPUTED:                  { label: 'Disputed',        tone: 'warning', icon: 'alert-circle-outline' },
};

const prettify = (s) =>
    String(s || '').replace(/[_-]+/g, ' ').trim().toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

// pureLight has no purple token — REFILL uses a hardcoded lavender pair.
const orderTypeChip = (type, theme) => {
    if (String(type ?? '').toUpperCase() === 'REFILL')
        return { label: 'Refill', bg: '#F0E9FF', fg: '#6B21A8' };
    return { label: 'Standard', bg: theme.surfaceSunken, fg: theme.inkMuted };
};

const MAX_IMAGES = 3;

const OrderItem = ({ onItemClick, status, orderCode, orderType, amount, date, images = [] }) => {
    const { theme } = useTheme();

    const validImageUris = filterValidImageUris(images);
    const shownImages = validImageUris.slice(0, MAX_IMAGES);
    const extraCount = Math.max(0, validImageUris.length - MAX_IMAGES);

    const key = String(status || '').trim().toUpperCase().replace(/\s+/g, '_');
    const meta = STATUS_MAP[key] || { label: prettify(status) || 'Order', tone: 'muted', icon: 'ellipse-outline' };

    const TONE = {
        primary: { color: theme.primary,                   tint: theme.primaryTint },
        info:    { color: theme.info,                      tint: theme.infoTint },
        orange:  { color: '#C2500A',                       tint: '#FFF1E0' },
        success: { color: theme.success,                   tint: theme.successTint },
        danger:  { color: theme.danger,                    tint: theme.dangerTint },
        warning: { color: theme.warning ?? theme.primary,  tint: theme.warningTint ?? theme.primaryTint },
        muted:   { color: theme.inkMuted,                  tint: theme.neutralTint ?? theme.surfaceSunken },
    };
    const tone = TONE[meta.tone] || TONE.primary;

    const chip = orderType ? orderTypeChip(orderType, theme) : null;

    const dt = date ? new Date(date) : null;
    const dateStr = dt && !isNaN(dt.getTime())
        ? dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        : '';

    const displayAmount = `₹${Math.round(Number(amount ?? 0))}`;

    return (
        <TouchableOpacity
            onPress={onItemClick}
            activeOpacity={0.88}
            style={[styles.card, { backgroundColor: theme.surfaceCard }]}
        >
            {/* STATUS ACCENT STRIP */}
            <View style={[styles.accentStrip, { backgroundColor: tone.color }]} />

            {/* IMAGE SECTION — tinted background in the status tone */}
            <View style={[styles.imageSection, { backgroundColor: tone.tint }]}>
                <View style={styles.imageRow}>
                    {shownImages.length > 0 ? (
                        shownImages.map((uri, i) => (
                            <ProductImage
                                key={i}
                                uri={uri}
                                style={[styles.thumb, { backgroundColor: theme.surfaceCard }]}
                                resizeMode="contain"
                            />
                        ))
                    ) : (
                        <ProductImage
                            imageUrls={[]}
                            style={[styles.thumb, { backgroundColor: theme.surfaceCard }]}
                            resizeMode="contain"
                        />
                    )}
                    {extraCount > 0 && (
                        <View style={[styles.extraPill, { backgroundColor: theme.surfaceCard }]}>
                            <AppText variant="caption" color={theme.inkMuted}>+{extraCount}</AppText>
                        </View>
                    )}
                </View>

                {chip && (
                    <View style={[styles.typeBadge, { backgroundColor: tone.color }]}>
                        <AppText variant="caption" color={theme.onPrimary}>{chip.label}</AppText>
                    </View>
                )}
            </View>

            {/* META ROW: order code (left) · date (right) */}
            <View style={styles.metaRow}>
                <AppText variant="caption" color={theme.inkMuted}>
                    {orderCode || ''}
                </AppText>
                <AppText variant="caption" color={theme.inkMuted}>{dateStr}</AppText>
            </View>

            {/* DIVIDER */}
            <View style={[styles.divider, { backgroundColor: theme.borderSubtle }]} />

            {/* BOTTOM ROW: status (left) · amount + chevron (right) */}
            <View style={styles.bottomRow}>
                <View style={styles.statusLeft}>
                    <View style={[styles.statusDot, { backgroundColor: tone.color }]} />
                    <AppText variant="bodyStrong" color={tone.color}>{meta.label}</AppText>
                </View>

                <View style={styles.amountRight}>
                    <View style={{ alignItems: 'flex-end' }}>
                        <AppText variant="bodyStrong" color={theme.ink}>{displayAmount}</AppText>
                        <AppText variant="caption" color={theme.inkMuted}>at door</AppText>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={theme.inkMuted} />
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default OrderItem;

const styles = StyleSheet.create({
    card: {
        borderRadius: radius.lg,
        marginVertical: 6,
        marginHorizontal: spacing.xl,
        overflow: 'hidden',
    },
    accentStrip: {
        height: 4,
    },
    imageSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    imageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    thumb: {
        width: 44,
        height: 44,
        borderRadius: radius.sm,
    },
    extraPill: {
        width: 36,
        height: 36,
        borderRadius: radius.sm,
        alignItems: 'center',
        justifyContent: 'center',
    },
    typeBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: radius.pill,
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: spacing.sm,
    },
    divider: {
        height: 1,
        marginHorizontal: spacing.lg,
    },
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    statusLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        flex: 1,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    amountRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
});
