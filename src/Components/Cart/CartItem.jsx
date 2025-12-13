import Fonts from '../../../assets/fonts/Fonts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppContext } from '../../Context/AppContext';
import { useTheme } from '../../Context/ThemeContext';
import { clearCart, loadCartItems, addToCart, updateCart } from '../../Redux/Slices/CartSlice';
import { useToast } from '../Toast/ToastProvider';
import { useDispatch } from 'react-redux';

const CartItem = ({ cartItem }) => {


    const { showToast } = useToast()
    // const { addToCart, reduceQuantity } = useAppContext() //pure UI STATE

    const dispatch = useDispatch()

    const { theme } = useTheme()

    const headerConfig = {
        color: theme.greyText,
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.sm
    }

    const paratextConfig = {
        color: theme.secondaryText,
        fontFamily: Fonts.family.medium,
        fontSize: Fonts.size.xs
    }

    const handleIncrease = (item) => {
        dispatch(
            updateCart({
                cart: {
                    id: item.id,
                    userId: item.userId,
                    productId: item.productId,
                    quantity: item.quantity + 1,
                },
                onSuccess: () => {
                    // 👇 YOU control this
                    dispatch(loadCartItems(item.userId));
                },
                onError: () => {
                    showToast("Unable to add quantity",true)
                }
            })
        );
    };


    const handleDecrease = (item) => {
        if (item.quantity < 1) return;
        dispatch(
            updateCart({
                cart: {
                    id: item.id,
                    userId: item.userId,
                    productId: item.productId,
                    quantity: item.quantity - 1,
                },
                onSuccess: () => {
                    dispatch(loadCartItems(item.userId));
                },
                onError:() =>{
                    showToast("unable to remove quantity",true)
                }
            })
        );
    };



    return (
        <View>
            <View style={styles.container}>
                <Image source={require('../../../assets/images/watercan2.png')} style={{ width: 40, height: 40, marginRight: 10 }} />
                <View style={{ flex: 1 }}>
                    <Text style={[headerConfig]}>{`prodID:${cartItem.productId}`}</Text>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={[paratextConfig, { textDecorationLine: "line-through", marginRight: 3 }]}>{cartItem.unitPrice}</Text>
                        <Text style={[paratextConfig, { color: "green" }]}>{cartItem.unitPrice}</Text>
                    </View>
                </View>

                <View style={styles.quantityContainer}>
                    <TouchableOpacity onPress={()=>handleDecrease(cartItem)} style={styles.iconButton}>
                        <Ionicons name="remove-circle-outline" size={24} color="red" />
                    </TouchableOpacity>
                    <Text style={styles.quantity}>{cartItem.quantity}</Text>
                    <TouchableOpacity onPress={()=>handleIncrease(cartItem)} style={styles.iconButton}>
                        <Ionicons name="add-circle-outline" size={24} color="green" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ backgroundColor: "grey", opacity: 0.12, width: "100%", height: 1 }} />

        </View>

    );
};

export default CartItem;

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
