import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../Context/ThemeContext';
import Fonts from '../../../assets/fonts/Fonts';

// --- Placeholder Image URI (Replace with your actual image import or URI) ---
const PRODUCT_IMAGE_URI = 'https://i.imgur.com/GjT4wBq.png'; 
// Note: This placeholder is based on the image you provided.
// You should replace it with your actual image path or import.
// --------------------------------------------------------------------------

/**
 * Reusable component for a product card design.
 * @param {object} props
 * @param {string} props.category - The product category (e.g., "Mineral Water").
 * @param {string} props.title - The product name (e.g., "AquaPure 20L Can").
 * @param {string} props.price - The product price (e.g., "$5.00").
 * @param {function} props.onAddToCart - Function to call when "Add to Cart" is pressed.
 * @param {function} props.onRefillQuantityChange - Function to call when refill quantity changes (receives new quantity).
 */
const ProductCardRect = ({
  navigate,
  category,
  title,
  price,
  onAddToCart,
  onRefillQuantityChange,
}) => {
  // State to manage the refill quantity
  const [refillQuantity, setRefillQuantity] = useState(0);



   const { theme, toggleTheme, isDark } = useTheme();

     const headerConfig = {
    color: theme.text,
    fontFamily: Fonts.family.semiBold,
    fontSize: Fonts.size.sm
  }

  const textConfig = {
    fontFamily: Fonts.family.regular,
    color:theme.card,
    fontSize: Fonts.size.sm,
  }

  const titleConfig = {
    color: theme.text,
    fontFamily: Fonts.family.semiBold,
    fontSize: Fonts.size.lg
  }
  
  // Handlers for the refill buttons
  const incrementRefill = () => {
    const newQuantity = refillQuantity + 3;
    setRefillQuantity(newQuantity);
    if (onRefillQuantityChange) {
      onRefillQuantityChange(newQuantity);
    }
  };

  const decrementRefill = () => {
    // Prevent quantity from going below 0
    if (refillQuantity > 0) {
      const newQuantity = refillQuantity - 3;
      setRefillQuantity(newQuantity);
      if (onRefillQuantityChange) {
        onRefillQuantityChange(newQuantity);
      }
    }
  };

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={()=>navigate()}>
 <View >
      {/* Product Details Section */}
      <View style={styles.detailsContainer}>
        {/* <Text style={styles.categoryText}>{category}</Text> */}
          <View style={styles.imageWrapper}>
        <Image 
          source={require('../../../assets/images/watercanNew.png')} 
          style={styles.productImage} 
        />
      </View>
        <Text style={styles.titleText}>{title}</Text>
        <Text style={textConfig}>Note:1 unit equal to 3 cans</Text>
        <Text style={styles.priceText}>{price}</Text>

       
      </View>
    </View>
    </TouchableOpacity>
   
  );
};

// --- Stylesheet for the component ---
const styles = StyleSheet.create({
  // Main Card Container
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    // Elevation for Android
    elevation: 5,
  },

  // Left Section: Details and Buttons
  detailsContainer: {
    flex: 1,
    paddingRight: 10,
  },
  categoryText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  priceText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3498db', // Blue color for the price
    marginBottom: 15,
  },

  // Right Section: Image
  imageWrapper: {
    width: 100,
    height: 100,
    alignSelf:'center',
    borderRadius: 12,
    marginVertical:7,
    overflow: 'hidden',
    backgroundColor: 'black', // Black background for the image like in the source
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  // 1. Add to Cart Button (Initial State)
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3498db', // Primary blue color
    borderRadius: 30,
    paddingVertical: 12,
    maxWidth: 200,
  },
  addToCartButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  plusIcon: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // 2. Refill Counter (Quantity > 0 State)
  refillCounterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    borderRadius: 30,
    maxWidth: 200,
    overflow: 'hidden',
  },
  refillButton: {
    width: 45, // Fixed width for a good touch target
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2980b9', // Slightly darker blue for buttons
  },
  refillButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  quantityDisplay: {
    flex: 1, // Takes up the remaining space
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default ProductCardRect;


// /*   {/* --- Button Logic --- */}
//         {refillQuantity === 0 ? (
//           // Display the 'Add to Cart' button initially
//           <TouchableOpacity 
//             style={styles.addToCartButton} 
//             onPress={incrementRefill} // Use increment to start the refill process
//             activeOpacity={0.8}
//           >
//             <Text style={styles.addToCartButtonText}>Add to Cart</Text>
//             <Text style={styles.plusIcon}>+</Text>
//           </TouchableOpacity>
//         ) : (
//           // Display the 'Refill' quantity counter once quantity is > 0
//           <View style={styles.refillCounterContainer}>
//             {/* Minus Button */}
//             <TouchableOpacity 
//               style={[styles.refillButton, styles.minusButton]}
//               onPress={decrementRefill}
//               activeOpacity={0.7}
//             >
//               <Text style={styles.refillButtonText}>-</Text>
//             </TouchableOpacity>

//             {/* Quantity Display */}
//             <View style={styles.quantityDisplay}>
//               <Text style={styles.quantityText}>{refillQuantity} Refill</Text>
//             </View>

//             {/* Plus Button */}
//             <TouchableOpacity 
//               style={[styles.refillButton, styles.plusButton]}
//               onPress={incrementRefill}
//               activeOpacity={0.7}
//             >
//               <Text style={styles.refillButtonText}>+</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//         {/* --- End Button Logic --- */}*/