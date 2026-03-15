import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
    TouchableOpacity,
    Modal,
    ScrollView,
    RefreshControl,
    Button,
    Pressable
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getSubscriptionPlans, placeOrderSubscription } from '../../Redux/Slices/OrderSlice'
import TopAppBar from '../../Components/TopAppBar'
import { useTheme } from '../../Context/ThemeContext'
import Fonts from '../../../assets/fonts/Fonts'
import VectorBg from '../../Components/VectorBg'
import { getSelectedAddressId } from '../../Utils/GetSelectedAddress'
import { useToast } from '../../Components/Toast/ToastProvider';
import AppLoading from '../../Components/AppLoading'

const SubscriptionProductList = ({ navigation }) => {

    const dispatch = useDispatch()

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



    const { theme } = useTheme()

    const headerConfig = {
        color: theme.greyText,
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.base
    };

    const paratextConfig = {
        color: theme.secondaryText,
        fontFamily: Fonts.family.medium,
        fontSize: Fonts.size.xs
    };


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
                onPress={() => {
                    setExpandedId(expanded ? null : item.productId)
                }}
                style={[
                    styles.card,
                    item.isSubscribed && styles.subscribedCard
                ]}
            >



                <Image
                    source={firstImage}
                    style={[
                        styles.image,
                        item.isSubscribed && { alignSelf: "flex-start" }
                    ]}
                />

                <View style={{ flex: 1 }}>

                    <Text style={styles.name}>
                        {item.name}
                    </Text>

                    <Text style={styles.price}>
                        ₹{item.basePrice}
                    </Text>

                    {item.isSubscribed && (

                        <TouchableOpacity
                            onPress={() =>
                                setExpandedId(expanded ? null : item.productId)
                            }
                        >
                            <Text style={styles.subscribedLabel}>
                                Subscribed ✓
                            </Text>
                        </TouchableOpacity>

                    )}

                    {expanded && item.subscriptionData && (

                        <View style={styles.subscriptionBox}>

                            <Text>
                                Start Date: {item.subscriptionData.startDate}
                            </Text>

                            <Text>
                                Expiry Date: 31-12-2026
                            </Text>

                            <Text>
                                Next Delivery: {item.subscriptionData.nextDeliveryDate}
                            </Text>

                        </View>

                    )}

                </View>

                {!item.isSubscribed && (

                    <TouchableOpacity
                        style={styles.subscribeButton}
                        onPress={() => openDialog(item)}
                    >

                        <Text style={styles.subscribeText}>
                            Subscribe
                        </Text>

                    </TouchableOpacity>

                )}

                {
                    item.isSubscribed && (
                        <View style={{ alignSelf: "flex-start" }}>
                            <TouchableOpacity onPress={() => {
                                setExpandedId(expanded ? null : item.productId)
                            }}>
                                {expanded ? (
                                    <Ionicons name={"caret-down-outline"} color={'black'} size={20} />
                                ) : (
                                    <Ionicons name={"caret-up-outline"} color={'black'} size={20} />
                                )}
                            </TouchableOpacity>
                        </View>
                    )
                }


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

        <View style={{ flex: 1  }} >

            {subscriptionLoading && (
                <AppLoading isVisible={subscriptionLoading} />
            )}

            <TopAppBar title="Subscriptions" navigation={navigation} />

            {/* HELP CARD */}
            <View style={[styles.helpCard, { backgroundColor: theme.cardContainer }]}>
                <VectorBg icon="diamond" bgColor={"#fdfc1a"} />
                <Text style={[headerConfig, styles.helpTitle]}>What is Subscriptions?</Text>
                <Text style={paratextConfig}>
                    With Subscriptions, your water cans are delivered automatically on a schedule. No need to reorder every time—just subscribe and we’ll handle the rest.
                </Text>
            </View>


            <Text style={[headerConfig, { marginHorizontal: 12, marginBottom: 6 }]}>
                Available Products
            </Text>


            <FlatList
                data={mergedProducts}
                keyExtractor={(item) => item.productId.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 12 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                    />
                }
            />



            {/* SUBSCRIBE DIALOG */}

            <Modal
                visible={dialogVisible}
                transparent
                animationType="fade"
            >

                <View style={styles.modalOverlay}>

                    <View style={styles.modalContainer}>

                        <Text style={styles.modalTitle}>
                            Subscribe {selectedProduct?.name}
                        </Text>

                        {selectedProduct?.imageUrls?.length > 0 && (
                            <Image
                                source={{ uri: selectedProduct.imageUrls[0] }}
                                style={styles.modalImage}
                            />
                        )}

                        <View style={styles.stepper}>

                            <TouchableOpacity
                                style={styles.stepButton}
                                onPress={decrease}
                            >
                                <Text style={styles.stepText}>-</Text>
                            </TouchableOpacity>

                            <Text style={styles.quantityText}>
                                {quantity}
                            </Text>

                            <TouchableOpacity
                                style={styles.stepButton}
                                onPress={increase}
                            >
                                <Text style={styles.stepText}>+</Text>
                            </TouchableOpacity>

                        </View>

                        <View style={styles.dialogButtons}>

                            <TouchableOpacity onPress={closeDialog}>
                                <Text style={styles.cancelText}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.okButton}
                                onPress={handleSubscribe}
                            >

                                <Text style={styles.okText}>
                                    OK
                                </Text>

                            </TouchableOpacity>

                        </View>

                    </View>

                </View>

            </Modal>

        </View>

    )
}

export default SubscriptionProductList


const styles = StyleSheet.create({

    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 16,
        marginBottom: 12,
        backgroundColor: '#fff',
        elevation: 3
    },

    subscribedCard: {
        borderWidth: 1,
        borderColor: '#2ecc71'
    },

    helpCard: {
        padding: 16,
        margin: 12,
        borderRadius: 12,
        marginBottom: 24
    },

    helpTitle: {
        marginTop: 12,
        marginBottom: 6
    },

    image: {
        width: 60,
        height: 60,
        borderRadius: 10,
        marginRight: 10
    },

    name: {
        fontSize: 16,
        fontWeight: '600'
    },

    price: {
        marginTop: 3,
        color: '#555'
    },

    subscribedLabel: {
        marginTop: 6,
        color: '#2ecc71',
        fontWeight: '600'
    },

    subscriptionBox: {
        marginTop: 6,
        padding: 6,
        borderRadius: 8,
        backgroundColor: '#e8f8f0'
    },

    subscribeButton: {
        backgroundColor: '#3274CC',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10
    },

    subscribeText: {
        color: '#fff',
        fontWeight: '600'
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },

    modalContainer: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10
    },

    modalImage: {
        width: '100%',
        height: 120,
        borderRadius: 12,
        marginBottom: 20
    },

    stepper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },

    stepButton: {
        backgroundColor: '#3274CC',
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },

    stepText: {
        color: '#fff',
        fontSize: 20
    },

    quantityText: {
        marginHorizontal: 20,
        fontSize: 18,
        fontWeight: '600'
    },

    dialogButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    cancelText: {
        fontSize: 16,
        color: "white",
        backgroundColor: "#FF1C1C",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10
    },

    okButton: {
        backgroundColor: '#3274CC',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 10
    },

    okText: {
        color: '#fff'
    }

})