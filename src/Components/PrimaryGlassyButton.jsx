import { Dimensions, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../Context/ThemeContext';

import Fonts from '../../assets/fonts/Fonts';

const PrimaryGlassyButton = ({title,onAction,style}) => {
const { theme, toggleTheme } = useTheme();
const { width } = Dimensions.get('window');
console.log("width",width)

  const textConfig = {
    color:'white',
    fontFamily:Fonts.family.semiBold,
    fontSize:Fonts.size.sm
  }

  return (
    
    <TouchableOpacity onPress={onAction} style={[style,{
        backgroundColor: theme.background,
        alignSelf:"flex-start",
        paddingHorizontal:10,
        borderRadius:10,
        paddingVertical:5,
        alignItems:"center"
    }]}
    >
        <Text style={textConfig}>{title}</Text>
    </TouchableOpacity>

  )
}

export default PrimaryGlassyButton

const styles = StyleSheet.create({


})