import { useTheme } from '../../Context/ThemeContext';
import Fonts from '../../../assets/fonts/Fonts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const BottomSheetContentProduct = ({ data  , onClose}) => {
  if (!data) return null; // safety

    const { theme } = useTheme()

  const headerConfig = {
    color: theme.background,
    fontFamily: Fonts.family.semiBold,
    fontSize: Fonts.size.sm
  }

  const paratextConfig = {
    color:theme.secondaryText,
    fontFamily: Fonts.family.semiBold,
    fontSize: Fonts.size.xs
  }

  return (
    <View style={styles.container}>
      {/* Product Image */}
      <Image source={{ uri: data.img }} style={styles.productImage} resizeMode="cover" />

      <Ionicons onPress={()=>onClose()} name='close-circle' size={30} style={{position:"absolute",alignSelf:"flex-end"}}/>

      {/* Name and Offer */}
      <Text style={styles.productName}>{data.name}</Text>
      {data.offerText ? <Text style={styles.offerText}>{data.offerText}</Text> : null}

      {/* Description */}
      <Text style={styles.description}>{data.description}</Text>

      {/* Price section */}
      <View style={styles.priceRow}>
        <Text style={styles.price}>{data.price}</Text>
        {data.oldPrice ? <Text style={styles.oldPrice}>{data.oldPrice}</Text> : null}
      </View>

      {/* Business model info */}
      <Text style={styles.unitInfo}>
        👉 In our model, selecting this product adds as <Text style={headerConfig}>1 unit = 4 water cans. </Text>  
        Price remains the same as displayed above.
      </Text>
    </View>
  );
};

export default BottomSheetContentProduct;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center'
  },
  productImage: {
    width: 120,
    height: 120,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: '#f5f5f5'
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center'
  },
  offerText: {
    fontSize: 14,
    color: 'green',
    marginBottom: 10,
    textAlign: 'center'
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 15,
    textAlign: 'center'
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 15
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginRight: 10
  },
  oldPrice: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through'
  },
  unitInfo: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    lineHeight: 20,
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 8,
  }
});
