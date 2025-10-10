import AppButton from '../../Components/AppButton';
import Fonts from '../../../assets/fonts/Fonts';
import { useMemo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../Context/ThemeContext';
const LoginOrRegister = ({navigation}) => {

  const { theme, isDark, toggleTheme } = useTheme()


  const textConfig = useMemo(() => ({
    color: theme.highlightedText,
    fontFamily: Fonts.family.medium,
    fontSize: Fonts.size.xxxl,
    paddingLeft:10
  }), [theme]);

  return (
    <View style={[styles.container, { backgroundColor: theme.primary }]}>
      <View style={[styles.head, { backgroundColor: theme.primary }]}>

      </View>
      <View style={[styles.body, { backgroundColor: "#FFFFFF" }]}>
        <View style={styles.logo}>
          <Image source={require(('../../../assets/images/logoDesign.png'))} />
          <Text style={textConfig}>Pure plus</Text>
        
        </View>
        <View style={styles.buttons}>
   <AppButton onAction={() => {
            navigation.navigate('Login')
          }} title={"Login"} />
          <AppButton borderOnly={true} onAction={() => {
            navigation.navigate('Signup')
          }} title={"Register"} />
        </View>
       
      </View>
    </View>
  )
}

export default LoginOrRegister

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  head: {
    flex: 1
  },
  body: {
    flex: 4,
    padding:24,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    alignItems: "center",
    justifyContent: "space-around"
  },
  logo: {
    flexDirection: "row"
  },
  buttons:{
    width:"100%",
    flexDirection:"column"
  }
})