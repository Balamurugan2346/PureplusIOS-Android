import Ionicons from 'react-native-vector-icons/Ionicons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppContext } from '../../Context/AppContext';
import { useTheme } from '../../Context/ThemeContext';
import { clearCart, loadCartItems, addToCart, updateCart } from '../../Redux/Slices/CartSlice';
import { useToast } from '../Toast/ToastProvider';
import { useDispatch, useSelector } from 'react-redux';
import AppText from '../AppText';
import { radius, spacing } from '../../Themes/Themes';

const CartItem = ({ cartItem }) => {


    const { showToast } = useToast()
    // const { addToCart, reduceQuantity } = useAppContext() //pure UI STATE

    const dispatch = useDispatch()

    const { theme } = useTheme()

    // The cart row carries only { id, productId, productName, price, quantity, uom,
    // totalPrice, imageUrls } — it has NO basePrice/unitCount. Those live on the product
    // catalog, so we look the product up by productId (same catalog `productList` the
    // CartScreen uses for per-product tax). This gives us a genuine previous (MRP) price
    // and the pack size — without fabricating either.
    const { productList } = useSelector((state) => state.products)
    // `productList` is `[]` before load, then the API envelope `{ data: [...] }` after —
    // normalise to the catalog array so `.find` is always safe.
    const catalogList = Array.isArray(productList) ? productList : (productList?.data ?? [])
    const catalogProduct = catalogList.find((p) => p.productId === cartItem?.productId)

    // Real per-unit price on the cart line is `price` (NOT `unitPrice`, which doesn't exist here).
    const unitPrice = cartItem?.price
    // Previous/MRP price from the catalog — only honoured when it's genuinely higher than the
    // current price (backend sends basePrice == unitPrice when there's no discount).
    const basePrice = catalogProduct?.basePrice
    const hasPreviousPrice = basePrice != null && unitPrice != null && Number(basePrice) > Number(unitPrice)
    // Cans-per-unit pack size, truthful per row (different lines may differ).
    const unitCount = catalogProduct?.unitCount

    // Product image from the cart response's imageUrls (a product can carry several
    // images — like any e-commerce listing — so we show the first). Falls back to the
    // bundled watercan asset when there are no images. Also tolerates the array arriving
    // as a JSON string, which the backend emits via `ImageUrls::text` in some paths.
    const resolveProductImage = () => {
        let urls = cartItem?.imageUrls;
        if (typeof urls === 'string') {
            const s = urls.trim();
            if (s.startsWith('[')) {
                try { urls = JSON.parse(s); } catch { urls = []; }
            } else {
                urls = s ? [s] : [];
            }
        }
        if (Array.isArray(urls) && urls.length > 0 && urls[0]) {
            return { uri: urls[0] };
        }
        return require('../../../assets/images/watercan2.png');
    };

    const handleIncrease = (item) => {
        dispatch(
            updateCart({
                cart: {
                    id: item.id,
                    userId: item.userId,
                    productId: item.productId,
                    quantity: item.quantity + 1,
                },
                onSuccess: () => {
                    // 👇 YOU control this
                    dispatch(loadCartItems(item.userId));
                },
                onError: () => {
                    showToast("Unable to add quantity",true)
                }
            })
        );
    };


    const handleDecrease = (item) => {
        if (item.quantity < 1) return;
        dispatch(
            updateCart({
                cart: {
                    id: item.id,
                    userId: item.userId,
                    productId: item.productId,
                    quantity: item.quantity - 1,
                },
                onSuccess: () => {
                    dispatch(loadCartItems(item.userId));
                },
                onError:() =>{
                    showToast("unable to remove quantity",true)
                }
            })
        );
    };



    return (
        <View>
            <View style={styles.container}>
                <Image source={resolveProductImage()} style={[styles.thumb, { backgroundColor: theme.sky200 }]} resizeMode="cover" />
                <View style={{ flex: 1 }}>
                    <AppText variant="bodyStrong" color={theme.ink} numberOfLines={2}>{`${cartItem.productName}`}</AppText>
                    {unitCount != null && (
                        <AppText variant="caption" color={theme.inkMuted} style={{ marginTop: 2 }}>
                            {`1 unit = ${unitCount} ${unitCount === 1 ? 'can' : 'cans'}`}
                        </AppText>
                    )}
                    <View style={styles.priceRow}>
                        {hasPreviousPrice && (
                            <AppText variant="caption" color={theme.inkMuted} style={{ textDecorationLine: 'line-through', marginRight: 6 }}>₹{basePrice}</AppText>
                        )}
                        <AppText variant="bodyStrong" color={theme.success}>₹{unitPrice}/unit</AppText>
                    </View>
                </View>

                <View style={[styles.quantityContainer, { backgroundColor: theme.surfaceSunken }]}>
                    <TouchableOpacity onPress={() => handleDecrease(cartItem)} style={styles.iconButton}>
                        <Ionicons name="remove" size={20} color={theme.primary} />
                    </TouchableOpacity>
                    <Text style={[styles.quantity, { color: theme.ink }]}>{cartItem.quantity}</Text>
                    <TouchableOpacity onPress={() => handleIncrease(cartItem)} style={styles.iconButton}>
                        <Ionicons name="add" size={20} color={theme.primary} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.borderSubtle }]} />

        </View>

    );
};

export default CartItem;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: spacing.md,
        gap: spacing.md,
    },
    thumb: {
        width: 48,
        height: 48,
        borderRadius: radius.sm,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    quantityContainer: {
        borderRadius: radius.pill,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.xs,
    },
    iconButton: {
        paddingHorizontal: spacing.sm,
        paddingVertical: 6,
    },
    quantity: {
        fontSize: 16,
        marginHorizontal: spacing.xs,
        minWidth: 18,
        textAlign: 'center',
    },
    divider: { width: '100%', height: 1 },
});
