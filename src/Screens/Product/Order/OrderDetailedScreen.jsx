import { useAppContext } from '../../../Context/AppContext';
import { useTheme } from '../../../Context/ThemeContext';
import Fonts from '../../../../assets/fonts/Fonts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppButton from '../../../Components/AppButton';
import { useEffect, useState } from 'react';
import { Alert, Image, LayoutAnimation, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';
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


    useEffect(() => {
        if (orderId) {
            dispatch(clearOrderDetailed())
        console.log("called")
        dispatch(getOrderDetailed({
            id: orderId,
            onSuccess: () => {

            },
            onError: () => {

            },
        }))
        }
    }, [orderId])


    const { orderDetailed } = useSelector((state) => state.order)
    const { showToast } = useToast()

    const order = orderDetailed?.data
    const meta = statusMeta(order?.deliveryStatus ?? order?.status)

    // CUS-20: authoritative cancel-window from backend (canCancel === PLACED / pre-ASSIGNED).
    const [canCancel, setCanCancel] = useState(false)
    const [cancelling, setCancelling] = useState(false)

    useEffect(() => {
        let active = true
        if (!orderId) return
        OrderApi.canCancel(orderId)
            .then((res) => { if (active) setCanCancel(!!res?.canCancel) })
            .catch(() => { if (active) setCanCancel(false) })
        return () => { active = false }
    }, [orderId])

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
                                dispatch(getOrderDetailed({ id: orderId, onSuccess: () => { }, onError: () => { } }))
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

    return (
        <View style={[styles.container, { backgroundColor: theme.secondaryBackground, paddingBottom: insets.bottom }]}>
            <TopAppBar title='Order Details' navigation={navigation} />

            {orderDetailed.isLoading && (
                <AppLoading isVisible={orderDetailed.isLoading} />
            )}

            {orderDetailed && orderDetailed?.data ? (
                <ScrollView>
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

                        {/* timeline */}
                        <OrderTimeline fromWhiteBg={true} style={[styles.cardContainer, { backgroundColor: theme.cardContainer }]} />

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

                        {/*Order summary */}
                        <OrderSummary isOrderDetails={true} />

                        {/* CUS-19/20 — self-service is open only while the order is unassigned (PLACED).
                            can-cancel from the backend is the authoritative gate for this window. */}
                        {canCancel && (
                          <>
                            <AppButton
                              title="Modify order"
                              borderOnly
                              style={{ margin: 10, marginBottom: 0 }}
                              onAction={() => navigation?.navigate?.('ModifyOrder', { orderId: orderId })}
                            />
                            <AppButton
                              title="Cancel order"
                              isLoading={cancelling}
                              loadingText="Cancelling..."
                              style={{ margin: 10, backgroundColor: '#E53935' }}
                              onAction={handleCancel}
                            />
                          </>
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