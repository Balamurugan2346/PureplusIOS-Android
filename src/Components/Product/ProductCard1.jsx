import { useAppContext } from '../../Context/AppContext';
import Fonts from '../../../assets/fonts/Fonts';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../Context/ThemeContext';

const ProductCard1 = ({ product, onPress }) => {
  const { theme } = useTheme();
  const { addToCart, cart, reduceQuantity, removeFromCart, usersAddress } = useAppContext()

  const isInCart = cart.some(item => item.id === product.id);

  const cartItem = cart.find(item => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const headerConfig = {
    color: theme.buttonText,
    fontFamily: Fonts.family.medium,
    fontSize: Fonts.size.xs
  };

  const paratextConfig = {
    color: theme.greyText,
    fontFamily: Fonts.family.medium,
    fontSize: Fonts.size.xs
  };


  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.inputContainerBorder }]}
      onPress={() => onPress(product)}
      activeOpacity={0.9}
    >
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Image source={require('../../../assets/images/30L.png')} style={{ width: 100, height: 100 }} />
        <Text style={headerConfig}>{product.name}</Text>

        <View style={{ flexDirection: "row" }}>
          <Text style={[paratextConfig, { marginRight: 5, textDecorationLine: "line-through", color: 'black', opacity: 0.5 }]}>₹{product.oldPrice}</Text>
          <Text style={[paratextConfig, { color: 'lightgreen' }]}>₹{product.price}</Text>
        </View>

        <View >
          {quantity < 1 ? (
            <TouchableOpacity style={{ marginTop: 10 , backgroundColor:theme.primary,paddingHorizontal:10,paddingVertical:6,borderRadius:20 }} onPress={() => {
              addToCart(product)
              console.log('clicked')
            }}>
              <Text style={headerConfig}>Add to Cart</Text>
            </TouchableOpacity>

          ) : (
            <View style={styles.qtyContainer}>
              <View>
                <View style={styles.stepper}>
                  <TouchableOpacity onPress={() => reduceQuantity(product)} style={styles.stepButton}>
                    <Text style={[styles.stepText, { color: "red" }]}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{quantity}</Text>
                  <TouchableOpacity onPress={() => addToCart(product)} style={styles.stepButton}>
                    <Text style={[styles.stepText, { color: "green" }]}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>

      </View>
    </TouchableOpacity>
  );
};

export default ProductCard1;

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },

  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  stepButton: {
    paddingHorizontal: 8,
  },
  stepText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityText: {
    marginHorizontal: 4,
    fontWeight: 'bold',
    color: '#000',
  },

  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 10
  },
  qtyBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  qtyText: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  qtyNumber: {
    fontSize: 16,
    fontWeight: '600'
  }
});
