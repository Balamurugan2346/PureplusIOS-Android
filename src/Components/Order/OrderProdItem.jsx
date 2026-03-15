import Fonts from '../../../assets/fonts/Fonts';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../Context/ThemeContext';

const OrderProdItem = ({ item }) => {

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

    const image =
        item?.imageUrls?.length > 0
            ? { uri: item.imageUrls[0] }
            : require('../../../assets/images/watercan2.png');

    return (
        <View>

            <View style={styles.container}>

                <View style={{ flexDirection: "row", flex: 1, alignItems: "center", justifyContent: "space-between", marginHorizontal: 10 }}>

                    {/* LEFT SIDE */}
                    <View style={{ flexDirection: "row" }}>
                        <Image
                            source={image}
                            style={{ width: 40, height: 40, marginRight: 10 }}
                        />

                        <View>
                            <Text style={headerConfig}>
                                {item?.productName}
                            </Text>

                            <View style={{ flexDirection: "row" }}>
                                <Text style={paratextConfig}>
                                    {item?.orderedQuantity} {item?.uom}
                                </Text>

                                <Text style={[paratextConfig, { marginLeft: 5 }]}>
                                    * {item?.unitPrice} Unit
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* RIGHT SIDE */}
                    <View>
                        <Text style={[
                            paratextConfig,
                            {
                                color: "black",
                                fontSize: Fonts.size.base,
                                fontFamily: Fonts.family.bold
                            }
                        ]}>
                            ₹{item?.totalLineAmount}
                        </Text>

                        {item?.taxAmount > 0 && (
                            <Text style={[
                                paratextConfig,
                                { textDecorationLine: "line-through", marginRight: 3 }
                            ]}>
                                ₹{item?.price}
                            </Text>
                        )}
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
});