import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../Context/ThemeContext';
import AppText from '../AppText';
import ProductImage from '../Product/ProductImage';
import { radius, spacing } from '../../Themes/Themes';

/**
 * A single line item inside the Order Details "items" card (prompt 03 restyle).
 * Data reads preserved: imageUrls, productName, orderedQuantity, uom, unitPrice,
 * totalLineAmount, taxAmount, price.
 */
const OrderProdItem = ({ item }) => {

    const { theme } = useTheme()

    return (
        <View>
            <View style={styles.container}>
                {/* LEFT */}
                <ProductImage imageUrls={item?.imageUrls} style={[styles.thumb, { backgroundColor: theme.sky200 }]} resizeMode="contain" />
                <View style={{ flex: 1 }}>
                    <AppText variant="label" color={theme.ink} numberOfLines={2}>{item?.productName}</AppText>
                    <AppText variant="caption" color={theme.inkMuted} style={{ marginTop: 2 }}>
                        {`${item?.orderedQuantity} × ₹${item?.unitPrice} /unit`}
                    </AppText>
                </View>

                {/* RIGHT */}
                <View style={{ alignItems: 'flex-end' }}>
                    <AppText variant="label" color={theme.ink}>₹{item?.totalLineAmount}</AppText>
                    {item?.taxAmount > 0 && (
                        <AppText variant="caption" color={theme.inkMuted} style={{ textDecorationLine: 'line-through', marginTop: 2 }}>
                            ₹{item?.price}
                        </AppText>
                    )}
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
        alignItems: 'center',
        gap: spacing.md,
        marginVertical: spacing.md,
    },
    thumb: {
        width: 44,
        height: 44,
        borderRadius: radius.sm,
    },
    divider: {
        width: '100%',
        height: 1,
    },
});
