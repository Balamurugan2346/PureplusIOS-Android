import BottomSheet from '../../Components/BottomSheet';
import Fonts from '../../../assets/fonts/Fonts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useEffect, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
import { useDispatch, useSelector } from 'react-redux';
import { useUserId } from '../../customHooks/useUserID'
import { clearCart, loadCartItems, addToCart, updateCart } from '../../Redux/Slices/CartSlice';
import { getSelectedAddressId } from '../../Utils/GetSelectedAddress';
const CartScreen = ({ navigation }) => {



  const insets = useSafeAreaInsets();
  const { isBottomBarVisible } = useAppContext()
  const { cartItems, loading: cartLoading, error: cartError, isFetched: cartIsFetched } = useSelector((state) => state.cart)
  //ADDRESS LIST
  const { addressList } = useSelector((state) => state.address)
  //LOCATIONS + GEOCODING API DATA  
  const { error: LocationError, display_name, address: DetailedAddress, isFetched: isLocationApiFetched, currentLocationAddressFetched, currentLocationFormattedAddress, entireGEOData, loading: isGEOcodingApiLoading } = useSelector((state) => state.locations)
  const { theme } = useTheme()
  const [showAddressBottomSheet, setShowAddressBottomSheet] = useState(false)
  //USER PROFILE
  const { error: ProfileError, loading: profileLoading, isFetched: isProfileApiFetched, profileData } = useSelector((state) => state.profile)
  const dispatch = useDispatch()
  const { userId, loading: userIDLoading } = useUserId();

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


  const [selectedAddress, setSelectedAddress] = useState(null);
  const [receiversDetails, setReceiversDetails] = useState(null)
  const [refreshing, setRefreshing] = useState(false);
  //  useState({
  //   receiverName:'',
  //   receiverNumber:'',
  //   receiversAddress:''
  // })

  const getAddressFromStateList = async () => {
    const id = await getSelectedAddressId();

    if (!addressList?.length) return;

    const matched = addressList.find(addr => addr.id == id);

    if (matched) {
      setSelectedAddress(
        `${matched.addressLine1 ?? ''} ${matched.addressLine2 ?? ''}`.trim()
      );

      setReceiversDetails({
        receiverName: matched.receiverName ?? '',
        receiverNumber: matched.receiverNumber ?? '',
      });
    } else {
      // setSelectedAddress(currentLocationFormattedAddress ?? null); no need to store location part in address
      setSelectedAddress(null)
      setReceiversDetails(null);
    }
  };

  const isOrderForSelf = (() => {
    if (!receiversDetails) return true;

    const receiverName = receiversDetails.receiverName
      ?.trim()
      .normalize("NFC")
      .toLowerCase();

    const profileName = profileData?.fullName
      ?.trim()
      .normalize("NFC")
      .toLowerCase();

    if (receiversDetails.receiverNumber?.trim()) return false;

    console.log("receiverName:", `"${receiverName}"`);
    console.log("profileName:", `"${profileName}"`);
    console.log("name match", receiverName === profileName);

    return receiverName === profileName;
  })();



  const displayReceiverName = isOrderForSelf
    ? profileData?.fullName
    : receiversDetails?.receiverName || profileData?.fullName;



  const synCCart = () => {
    // dispatch(clearCart()) no need its weird when seeing white screen when syncing even there is data 
    dispatch(loadCartItems(userId))
  }

  //API CALL
  useEffect(() => {
    if (!userIDLoading) {
      synCCart()
    }
  }, [userIDLoading])


  useEffect(() => {
    getAddressFromStateList()
  }, [currentLocationFormattedAddress])


  const handleRefresh = () => {
    setRefreshing(true);
    synCCart()
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.secondaryBackground, paddingBottom: isBottomBarVisible ? 0 : insets.bottom }]}>


      {/* topbar */}
      <TopAppBar title='My Cart' navigation={navigation} />



      {/* content */}
      {cartItems && cartItems.length > 0 ? (
        <ScrollView refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }>

          {/* coupon ui */}
          <ViewCoupon navigation={navigation} />

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

            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ backgroundColor: "lightgreen", borderRadius: 10, width: 40, height: 40, alignItems: "center", justifyContent: "center" }}>

                  <View style={{ backgroundColor: "white", width: 25, height: 25, borderRadius: 30, justifyContent: "center", alignItems: "center" }}>
                    <Ionicons name='time' color={"lightgreen"} size={20} />
                  </View>
                </View>

                <Text style={[headerConfig, { fontFamily: Fonts.family.bold, fontSize: Fonts.size.xs, marginLeft: 10, marginBottom: 7 }]}>You can shedule for later</Text>
              </View>


              <Pressable onPress={() => {
                navigation.navigate('SheduleOrderScreen')
              }} style={{ backgroundColor: "#FFF59D", borderRadius: 20, alignItems: "center", justifyContent: "center" }}>

                <View style={{ flexDirection: "row", paddingHorizontal: 10, paddingVertical: 5, justifyContent: "center" }}>
                  <Ionicons name='time' color={"#FDD835"} size={20} />
                  <Text style={[{ marginLeft: 3, color: "#5D4037", fontFamily: Fonts.family.regular }]}>Shedule</Text>
                </View>

              </Pressable>

            </View>






            {/* cart items */}
            <View>
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  cartItem={item}
                />
              ))}

            </View>
          </LinearGradient>
          {/* {selectedAddress && ( */}
          <PaymentWithAddressBar displayName={displayReceiverName} receiversDetails={receiversDetails} isOrderForSelf={isOrderForSelf} address={selectedAddress} navigation={navigation} showBottomSheet={() => setShowAddressBottomSheet(true)} />
          {/* )} */}

          {/* bill summary */}
          <OrderSummary />

          {/* payment button */}
          <PaymentSection navigation={navigation} />
        </ScrollView>
      ) : (
        cartIsFetched && (
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
        )

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
