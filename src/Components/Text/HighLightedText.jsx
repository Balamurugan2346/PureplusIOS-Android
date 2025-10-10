import { StyleSheet, Text, View } from 'react-native'
import React, { useMemo } from 'react'
import { useTheme } from '../../Context/ThemeContext';
import Fonts from '../../../assets/fonts/Fonts'


const HighLightedText = ({text,style}) => {

      const { theme, toggleTheme } = useTheme();


  return (
    <View>
      <Text style={[styles.text,{ color: theme.text,
  fontFamily: Fonts.family.bold,
  fontSize: Fonts.size.xl,
  fontWeight:Fonts.weight.bold},style]}>{text}</Text>
    </View>
  )
}

export default HighLightedText

const styles = StyleSheet.create({
    text:{

    }
})