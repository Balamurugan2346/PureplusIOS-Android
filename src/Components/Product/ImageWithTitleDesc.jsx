import React from 'react';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';
import { useTheme } from '../../Context/ThemeContext';
import Fonts from '../../../assets/fonts/Fonts';

// --- Placeholder Image URI (Replace with your actual image import or URI) ---
const BACKGROUND_IMAGE_URI = 'https://i.imgur.com/WbQvF1k.png'; 
// Note: This placeholder is based on the image you provided.
// You should replace it with your actual image path or import.
// --------------------------------------------------------------------------

/**
 * Reusable component for an image card with a title and description overlay.
 * @param {object} props
 * @param {string} props.imageUrl - URI or require path for the background image.
 * @param {string} props.title - The main title text.
 * @param {string} props.description - The descriptive text below the title.
 * 
 * 
 * 
 */

  
const ImageWithTitleDesc = ({ 
  title = "Pure & Safe Hydration",
  description = "Our commitment to your well-being.",
}) => {


    const { theme } = useTheme()
    const headerConfig = {
    color: 'white',
    fontFamily: Fonts.family.semiBold,
    fontSize: Fonts.size.xxl
  }

  const paratextConfig = {
    color: theme.text,
    fontFamily: Fonts.family.medium,
    fontSize: Fonts.size.sm
  }

  return (
    <View style={styles.cardContainer}>
      <ImageBackground 
        source={require('../../../assets/images/watercanprotectsunlight.png')} 
        style={styles.imageBackground}
        imageStyle={styles.imageStyle} // Apply border radius to the image itself
      >
        {/* Overlay to improve text readability */}
        <View style={styles.overlay} /> 

        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={headerConfig}>{title}</Text>
          <Text style={paratextConfig}>{description}</Text>
        </View>
      </ImageBackground>
    </View>
  );
};

// --- Stylesheet for the component ---
const styles = StyleSheet.create({
  cardContainer: {
    margin: 15, // Margin around the entire card
    borderRadius: 16,
    overflow: 'hidden', // Ensures content respects border radius, especially for ImageBackground
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    // Elevation for Android
    elevation: 8,
  },
  imageBackground: {
    width: '100%',
    aspectRatio: 16 / 9, // Maintain a consistent aspect ratio
    justifyContent: 'flex-end', // Push content to the bottom
  },
  imageStyle: {
    borderRadius: 16, // Apply border radius directly to the image
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // Covers the entire image background
    backgroundColor: 'rgba(0, 0, 0, 0.25)', // Semi-transparent dark overlay for text readability
    borderRadius: 16, // Match card container
  },
  textContainer: {
    padding: 20,
    position: 'absolute', // Position text over the image
    bottom: 0,
    left: 0,
    right: 0,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)', // Slightly transparent white
  },
});

export default ImageWithTitleDesc;