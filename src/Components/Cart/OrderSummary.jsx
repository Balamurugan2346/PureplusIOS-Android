import Fonts from '../../../assets/fonts/Fonts';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../Context/ThemeContext';

export default function OrderSummary({ isOrderDetails = false }) {


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


    return (

        <View style={[styles.cardContainer, { backgroundColor: theme.cardContainer }]}>
            <Text style={[headerConfig, { fontSize: Fonts.size.base, marginBottom: 16 }]}>Bill Summary</Text>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                <Text style={headerConfig}>Item Total</Text>
                <View style={{ flexDirection: "row" }}>
                    <Text style={[paratextConfig, { textDecorationLine: "line-through" }]}>140</Text>
                    <Text style={[paratextConfig, { color: theme.greyText, marginLeft: 5 }]}>120</Text>
                </View>
            </View>


            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                <Text style={headerConfig}>Delivery charges</Text>
                <View style={{ flexDirection: "row" }}>
                    <Text style={[paratextConfig, { textDecorationLine: "line-through" }]}>140</Text>
                    <Text style={[paratextConfig, { color: theme.greyText, marginLeft: 5 }]}>120</Text>
                </View>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={headerConfig}>Handling charges</Text>
                <View style={{ flexDirection: "row" }}>
                    <Text style={[paratextConfig, { textDecorationLine: "line-through" }]}>140</Text>
                    <Text style={[paratextConfig, { color: theme.greyText, marginLeft: 5 }]}>120</Text>
                </View>
            </View>


            <View style={{ backgroundColor: "grey", opacity: 0.12, width: "100%", height: 1, marginTop: 15 }} />


            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 5 }}>
                <View>
                    <Text style={[headerConfig, { fontSize: Fonts.size.base }]}>{`${isOrderDetails ? 'Total Bill' : 'To Pay'}`}</Text>
                    <Text style={[paratextConfig, { fontSize: 10, marginTop: 5 }]}>Incl All Taxes and Charges</Text>
                </View>
                <View style={{ justifyContent: "center", alignItems: "flex-end", marginTop: 10 }}>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={[paratextConfig, { textDecorationLine: "line-through" }]}>140</Text>
                        <Text style={[paratextConfig, { color: theme.greyText, marginLeft: 5 }]}>120</Text>
                    </View>
                    {!isOrderDetails ? (
                        <View style={{ borderRadius: 10, backgroundColor: "lightgreen", padding: 5, marginTop: 5 }}>
                            <Text style={[styles.detailText, { color: "green", fontWeight: "bold" }]}>Saving 50%</Text>
                        </View>
                    ) : (
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
