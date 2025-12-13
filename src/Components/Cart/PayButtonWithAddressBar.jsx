import { useAppContext } from '../../Context/AppContext';
import { useTheme } from '../../Context/ThemeContext';
import Fonts from '../../../assets/fonts/Fonts';
import React, { useState } from 'react';
import {
    Image,
    LayoutAnimation,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    UIManager,
    View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppButton from '../AppButton';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
}

const PayButtonWithAddressBar = ({ displayName, receiversDetails, navigation, showBottomSheet, address, isOrderForSelf }) => {

    const { theme } = useTheme()


    const headerConfig = {
        color: '#333',
        fontFamily: Fonts.family.medium,
        fontSize: Fonts.size.sm
    }

    const paratextConfig = {
        color: theme.secondaryText,
        opacity: 0.6,
        fontFamily: Fonts.family.medium,
        fontSize: Fonts.size.xs
    }

    const [expanded, setExpanded] = useState(false);

    const handleToggle = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
        setExpanded(prev => !prev);
    };

    const displayTrimmedAddress = (usersAddress) => {
        if (expanded) return usersAddress;
        return usersAddress.length > 30
            ? usersAddress.substring(0, 30) + '...'
            : usersAddress;
    };

    return (
        <View style={[styles.cardContainer, { backgroundColor: theme.cardContainer }]}>
            <TouchableOpacity
                onPress={handleToggle}
                style={styles.row}
                activeOpacity={0.8}
            >
                {/* Location Icon */}
                <View style={styles.iconOuter}>
                    <View style={styles.iconInner}>
                        <Ionicons name='location' color={"white"} size={25} />
                    </View>
                </View>

                {/* Address Text */}
                <View style={styles.addressBlock}>
                    <Text style={[headerConfig, {
                        fontSize: Fonts.size.base,
                        color: theme.greyText,
                    }]}>
                        {` Delivering To ${displayName}`}
                    </Text>
                    <Text style={[paratextConfig, { color: '#666' }]}>
                        {displayTrimmedAddress(address)}
                    </Text>
                </View>

                {/* Chevron Icon */}
                <Ionicons
                    name={expanded ? 'chevron-up-outline' : 'chevron-down-outline'}
                    size={22}
                    color="#444"
                />
            </TouchableOpacity>

            <AppButton title={"Change the address"} borderOnly={true} onAction={() => {
                showBottomSheet()
            }} />
            {/* <View style={styles.expandedSection}>
                    <View style={{ justifyContent: "center" }}>
                      
                        // <TouchableOpacity style={{ flexDirection: "row" }} onPress={() => showBottomSheet()}  >
                        //     <Text style={{ color: theme.primary, textDecorationLine: "underline" }}>Change the address?
                        //     </Text>
                        // </TouchableOpacity>
                    </View>
                </View> */}
        </View>
    );
};

export default PayButtonWithAddressBar;

const styles = StyleSheet.create({
    cardContainer: {
        borderRadius: 20,
        padding: 16,
        elevation: 3,
        margin: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-around"
    },
    iconOuter: {
        backgroundColor: "#0000005a",
        borderRadius: 10,
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center"
    },
    iconInner: {
        width: 25,
        height: 25,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center"
    },
    addressBlock: {
        flex: 1,
        marginLeft: 10,
    },
    expandedSection: {
        marginTop: 10,
        backgroundColor: '#f6f6f6',
        padding: 10,
        borderRadius: 12,
    },
});
