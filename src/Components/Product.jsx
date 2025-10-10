import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../Context/ThemeContext';

const Product = () => {

  const {theme}  = useTheme()
    const [quantity, setQuantity] = useState(0);

  const increase = () => setQuantity(prev => prev + 1);
  const decrease = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
    else setQuantity(0); // go back to ADD
  };

  return (
    <View style={[styles.card,{backgroundColor:theme.card}]}>
     <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/images/watercan2.png')}
          style={styles.img}
        />

        {quantity === 0 ? (
          <TouchableOpacity style={styles.addButton} onPress={increase}>
            <Text style={styles.addText}>ADD</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.stepper}>
            <TouchableOpacity onPress={decrease} style={styles.stepButton}>
              <Text style={styles.stepText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity onPress={increase} style={styles.stepButton}>
              <Text style={styles.stepText}>+</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹24.25</Text>
          <Text style={styles.strikePrice}>₹26</Text>
        </View>
        {/* <Text style={styles.weight}>500g</Text> */}
        <Text style={styles.discount}>₹2 Off</Text>
        {/* <Text numberOfLines={3} style={styles.name}>
          1 Unit consider as 4 water can,each 25 litre
        </Text> */}
        {/* <Text style={styles.tag}>Fresh & Purified</Text>
        <Text style={styles.rating}>⭐ 4.6 (10.4k) • 5 mins</Text> */}
        {/* <SmallButton title={"Buy"}/> */}
      </View>
    </View>
  );
};

export default Product;

const styles = StyleSheet.create({
  card: {
    width: '40%',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    margin: 8,
  },
  imageContainer: {
    position: 'relative',
  },
  img: {
    width: '100%',
    height: 90,
    resizeMode: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 0,
    right: 2,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f04f5f',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },

  stepper: {
    position: 'absolute',
    bottom:0,
    right: 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f04f5f',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  stepButton: {
    paddingHorizontal: 8,
  },
  stepText: {
    fontSize: 16,
    color: '#f04f5f',
    fontWeight: 'bold',
  },
  quantityText: {
    marginHorizontal: 4,
    fontWeight: 'bold',
    color: '#000',
  },

  addText: {
    color: '#f04f5f',
    fontWeight: 'bold',
  },
  infoContainer: {
    padding: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  strikePrice: {
    textDecorationLine: 'line-through',
    color: '#777',
    fontSize: 12,
    marginLeft: 6,
  },
  weight: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  discount: {
    fontSize: 12,
    color: 'green',
    marginVertical: 2,
  },
  name: {
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
    marginTop: 4,
  },
  tag: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
  rating: {
    fontSize: 11,
    color: '#555',
    marginTop: 2,
  },
});
