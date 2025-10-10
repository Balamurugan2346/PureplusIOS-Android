import Fonts from '../../assets/fonts/Fonts';
import { Dimensions, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../Context/ThemeContext';

const SmallButton = ({title,onAction,borderOnly=false,style}) => {
 const { theme, toggleTheme } = useTheme();
const { width } = Dimensions.get('window');
console.log("width",width)

  const textConfig = {
    color: borderOnly ? theme.highlightedText : theme.buttonText ,
    fontFamily:Fonts.family.semiBold,
    fontSize:Fonts.size.sm
  }

  return (
    
    <TouchableOpacity onPress={onAction} style={[{
        backgroundColor: borderOnly ? theme.background: theme.primary,
        width:'100%',
        padding:5,
        marginVertical:10,
        borderWidth:borderOnly ? 1 : 0,
        borderColor:borderOnly ? theme.highlightedText : "",
        borderRadius:14,
        alignItems:"center"
    },style]}
    >
        <Text style={textConfig}>{title}</Text>
    </TouchableOpacity>

  )
}

export default SmallButton

const styles = StyleSheet.create({})