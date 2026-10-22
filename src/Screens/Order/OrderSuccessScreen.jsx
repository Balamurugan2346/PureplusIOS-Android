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
import TopAppBar from '../../Components/TopAppBar';
import AppText from '../../Components/AppText';
import AppButton from '../../Components/AppButton';
import { floatShadow, radius, spacing } from '../../Themes/Themes';

const OrderSuccessScreen = ({ navigation, route }) => {

    const insets = useSafeAreaInsets()
    const { theme } = useTheme()

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

    // Proper en-IN date formatting (replaces the raw ISO/epoch string shown before).
    const formatOrderedTime = (raw) => {
        if (!raw) return '';
        const d = new Date(raw);
        if (isNaN(d.getTime())) return String(raw);
        return d.toLocaleString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: true,
        });
    };
    const orderedTime = formatOrderedTime(order?.orderDate);

    // Pay-at-door banner — shown only when the backend gave us both a total and a method.
    const payTotal = order?.grandTotal ?? order?.totalAmount;
    const payMethod = order?.paymentMode ?? order?.paymentMethod;
    const showPayBanner = Number(payTotal) > 0 && !!payMethod;

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
        <View style={[styles.container, { backgroundColor: theme.surface, paddingBottom: insets.bottom }]}>

            {/* Decorative shapes */}
            <View style={[styles.decorTopRight, { backgroundColor: theme.sky200 }]} pointerEvents="none" />
            <View style={[styles.decorLeft, { backgroundColor: theme.successTint }]} pointerEvents="none" />

            <TopAppBar callback={() => {
                goHome()
            }} navigation={navigation} customNav={"yes"} title='Order Success' />

            <View style={[styles.card, { backgroundColor: theme.surfaceCard }, floatShadow]}>

                {/* Success Icon */}
                <View style={styles.iconWrapper}>
                    <View style={[styles.iconOuter, { backgroundColor: theme.successTint }]}>
                        <View style={[styles.iconCircle, { backgroundColor: theme.success }]}>
                            <Ionicons name="checkmark" size={32} color={theme.onPrimary} />
                        </View>
                    </View>
                </View>

                {/* Success Text */}
                <AppText variant="display" color={theme.ink} style={styles.successText}>
                    Order Successful!
                </AppText>

                <AppText variant="body" color={theme.inkMuted} style={styles.subText}>
                    Your order has been placed and is being prepared by your Pureplus store.
                </AppText>

                <View style={[styles.divider, { backgroundColor: theme.borderSubtle }]} />

                {/* Order Name */}
                <AppText variant="badge" color={theme.success} style={styles.label}>ORDER</AppText>
                <AppText variant="bodyStrong" color={theme.ink} style={styles.value}>{orderName}</AppText>

                {/* Address */}
                <AppText variant="badge" color={theme.success} style={styles.label}>ADDRESS</AppText>
                <AppText variant="bodyStrong" color={theme.ink} style={styles.value}>{address}</AppText>

                {/* Ordered Time */}
                <AppText variant="badge" color={theme.success} style={styles.label}>ORDERED TIME</AppText>
                <AppText variant="bodyStrong" color={theme.ink} style={styles.value}>{orderedTime}</AppText>

                {/* Pay-at-door banner */}
                {showPayBanner && (
                    <View style={[styles.payBanner, { backgroundColor: theme.infoTint }]}>
                        <Ionicons name="information-circle-outline" size={18} color={theme.info} />
                        <AppText variant="caption" color={theme.info} style={{ marginLeft: spacing.sm, flex: 1 }}>
                            {`Pay ₹${Number(payTotal).toFixed(2)} by ${payMethod} when your cans arrive.`}
                        </AppText>
                    </View>
                )}

                {/* Button */}
                <AppButton title="Back to Home" onAction={goHome} style={{ marginTop: spacing.xl }} />
            </View>

        </View>
    );
};

export default OrderSuccessScreen;


const styles = StyleSheet.create({

    container: {
        flex: 1,
    },

    decorTopRight: {
        position: 'absolute',
        top: 120,
        right: -50,
        width: 180,
        height: 180,
        borderRadius: 190,
        opacity: 0.6,
    },

    decorLeft: {
        position: 'absolute',
        top: 100,
        left: -60,
        width: 140,
        height: 140,
        borderRadius: 70,
        opacity:0.6,
    },

    card: {
        width: '90%',
        alignSelf: "center",
        marginTop: 40,
        borderRadius: radius.lg,
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.xxl,
        paddingBottom: spacing.xl,
    },

    iconWrapper: {
        alignItems: 'center',
        marginBottom: spacing.md,
    },

    iconOuter: {
        width: 88,
        height: 88,
        borderRadius: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },

    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },

    successText: {
        fontSize: 26,
        lineHeight: 32,
        textAlign: 'center',
        marginTop: spacing.md,
    },

    subText: {
        textAlign: 'center',
        marginTop: spacing.sm,
        marginBottom: spacing.lg,
    },

    divider: {
        height: 1,
        marginVertical: spacing.lg,
    },

    label: {
        letterSpacing: 0.6,
        marginTop: spacing.md,
    },

    value: {
        marginTop: 4,
    },

    payBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: radius.md,
        padding: spacing.md,
        marginTop: spacing.lg,
    },
});