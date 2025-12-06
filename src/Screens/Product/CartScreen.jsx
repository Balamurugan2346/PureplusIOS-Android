import BottomSheet from '../../Components/BottomSheet';
import Fonts from '../../../assets/fonts/Fonts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CartItem from '../../Components/Cart/CartItem';
import OrderSummary from '../../Components/Cart/OrderSummary';
import PaymentWithAddressBar from '../../Components/Cart/PayButtonWithAddressBar';
import PaymentSection from '../../Components/Cart/PaymentSection';
import TopAppBar from '../../Components/TopAppBar';
import ViewCoupon from '../../Components/ViewCoupon';
import { useAppContext } from '../../Context/AppContext';
import { useTheme } from '../../Context/ThemeContext';
import AddressScreen from '../Address/AddressScreen';
import { useSelector } from 'react-redux';
const CartScreen = ({ navigation }) => {



  const insets = useSafeAreaInsets();
  const { isBottomBarVisible } = useAppContext()
  const { cartItems, loading: cartLoading, error: cartError, isFetched: cartIsFetched } = useSelector((state) => state.cart)
  const { theme } = useTheme()
  const [showAddressBottomSheet, setShowAddressBottomSheet] = useState(false)
  const headerConfig = {
    color: theme.greyText,
    fontFamily: Fonts.family.regular,
    fontSize: Fonts.size.base
  }

  const paratextConfig = {
    color: theme.secondaryText,
    fontFamily: Fonts.family.medium,
    fontSize: Fonts.size.xs
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.secondaryBackground, paddingBottom: isBottomBarVisible ? 0 : insets.bottom }]}>


      {/* topbar */}
      <TopAppBar title='My Cart' navigation={navigation} />



      {/* content */}
      {cartItems && cartItems.length > 0 ? (
        <ScrollView>

          {/* coupon ui */}
          <ViewCoupon />

          {/* cart items */}
          <LinearGradient
            colors={[theme.cardContainer, theme.cardContainer]}
            style={{
              borderRadius: 20,
              marginHorizontal: 10,
              padding: 10,
            }}
          >
            {/* delivery time ui */}
            <View style={{ flexDirection: "row", alignItems: "center" }}>

              <View style={{ backgroundColor: "lightgreen", borderRadius: 10, width: 40, height: 40, alignItems: "center", justifyContent: "center" }}>

                <View style={{ backgroundColor: "white", width: 25, height: 25, borderRadius: 30, justifyContent: "center", alignItems: "center" }}>
                  <Ionicons name='time' color={"lightgreen"} size={20} />
                </View>
              </View>

              <Text style={[headerConfig, { fontSize: Fonts.size.base, marginLeft: 10, marginBottom: 7 }]}>Delivery within 15 mins</Text>

            </View>


            {/* cart items */}
            <View>
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  product={item}
                  onIncrease={() => handleIncrease(item.id)}
                  onDecrease={() => handleDecrease(item.id)}
                />
              ))}

            </View>
          </LinearGradient>

          <PaymentWithAddressBar navigation={navigation} showBottomSheet={() => setShowAddressBottomSheet(true)} />

          {/* bill summary */}
          <OrderSummary />

          {/* payment button */}
          <PaymentSection navigation={navigation} />
        </ScrollView>
      ) : (
        <View style={{ flexDirection: 'column', alignItems: 'center', paddingVertical: 20 }}>
          <Text style={[paratextConfig, { color: 'black' }]}>No Items in the cart</Text>
          <TouchableOpacity
            style={{
              backgroundColor: theme.background,
              borderRadius: 10,
              paddingHorizontal: 20,
              paddingVertical: 10,
              marginTop: 10,
            }}
            onPress={() => navigation.goBack()}
          >
            <Text style={[paratextConfig, { color: 'white' }]}>Go Back</Text>
          </TouchableOpacity>
        </View>
      )}

      {showAddressBottomSheet && <BottomSheet visible={showAddressBottomSheet} onClose={() => setShowAddressBottomSheet(false)}>
        <AddressScreen navigation={navigation} onClose={() => setShowAddressBottomSheet(false)} />
      </BottomSheet>
      }

    </View>

  );
};

export default CartScreen;

const styles = StyleSheet.create({


  topBar: {
    flexDirection: "row",
    paddingHorizontal: 20,
    height: "13%",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30
  },

  container: {
    flex: 1,
  },

  paymentContainer: {
    borderRadius: 20,
    justifyContent: "center",
    padding: 12,
    margin: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    marginRight: 8,
  },
  paymentText: {

    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  payButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6
  },
});
