import Fonts from '../../assets/fonts/Fonts';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../Context/ThemeContext';

const ProductCard = ({ product, onProductClick }) => {

    console.log("prd",product)
    const { theme } = useTheme()

    const headerConfig = {
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.sm
    }

    const textConfig = {
        color: "black",
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.base
    }

    const paratextConfig = {
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.xs
    }


    return (
        <TouchableOpacity style={styles.card} onPress={()=>onProductClick(product)}>
            <View >
                <Text style={[styles.title, headerConfig]}>{product.name}</Text>

                <View style={styles.imageContainer}>
                    <Image
                        source={require('../../assets/images/watercan2.png')}
                        style={styles.image}
                        resizeMode="contain"
                    />
                </View>

                <View >
                    <Text style={[styles.price, textConfig]}>
                        {product.price} <Text style={styles.oldPrice}>{product.oldPrice}</Text>
                    </Text>
                    <Text style={[styles.offer, paratextConfig]}>{product.offerText}</Text>
                </View>


                {/* <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addText}>ADD</Text>
      </TouchableOpacity> */}
            </View>
        </TouchableOpacity>

    );
};

const styles = StyleSheet.create({
    card: {
        width: 160,
        backgroundColor: '#F0F7FF', // subtle gradient can be done via LinearGradient
        borderRadius: 16,
        padding: 12,
        margin: 8,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
        elevation: 3,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: '#222',
        marginBottom: 8,
    },
    imageContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 8,
        alignItems: 'center',
        marginBottom: 8,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    image: {
        width: 100,
        height: 100,
    },
    price: {
    },
    oldPrice: {
        textDecorationLine: 'line-through',
        color: '#888',
    },
    offer: {
        color: 'green',
        marginBottom: 10,
    },
    addButton: {
        backgroundColor: '#007BFF',
        borderRadius: 50,
        paddingVertical: 6,
        paddingHorizontal: 20,
        alignSelf: 'center',
    },
    addText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
});

export default ProductCard;
