import Fonts from '../../../assets/fonts/Fonts';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useAppContext } from '../../Context/AppContext';
import { useTheme } from '../../Context/ThemeContext';
const OrderProdItem = () => {


    const { addToCart, cart, reduceQuantity, removeFromCart, usersAddress } = useAppContext()


    const { theme } = useTheme()

    const headerConfig = {
        color: theme.greyText,
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.sm
    }

    const paratextConfig = {
        color: theme.secondaryText,
        fontFamily: Fonts.family.medium,
        fontSize: Fonts.size.xs
    }



    return (
        <View>
            <View style={styles.container}>
                <View style={{ flexDirection: "row", flex: 1, alignItems: "center", justifyContent: "space-between", marginHorizontal: 10 }}>

                    <View style={{ flexDirection: "row" }}>
                        <Image source={require('../../../assets/images/watercan2.png')} style={{ width: 40, height: 40, marginRight: 10 }} />
                        <View>
                            <Text style={[headerConfig]}>{'Water can 1 litre'}</Text>
                            <View style={{flexDirection:"row"}}>
                                <Text style={[paratextConfig]}>{'4 Can'}</Text>
                                <Text style={[paratextConfig,{marginLeft:5}]}>{'* 1 Unit'}</Text>
                            </View>
                        </View>
                    </View>
                    <View>
                        <Text style={[paratextConfig, { color: "black",fontSize:Fonts.size.base,fontFamily:Fonts.family.bold }]}>{16.45}</Text>
                        <Text style={[paratextConfig, { textDecorationLine: "line-through", marginRight: 3 }]}>{23.45}</Text>
                    </View>
                </View>
            </View>
            <View style={{ backgroundColor: "grey", opacity: 0.12, width: "100%", height: 1 }} />

        </View>

    );
};

export default OrderProdItem;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    price: {
        fontSize: 14,
        color: '#444',
        marginTop: 4,
    },
    quantityContainer: {
        // borderRadius: 30,
        // borderColor: "#b75ef3ff",
        // borderWidth: 0.8,
        backgroundColor: "white",
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        paddingHorizontal: 4,
    },
    quantity: {
        fontSize: 18,
        marginHorizontal: 8,
    },
});
