import {
    StyleSheet,
    View,
    FlatList,
    Image,
    TouchableOpacity,
    Modal,
    RefreshControl,
    Pressable
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getSubscriptionPlans, placeOrderSubscription } from '../../Redux/Slices/OrderSlice'
import TopAppBar from '../../Components/TopAppBar'
import AppText from '../../Components/AppText'
import AppButton from '../../Components/AppButton'
import QuantityStepper from '../../Components/QuantityStepper'
import { radius, spacing, floatShadow } from '../../Themes/Themes'
import { useTheme } from '../../Context/ThemeContext'
import { getSelectedAddressId } from '../../Utils/GetSelectedAddress'
import { useToast } from '../../Components/Toast/ToastProvider';
import AppLoading from '../../Components/AppLoading'

const SubscriptionProductList = ({ navigation }) => {

    const dispatch = useDispatch()
    const { theme } = useTheme()

    const { productList } = useSelector(state => state.products)
    const { subscriptionPlans, subscriptionLoading } = useSelector(state => state.order)

    const [expandedId, setExpandedId] = useState(null)
    const [dialogVisible, setDialogVisible] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [selectedId, setSelectedId] = useState(-1);

    const { showToast } = useToast()

    useEffect(() => {
        const loadSelected = async () => {
            const id = await getSelectedAddressId();
            setSelectedId(id);
        };
        loadSelected();
    }, []);

    useEffect(() => {
        dispatch(getSubscriptionPlans({}))
    }, [])

    const MAX_QUANTITY = 10

    const mergedProducts = useMemo(() => {
        const subMap = new Map(
            subscriptionPlans?.map(sub => [sub.productId, sub])
        )
        return productList?.data?.map(product => {
            const subscription = subMap.get(product.productId)
            return {
                ...product,
                isSubscribed: !!subscription,
                subscriptionData: subscription || null
            }
        }) || []
    }, [productList, subscriptionPlans])

    const openDialog = (product) => {
        setSelectedProduct(product)
        setQuantity(1)
        setDialogVisible(true)
    }

    const closeDialog = () => {
        setDialogVisible(false)
        setSelectedProduct(null)
        setQuantity(1)
    }

    const increase = () => {
        if (quantity < MAX_QUANTITY) {
            setQuantity(q => q + 1)
        }
    }

    const decrease = () => {
        if (quantity > 1) {
            setQuantity(q => q - 1)
        }
    }

    const handleSubscribe = () => {
        if (!selectedProduct) return

        if (selectedId === -1) {
            showToast("Please select a delivery address before subscribing.", true)
            closeDialog()
            return
        }

        dispatch(placeOrderSubscription({
            body: {
                productId: selectedProduct.productId,
                addressId: selectedId,
                quantity: quantity,
                frequency: "testing",
                startDate: new Date().toISOString()
            },
            onSuccess: () => {
                showToast("Subscription successful!")
                dispatch(getSubscriptionPlans({}))
            }
        }))

        closeDialog()
    }

    const renderItem = ({ item }) => {
        const firstImage =
            item.imageUrls?.length > 0
                ? { uri: item.imageUrls[0] }
                : require('../../../assets/images/placeholder.png')

        const expanded = expandedId === item.productId

        return (
            <Pressable
                onPress={() => setExpandedId(expanded ? null : item.productId)}
                style={[
                    styles.card,
                    { backgroundColor: theme.surfaceCard },
                    item.isSubscribed && { borderWidth: 1.5, borderColor: theme.success },
                ]}
            >
                <View style={styles.cardTop}>
                    <Image source={firstImage} style={[styles.image, { backgroundColor: theme.sky200 }]} resizeMode="contain" />

                    <View style={{ flex: 1 }}>
                        <AppText variant="bodyStrong" color={theme.ink} numberOfLines={2}>{item.name}</AppText>
                        <AppText variant="label" color={theme.inkMuted} style={{ marginTop: 2 }}>₹{item.basePrice}</AppText>
                    </View>

                    {!item.isSubscribed ? (
                        <TouchableOpacity
                            style={[styles.subscribeButton, { backgroundColor: theme.primary }]}
                            onPress={() => openDialog(item)}
                            activeOpacity={0.85}
                        >
                            <AppText variant="button" color={theme.onPrimary}>Subscribe</AppText>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={styles.subscribedChip}
                            onPress={() => setExpandedId(expanded ? null : item.productId)}
                            activeOpacity={0.8}
                        >
                            <AppText variant="bodyStrong" color={theme.success}>✓ Subscribed</AppText>
                            <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} color={theme.success} size={18} style={{ marginLeft: 4 }} />
                        </TouchableOpacity>
                    )}
                </View>

                {expanded && item.subscriptionData && (
                    <View style={[styles.subscriptionBox, { backgroundColor: theme.successTint }]}>
                        <SubCol theme={theme} label="Start Date" value={item.subscriptionData.startDate} />
                        <SubCol theme={theme} label="Expiry Date" value="31-12-2026" />
                        <SubCol theme={theme} label="Next Delivery" value={item.subscriptionData.nextDeliveryDate} />
                    </View>
                )}
            </Pressable>
        )
    }

    const [refreshing, setIsRefreshing] = useState(false)

    const handleRefresh = () => {
        setIsRefreshing(true)
        dispatch(getSubscriptionPlans({
            onSuccess: () => setIsRefreshing(false),
            onError: () => setIsRefreshing(false)
        }))
    }

    return (
        <View style={{ flex: 1, backgroundColor: theme.surface }}>

            {subscriptionLoading && (
                <AppLoading isVisible={subscriptionLoading} />
            )}

            <TopAppBar title="Subscriptions" navigation={navigation} />

            <FlatList
                data={mergedProducts}
                keyExtractor={(item) => item.productId.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ paddingHorizontal: spacing.xl, paddingTop: spacing.sm, paddingBottom: 40, gap: spacing.lg }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[theme.primary]} />
                }
                ListHeaderComponent={
                    <View style={{ gap: spacing.lg, marginBottom: spacing.lg }}>
                        {/* Explainer */}
                        <View style={[styles.helpCard, { backgroundColor: theme.warningTint }]}>
                            <View style={[styles.helpWell, { backgroundColor: theme.surfaceCard }]}>
                                <Ionicons name="repeat" size={22} color={theme.warning} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <AppText variant="title" color={theme.ink}>What is Subscriptions?</AppText>
                                <AppText variant="body" color={theme.ink} style={{ marginTop: 4 }}>
                                    With Subscriptions, your water cans are delivered automatically on a schedule. No need to reorder every time—just subscribe and we’ll handle the rest.
                                </AppText>
                            </View>
                        </View>

                        <AppText variant="title" color={theme.ink}>Available Products</AppText>
                    </View>
                }
            />

            {/* SUBSCRIBE DIALOG */}
            <Modal visible={dialogVisible} transparent animationType="fade" onRequestClose={closeDialog}>
                <View style={[styles.modalOverlay, { backgroundColor: theme.scrim }]}>
                    <View style={[styles.modalContainer, { backgroundColor: theme.surfaceCard }, floatShadow]}>
                        <AppText variant="title" color={theme.ink} style={{ textAlign: 'center' }}>
                            Subscribe {selectedProduct?.name}
                        </AppText>

                        {selectedProduct?.imageUrls?.length > 0 && (
                            <Image source={{ uri: selectedProduct.imageUrls[0] }} style={[styles.modalImage, { backgroundColor: theme.sky200 }]} resizeMode="contain" />
                        )}

                        <AppText variant="caption" color={theme.inkMuted}>Cans per delivery</AppText>
                        <QuantityStepper size="large" value={quantity} min={1} onIncrease={increase} onDecrease={decrease} style={{ marginTop: spacing.sm }} />

                        <View style={styles.dialogButtons}>
                            <View style={{ flex: 1 }}>
                                <AppButton title="Cancel" variant="dangerSoft" onAction={closeDialog} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <AppButton title="OK" onAction={handleSubscribe} />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>

        </View>
    )
}

