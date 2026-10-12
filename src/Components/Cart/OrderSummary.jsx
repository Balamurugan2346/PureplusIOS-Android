import Fonts from '../../../assets/fonts/Fonts';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../Context/ThemeContext';

const money = (n) => `₹${(Number(n) || 0).toFixed(2)}`;

/**
 * Bill summary for a placed order. Values are the persisted snapshot returned by
 * GET /api/customer/orders/{id} (OrderDetailResponse) — this screen never re-derives a
 * number. Rows that are zero (floor / surcharge / deposit) are hidden to keep it clean.
 */
export default function OrderSummary({ isOrderDetails = false, order }) {


    const { theme } = useTheme()

    const headerConfig = {
        color: theme.greyText,
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.xs
    }

    const paratextConfig = {
        color: theme.secondaryText,
        fontFamily: Fonts.family.medium,
        fontSize: Fonts.size.xs
    }

    const num = (v) => Number(v) || 0;

    // Pull the booked breakdown off the order snapshot (camelCase JSON from the API).
    const subTotal = num(order?.subTotal);
    const taxAmount = num(order?.taxAmount);
    const floorCharge = num(order?.floorCharge);
    const deliveryCharge = num(order?.deliveryCharge);
    const convenienceFee = num(order?.convenienceFee);
    const deliverySurcharge = num(order?.deliverySurcharge);
    const depositAmount = num(order?.depositAmount);
    const orderAmount = num(order?.totalAmount); // booked amount, deposit EXCLUDED
    // Cash collected at the door = booked amount + refundable deposit (matches backend CollectAtDoor).
    const collectAtDoor = order?.collectAtDoor != null ? num(order.collectAtDoor) : orderAmount + depositAmount;

    const Row = ({ label, hint, value }) => (
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
            <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={headerConfig}>{label}</Text>
                {hint ? <Text style={[paratextConfig, { fontSize: 10, marginTop: 2 }]}>{hint}</Text> : null}
            </View>
            <Text style={[paratextConfig, { color: theme.greyText }]}>{value}</Text>
        </View>
    );

    return (

        <View style={[styles.cardContainer, { backgroundColor: theme.cardContainer }]}>
            <Text style={[headerConfig, { fontSize: Fonts.size.base, marginBottom: 16 }]}>Bill Summary</Text>

            <Row label="Item Total" value={money(subTotal)} />
            <Row label="GST" value={money(taxAmount)} />
            {floorCharge > 0 && <Row label="Floor charge" value={money(floorCharge)} />}
            <Row label="Delivery charges" value={money(deliveryCharge)} />
            <Row label="Handling charges" value={money(convenienceFee)} />
            {deliverySurcharge > 0 && <Row label="Delivery surcharge" value={money(deliverySurcharge)} />}
            {depositAmount > 0 && (
                <Row label="Refundable can deposit" hint="Refunded when cans are returned" value={money(depositAmount)} />
            )}

            <View style={{ backgroundColor: "grey", opacity: 0.12, width: "100%", height: 1, marginTop: 8 }} />

            {depositAmount > 0 && (
                <View style={{ marginTop: 8 }}>
                    <Row label="Order amount" hint="Excl. refundable deposit" value={money(orderAmount)} />
                </View>
            )}

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 5 }}>
                <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={[headerConfig, { fontSize: Fonts.size.base }]}>{`${isOrderDetails ? 'Total Bill' : 'To Pay'}`}</Text>
                    <Text style={[paratextConfig, { fontSize: 10, marginTop: 5 }]}>Incl. all taxes, charges &amp; deposit</Text>
                </View>
                <View style={{ justifyContent: "center", alignItems: "flex-end", marginTop: 10 }}>
                    <Text style={[paratextConfig, { color: theme.greyText, fontSize: Fonts.size.base, fontWeight: 'bold' }]}>
                        {money(collectAtDoor)}
                    </Text>
                    {isOrderDetails && (
                      <View style={{ flexDirection:"row", alignItems:"center", borderRadius: 10, backgroundColor: "lightgreen", padding: 5, marginTop: 5,paddingHorizontal:10 }}>
                        <Image source={require('../../../assets/images/download.png')}  style={{width:15,height:15}} tintColor={"green"}/>
                            <Text style={[paratextConfig, { color: "green", fontWeight: "bold",marginLeft:5 }]}>Download Invoice</Text>
                        </View>
                    )}
                </View>
            </View>

        </View>

    );
}

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
    title: {
        fontSize: 20,
        marginBottom: 16,
        fontWeight: 'bold',
    },
    input: {
        backgroundColor: '#f7f7f7',
        padding: 10,
        borderRadius: 10,
        marginVertical: 6,
        color: '#444',
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 8,
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginTop: 10,
    },
    radioGroup: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 8,
    },
    radioOption: {
        fontSize: 16,
        color: '#888',
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 10,
        backgroundColor: '#eee',
    },
    radioSelected: {
        color: '#000',
        backgroundColor: '#d0f0c0',
        fontWeight: '600',
    },
    button: {
        marginTop: 20,
        backgroundColor: '#3498db',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
    responseContainer: {
        marginTop: 20,
        padding: 12,
        backgroundColor: '#f6f6f6',
        borderRadius: 12,
    },
    responseText: {
        fontSize: 15,
        color: '#333',
        marginVertical: 4,
    },
});
