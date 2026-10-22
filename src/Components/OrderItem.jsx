import Ionicons from 'react-native-vector-icons/Ionicons';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../Context/ThemeContext';
import AppText from './AppText';
import { radius, spacing } from '../Themes/Themes';

/**
 * Order history list card (prompt 03 restyle). Props preserved:
 * onItemClick, status ('C' | 'P' | 'CO'), amount, date, images.
 */
const OrderItem = ({ onItemClick, status = "P", amount, date, images = [] }) => {

    const { theme } = useTheme();

    const imageList =
        images && images.length > 0
            ? images.map(url => ({ uri: url }))
            : [require('../../assets/images/30L.png')];

    const displayStatus =
        status === "C"
            ? "Order Cancelled"
            : status === "P"
                ? "Order Pending"
                : "Order Completed";

    const color =
        status === "C"
            ? theme.danger
            : status === "P"
                ? theme.primary
                : theme.success;

    const icon =
        status === "C"
            ? "close-circle-outline"
            : status === "P"
                ? "time-outline"
                : "checkmark-circle-outline";

    const formattedDate = date
        ? new Date(date).toLocaleString()
        : "";

    return (
        <TouchableOpacity onPress={onItemClick} activeOpacity={0.85} style={[styles.card, { backgroundColor: theme.surfaceCard }]}>

            {/* IMAGES SCROLL */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.imageRow}
            >
                {imageList.map((img, index) => (
                    <Image key={index} source={img} style={[styles.productImage, { backgroundColor: theme.sky200 }]} resizeMode="contain" />
                ))}
            </ScrollView>

            {/* INFO ROW */}
            <View style={styles.infoRow}>

                <View style={{ flex: 1 }}>
                    <View style={styles.statusRow}>
                        <Ionicons name={icon} size={18} color={color} style={{ marginRight: 6 }} />
                        <AppText variant="bodyStrong" color={color}>
                            {displayStatus}
                        </AppText>
                    </View>

                    <AppText variant="caption" color={theme.inkMuted} style={{ marginTop: 4 }}>
                        Placed at {formattedDate}
                    </AppText>
                </View>

                <View style={styles.amountBox}>
                    <AppText variant="price" color={theme.ink}>₹{amount}</AppText>
                    <Ionicons name="chevron-forward" size={18} color={theme.inkMuted} />
                </View>

            </View>

        </TouchableOpacity>
    );
};

export default OrderItem;

const styles = StyleSheet.create({
    card: {
        borderRadius: radius.lg,
        padding: spacing.lg,
        marginVertical: 6,
        marginHorizontal: spacing.xl,
    },

    imageRow: {
        flexDirection: 'row',
        gap: spacing.sm,
        paddingBottom: spacing.md,
    },

    productImage: {
        width: 52,
        height: 52,
        borderRadius: radius.sm,
    },

    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    amountBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
});
