import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Linking,
    Platform
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import TopAppBar from '../../Components/TopAppBar';
import VectorBg from '../../Components/VectorBg';
import { SUPPORT_CONFIG } from '../../Config/SupportConfig';
import { useTheme } from '../../Context/ThemeContext';
import Fonts from '../../../assets/fonts/Fonts';

const CustomerSupportScreen = ({ navigation }) => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const [expandedIndex, setExpandedIndex] = useState(null);

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

    /* ---------------- ACTION HANDLERS ---------------- */

    const openDialer = () => {
        Linking.openURL(`tel:${SUPPORT_CONFIG.phone}`);
    };

    const openEmail = () => {
        const subject = encodeURIComponent('Pure Plus Support');
        const body = encodeURIComponent(
            'Hi Pure Plus Support,\n\nI need help with my water delivery.\n\nThanks.'
        );

        const mailtoURL = `mailto:${SUPPORT_CONFIG.email}?subject=${subject}&body=${body}`;

        Linking.openURL(mailtoURL);
    };


    const openWhatsApp = async () => {
        const phone = SUPPORT_CONFIG.whatsapp.number.replace('+', '');
        const message = encodeURIComponent(SUPPORT_CONFIG.whatsapp.defaultMessage);

        // Native WhatsApp deep link
        const whatsappURL = `whatsapp://send?phone=${phone}&text=${message}`;

        // Web fallback (works everywhere)
        const webURL = `https://wa.me/${phone}?text=${message}`;

        try {
            await Linking.openURL(whatsappURL);
        } catch (error) {
            // WhatsApp app not available → open web
            await Linking.openURL(webURL);
        }
    };



    /* ---------------- UI ---------------- */

    return (
        <View style={[styles.container, { backgroundColor: theme.secondaryBackground }]}>
            <TopAppBar title="Customer Support" navigation={navigation} />

            <ScrollView
                contentContainerStyle={{
                    padding: 16,
                    paddingBottom: 120 // space for fixed CTA
                }}
                showsVerticalScrollIndicator={false}
            >
                {/* HELP CARD */}
                <View style={[styles.helpCard, { backgroundColor: theme.cardContainer }]}>
                    <VectorBg icon="headset-outline" bgColor={theme.teritary} />
                    <Text style={[headerConfig, styles.helpTitle]}>How can we help?</Text>
                    <Text style={paratextConfig}>
                        We are here to help you with your water delivery needs. Our team is available 9am - 9pm.
                    </Text>
                </View>

                {/* CONTACT OPTIONS */}
                <View style={[styles.helpCard, { backgroundColor: theme.cardContainer }]}>
                    <Text style={[headerConfig, styles.sectionTitle]}>Contact Us</Text>

                    <SupportItem
                        icon="call-outline"
                        title="Phone Support"
                        value={SUPPORT_CONFIG.phone}
                        onPress={openDialer}
                        theme={theme}
                    />

                    <SupportItem
                        icon="mail-outline"
                        title="Email Support"
                        value={SUPPORT_CONFIG.email}
                        onPress={openEmail}
                        theme={theme}
                    />

                    <SupportItem
                        icon="logo-whatsapp"
                        title="WhatsApp Support"
                        value="Chat with us on WhatsApp"
                        onPress={openWhatsApp}
                        theme={theme}
                    />
                </View>


                {/* FAQ */}
                <Text style={[headerConfig, styles.sectionTitle]}>Frequently Asked Questions</Text>

                {SUPPORT_CONFIG.faq.map((item, index) => {
                    const expanded = expandedIndex === index;

                    return (
                        <TouchableOpacity
                            key={index}
                            style={[styles.faqItem, { backgroundColor: theme.cardContainer }]}
                            onPress={() => setExpandedIndex(expanded ? null : index)}
                            activeOpacity={0.8}
                        >
                            <View style={styles.faqHeader}>
                                <Text style={headerConfig}>{item.question}</Text>
                                <Ionicons
                                    name={expanded ? 'chevron-up-outline' : 'chevron-down-outline'}
                                    size={Fonts.Iconsize.regular}
                                    color={theme.greyText}
                                />
                            </View>

                            {expanded && (
                                <Text style={[paratextConfig, { marginTop: 8 }]}>
                                    {item.answer}
                                </Text>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {/* FIXED BOTTOM CTA */}
            <View
                style={[
                    styles.bottomCTA,
                    {
                        paddingBottom: insets.bottom,
                        backgroundColor: theme.cardContainer
                    }
                ]}
            >
                <TouchableOpacity
                    style={[styles.callButton, { backgroundColor: theme.button }]}
                    onPress={openDialer}
                >
                    <Ionicons name="call-outline" size={20} color="white" />
                    <Text style={styles.callButtonText}>Call Support Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

/* ---------------- SMALL COMPONENT ---------------- */

const SupportItem = ({ icon, title, value, onPress, theme }) => (
    <TouchableOpacity style={styles.supportItem} onPress={onPress}>
        <VectorBg icon={icon} bgColor={theme.primary} iconTint={theme.primary} />
        <View style={{ marginLeft: 12 }}>
            <Text style={{ fontFamily: Fonts.family.medium, color: theme.greyText }}>
                {title}
            </Text>
            <Text style={{ fontFamily: Fonts.family.light, color: theme.secondaryText, fontSize: Fonts.size.xs }}>
                {value}
            </Text>
        </View>
    </TouchableOpacity>
);

export default CustomerSupportScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    helpCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 24
    },

    helpTitle: {
        marginTop: 12,
        marginBottom: 6
    },

    sectionTitle: {
        marginBottom: 12
    },

    supportItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14
    },

    faqItem: {
        padding: 14,
        borderRadius: 10,
        marginBottom: 10
    },

    faqHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    bottomCTA: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        padding: 16,
        borderTopWidth: 1,
        borderColor: '#eee'
    },

    callButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 14,
        borderRadius: 10
    },

    callButtonText: {
        color: 'white',
        fontFamily: Fonts.family.semiBold,
        marginLeft: 8
    }
});
