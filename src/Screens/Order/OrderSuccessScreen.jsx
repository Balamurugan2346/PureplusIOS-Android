import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    BackHandler
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useTheme } from '../../Context/ThemeContext';
import Fonts from '../../../assets/fonts/Fonts';
import TopAppBar from '../../Components/TopAppBar';

const OrderSuccessScreen = ({ navigation, route }) => {

    const insets = useSafeAreaInsets()

    const id = route?.params?.id;
    console.log("Order ID:", id);
    const { data: order } = useSelector(state => state.order.orderDetailed);

    console.log("order", order)


    const displayOrderNames = (items) => {
        if (!items || items.length === 0) return "";

        return items.map(item => item.productName).join(", ");
    };

    const orderName = displayOrderNames(order?.items)
    const address = order?.deliveryAddress;
    const orderedTime = order?.orderDate;

    const goHome = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'DashBoard' }]
        });

    };

    useEffect(() => {

        const backAction = () => {
            goHome();
            return true; // prevent default back behaviour
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();

    }, []);

    return (
        <View style={[styles.container, { paddingBottom: insets.bottom }]}>

            <TopAppBar callback={() => {
                goHome()
            }} navigation={navigation} customNav={"yes"} title='Order Success' />

            <View style={styles.card}>

                {/* Back Button
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => {
                        goHome()
                    }}
                >
                    <Ionicons name="arrow-back" size={22} color="#fff" />
                </TouchableOpacity>

                <Text style={[styles.header, { fontFamily: Fonts.family.semiBold }]}>
                    Order Status
                </Text> */}

                {/* Success Icon */}
                <View style={styles.iconWrapper}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="checkmark" size={34} color="#0B2E13" />
                    </View>
                </View>

                {/* Success Text */}
                <Text style={[styles.successText, { fontFamily: Fonts.family.bold }]}>
                    Order Successful!
                </Text>

                <Text style={[styles.subText, { fontFamily: Fonts.family.medium }]}>
                    Your order has been placed and is being processed by the restaurant.
                </Text>

                <View style={styles.divider} />

                {/* Order Name */}
                <Text style={[styles.label, { fontFamily: Fonts.family.medium }]}>
                    ORDER
                </Text>

                <Text style={[styles.value, { fontFamily: Fonts.family.semiBold }]}>
                    {orderName}
                </Text>

                {/* Address */}
                <Text style={[styles.label, { fontFamily: Fonts.family.medium }]}>
                    ADDRESS
                </Text>

                <Text style={[styles.value, { fontFamily: Fonts.family.semiBold }]}>
                    {address}
                </Text>

                {/* Ordered Time */}
                <Text style={[styles.label, { fontFamily: Fonts.family.medium }]}>
                    ORDERED TIME
                </Text>

                <Text style={[styles.value, { fontFamily: Fonts.family.semiBold }]}>
                    {orderedTime}
                </Text>

                {/* Button */}
                <TouchableOpacity style={styles.homeButton} onPress={goHome}>
                    <Text style={[styles.homeText, { fontFamily: Fonts.family.bold }]}>
                        Back to Home
                    </Text>
                </TouchableOpacity>

            </View>

        </View>
    );
};

export default OrderSuccessScreen;


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'white',
        // justifyContent: 'center',
        // alignItems: 'center'
    },

    card: {
        width: '92%',
        alignSelf: "center",
        marginTop: "15%",
        alignContent: "center",
        backgroundColor: '#1A2D44',
        borderRadius: 22,
        padding: 24
    },

    backButton: {
        position: 'absolute',
        left: 18,
        top: 20,
        zIndex: 2
    },

    header: {
        textAlign: 'center',
        fontSize: 16,
        color: '#fff',
        marginBottom: 30
    },

    iconWrapper: {
        alignItems: 'center',
        marginBottom: 16
    },

    iconCircle: {
        width: 70,
        height: 70,
        borderRadius: 40,
        backgroundColor: '#20D25B',
        justifyContent: 'center',
        alignItems: 'center'
    },

    successText: {
        fontSize: 22,
        textAlign: 'center',
        color: '#fff',
        marginTop: 10
    },

    subText: {
        textAlign: 'center',
        color: '#B8D2C0',
        fontSize: 13,
        marginTop: 6,
        marginBottom: 20
    },

    divider: {
        height: 1,
        backgroundColor: '#1E5732',
        marginVertical: 18
    },

    label: {
        fontSize: 11,
        color: '#29D463',
        letterSpacing: 1,
        marginTop: 8
    },

    value: {
        fontSize: 14,
        color: '#fff',
        marginTop: 4
    },

    homeButton: {
        backgroundColor: '#21D44B',
        borderRadius: 14,
        paddingVertical: 14,
        marginTop: 28,
        alignItems: 'center'
    },

    homeText: {
        color: '#000',
        fontSize: 15
    }
});