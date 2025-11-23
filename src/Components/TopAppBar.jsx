import Fonts from '../../assets/fonts/Fonts';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppNavButton from '../Components/AppNavButton';
import { useAppContext } from '../Context/AppContext';
import { useTheme } from '../Context/ThemeContext';

const TopAppBar = ({title="Default",style,navigation}) => {

    
  const insets = useSafeAreaInsets();
  const { addToCart, cart, reduceQuantity, removeFromCart, usersAddress , isBottomBarVisible } = useAppContext()
  const { theme } = useTheme()

 const padAmount = {
    paddingBottom : isBottomBarVisible ? 10 : 20
 }
  
  const headerConfig = {
    color: theme.greyText,
    fontFamily: Fonts.family.semiBold,
    fontSize: Fonts.size.lg
  }

  const paratextConfig = {
    color: theme.secondaryText,
    fontFamily: Fonts.family.medium,
    fontSize: Fonts.size.xs
  }

    return (
        <View style={[styles.topBar, style =  { backgroundColor: theme.background, paddingTop: insets.top }]}>
            <View style={{ flexDirection: "row",alignItems:"center" }}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                >
                    <AppNavButton color={theme.secondary} />
                </TouchableOpacity>
                <Text style={[headerConfig, { marginLeft: 20, color: "white" }]}>{title}</Text>
            </View>

        </View>
    )
}

export default TopAppBar

const styles = StyleSheet.create({
    topBar: {
        flexDirection: "row",
        paddingHorizontal: 20,
        height: "13%",
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30
    },

    
})