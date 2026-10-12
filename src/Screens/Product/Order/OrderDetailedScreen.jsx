import { useAppContext } from '../../../Context/AppContext';
import { useTheme } from '../../../Context/ThemeContext';
import Fonts from '../../../../assets/fonts/Fonts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppButton from '../../../Components/AppButton';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Image, LayoutAnimation, Linking, Platform, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import OrderSummary from '../../../Components/Cart/OrderSummary';
import Line from '../../../Components/Line';
import OrderProdItem from '../../../Components/Order/OrderProdItem';
import TopAppBar from '../../../Components/TopAppBar';
import VectorBg from '../../../Components/VectorBg';
import OrderTimeline from '../../../Components/OrderTracking/OrderTimeLIne';
import { useDispatch, useSelector } from 'react-redux';
import { getDetailedProducts } from '../../../Redux/Slices/ProductsSlice';
import AppLoading from '../../../Components/AppLoading';
import { cancelOrder, clearOrderDetailed, getAllOrders, getOrderDetailed } from '../../../Redux/Slices/OrderSlice';
import { useToast } from '../../../Components/Toast/ToastProvider';
import OrderApi from '../../../API/modules/OrderService';

/** CUS-16/17/20: map any backend order-status string to a label, color and icon. */
const statusMeta = (raw) => {
    const s = String(raw ?? '').toLowerCase();
    if (s.includes('cancel')) return { label: 'Cancelled', color: '#E53935', icon: 'close-circle' };
    if (s.includes('fail')) return { label: 'Delivery failed', color: '#E53935', icon: 'alert-circle' };
    if (s.includes('out')) return { label: 'Out for delivery', color: '#FB8C00', icon: 'bicycle' };
    if (s.includes('deliver') || s.includes('complete')) return { label: 'Delivered', color: '#43A047', icon: 'checkmark-circle' };
    if (s.includes('assign') || s.includes('load')) return { label: raw, color: '#FB8C00', icon: 'cube' };
    return { label: raw || 'Placed', color: '#FB8C00', icon: 'time' };
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

    const headerConfig = {
        color: theme.greyText,
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.lg
    }

    const paratextConfig = {
        color: theme.secondaryText,
        fontFamily: Fonts.family.medium,
        fontSize: Fonts.size.xs
    }


    const { orderDetailed } = useSelector((state) => state.order)
    const { showToast } = useToast()

    const order = orderDetailed?.data
    const meta = statusMeta(order?.deliveryStatus ?? order?.status)

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
        <View style={[styles.container, { backgroundColor: theme.secondaryBackground, paddingBottom: insets.bottom }]}>
            <TopAppBar title='Order Details' navigation={navigation} />

            {orderDetailed.isLoading && (
                <AppLoading isVisible={orderDetailed.isLoading} />
            )}

            {orderDetailed && orderDetailed?.data ? (
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                    <View style={[styles.content]}>

                        {/* order id  */}
                        <View style={[styles.cardContainer, { backgroundColor: theme.cardContainer }]}>

                            <TouchableOpacity onPress={toggleExpand} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <Text style={[headerConfig, { marginLeft: 6, color: theme.greyText, fontSize: Fonts.size.base }]}>Order Details</Text>
                                <Ionicons onPress={toggleExpand} name={!expanded ? 'chevron-down' : 'chevron-up'} color={theme.background} size={20} />
                            </TouchableOpacity>
                            <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
                                <VectorBg icon={"cart"} bgColor={'#F48FB1'} iconTint={"#880E4F"} />
                                <View style={{ marginLeft: 10, flex: 1 }}>
                                    <Text numberOfLines={1}
                                        ellipsizeMode="tail" style={[paratextConfig, { color: theme.greyText }]}>{`OrderID : #${orderDetailed?.data?.orderId}`}</Text>
                                    <Text style={paratextConfig}>{`${orderDetailed?.data.items?.length}`} items</Text>
                                </View>


                                <View style={{ paddingHorizontal: 10, paddingVertical: 5, alignItems: "center" }}>
                                    <View style={[styles.deliveryTag, {
                                        marginTop: 3,
                                        backgroundColor: meta.color + '22',
                                        borderColor: meta.color,
                                        borderWidth: 1,
                                    }]}>
                                        <Ionicons name={meta.icon} color={meta.color} size={16} style={{ marginRight: 4 }} />
                                        <Text style={[paratextConfig, { fontFamily: Fonts.family.bold, color: meta.color, marginRight: 6 }]}>{meta.label}</Text>
                                    </View>
                                </View>
                            </View>

                            <Line style={{ marginTop: 10 }} />
                            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6, justifyContent: "space-between" }}>


                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Ionicons name={meta.icon} color={meta.color} size={26} />
                                    <Text style={[headerConfig, { marginLeft: 6, color: meta.color, fontSize: Fonts.size.sm }]}>{meta.label}</Text>
                                </View>
                            </View>
                            {expanded && (
                                <View style={styles.detailsContainer}>
                                    <View style={{ flexDirection: "column", paddingBottom: 5 }}>
                                        <Text style={[paratextConfig, { color: theme.secondaryText }]}>Order ID</Text>
                                        <Text style={[paratextConfig, { color: theme.greyText }]}>#{order?.orderId}</Text>
                                    </View>
                                    {!!(order?.receiverName || order?.receiverPhone) && (
                                        <View style={{ flexDirection: "column", marginVertical: 5 }}>
                                            <Text style={[paratextConfig, { color: theme.secondaryText }]}>Receiver Details</Text>
                                            <Text style={[paratextConfig, { color: theme.greyText }]}>
                                                {[order?.receiverName, order?.receiverPhone].filter(Boolean).join(', ')}
                                            </Text>
                                        </View>
                                    )}
                                    <View style={{ flexDirection: "column" }}>
                                        <Text style={[paratextConfig, { color: theme.secondaryText }]}>Address</Text>
                                        <Text style={[paratextConfig, { color: theme.greyText }]}>{order?.deliveryAddress ?? '—'}</Text>
                                    </View>
                                    <View style={{ flexDirection: "column", marginVertical: 5 }}>
                                        <Text style={[paratextConfig, { color: theme.secondaryText }]}>Placed Time</Text>
                                        <Text style={[paratextConfig, { color: theme.greyText }]}>{formatDateTime(order?.orderDate)}</Text>
                                    </View>
                                </View>
                            )}

                        </View>

                        {/* Track order — only while the order is in flight (PLACED / ASSIGNED /
                            OUT_FOR_DELIVERY). Hidden once delivered, cancelled or failed. */}
                        {canTrackOrder(order?.deliveryStatus ?? order?.status) && (
                            <TouchableOpacity
                                onPress={() => navigation?.navigate?.('OrderTrackingScreen', { id: orderId })}
                                style={[styles.trackBtn, { backgroundColor: theme.primary }]}
                            >
                                <Ionicons name="location" size={20} color={theme.buttonText} style={{ marginRight: 8 }} />
                                <Text style={[paratextConfig, { color: theme.buttonText, fontFamily: Fonts.family.semiBold, fontSize: Fonts.size.sm }]}>
                                    Track Order
                                </Text>
                            </TouchableOpacity>
                        )}

                        {/* timeline — driven by the real order.history / status */}
                        {/* <OrderTimeline order={order} fromWhiteBg={true} style={[styles.cardContainer, { backgroundColor: theme.cardContainer }]} /> */}

                        {/* <OrderProdItem/> */}
                        <View style={[styles.cardContainer, { backgroundColor: theme.cardContainer }]}>

                            <TouchableOpacity
                                onPress={toggleItemsExpand}
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}
                            >

                                <Text
                                    style={[
                                        paratextConfig,
                                        { marginLeft: 6, color: theme.greyText, fontSize: Fonts.size.sm }
                                    ]}
                                >
                                    {orderDetailed?.data?.items?.length} items in order
                                </Text>

                                <Ionicons
                                    name={!itemsExpanded ? "chevron-down" : "chevron-up"}
                                    color={theme.background}
                                    size={20}
                                />

                            </TouchableOpacity>

                            {/* PRODUCTS */}

                            {(itemsExpanded
                                ? orderDetailed?.data?.items
                                : orderDetailed?.data?.items?.slice(0, 2)
                            )?.map((item, index) => (

                                <OrderProdItem
                                    key={index}
                                    item={item}
                                />

                            ))}

                        </View>

                        {/*Order summary — driven by the real order/{id} breakdown snapshot */}
                        <OrderSummary isOrderDetails={true} order={order} />

                        {/* CUS-18 invoice — available once the order is delivered. */}
                        {isDelivered && (
                          <View style={{ paddingHorizontal: 10 }}>
                            <AppButton
                              title="Download invoice"
                              borderOnly
                              isLoading={invoiceLoading}
                              loadingText="Fetching..."
                              onAction={handleInvoice}
                            />
                          </View>
                        )}

                        {/* CUS-19/20 — self-service is open only while the order is unassigned (PLACED).
                            can-cancel from the backend is the authoritative gate for this window. */}
                        {canCancel && (
                          <View style={{ paddingHorizontal: 10 }}>
                            <AppButton
                              title="Modify order"
                              borderOnly
                              style={{ marginBottom: 0 }}
                              onAction={() => navigation?.navigate?.('ModifyOrder', { orderId: orderId })}
                            />
                            <AppButton
                              title="Cancel order"
                              isLoading={cancelling}
                              loadingText="Cancelling..."
                              style={{ backgroundColor: '#E53935' }}
                              onAction={handleCancel}
                            />
                          </View>
                        )}
                    </View>
                </ScrollView>
            ) : (
                <Image
                    source={require('../../../../assets/images/no_order.jpg')}
                    style={{
                        width: 180,
                        height: 180,
                        marginBottom: 10
                    }}
                    resizeMode="contain"
                />
            )}

        </View>
    )
}

