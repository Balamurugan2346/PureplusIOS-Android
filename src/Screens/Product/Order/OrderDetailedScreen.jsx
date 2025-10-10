import { useAppContext } from '../../../Context/AppContext';
import { useTheme } from '../../../Context/ThemeContext';
import Fonts from '../../../../assets/fonts/Fonts';
import  Ionicons  from 'react-native-vector-icons/Ionicons';
import { useState } from 'react';
import { Image, LayoutAnimation, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import OrderSummary from '../../../Components/Cart/OrderSummary';
import Line from '../../../Components/Line';
import OrderProdItem from '../../../Components/Order/OrderProdItem';
import TopAppBar from '../../../Components/TopAppBar';
import VectorBg from '../../../Components/VectorBg';

const OrderDetailedScreen = ({navigation}) => {


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

    return (
        <View style={[styles.container, { backgroundColor: theme.secondaryBackground ,paddingBottom:insets.bottom }]}>
            <TopAppBar title='Order Details' navigation={navigation}/>
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
                                    ellipsizeMode="tail" style={[paratextConfig, { color: theme.greyText }]}>Order ID : #24543654756#245 43654756#245 43654756 #24543654756</Text>
                                <Text style={paratextConfig}>5 items</Text>
                            </View>


                            <View style={{ paddingHorizontal: 10, paddingVertical: 5, alignItems: "center" }}>
                                <Text style={[headerConfig, { fontSize: Fonts.size.xs }]}>Arrived in </Text>
                                <View style={[styles.deliveryTag, {
                                    marginTop: 3,
                                    backgroundColor: "#FFF59D", // light yellow
                                    borderColor: "#FDD835"
                                }]}>
                                    <Image source={require('../../../../assets/images/thunder.png')} style={{ width: 20, height: 20 }} tintColor={theme.tagIconColor} />
                                    <Text style={[paratextConfig, { fontFamily: Fonts.family.bold, color: "#5D4037", marginRight: 8 }]}>6 Mins</Text>
                                </View>
                            </View>
                        </View>

                        <Line style={{ marginTop: 10 }} />
                        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6, justifyContent: "space-between" }}>


                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Image source={require('../../../../assets/images/orderSuccess.png')} style={{ width: 30, height: 30 }} />
                                <Text style={[headerConfig, { marginLeft: 6, color: '#43A047', fontSize: Fonts.size.sm }]}>Delivered</Text>
                            </View>
                        </View>
                        {expanded && (
                            <View style={styles.detailsContainer}>
                                <View style={{ flexDirection: "column", paddingBottom: 5 }}>
                                    <Text style={[paratextConfig, { color: theme.secondaryText }]}>Order ID</Text>
                                    <Text style={[paratextConfig, { color: theme.greyText }]}>#2342422424</Text>
                                </View>
                                <View style={{ flexDirection: "column", marginVertical: 5 }}>
                                    <Text style={[paratextConfig, { color: theme.secondaryText }]}>Receiver Details</Text>
                                    <Text style={[paratextConfig, { color: theme.greyText }]}>John Doe, +91 7897014106</Text>
                                </View>
                                <View style={{ flexDirection: "column" }}>
                                    <Text style={[paratextConfig, { color: theme.secondaryText }]}>Address</Text>
                                    <Text style={[paratextConfig, { color: theme.greyText }]}>3rd Floor, B Block, Marvel Heights</Text>
                                </View>
                                <View style={{ flexDirection: "column", marginVertical: 5 }}>
                                    <Text style={[paratextConfig, { color: theme.secondaryText }]}>Placed Time</Text>
                                    <Text style={[paratextConfig, { color: theme.greyText }]}>12:00 PM</Text>

                                </View>
                                <View style={{ flexDirection: "column", marginVertical: 5 }}>
                                    <Text style={[paratextConfig, { color: theme.secondaryText }]}>Arrived Time</Text>
                                    <Text style={[paratextConfig, { color: theme.greyText }]}>12:06 PM</Text>

                                </View>
                            </View>
                        )}

                    </View>


                    {/* <OrderProdItem/> */}
                    <View style={[styles.cardContainer, { backgroundColor: theme.cardContainer }]}>
                        <TouchableOpacity onPress={toggleItemsExpand} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Text style={[paratextConfig, { marginLeft: 6, color: theme.greyText, fontSize: Fonts.size.sm }]}>5 items in order</Text>
                            <Ionicons onPress={toggleItemsExpand} name={!itemsExpanded ? 'chevron-down' : 'chevron-up'} color={theme.background} size={20} />
                        </TouchableOpacity>
                        <OrderProdItem />
                        <OrderProdItem />
                        {itemsExpanded && (
                            <View>
                                <OrderProdItem />
                                <OrderProdItem />
                                <OrderProdItem />
                            </View>
                        )}
                    </View>

                    <OrderSummary isOrderDetails={true} />
                </View>
            </ScrollView>
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