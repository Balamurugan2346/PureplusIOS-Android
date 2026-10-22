import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Linking,
    RefreshControl,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TopAppBar from '../../Components/TopAppBar';
import AppText from '../../Components/AppText';
import AppButton from '../../Components/AppButton';
import { SUPPORT_CONFIG } from '../../Config/SupportConfig';
import { useTheme } from '../../Context/ThemeContext';
import { radius, spacing, floatShadow } from '../../Themes/Themes';
import { clearCustomerSupportDetails, loadCustomerSupportDetails } from '../../Redux/Slices/BannerSlice';
import { useDispatch, useSelector } from 'react-redux';
import AppLoading from '../../Components/AppLoading';

const CustomerSupportScreen = ({ navigation }) => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [refreshing, setRefreshing] = React.useState(false);
    const dispatch = useDispatch();

    const { customerSupportData, customerSupportLoading, customerSupportError, isCustomerSupportFetched } = useSelector(state => state.banners)

    const email = customerSupportData?.email || null;
    const phone = customerSupportData?.phoneNumber || null;
    const whatsapp = customerSupportData?.whatsappNumber || null;

    useEffect(() => {
        if (!isCustomerSupportFetched) {
            dispatch(loadCustomerSupportDetails());
        }
    }, [dispatch, isCustomerSupportFetched]);

    const handleRefresh = () => {
        dispatch(clearCustomerSupportDetails())
        dispatch(loadCustomerSupportDetails());
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }

    /* ---------------- ACTION HANDLERS ---------------- */
    const openDialer = () => {
        if (!phone) return;
        Linking.openURL(`tel:${phone}`);
    };

    const openEmail = () => {
        if (!email) return;
        const subject = encodeURIComponent('Pure Plus Support');
        const body = encodeURIComponent(
            'Hi Pure Plus Support,\n\nI need help with my water delivery.\n\nThanks.'
        );
        Linking.openURL(`mailto:${email}?subject=${subject}&body=${body}`);
    };

    const openWhatsApp = async () => {
        if (!whatsapp) return;
        const phoneNumber = whatsapp.replace('+', '');
        const message = encodeURIComponent("Hi, I need help with my order");
        const whatsappURL = `whatsapp://send?phone=${phoneNumber}&text=${message}`;
        const webURL = `https://wa.me/${phoneNumber}?text=${message}`;
        try {
            await Linking.openURL(whatsappURL);
        } catch {
            await Linking.openURL(webURL);
        }
    };

    /* ---------------- UI ---------------- */
    return (
        <View style={[styles.container, { backgroundColor: theme.surface }]}>
            <TopAppBar title="Customer Support" navigation={navigation} />

            <ScrollView
                contentContainerStyle={styles.scrollBody}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[theme.primary]} />
                }
                showsVerticalScrollIndicator={false}
            >

                {customerSupportLoading && (
                    <AppLoading isVisible={customerSupportLoading} />
                )}

                {/* HELP CARD */}
                <View style={[styles.helpCard, { backgroundColor: theme.sky200 }]}>
                    <View style={[styles.helpWell, { backgroundColor: theme.surfaceCard }]}>
                        <Ionicons name="headset-outline" size={24} color={theme.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <AppText variant="title" color={theme.ink}>How can we help?</AppText>
                        <AppText variant="body" color={theme.ink} style={{ marginTop: 4 }}>
                            We are here to help you with your water delivery needs. Our team is available 9am – 9pm.
                        </AppText>
                    </View>
                </View>

                {/* CONTACT OPTIONS */}
                <View style={[styles.card, { backgroundColor: theme.surfaceCard }]}>
                    <AppText variant="title" color={theme.ink} style={{ marginBottom: spacing.sm }}>Contact Us</AppText>

                    <SupportItem theme={theme} first icon="call-outline" tone="primary" title="Phone Support" value={phone || 'Not Available'} onPress={openDialer} />
                    <SupportItem theme={theme} icon="mail-outline" tone="warning" title="Email Support" value={email || 'Not Available'} onPress={openEmail} />
                    <SupportItem theme={theme} icon="logo-whatsapp" tone="success" title="WhatsApp Support" value={whatsapp || 'Not Available'} onPress={openWhatsApp} />
                </View>

                {/* FAQ */}
                <AppText variant="title" color={theme.ink} style={{ marginBottom: spacing.sm }}>Frequently Asked Questions</AppText>

                <View style={{ marginBottom: 20 }}>
                    {SUPPORT_CONFIG.faq.map((item, index) => {
                        const expanded = expandedIndex === index;
                        return (
                            <TouchableOpacity
                                key={index}
                                style={[styles.faqItem, { backgroundColor: theme.surfaceCard }]}
                                onPress={() => setExpandedIndex(expanded ? null : index)}
                                activeOpacity={0.8}
                            >
                                <View style={styles.faqHeader}>
                                    <AppText variant="bodyStrong" color={theme.ink} style={{ flex: 1, marginRight: spacing.md }}>{item.question}</AppText>
                                    <Ionicons
                                        name={expanded ? 'chevron-up' : 'chevron-down'}
                                        size={20}
                                        color={theme.primary}
                                    />
                                </View>
                                {expanded && (
                                    <AppText variant="body" color={theme.inkMuted} style={{ marginTop: spacing.sm }}>
                                        {item.answer}
                                    </AppText>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>

            </ScrollView>

            {/* FIXED BOTTOM CTA */}
            <View style={[styles.bottomCTA, { backgroundColor: theme.surfaceCard, paddingBottom: insets.bottom + spacing.lg }, floatShadow]}>
                <AppButton title="Call Support Now" icon="call-outline" onAction={openDialer} />
            </View>
        </View>
    );
};

/* ---------------- SMALL COMPONENT ---------------- */
const SupportItem = ({ icon, title, value, onPress, theme, tone = 'primary', first = false }) => {
    const color = theme[tone] || theme.primary;
    const tint = theme[`${tone}Tint`] || theme.primaryTint;
    const available = value !== 'Not Available';
    return (
        <TouchableOpacity
            style={[styles.supportItem, !first && { borderTopWidth: 1, borderTopColor: theme.borderSubtle }]}
            onPress={available ? onPress : undefined}
            disabled={!available}
            activeOpacity={0.8}
        >
            <View style={[styles.supportWell, { backgroundColor: tint }]}>
                <Ionicons name={icon} size={20} color={color} />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.md }}>
                <AppText variant="bodyStrong" color={theme.ink}>{title}</AppText>
                <AppText variant="caption" color={theme.inkMuted} style={{ marginTop: 2 }}>{value}</AppText>
            </View>
            {available && <Ionicons name="chevron-forward" size={18} color={theme.inkMuted} />}
        </TouchableOpacity>
    );
};

export default CustomerSupportScreen;

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollBody: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm, paddingBottom: 120, gap: spacing.lg },

    helpCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        padding: spacing.lg,
        borderRadius: radius.lg,
    },
    helpWell: {
        width: 48,
        height: 48,
        borderRadius: radius.sm,
        alignItems: 'center',
        justifyContent: 'center',
    },

    card: {
        borderRadius: radius.lg,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
    },

    supportItem: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 64,
    },
    supportWell: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },

    faqItem: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderRadius: radius.md,
        marginBottom: spacing.md,
    },
    faqHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: 32,
    },

    bottomCTA: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.lg,
    },
});
