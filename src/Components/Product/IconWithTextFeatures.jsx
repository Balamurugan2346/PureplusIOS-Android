import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 
import VectorBg from '../VectorBg';
import { useTheme } from '../../Context/ThemeContext';
import Fonts from '../../../assets/fonts/Fonts';
// Note: You need to install 'react-native-vector-icons' for this component.

/**
 * Reusable component for displaying a feature with an icon, title, and description.
 * @param {object} props
 * @param {string} props.iconName - The name of the icon (e.g., 'flask-outline', requires MaterialCommunityIcons).
 * @param {string} props.title - The main heading/title text.
 * @param {string} props.description - The body/descriptive text.
 * @param {string} [props.iconColor='#3498db'] - Color of the icon.
 * @param {string} [props.iconBgColor='#ecf0f1'] - Background color for the icon circle.
 */
const IconTextFeature = ({
  iconName = 'flask-outline',
  title = 'Minimal Chemical Treatment',
  description = 'We use an advanced purification process that relies on natural filtration, ensuring our water is pure with significantly fewer chemicals.',
  iconColor = '#3498db', // Blue color
  iconBgColor = '#ecf0f1', // Light gray background
}) => {

       const { theme } = useTheme()
    const headerConfig = {
    color: theme.background,
    fontFamily: Fonts.family.semiBold,
    fontSize: Fonts.size.sm
  }

  const paratextConfig = {
    color: theme.secondaryText,
    fontFamily: Fonts.family.regular,
    fontSize: Fonts.size.xs
  }


  return (
    <View style={styles.featureContainer}>
      {/* Icon Circle */}
      {/* <View style={[styles.iconCircle, { backgroundColor: iconBgColor }]}>
        <Icon name={iconName} size={30} color={iconColor} />
      </View> */}
        <VectorBg icon={iconName} bgColor={iconBgColor} iconTint={iconColor} style={styles.iconCircle} />

      {/* Text Content */}
      <View style={styles.textContainer}>
        <Text style={headerConfig}>{title}</Text>
        <Text style={paratextConfig}>{description}</Text>
      </View>
    </View>
  );
};

// --- Stylesheet for the component ---
const styles = StyleSheet.create({
  featureContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Align content to the top
    padding: 15,
    backgroundColor: 'white', // White background for the card/row
    borderRadius: 8,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    padding: 5,
  },
  textContainer: {
    flex: 1, // Allows text to take up the remaining space
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
});

export default IconTextFeature;