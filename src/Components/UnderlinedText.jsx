import { StyleSheet, Text } from 'react-native'
import Fonts from '../../assets/fonts/Fonts'
import { useTheme } from '../Context/ThemeContext'

const UnderlinedText = ({text,style}) => {

    const {theme} = useTheme()
    
  const textConfig = {
    color : theme.primary,
    fontFamily: Fonts.family.semiBold,
    fontSize: Fonts.size.base
  }

  return (
    <Text style={[style,textConfig,styles.text]}>{text}</Text>
  )
}

export default UnderlinedText

const styles = StyleSheet.create({
    text : {
        textDecorationLine:"underline"
    }
})