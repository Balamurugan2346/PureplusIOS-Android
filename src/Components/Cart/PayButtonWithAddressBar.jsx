import { useTheme } from '../../Context/ThemeContext';
import React, { useState } from 'react';
import {
    LayoutAnimation,
    Platform,
    StyleSheet,
    TouchableOpacity,
    UIManager,
    View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppText from '../AppText';
import { radius, spacing } from '../../Themes/Themes';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
}

/**
 * Cart delivery-address card (pureLight restyle). Props/behavior preserved:
 * tapping the row toggles the expanded (full) address; the chevron-down icon
 * opens the address bottom sheet (same handler the old Change button used).
 * Borderless card; a missing address is signalled via danger-coloured text/icon only.
 */
const PayButtonWithAddressBar = ({ displayName, receiversDetails, navigation, showBottomSheet, address, isOrderForSelf }) => {

    const { theme } = useTheme();

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
        <View style={[
            styles.card,
            { backgroundColor: theme.surfaceCard },
        ]}>
            <TouchableOpacity onPress={handleToggle} style={styles.row} activeOpacity={0.8}>
                <View style={[styles.iconWell, { backgroundColor: address ? theme.primaryTint : theme.dangerTint }]}>
                    <Ionicons name="location" color={address ? theme.primary : theme.danger} size={22} />
                </View>

                {address ? (
                    <View style={styles.addressBlock}>
                        <AppText variant="caption" color={theme.inkMuted}>
                            {`Delivering to ${displayName ?? ''}`.trim()}
                        </AppText>
                        <AppText variant="caption" color={theme.inkMuted} style={{ marginTop: 2 }}>
                            {displayTrimmedAddress(address)}
                        </AppText>
                    </View>
                ) : (
                    <View style={styles.addressBlock}>
                        <AppText variant="label" color={theme.danger}>Address required</AppText>
                        <AppText variant="caption" color={theme.inkMuted} style={{ marginTop: 2 }}>
                            Please add an address to proceed to checkout
                        </AppText>
                    </View>
                )}

                <TouchableOpacity
                    onPress={() => showBottomSheet()}
                    style={styles.changeBtn}
                    activeOpacity={0.8}
                    hitSlop={8}
                >
                    <Ionicons name="chevron-down" color={theme.inkMuted} size={22} />
                </TouchableOpacity>
            </TouchableOpacity>
        </View>
    );
};

export default PayButtonWithAddressBar;

const styles = StyleSheet.create({
    card: {
        borderRadius: radius.md,
        padding: spacing.lg,
        marginHorizontal: spacing.lg,
        marginTop: spacing.lg,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    iconWell: {
        borderRadius: radius.sm,
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addressBlock: {
        flex: 1,
    },
    changeBtn: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
