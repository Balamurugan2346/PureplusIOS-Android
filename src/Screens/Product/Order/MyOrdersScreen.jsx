import { useAppContext } from '../../../Context/AppContext';
import { useTheme } from '../../../Context/ThemeContext';
import Fonts from '../../../../assets/fonts/Fonts';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import OrderItem from '../../../Components/OrderItem';
import TopAppBar from '../../../Components/TopAppBar';

const MyOrdersScreen = ({ navigation }) => {


  const insets = useSafeAreaInsets();
  const { addToCart, cart, reduceQuantity, removeFromCart, usersAddress } = useAppContext()
  const { theme } = useTheme()

  const headerConfig = {
    color: theme.greyText,
    fontFamily: Fonts.family.regular,
    fontSize: Fonts.size.base
  }



  return (
    <View style={[styles.container, { backgroundColor: theme.secondaryBackground }]}>
      <TopAppBar navigation={navigation} title='My Orders' />

      <ScrollView style={{ marginTop: 10 ,marginBottom:insets.bottom }}>
        <Text style={[headerConfig,{paddingLeft:15}]}>Total Orders : 5</Text>
        <OrderItem onItemClick={() => navigation.navigate('OrderDetailedScreen')} status='C' />
        <OrderItem onItemClick={() => navigation.navigate('OrderDetailedScreen')} status='CO'/>
        <OrderItem onItemClick={() => navigation.navigate('OrderDetailedScreen')}  status='P'/>
        {/* <OrderItem onItemClick={() => navigation.navigate('OrderDetailedScreen')}  status='CO'/>
        <OrderItem onItemClick={() => navigation.navigate('OrderDetailedScreen')}  status='P'/> */}

      </ScrollView>


    </View>
  )
}

export default MyOrdersScreen

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})