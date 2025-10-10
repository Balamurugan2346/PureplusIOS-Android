import AppNavButton from '../../Components/AppNavButton';
import BottomSheet from '../../Components/BottomSheet';
import Line from '../../Components/Line';
import { useAppContext } from '../../Context/AppContext';
import { useTheme } from '../../Context/ThemeContext';
import Fonts from '../../../assets/fonts/Fonts';
import { useRoute } from '@react-navigation/native';
import { useState } from 'react';
import { Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CartButton from '../../Components/Cart/CartButton';
import PerksUI from '../../Components/GlassyPerksContainer';
import AddressScreen from '../../Screens/Address/AddressScreen';

const DetailedProductScreen = ({ navigation }) => {


  //UI LOGIC AND STATE HANDLING 
  const route = useRoute();
  const { product } = route.params;

  // const productID = product.sl_No

  const insets = useSafeAreaInsets()

  const { addToCart, cart, reduceQuantity, removeFromCart, usersAddress, height } = useAppContext()
  const { theme } = useTheme()

  const isInCart = cart.some(item => item.id === product.id);

  const cartItem = cart.find(item => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;


  const [showAddressBottomSheet, setShowAddressBottomSheet] = useState(false)

  const [refreshing, setRefreshing] = useState(false);
  const headerConfig = {
    color: theme.background,
    fontFamily: Fonts.family.semiBold,
    fontSize: Fonts.size.sm
  }

  const paratextConfig = {
    color: theme.secondaryText,
    fontFamily: Fonts.family.medium,
    fontSize: Fonts.size.xs
  }
  const displayTrimmedAddress = (usersAddress) => {
    if (usersAddress) {
      const address = usersAddress.length > 40
        ? usersAddress.substring(0, 40) + '...'
        : usersAddress;
      return address;
    } else {
      return "Address Not found"
    }
  };


  //API CALLS PLUS REFRESH LOGIC
  // const dispatch = useDispatch();

  // const { selectedProduct } = useSelector(state=>state.products)

  const handleRefresh = () => {
    // console.log("reloading...")
    // setRefreshing(true);
    // dispatch(getDetailedProducts(productID))
    // setTimeout(() => {
    //   setRefreshing(false);
    // }, 2000);
  }

  // useEffect(() => {
  //   // dispatch(getDetailedProducts(productID))
  // }, [productID, dispatch])

  // useEffect(()=>{
  //   console.log("selected product",selectedProduct)
  // },[selectedProduct])

  return (
    <View style={[styles.container, { marginBottom: insets.bottom }]}>
      <ScrollView refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }>
        
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ zIndex: 1, position: "absolute", marginVertical: 46, marginHorizontal: 20 }}
        >
          <AppNavButton color={theme.secondary} />
        </TouchableOpacity>

        <View style={{ backgroundColor: theme.inputContainerBorder, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, height: height * 0.4, width: "100%", alignItems: "center" }}>
          <Image source={require('../../../assets/images/30L.png')} style={{ width: 300, height: 300, top: "8%" }} />
        </View>

        <View style={styles.content}>
          {/* order id  */}
          <View style={[styles.cardContainer, { backgroundColor: theme.cardContainer }]}>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={[headerConfig, { color: theme.greyText, fontSize: Fonts.size.base }]}>{product.name}</Text>
              <TouchableOpacity onPress={() => setShowAddressBottomSheet(true)}>
                <Text style={[paratextConfig, { color: theme.card, textDecorationLine: "underline" }]}>Change Address</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={paratextConfig}>{product.description}</Text>
            </View>

            <Line style={{ marginTop: 10, marginBottom: 10 }} />


            <View style={styles.detailsContainer}>
              <View style={{ flexDirection: "column", paddingBottom: 5 }}>
                <Text style={[paratextConfig, { color: theme.secondaryText }]}>{`MRP (incl. of all taxes)`}</Text>
                <Text style={[headerConfig, { color: theme.greyText }]}>{product.price}</Text>
              </View>
              <View style={{ flexDirection: "column", marginVertical: 5 }}>
                <Text style={[paratextConfig, { color: theme.secondaryText }]}>Receiver's Name</Text>
                <Text style={[paratextConfig, { color: theme.greyText }]}>I.Balamurugan</Text>
              </View>
              <View style={{ flexDirection: "column" }}>
                <Text style={[paratextConfig, { color: theme.secondaryText }]}>Receiver's Address</Text>
                <Text style={[paratextConfig, { color: theme.greyText }]}>{displayTrimmedAddress(usersAddress)}</Text>
              </View>
            </View>
            <View style={{ paddingVertical: 5, alignItems: "center" }}>
              <View style={[styles.deliveryTag, {
                marginTop: 3,
                backgroundColor: "#f9f1abff", // light yellow
                borderColor: "#FDD835"
              }]}>
                <Image source={require('../../../assets/images/thunder.png')} style={{ width: 20, height: 20 }} tintColor={"#5D4037"} />
                <Text style={[paratextConfig, { fontFamily: Fonts.family.bold, color: "#5D4037", marginRight: 8 }]}>Estimated Delivery Time : 6 Mins</Text>
              </View>
            </View>

          </View>

          <PerksUI />


        </View>

      </ScrollView>
      <CartButton navigation={navigation} product={product} />


      <BottomSheet
        visible={showAddressBottomSheet}
        onClose={() => setShowAddressBottomSheet(false)}
      >
        <AddressScreen
          navigation={navigation}
          onClose={() => setShowAddressBottomSheet(false)}
        />
      </BottomSheet>

    </View>
  )
}

export default DetailedProductScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 10,
  },
  image: {
    width: "100%",
    height: 300,
  },

  header: {
    backgroundColor: "red"
  },

  addButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0D6EFD',
    borderRadius: 20,
    overflow: 'hidden',
  },
  stepButton: {
    backgroundColor: '#0D6EFD',
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  quantityText: {
    minWidth: 32,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#0D6EFD',
    paddingHorizontal: 8,
  },

  deliveryTag: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginVertical: 5,
    paddingVertical: 2,
    borderRadius: 5,
  },

  cardContainer: {
    borderRadius: 20,
    justifyContent: "center",
    padding: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
})