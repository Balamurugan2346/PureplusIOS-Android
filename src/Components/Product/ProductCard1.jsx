// import { useAppContext } from '../../Context/AppContext';
// import Fonts from '../../../assets/fonts/Fonts';
// import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { useTheme } from '../../Context/ThemeContext';

// const ProductCard1 = ({ product, onPress }) => {
//   const { theme } = useTheme();
//   const { addToCart, cart, reduceQuantity, removeFromCart, usersAddress } = useAppContext()

//   const isInCart = cart.some(item => item.id === product.id);

//   const cartItem = cart.find(item => item.id === product.id);
//   const quantity = cartItem ? cartItem.quantity : 0;

//   const headerConfig = {
//     color: theme.buttonText,
//     fontFamily: Fonts.family.medium,
//     fontSize: Fonts.size.xs
//   };

//   const paratextConfig = {
//     color: theme.greyText,
//     fontFamily: Fonts.family.medium,
//     fontSize: Fonts.size.xs
//   };


//   return (
//     <TouchableOpacity
//       style={[styles.card, { backgroundColor: theme.inputContainerBorder }]}
//       onPress={() => onPress(product)}
//       activeOpacity={0.9}
//     >
//       <View style={{ alignItems: "center", justifyContent: "center" }}>
//         <Image source={require('../../../assets/images/30L.png')} style={{ width: 100, height: 100 }} />
//         <Text style={headerConfig}>{product.name}</Text>

//         <View style={{ flexDirection: "row" }}>
//           <Text style={[paratextConfig, { marginRight: 5, textDecorationLine: "line-through", color: 'black', opacity: 0.5 }]}>₹{product.oldPrice}</Text>
//           <Text style={[paratextConfig, { color: 'lightgreen' }]}>₹{product.price}</Text>
//         </View>

//         <View >
//           {quantity < 1 ? (
//             <TouchableOpacity style={{ marginTop: 10 , backgroundColor:theme.primary,paddingHorizontal:10,paddingVertical:6,borderRadius:20 }} onPress={() => {
//               addToCart(product)
//               console.log('clicked')
//             }}>
//               <Text style={headerConfig}>Add to Cart</Text>
//             </TouchableOpacity>

//           ) : (
//             <View style={styles.qtyContainer}>
//               <View>
//                 <View style={styles.stepper}>
//                   <TouchableOpacity onPress={() => reduceQuantity(product)} style={styles.stepButton}>
//                     <Text style={[styles.stepText, { color: "red" }]}>−</Text>
//                   </TouchableOpacity>
//                   <Text style={styles.quantityText}>{quantity}</Text>
//                   <TouchableOpacity onPress={() => addToCart(product)} style={styles.stepButton}>
//                     <Text style={[styles.stepText, { color: "green" }]}>+</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </View>
//           )}
//         </View>

//       </View>
//     </TouchableOpacity>
//   );
// };

// export default ProductCard1;

// const styles = StyleSheet.create({
//   card: {
//     overflow: 'hidden',
//     borderRadius: 16,
//     justifyContent: "center",
//     alignItems: "center",
//     margin: 10,
//     padding: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//   },

//   stepper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     borderWidth: 1,
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//   },
//   stepButton: {
//     paddingHorizontal: 8,
//   },
//   stepText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   quantityText: {
//     marginHorizontal: 4,
//     fontWeight: 'bold',
//     color: '#000',
//   },

//   qtyContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 8,
//     gap: 10
//   },
//   qtyBtn: {
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 6,
//   },
//   qtyText: {
//     fontSize: 18,
//     fontWeight: 'bold'
//   },
//   qtyNumber: {
//     fontSize: 16,
//     fontWeight: '600'
//   }
// });


import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Pressable } from 'react-native';
import Fonts from '../../../assets/fonts/Fonts';

export default function ProductCard1({ product, onPress }) {
  return (
    <Pressable onPress={()=>onPress()}>
      <View style={styles.card}>
        <View style={styles.row}>
          <Image
            source={require('../../../assets/images/watercan.png')}
            style={styles.image}
            resizeMode="contain"
          />

          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { fontFamily: Fonts.family.bold }]}>{product.productName}</Text>
            <Text style={[styles.uom, { fontFamily: Fonts.family.regular }]}>{product.uom}</Text>

            <View style={styles.row}>
              <Text style={[styles.strike, { fontFamily: Fonts.family.medium }]}>₹{product.perCanPrice}</Text>
              {/* <Text style={styles.tax}> / {product.taxPercentage}% Tax</Text> */}
            </View>

            <Text style={[styles.price, { fontFamily: Fonts.family.semiBold }]}>₹{product.originalPrice} / Can</Text>
          </View>
        </View>

        <View style={styles.line} />

        <View style={styles.rowBetween}>
          <Text style={[styles.label, { fontFamily: Fonts.family.regular , paddingRight:10 }]}>Unit: {product.unitCount} Cans</Text>
          <Text style={[styles.unitPrice, { fontFamily: Fonts.family.medium }]}>    Total:₹{product.unitPrice} / Unit</Text>
        </View>
      </View>
    </Pressable>

  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
    marginHorizontal: 10
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  image: {
    width: 70,
    height: 90,
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0A1E3F',
  },
  uom: {
    fontSize: 14,
    marginVertical: 4,
    color: '#8A8A8A',
  },
  strike: {
    textDecorationLine: 'line-through',
    color: '#A0A0A0',
    fontSize: 14,
  },
  tax: {
    marginLeft: 4,
    fontSize: 14,
    color: '#555',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0A1E3F',
    marginTop: 3,
  },
  label: {
    fontSize: 15,
    color: '#6A6A6A',
  },
  unitPrice: {
    fontSize: 16,
    fontWeight: '700',
  },
  line: {
    height: 1,
    backgroundColor: '#EDEDED',
    marginVertical: 10,
  },
});
