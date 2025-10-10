import { useTabBarVisibility } from '../../Context/BottomBarContext';
import Fonts from '../../../assets/fonts/Fonts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../Context/ThemeContext';
const ViewCartButton = ({cart,navigation}) => {

  const { theme, toggleTheme } = useTheme();

  const insets = useSafeAreaInsets()
   const { isTabBarVisible } = useTabBarVisibility();

  const headerConfig = {
    color: theme.buttonText,
    fontFamily: Fonts.family.semiBold,
    fontSize: Fonts.size.sm
  }

  const paraconfig = {
    color: theme.buttonText,
    fontFamily: Fonts.family.semiBold,
    fontSize: Fonts.size.xs
  }

  return (
    <TouchableOpacity onPress={()=>navigation.navigate('CartScreen')} style={[styles.container, { backgroundColor: theme.primary ,marginBottom:insets.bottom }]}>
      <Image source={require('../../../assets/images/cart.png')} tintColor={theme.buttonText} style={styles.icon} />

      <View style={styles.items}>
        <Text style={[headerConfig, { paddingHorizontal: 7 }]}>View Cart</Text>
        <Text style={paraconfig}>{`${cart.length > 1 ? `${cart.length} items` : `${cart.length} item`}`}</Text>
      </View>
      <Ionicons name='arrow-forward-sharp' color={theme.buttonText} size={20} />

    </TouchableOpacity>
  )
}

export default ViewCartButton

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
    flexDirection: "row",
    left: "30%",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 10,
    position: "absolute",
    bottom: "2%",
    elevation: 90
  },
  icon: {
    width: 30,
    height: 30,

  },
  items: {
    justifyContent: "center",
    alignItems: "center"
  }
})