import Ionicons from 'react-native-vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../Context/ThemeContext';
import AppText from '../AppText';
import ProductImage from '../Product/ProductImage';
import { radius, spacing } from '../../Themes/Themes';

/**
 * A single line item inside the Order Details "items" card.
 * Props: item (order item data), isRefill (bool — drives can-vs-unit display).
 *
 * Normal:  orderedQuantity = units,  unitPrice = per-unit price
 * Refill:  orderedQuantity = cans,   unitPrice = per-can price  (field same, semantics differ)
 */

// A small rounded chip used in the pricing breakdown row.
const Pill = ({ label, highlight, theme }) => (
    <View style={[
        pillStyles.base,
        { backgroundColor: highlight ? theme.primaryTint : theme.surfaceCard,
          borderColor: highlight ? theme.primary : theme.borderSubtle },
    ]}>
        <AppText variant="caption" color={highlight ? theme.primary : theme.ink}>{label}</AppText>
    </View>
);

const pillStyles = StyleSheet.create({
    base: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: radius.sm,
        borderWidth: 1,
    },
});

// Inline pricing info box — shows the actual calculation + a context note.
const PriceInfo = ({ item, isRefill, theme }) => {
    const qty       = item?.orderedQuantity ?? item?.quantity ?? 0;
    const unitPrice = Number(item?.unitPrice ?? 0);
    const total     = Number(item?.totalLineAmount ?? 0);

    // For normal orders: how many physical cans per unit?
    // quantity = total cans delivered (ordered + free); freeQuantity = complimentary cans.
    const deliveredCans = Math.max(0, (item?.quantity ?? 0) - (item?.freeQuantity ?? 0));
    const cansPerUnit   = qty > 0 ? Math.round(deliveredCans / qty) : 1;
    const freeCans      = item?.freeQuantity ?? 0;

    const qtyPill   = isRefill ? `${qty} can`       : `${qty} unit`;
    const pricePill = isRefill ? `₹${unitPrice}/can` : `₹${unitPrice}/unit`;
    const totalPill = `₹${total}`;

    // Refill note uses the established lavender purple (pureLight has no purple token).
    const noteStyle = isRefill
        ? { bg: '#F0E9FF', fg: '#6B21A8', icon: 'swap-horizontal-outline' }
        : { bg: theme.infoTint, fg: theme.info, icon: 'information-circle-outline' };

    const noteText = isRefill
        ? 'Can-for-can swap · deposit stays ₹0'
        : cansPerUnit > 1
            ? `1 unit = ${cansPerUnit} cans · ${deliveredCans + freeCans} cans delivered${freeCans > 0 ? ` (${freeCans} free)` : ''}`
            : `${deliveredCans + freeCans} can${deliveredCans + freeCans !== 1 ? 's' : ''} delivered`;

    return (
        <View style={[infoStyles.box, { backgroundColor: theme.surfaceSunken }]}>
            {/* Calculation row: [qty] × [price] = [total] */}
            <View style={infoStyles.calcRow}>
                <Pill label={qtyPill} theme={theme} />
                <AppText variant="caption" color={theme.inkMuted}>×</AppText>
                <Pill label={pricePill} theme={theme} />
                <AppText variant="caption" color={theme.inkMuted}>=</AppText>
                <Pill label={totalPill} highlight theme={theme} />
            </View>

            {/* Context note */}
            <View style={[infoStyles.noteRow, { backgroundColor: noteStyle.bg }]}>
                <Ionicons name={noteStyle.icon} size={12} color={noteStyle.fg} />
                <AppText variant="caption" color={noteStyle.fg} style={{ marginLeft: 4, flex: 1 }}>
                    {noteText}
                </AppText>
            </View>
        </View>
    );
};

const infoStyles = StyleSheet.create({
    box: {
        borderRadius: radius.sm,
        padding: spacing.sm,
        marginTop: spacing.sm,
        gap: spacing.sm,
    },
    calcRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 6,
    },
    noteRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        borderRadius: radius.xs ?? 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
});

// ─── Main component ───────────────────────────────────────────────────────────

const OrderProdItem = ({ item, isRefill = false }) => {
    const { theme } = useTheme();

    return (
        <View>
            <View style={styles.container}>
                {/* Thumbnail */}
                <ProductImage
                    imageUrls={item?.imageUrls}
                    style={[styles.thumb, { backgroundColor: theme.sky200 }]}
                    resizeMode="contain"
                />

                {/* Info column */}
                <View style={{ flex: 1 }}>
                    <View style={styles.nameRow}>
                        <AppText variant="label" color={theme.ink} numberOfLines={2} style={{ flex: 1 }}>
                            {item?.productName}
                        </AppText>
                        {/* Line total — right-aligned next to the name */}
                        <AppText variant="label" color={theme.ink}>₹{item?.totalLineAmount}</AppText>
                    </View>

                    {/* Pricing breakdown info box */}
                    <PriceInfo item={item} isRefill={isRefill} theme={theme} />
                </View>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.borderSubtle }]} />
        </View>
    );
};

export default OrderProdItem;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.md,
        marginVertical: spacing.md,
    },
    thumb: {
        width: 44,
        height: 44,
        borderRadius: radius.sm,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: spacing.sm,
    },
    divider: {
        width: '100%',
        height: 1,
    },
});
