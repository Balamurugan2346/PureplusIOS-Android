import { useAppContext } from '../../../Context/AppContext';
import { useTheme } from '../../../Context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppButton from '../../../Components/AppButton';
import AppText from '../../../Components/AppText';
import StatusBadge from '../../../Components/StatusBadge';
import { radius, spacing } from '../../../Themes/Themes';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Image, LayoutAnimation, Linking, Platform, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import OrderSummary from '../../../Components/Cart/OrderSummary';
import OrderProdItem from '../../../Components/Order/OrderProdItem';
import TopAppBar from '../../../Components/TopAppBar';
import { useDispatch, useSelector } from 'react-redux';
import { getDetailedProducts } from '../../../Redux/Slices/ProductsSlice';
import AppLoading from '../../../Components/AppLoading';
import { cancelOrder, clearOrderDetailed, getAllOrders, getOrderDetailed } from '../../../Redux/Slices/OrderSlice';
import { useToast } from '../../../Components/Toast/ToastProvider';
import OrderApi from '../../../API/modules/OrderService';

/** CUS-16/17/20: map any backend order-status string to a label, semantic tone and icon.
 *  `tone` resolves to theme tokens (theme[tone] / theme[`${tone}Tint`]) in the component. */
const statusMeta = (raw) => {
    const s = String(raw ?? '').toLowerCase();
    if (s.includes('cancel')) return { label: 'Cancelled', tone: 'danger', icon: 'close-circle-outline' };
    if (s.includes('fail')) return { label: 'Delivery failed', tone: 'danger', icon: 'alert-circle-outline' };
    if (s.includes('out')) return { label: 'Out for delivery', tone: 'warning', icon: 'bicycle-outline' };
    if (s.includes('deliver') || s.includes('complete')) return { label: 'Delivered', tone: 'success', icon: 'checkmark-circle-outline' };
    if (s.includes('assign') || s.includes('load')) return { label: 'Driver Assigned', color: '#C2500A', icon: 'person-outline' };
    return { label: raw || 'Placed', tone: 'info', icon: 'time-outline' };
};

const formatDateTime = (value) => {
    if (!value) return '—';
    const d = new Date(value);
    if (isNaN(d.getTime())) return String(value);
    return d.toLocaleString();
};

/**
 * Track-order is offered only while the order is still in flight — i.e. canonical status
 * PLACED / ASSIGNED / OUT_FOR_DELIVERY (per backend OrderLifecycleRules). Hidden once the
 * order is DELIVERED, CANCELLED or FAILED (terminal), and for DELIVERED_PAYMENT_PENDING /
 * DISPUTED. Legacy LOADED / dispatched spellings are accepted too. Match the backend's
 * normalization: upper-case + strip non-alphanumerics before comparing.
 */
