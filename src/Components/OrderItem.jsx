import Fonts from '../../assets/fonts/Fonts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppContext } from '../Context/AppContext';
import { useTheme } from '../Context/ThemeContext';

// Dummy image URLs (you can replace them with actual URLs or sources)
const images = [
    require('../../assets/images/30L.png'),
    // require('../../assets/images/30L.png'),
    // require('../../assets/images/30L.png'),
    // require('../../assets/images/30L.png'),
]

const OrderItem = ({ onItemClick , status = "P" }) => {

    
    const insets = useSafeAreaInsets();
    const { addToCart, cart, reduceQuantity, removeFromCart, usersAddress } = useAppContext()
    const { theme } = useTheme()

    const headerConfig = {
        color: theme.greyText,
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.base
    }

    const paratextConfig = {
        color: theme.secondaryText,
        fontFamily: Fonts.family.medium,
        fontSize: Fonts.size.xs
    }

   const displayStatus =
  status === "C"
    ? "Order Cancelled"
    : status === "P"
    ? "Order Pending"
    : "Order Completed";

    const color = status === "C"
    ? theme.error
    : status === "P"
    ? theme.primary
    : 'green';

    const icon = status === "C"
    ? 'close-circle'
    : status === "P"
    ? 'time'
    : 'cloud-done';


    return (
        <TouchableOpacity onPress={() => onItemClick()} style={styles.card}>
            {/* IMAGES SCROLL */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.imageRow}
            >
                {images.map((img, index) => (
                    <Image key={index} source={img} style={styles.productImage} />
                ))}
            </ScrollView>

            {/* INFO ROW */}
            <View style={styles.infoRow}>
                <View style={{ flex: 1 }}>
                    <View style={styles.statusRow}>
                        <Text style={[headerConfig,{color:color,opacity:0.5}]}>{displayStatus}</Text>
                        <Ionicons name={icon} size={18} color={color} style={{ marginLeft: 4 }} />
                    </View>
                    <Text style={[paratextConfig]}>Placed at 19th Jul 2025, 11:38 am </Text>
                </View>

                <View style={styles.amountBox}>
                    <Text style={styles.amount}>₹166.81</Text>
                    <Ionicons name="chevron-forward" size={18} color="#333" />
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default OrderItem

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
    statusText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#333',
    },
    dateText: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
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
})
