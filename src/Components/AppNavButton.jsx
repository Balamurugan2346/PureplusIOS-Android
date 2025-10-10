import { Image, StyleSheet, View } from 'react-native';
import { useTheme } from '../Context/ThemeContext';

const AppNavButton = ({isback=true,color,style}) => {
    const { theme, toggleTheme } = useTheme();
  return (
    <View style={[{
        backgroundColor:color ? color : theme.background,
        borderRadius:12,
        padding:10
    },style]}>
      <Image source={require("../../assets/images/back_arrow.png")}  width={50} height={50}/>
    </View>
  )
}

export default AppNavButton

const styles = StyleSheet.create({


})