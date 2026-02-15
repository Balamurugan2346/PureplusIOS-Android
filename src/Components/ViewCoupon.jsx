import Fonts from '../../assets/fonts/Fonts'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { useTheme } from '../Context/ThemeContext'

const ViewCoupon = ({ navigation }) => {


  const { theme } = useTheme()

  const headerConfig = {
    color: theme.background,
    fontFamily: Fonts.family.regular,
    fontSize: Fonts.size.sm
  }

  return (
    <TouchableOpacity onPress={() => {
      // navigation.navigate('SheduleOrderScreen')
    }} style={{
      flexDirection: "row",
      justifyContent: "space-between",
      margin: 10,
      // backgroundColor:"lightgreen",
      alignItems: "center",
      paddingHorizontal: 10,
      borderRadius: 10,
      paddingVertical: 10,
      borderWidth: 0.5

    }}>
      <Image style={{ width: 30, height: 30 }} source={require('../../assets/images/discount.png')} />
      <Text style={headerConfig}>View Coupon & offers</Text>
      <Ionicons name='arrow-forward-sharp' size={20} />
    </TouchableOpacity>
  )
}

export default ViewCoupon

const styles = StyleSheet.create({})