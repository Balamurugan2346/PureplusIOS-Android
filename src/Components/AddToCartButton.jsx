import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../Context/ThemeContext';

import Fonts from '../../assets/fonts/Fonts';

const AddToCartButton = ({title,onAction,style,isItemAddedToCart = false}) => {
const { theme, toggleTheme } = useTheme();

  const textConfig = {
    color:theme.buttonText ,
    fontFamily:Fonts.family.semiBold,
    fontSize:Fonts.size.sm
  }

  return (
    
    <TouchableOpacity onPress={onAction} style={[style,{
        backgroundColor: isItemAddedToCart ? theme.primary : theme.teritary,
        width:'100%',
        paddingVertical:10,
        marginVertical:10,
        borderRadius:14,
        alignItems:"center"
    }]}
    >
        <Text style={textConfig}>{title}</Text>
    </TouchableOpacity>

  )
}

export default AddToCartButton

const styles = StyleSheet.create({


})