const TRACKABLE_STATUSES = new Set([
    'PLACED', 'PENDING', 'NEW', 'ORDERPLACED', '1',         // placed
    'ASSIGNED',                                             // assigned
    'LOADED', 'PICKEDUP',                                   // legacy dispatched
    'OUTFORDELIVERY', 'OFD', 'INTRANSIT', 'INPROGRESS', 'DISPATCHED', 'DISPATCH', // out for delivery
]);
const canTrackOrder = (raw) => {
    const k = String(raw ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    return TRACKABLE_STATUSES.has(k);
};

const OrderDetailedScreen = ({ navigation, route }) => {




    const orderId = route?.params.id

    const dispatch = useDispatch()

    console.log("order id", orderId)

    if (Platform.OS === 'android') {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    const [expanded, setExpanded] = useState(false);

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    const [itemsExpanded, setItemsExpanded] = useState(false);

    const toggleItemsExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setItemsExpanded(!itemsExpanded);
    };
    const insets = useSafeAreaInsets();
    const { addToCart, cart, reduceQuantity, removeFromCart, usersAddress } = useAppContext()
    const { theme } = useTheme()

    const { orderDetailed } = useSelector((state) => state.order)
    const { showToast } = useToast()

    const order = orderDetailed?.data
    const meta = statusMeta(order?.deliveryStatus ?? order?.status)
    const metaColor = meta.color ?? theme[meta.tone] ?? theme.info

    // CUS-20: authoritative cancel-window from backend (canCancel === PLACED / pre-ASSIGNED).
    const [canCancel, setCanCancel] = useState(false)
    const [cancelling, setCancelling] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    // CUS-18 invoice — offered once the order is delivered.
    const [invoiceLoading, setInvoiceLoading] = useState(false)
    const isDelivered = /deliver|complete/i.test(String(order?.deliveryStatus ?? order?.status ?? ''))

    // Re-check the backend cancel window alongside any order refresh.
    const refreshCanCancel = useCallback(() => {
        if (!orderId) return
        OrderApi.canCancel(orderId)
            .then((res) => setCanCancel(!!res?.canCancel))
            .catch(() => setCanCancel(false))
    }, [orderId])

    // silent=true keeps the current data on screen (no loader flash) — used by pull-to-refresh
    // and the in-flight poll; the initial load clears first so the loader shows.
    const fetchOrder = useCallback(({ silent = false } = {}) => {
        if (!orderId) return
        if (!silent) dispatch(clearOrderDetailed())
        dispatch(getOrderDetailed({ id: orderId, onSuccess: () => { }, onError: () => { } }))
        refreshCanCancel()
    }, [orderId, dispatch, refreshCanCancel])

    // initial load
    useEffect(() => { fetchOrder() }, [fetchOrder])

    // pull-to-refresh
    const onRefresh = useCallback(() => {
        if (!orderId) return
        setRefreshing(true)
        dispatch(getOrderDetailed({
            id: orderId,
            onSuccess: () => setRefreshing(false),
            onError: () => setRefreshing(false),
        }))
        refreshCanCancel()
    }, [orderId, dispatch, refreshCanCancel])

    // Live-refresh while the order is still in flight (PLACED / ASSIGNED / OUT_FOR_DELIVERY):
    // poll every 20s and stop automatically once it reaches a terminal status or unmounts.
    const inFlight = canTrackOrder(order?.deliveryStatus ?? order?.status)
    useEffect(() => {
        if (!orderId || !inFlight) return
        const t = setInterval(() => fetchOrder({ silent: true }), 20000)
        return () => clearInterval(t)
    }, [orderId, inFlight, fetchOrder])

    const handleCancel = () => {
        Alert.alert(
            'Cancel order',
            'Are you sure you want to cancel this order? Cancellation is free while the order has not yet been assigned to a driver.',
            [
                { text: 'Keep order', style: 'cancel' },
                {
                    text: 'Yes, cancel',
                    style: 'destructive',
                    onPress: () => {
                        setCancelling(true)
                        dispatch(cancelOrder({
                            id: orderId,
                            onSuccess: () => {
                                setCancelling(false)
                                setCanCancel(false)
                                showToast('Order cancelled')
                                dispatch(getAllOrders({}))
                                fetchOrder({ silent: true })
                            },
                            onError: (err) => {
                                setCancelling(false)
                                showToast(
                                    err?.response?.data?.message ||
                                    'This order can no longer be cancelled here. Please contact the store.',
                                    true,
                                )
                            },
                        }))
                    },
                },
            ],
        )
    }

    // CUS-18 invoice fetch. Backend currently returns 501 (generation not built yet) → surface
    // that honestly rather than pretending. When it ships, { invoiceUrl } opens in the browser.
    const handleInvoice = async () => {
        if (!orderId || invoiceLoading) return
        setInvoiceLoading(true)
        try {
            const res = await OrderApi.invoice(orderId)
            const url = res?.invoiceUrl
            if (url && await Linking.canOpenURL(url)) {
                await Linking.openURL(url)
            } else {
                Alert.alert('Invoice', 'Invoice is not available yet.')
            }
        } catch (e) {
            Alert.alert('Invoice unavailable', e?.message || 'Invoice is not available yet.')
        } finally {
            setInvoiceLoading(false)
        }
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.surface, paddingBottom: insets.bottom }]}>
            <TopAppBar title='Order Details' navigation={navigation} />

            {orderDetailed.isLoading && (
                <AppLoading isVisible={orderDetailed.isLoading} />
            )}

            {orderDetailed && orderDetailed?.data ? (
                <ScrollView
                    contentContainerStyle={{ padding: spacing.xl, gap: spacing.lg, paddingBottom: 40 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} />
                    }
                >
                    {/* Order card */}
                    <View style={[styles.card, { backgroundColor: theme.surfaceCard }]}>

                        <TouchableOpacity onPress={toggleExpand} style={styles.cardHeaderRow}>
                            <AppText variant="title" color={theme.ink}>Order Details</AppText>
                            <Ionicons name={!expanded ? 'chevron-down' : 'chevron-up'} color={theme.inkMuted} size={20} />
                        </TouchableOpacity>

                        <View style={styles.orderRow}>
                            <View style={[styles.iconWell, { backgroundColor: theme.primaryTint }]}>
                                <Ionicons name="cart-outline" size={22} color={theme.primary} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <AppText variant="bodyStrong" color={theme.ink} numberOfLines={1}>{order?.orderCode || `Order #${order?.orderId}`}</AppText>
                                <AppText variant="caption" color={theme.inkMuted} style={{ marginTop: 2 }}>{`${order?.items?.length ?? 0} items`}</AppText>
                            </View>
                            <StatusBadge status={order?.deliveryStatus ?? order?.status} />
                        </View>

                        {/* Status line box */}
                        <View style={[styles.statusBox, { backgroundColor: theme.surfaceSunken }]}>
                            <Ionicons name={meta.icon} color={metaColor} size={18} style={{ marginRight: 8 }} />
                            <AppText variant="label" color={metaColor} style={{ flex: 1 }}>{meta.label}</AppText>
                            {!!order?.orderType && (
                                <View style={[styles.orderTypeBadge, {
                                    backgroundColor: order.orderType === 'REFILL' ? '#F0E9FF' : theme.surfaceCard,
                                }]}>
                                    <AppText variant="caption" color={order.orderType === 'REFILL' ? '#6B21A8' : theme.inkMuted}>
                                        {order.orderType === 'REFILL' ? 'Refill' : 'Standard'}
                                    </AppText>
                                </View>
                            )}
                        </View>

                        {expanded && (
                            <View style={styles.detailsGrid}>
                                <DetailRow theme={theme} label="Order ID" value={order?.orderCode || `#${order?.orderId}`} />
                                {!!(order?.receiverName || order?.receiverPhone) && (
                                    <DetailRow theme={theme} label="Receiver" value={[order?.receiverName, order?.receiverPhone].filter(Boolean).join(' · ')} />
                                )}
                                <DetailRow theme={theme} label="Address" value={order?.deliveryAddress ?? '—'} />
                                <DetailRow theme={theme} label="Placed time" value={formatDateTime(order?.orderDate)} />
                            </View>
                        )}

                    </View>

                    {/* Track order — only while the order is in flight. */}
                    {canTrackOrder(order?.deliveryStatus ?? order?.status) && (
                        <AppButton
                            title="Track Order"
                            icon="location-outline"
                            onAction={() => navigation?.navigate?.('OrderTrackingScreen', { id: orderId })}
                        />
                    )}

                    {/* Items card */}
                    <View style={[styles.card, { backgroundColor: theme.surfaceCard }]}>
                        <TouchableOpacity onPress={toggleItemsExpand} style={styles.cardHeaderRow}>
                            <AppText variant="bodyStrong" color={theme.ink}>{`${order?.items?.length ?? 0} items in order`}</AppText>
                            <Ionicons name={!itemsExpanded ? "chevron-down" : "chevron-up"} color={theme.inkMuted} size={20} />
                        </TouchableOpacity>

                        {(itemsExpanded
                            ? order?.items
                            : order?.items?.slice(0, 2)
                        )?.map((item, index) => (
                            <OrderProdItem key={index} item={item} isRefill={order?.orderType === 'REFILL'} />
                        ))}
                    </View>

                    {/* Order summary — real order/{id} breakdown snapshot */}
                    <OrderSummary isOrderDetails={true} order={order} />

                    {/* CUS-18 invoice — available once delivered. */}
                    {isDelivered && (
                        <AppButton
                            title="Download invoice"
                            icon="download-outline"
                            borderOnly
                            isLoading={invoiceLoading}
                            loadingText="Fetching..."
                            onAction={handleInvoice}
                        />
                    )}

                    {/* CUS-19/20 — self-service is open only while the order is unassigned (PLACED). */}
                    {canCancel && (
                        <View>
                            <View style={styles.actionRow}>
                                <View style={{ flex: 1 }}>
                                    <AppButton
                                        title="Modify order"
                                        borderOnly
                                        onAction={() => navigation?.navigate?.('ModifyOrder', { orderId: orderId })}
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <AppButton
                                        title="Cancel order"
                                        variant="dangerSoft"
                                        isLoading={cancelling}
                                        loadingText="Cancelling..."
                                        onAction={handleCancel}
                                    />
                                </View>
                            </View>
                            <AppText variant="caption" color={theme.inkMuted} style={styles.actionHint}>
                                Free to change or cancel until a delivery partner is assigned.
                            </AppText>
                        </View>
                    )}
                </ScrollView>
            ) : (
                <View style={styles.emptyWrap}>
                    <Image
                        source={require('../../../../assets/images/no_order.jpg')}
                        style={{ width: 120, height: 120 }}
                        resizeMode="contain"
                    />
                </View>
            )}

        </View>
    )
}

/** 2-column label/value detail row used in the expanded order card. */
const DetailRow = ({ theme, label, value }) => (
    <View style={styles.detailRow}>
        <AppText variant="caption" color={theme.inkMuted} style={styles.detailLabel}>{label}</AppText>
        <AppText variant="caption" color={theme.ink} style={styles.detailValue}>{value}</AppText>
    </View>
)

export default OrderDetailedScreen

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    card: {
        borderRadius: radius.lg,
        padding: spacing.lg,
        gap: spacing.md,
    },
    cardHeaderRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    orderRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.md,
    },
    iconWell: {
        width: 44,
        height: 44,
        borderRadius: radius.sm,
        alignItems: "center",
        justifyContent: "center",
    },
    statusBox: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: radius.sm,
        padding: spacing.md,
    },
    orderTypeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: radius.sm,
    },
    detailsGrid: {
        gap: spacing.md,
    },
    detailRow: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
    detailLabel: {
        width: 110,
    },
    detailValue: {
        flex: 1,
    },
    actionRow: {
        flexDirection: "row",
        gap: spacing.md,
    },
    actionHint: {
        textAlign: "center",
        marginTop: spacing.md,
    },
    emptyWrap: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
})