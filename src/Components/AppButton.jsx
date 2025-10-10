import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Fonts from '../../assets/fonts/Fonts';
import { useTheme } from '../Context/ThemeContext';

const AppButton = ({ title, onAction, borderOnly = false, style, isLoading = false , loadingText='Loading...' }) => {
  const { theme, toggleTheme } = useTheme();
  const { width } = Dimensions.get('window');
  console.log("width", width)

  const textConfig = {
    color: borderOnly ? theme.highlightedText : theme.buttonText,
    fontFamily: Fonts.family.semiBold,
    fontSize: Fonts.size.sm
  }

  return (

    <TouchableOpacity disabled={isLoading} onPress={onAction} style={[{
      backgroundColor: borderOnly
          ? theme.background
          : theme.primary,
      width: '100%',
      opacity:isLoading ? 0.2 : 1,
      paddingVertical: 10,
      marginVertical: 10,
      borderWidth: borderOnly ? 1 : 0,
      borderColor: borderOnly ? theme.highlightedText : "",
      borderRadius: 14,
      alignItems: "center"
    }, style]}
    >
      {!isLoading ? (
        <Text style={textConfig}>{title}</Text>
      ) : (
        <Text style={textConfig}>{loadingText}</Text>
      )}
    </TouchableOpacity>

  )
}

export default AppButton

const styles = StyleSheet.create({


})