const SubCol = ({ theme, label, value }) => (
    <View style={{ flex: 1 }}>
        <AppText variant="badge" color={theme.success}>{label}</AppText>
        <AppText variant="caption" color={theme.ink} style={{ marginTop: 2, fontWeight: '600' }}>{value ?? '—'}</AppText>
    </View>
)

export default SubscriptionProductList

const styles = StyleSheet.create({
    card: {
        borderRadius: radius.lg,
        padding: spacing.lg,
    },
    cardTop: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: radius.sm,
    },
    subscribeButton: {
        paddingHorizontal: spacing.lg,
        height: 40,
        borderRadius: radius.pill,
        alignItems: 'center',
        justifyContent: 'center',
    },
    subscribedChip: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    subscriptionBox: {
        flexDirection: 'row',
        marginTop: spacing.md,
        padding: spacing.md,
        borderRadius: radius.sm,
        gap: spacing.sm,
    },

    helpCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        padding: spacing.lg,
        borderRadius: radius.lg,
    },
    helpWell: {
        width: 44,
        height: 44,
        borderRadius: radius.sm,
        alignItems: 'center',
        justifyContent: 'center',
    },

    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    modalContainer: {
        width: '100%',
        maxWidth: 340,
        borderRadius: radius.md,
        padding: spacing.xl,
        alignItems: 'center',
        gap: spacing.md,
    },
    modalImage: {
        width: 88,
        height: 88,
        borderRadius: radius.sm,
    },
    dialogButtons: {
        flexDirection: 'row',
        gap: spacing.md,
        marginTop: spacing.sm,
        alignSelf: 'stretch',
    },
})
