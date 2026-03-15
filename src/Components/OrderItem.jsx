import Fonts from '../../assets/fonts/Fonts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../Context/ThemeContext';

const OrderItem = ({ onItemClick, status = "P", amount, date, images = [] }) => {

    const { theme } = useTheme();

    const imageList =
        images && images.length > 0
            ? images.map(url => ({ uri: url }))
            : [require('../../assets/images/30L.png')];

    const headerConfig = {
        color: theme.greyText,
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.base
    };

    const paratextConfig = {
        color: theme.secondaryText,
        fontFamily: Fonts.family.medium,
        fontSize: Fonts.size.xs
    };

    const displayStatus =
        status === "C"
            ? "Order Cancelled"
            : status === "P"
                ? "Order Pending"
                : "Order Completed";

    const color =
        status === "C"
            ? theme.error
            : status === "P"
                ? theme.primary
                : "green";

    const icon =
        status === "C"
            ? "close-circle"
            : status === "P"
                ? "time"
                : "cloud-done";

    const formattedDate = date
        ? new Date(date).toLocaleString()
        : "";

    return (
        <TouchableOpacity onPress={onItemClick} style={styles.card}>

            {/* IMAGES SCROLL */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.imageRow}
            >
                {imageList.map((img, index) => (
                    <Image key={index} source={img} style={styles.productImage} />
                ))}
            </ScrollView>

            {/* INFO ROW */}
            <View style={styles.infoRow}>

                <View style={{ flex: 1 }}>
                    <View style={styles.statusRow}>
                        <Text style={[headerConfig, { color, opacity: 0.8 }]}>
                            {displayStatus}
                        </Text>

                        <Ionicons
                            name={icon}
                            size={18}
                            color={color}
                            style={{ marginLeft: 4 }}
                        />
                    </View>

                    <Text style={paratextConfig}>
                        Placed at {formattedDate}
                    </Text>
                </View>

                <View style={styles.amountBox}>
                    <Text style={styles.amount}>₹{amount}</Text>
                    <Ionicons name="chevron-forward" size={18} color="#333" />
                </View>

            </View>

        </TouchableOpacity>
    );
};

export default OrderItem;

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fdfdfd',
        borderRadius: 12,
        padding: 12,
        marginVertical: 8,
        marginHorizontal: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },

    imageRow: {
        flexDirection: 'row',
        gap: 10,
        paddingBottom: 8,
    },

    productImage: {
        width: 52,
        height: 52,
        borderRadius: 8,
        backgroundColor: '#eee',
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

    amount: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111',
    },
});