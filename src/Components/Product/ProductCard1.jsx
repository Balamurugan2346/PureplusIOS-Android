// import React from 'react';
// import { View, Text, StyleSheet, Image, TouchableOpacity, Pressable } from 'react-native';
// import Fonts from '../../../assets/fonts/Fonts';

// export default function ProductCard1({ product, onPress }) {
//   return (
//     <Pressable onPress={()=>onPress()}>
//       <View style={styles.card}>
//         <View style={styles.row}>
//           <Image
//             source={require('../../../assets/images/watercan.png')}
//             style={styles.image}
//             resizeMode="contain"
//           />

//           <View style={{ flex: 1 }}>
//             <Text style={[styles.title, { fontFamily: Fonts.family.bold }]}>{product.productName}</Text>
//             <Text style={[styles.uom, { fontFamily: Fonts.family.regular }]}>{product.uom}</Text>

//             <View style={styles.row}>
//               <Text style={[styles.strike, { fontFamily: Fonts.family.medium }]}>₹{product.perCanPrice}</Text>
//               {/* <Text style={styles.tax}> / {product.taxPercentage}% Tax</Text> */}
//             </View>

//             <Text style={[styles.price, { fontFamily: Fonts.family.semiBold }]}>₹{product.originalPrice} / Can</Text>
//           </View>
//         </View>

//         <View style={styles.line} />

//         <View style={styles.rowBetween}>
//           <Text style={[styles.label, { fontFamily: Fonts.family.regular , paddingRight:10 }]}>Unit: {product.unitCount} Cans</Text>
//           <Text style={[styles.unitPrice, { fontFamily: Fonts.family.medium }]}>    Total:₹{product.unitPrice} / Unit</Text>
//         </View>
//       </View>
//     </Pressable>

//   );
// }

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 18,
//     padding: 16,
//     marginVertical: 10,
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 1,
//     marginHorizontal: 10
//   },
//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   rowBetween: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 10,
//   },
//   image: {
//     width: 70,
//     height: 90,
//     marginRight: 16,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#0A1E3F',
//   },
//   uom: {
//     fontSize: 14,
//     marginVertical: 4,
//     color: '#8A8A8A',
//   },
//   strike: {
//     textDecorationLine: 'line-through',
//     color: '#A0A0A0',
//     fontSize: 14,
//   },
//   tax: {
//     marginLeft: 4,
//     fontSize: 14,
//     color: '#555',
//   },
//   price: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#0A1E3F',
//     marginTop: 3,
//   },
//   label: {
//     fontSize: 15,
//     color: '#6A6A6A',
//   },
//   unitPrice: {
//     fontSize: 16,
//     fontWeight: '700',
//   },
//   line: {
//     height: 1,
//     backgroundColor: '#EDEDED',
//     marginVertical: 10,
//   },
// });


import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Fonts from '../../../assets/fonts/Fonts';
import { useTheme } from '../../Context/ThemeContext';

export default function ProductCard1({ product, onPress }) {
  const dispatch = useDispatch();

   const { theme, toggleTheme, isDark } = useTheme();

    const headerConfig = {
        color: theme.buttonText,
        fontFamily: Fonts.family.bold,
        fontSize: Fonts.size.xxl
    }

    const paratextConfig = {
        color: theme.text,
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.xs
    }


  const { cartItems, cartUpdateLoading } = useSelector(
    (state) => state.cart
  );

  const isInCart = cartItems?.some(
    (item) => item.productId === product.productId
  );

  const cartItem = cartItems?.find(
    (item) => item.productId === product.productId
  );

  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAdd = () => {
    dispatch(
      addItemLocal({
        productId: product.productId,
        productName: product.productName,
        price: product.basePrice,
      })
    );
  };

  const handleIncrease = () => {
    dispatch(
      addItemLocal({
        productId: product.productId,
      })
    );
  };

  const handleDecrease = () => {
    dispatch(decreaseItemLocal(product.productId));
  };

  return (
    <Pressable onPress={onPress}>
      <View style={styles.card}>
        {/* TOP SECTION */}
        <View style={styles.row}>
          <Image
            source={require('../../../assets/images/watercan.png')}
            style={styles.image}
            resizeMode="contain"
          />

          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { fontFamily: Fonts.family.bold }]}>
              {product.productName}
            </Text>

            <Text style={[styles.uom, { fontFamily: Fonts.family.regular }]}>
              {product.unit}
            </Text>

            <View style={styles.row}>
              <Text
                style={[
                  styles.strike,
                  { fontFamily: Fonts.family.medium },
                ]}
              >
                ₹{product.unitPrice}
              </Text>
            </View>

            <Text
              style={[
                styles.price,
                { fontFamily: Fonts.family.semiBold },
              ]}
            >
              ₹{product.basePrice} / Can
            </Text>
          </View>
        </View>

        <View style={styles.line} />

        {/* BOTTOM SECTION */}
        <View style={styles.rowBetween}>
          <Text
            style={[
              styles.label,
              { fontFamily: Fonts.family.regular },
            ]}
          >
            Unit: {product.unitCount} Cans
          </Text>

          {/* {isInCart && ( */}
            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "rgba(37, 119, 132, 0.1)", padding: 5, borderRadius: 30, paddingHorizontal: 10 , opacity:isInCart ? 100 : 0 }}>
              <Text style={[paratextConfig,{color:theme.primary}]}>Cart:{quantity}</Text>
            </View>
          {/* // )} */}
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
    marginHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  image: {
    width: 70,
    height: 90,
    marginRight: 16,
  },
  title: {
    fontSize: 18,
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
  price: {
    fontSize: 18,
    color: '#0A1E3F',
    marginTop: 3,
  },
  label: {
    fontSize: 15,
    color: '#6A6A6A',
  },
  line: {
    height: 1,
    backgroundColor: '#EDEDED',
    marginVertical: 10,
  },

  /* ADD BUTTON */
  addBtn: {
    backgroundColor: '#0A1E3F',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },

  /* QUANTITY CONTROLS */
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: 20,
    paddingHorizontal: 8,
  },
  qtyBtn: {
    padding: 6,
  },
  qtyText: {
    fontSize: 18,
    fontWeight: '700',
  },
  qtyNumber: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: '700',
  },
});