export default OrderDetailedScreen

const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    deliveryTag: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        marginVertical: 5,
        paddingVertical: 2,
        borderRadius: 5,
    },

    cardContainer: {
        borderRadius: 20,
        justifyContent: "center",
        padding: 12,
        margin: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },

    content: {
        margin: 8
    },
    trackBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 14,
        paddingVertical: 12,
        marginHorizontal: 10,
        marginTop: 2,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    header: {
        marginLeft: 6,
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },
    summaryTextContainer: {
        marginLeft: 10,
        flex: 1,
    },
    orderIdText: {
        fontSize: 14,
    },
    itemText: {
        fontSize: 12,
    },
    deliveryTagContainer: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        alignItems: "center",
    },
    deliveryText: {
        fontSize: 10,
    },
    deliveryTag: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        borderWidth: 1,
        borderRadius: 8,
    },
    tagIcon: {
        width: 20,
        height: 20,
        marginRight: 5,
    },
    tagText: {
        fontFamily: 'bold',
    },
    line: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 10,
    },
    statusRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    statusLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    statusIcon: {
        width: 30,
        height: 30,
    },
    statusText: {
        marginLeft: 6,
    },
    lottieStyle: {
        width: 60,
        height: 60,
    },
    detailsContainer: {
        marginTop: 10,
        paddingHorizontal: 10,
    },
    detailText: {
        fontSize: 12,
        marginVertical: 2,
    }
})