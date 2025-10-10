import { StyleSheet, Text, View } from 'react-native'
import React, { useMemo } from 'react'
import { useTheme } from '../../Context/ThemeContext';
import Fonts from '../../../assets/fonts/Fonts'


const RegularText = ({text,style}) => {

      const { theme, toggleTheme } = useTheme();


  return (
    <View>
      <Text style={[styles.text,{ color: theme.text,
  fontFamily: Fonts.family.regular,
  fontSize: Fonts.size.sm,
  fontWeight:Fonts.weight.regular},style]}>{text}</Text>
    </View>
  )
}

export default RegularText

const styles = StyleSheet.create({
    text:{

    }
})