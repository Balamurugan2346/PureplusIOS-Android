import BottomSheet from '../../Components/BottomSheet';
import { useAppContext } from '../../Context/AppContext';
import { useTabBarVisibility } from '../../Context/BottomBarContext';
import { useTheme } from '../../Context/ThemeContext';
import { clearBanners, clearCustomerSupportDetails, loadBanners, loadCustomerSupportDetails } from '../../Redux/Slices/BannerSlice';
import { clearProfileState, getUserProfile } from '../../Redux/Slices/ProfileSlice'
import { clearDecodedAddress, decodeAddress, decodeCurrentLocationAddress } from '../../Redux/Slices/LocationSlice';
import { clearProducts, loadProducts } from '../../Redux/Slices/ProductsSlice';
import Fonts from '../../../assets/fonts/Fonts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  AppState,
  Button,
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AddressBar from '../../Components/AddressBar';
import AppAdvertiseMent from '../../Components/AppAdvertiseMent';
import Banner from '../../Components/Banner';
import ViewCartButton from '../../Components/Cart/ViewCartButton';
import CustomDialog from '../../Components/CustomDialog';
import OrderTracking from '../../Components/OrderTracking';
import Product from '../../Components/Product/ProductCard1';
import Tag from '../../Components/Tag';
import useScrollDirection from '../../Components/UseScrollDirection';
import { TagData } from '../../Data/TagData';
import AddressScreen from '../Address/AddressScreen';
import ProductCardRect from '../../Components/Product/ProductCardRect'
import OrderTimeline from '../../Components/OrderTracking/OrderTimeLIne'
import ProductCard1 from '../../Components/Product/ProductCard1';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchCurrentLocation } from '../../Utils/LocationUtil';
import AppLoading from '../../Components/AppLoading';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { useToast } from '../../Components/Toast/ToastProvider';
import { clearDataBeforeLogout, getData, removeData } from '../../OfflineStore/OfflineStore';
import { clearAddressState, getAddressList } from '../../Redux/Slices/AddressSlice';
import { getSelectedAddressId } from '../../Utils/GetSelectedAddress';
import { clearCart, loadCartItems } from '../../Redux/Slices/CartSlice';
import { logout } from '../../Redux/LogoutActions';
import { requestNotificationPermission } from '../../Utils/NotificationUtils';
import { getFcmToken } from '../../Utils/FirebaseUtils';
import { getCurrentOrder } from '../../Redux/Slices/OrderSlice';
import FirstLetterAvatar from '../../Components/Profile/FirstLetterAvatar';
import { resolveServiceability } from '../../Redux/Slices/ServiceabilitySlice';
import UnserviceableArea from '../../Components/UnserviceableArea';

// Placeholder Carousel Data
const bannerData = [
  {
    id: '1',
    image: require('../../../assets/images/canBusinessLogic.png'),
    title: "Minimum Quantity!",
    description: "1 unit = 4 water can"
  },
  {
    id: '2',
    image: require('../../../assets/images/deliveryPersonRiding.png'),
    title: "Latest News",
    description: "If in case delivery person late, no need to pay for the delivery charge"
  },
  {
    id: '3',
    image: require('../../../assets/images/UsernameBG.png'),
    title: "100% Purity Guaranteed",
    description: "Our water is tested and certified for your family's health and safety."
  }
];

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.8;

const Dashboard = ({ navigation }) => {


  //UI LOGIC
  const { theme, toggleTheme, isDark } = useTheme();
  const { showToast } = useToast()

  const headerConfig = {
    color: theme.text,
    fontFamily: Fonts.family.semiBold,
    fontSize: Fonts.size.sm
  }

  const textConfig = {
    fontFamily: Fonts.family.semiBold,
    fontSize: Fonts.size.base
  }

  const titleConfig = {
    color: theme.text,
    fontFamily: Fonts.family.semiBold,
    fontSize: Fonts.size.lg
  }

  const shadow = {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 80,
  }

  const {
    isDialogVisibleAtOnce,
    setIsDialogVisibleAtOnce,
    products,
    currentLocation,
    setCurrentLocation,
    setProducts,
    cart,
    usersAddress,
    setCart,
    warehouses,
    setWareHouses,
    suggestedWarehouseList
  } = useAppContext()



  const insets = useSafeAreaInsets()

  const [refreshing, setRefreshing] = React.useState(false);
  const [refreshLocation, setRefreshLocation] = useState(false);
  const [coords, setCoords] = useState(null);
  const [isLocationFetching, setIsLocationFetching] = useState(false);
  const [showAddressBottomSheet, setShowAddressBottomSheet] = useState(false)
  //this state is for to show the dialog
  const [isDialogVisible, setIsDialogVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0);
  const [showBottomSheet, setShowBottomSheet] = useState(false)
  const [bottomSheetProductDetailsData, setBottomSheetProductDetailsData] = useState(null)
  const [userID, setUserID] = useState(-1)
  const [displayAddress, setDisplayAddress] = useState(null)

  //REDUX
  const dispatch = useDispatch();
  //BANNERS API DATA
  const { list, loading, error, isFetched: isBannerFetched, isCustomerSupportFetched, iscustomerSupportLoading } = useSelector((state) => state.banners);
  //PRODUCTS API DATA
  const { productList, loading: productsLoading, error: productError, isFetched: isProductsFetched } = useSelector((state) => state.products)
  //LOCATIONS + GEOCODING API DATA  
  const { error: LocationError, display_name, address: DetailedAddress, isFetched: isLocationApiFetched, currentLocationAddressFetched, currentLocationFormattedAddress, entireGEOData, loading: isGEOcodingApiLoading } = useSelector((state) => state.locations)
  //USER PROFILE
  const { error: ProfileError, loading: profileLoading, isFetched: isProfileApiFetched, profileData } = useSelector((state) => state.profile)

  //ADDRESS LIST
  const { addressList } = useSelector((state) => state.address)

  const { cartItems, loading: cartLoading, error: cartError, isFetched: cartIsFetched, cartUpdateLoading } = useSelector((state) => state.cart)


  const { currentOrder } = useSelector((state) => state.order)

  //SERVICEABILITY (CUS-07): the selected delivery address's pincode decides which
  //store's catalog is shown, or "not serviceable". serviceable===false hides products.
  const {
    checked: svcChecked,
    serviceable,
    reason: svcReason,
    storeName: svcStoreName,
    pincode: svcPincode,
  } = useSelector((state) => state.serviceability)


  //FETCHING LOCATION ALSO GET DECODED ADDRESS FROM PROVIDER(GEOAPIFY.COM)
  const refreshLocation1 = async () => {
    try {
      setIsLocationFetching(true)
      const pos = await fetchCurrentLocation();
      console.log("pos", pos)
      if (pos) {
        setCurrentLocation({
          lat: pos.latitude,
          long: pos.longitude,
          displayAddress: ""
        })
        if (!isLocationApiFetched) {
          dispatch(decodeAddress({ lat: pos.latitude, long: pos.longitude }));
          console.log("before sending to api", "lat", pos.latitude, "lonh", pos.longitude)
        }
        if (!currentLocationAddressFetched) {
          dispatch(decodeCurrentLocationAddress({ lat: pos.latitude, long: pos.longitude }))
        }
      }
      // console.log("position", pos)
      setCoords(pos);
    } finally {
      setIsLocationFetching(false)
    }
  };

  useEffect(() => {
    getFcmToken()
    requestNotificationPermission()
  }, [])

  useEffect(() => {
    // console.log("running....")
    refreshLocation1()
  }, [refreshLocation]);


  useEffect(() => {
    const loadUserId = async () => {
      const storedId = await getData('userID');
      const parsed = Number(storedId);
      setUserID(isNaN(parsed) ? -1 : parsed);
    };
    loadUserId();
  }, []);

  //INITIAL API CALLS WHEN THE DASHBOARD RENDERS 
  const syncAddress = () => {
    dispatch(clearAddressState())
    dispatch(getAddressList())
  }

  const synCCart = () => {
    dispatch(clearCart())
    dispatch(loadCartItems(userID))
  }

  useEffect(() => {
    if (userID === -1) return;
    syncAddress();
    synCCart()
  }, [userID, refreshing]);


  useEffect(() => {
    if (!isProductsFetched) {
      dispatch(loadProducts());
    }
  }, [dispatch, isProductsFetched]);

  useEffect(() => {
    if (!isBannerFetched) {
      dispatch(loadBanners());
    }
  }, [dispatch, isBannerFetched]); // 🔹 only run on mount


  useEffect(() => {
    //call any time 
    dispatch(getCurrentOrder({
      onSuccess: () => {

      },
      onError: () => {

      }
    }))
  }, [dispatch])

  useEffect(() => {
    if (!isProfileApiFetched) {
      dispatch(getUserProfile());
    }
  }, [dispatch, isProfileApiFetched]); // 🔹 only run on mount

  // useEffect(() => {
  //   if (!isCustomerSupportFetched) {
  //     dispatch(loadCustomerSupportDetails());
  //   }
  // }, [dispatch, isCustomerSupportFetched]); // 🔹 only run on mount


  useEffect(() => {
    // console.log("profileData", profileData)
  }, [profileData])

  //change this dialog later once
  useEffect(() => {
    if (!isDialogVisibleAtOnce) {
      setIsDialogVisible(true)
      setIsDialogVisibleAtOnce(true)
    }
  }, [])

  const getAddressFromStateList = async () => {
    const id = await getSelectedAddressId();
    if (addressList) {
      const matched = addressList.find((address) => address.id == id);
      if (matched) {
        setDisplayAddress(`${matched.addressLine1}, ${matched.addressLine2}`)
        // Resolve serviceability for the SELECTED delivery address's pincode. Changing the
        // address (incl. a receiver's address for someone else) re-runs this and swaps the
        // catalog / unserviceable state. Backend field is `pincode`; forms use `pinCode`.
        const pin = matched.pincode ?? matched.pinCode ?? matched.pin_code;
        if (pin) dispatch(resolveServiceability(String(pin).trim()));
      }
    }
  }
  // Re-resolve whenever the address list changes (new/edited/selected address).
  useEffect(() => {
    getAddressFromStateList()
    console.log("called")
  }, [addressList])



  const handleRefresh = () => {
    // console.log("reloading...")
    setRefreshing(true);
    dispatch(clearProducts())
    dispatch(clearBanners())
    dispatch(clearProfileState())
    dispatch(clearDecodedAddress())
    dispatch(clearCustomerSupportDetails())

    dispatch(loadBanners())
    dispatch(loadProducts())
    dispatch(loadCustomerSupportDetails())
    dispatch(getUserProfile())
    dispatch(getCurrentOrder({
      onSuccess: () => {

      },
      onError: () => {

      }
    }))
    syncAddress();
    synCCart()
    requestNotificationPermission()
    //need to fetch also address 
    setRefreshLocation(prev => !prev)
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }

  //RENDER UI CONDITION
  const isAddressBarLoading = (isGEOcodingApiLoading || isLocationFetching)

  const dasboardLoading = loading || productsLoading || profileLoading || cartLoading || cartUpdateLoading || iscustomerSupportLoading

  return (
    <View
      style={[styles.container, { backgroundColor: theme.secondaryBackground }]}
    >

      {dasboardLoading && (
        <AppLoading isVisible={dasboardLoading} />
      )}

      {/* //show dialog after demo or remodel the dialog */}
      {/* {isDialogVisible && <CustomDialog visible={isDialogVisible} setVisible={setIsDialogVisible} />} */}

      <StatusBar />

      {/* === Header === */}
      <ScrollView refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }>


        <View style={[styles.header, { backgroundColor: theme.background, paddingTop: insets.top + 10 }, shadow]}>
          <View style={styles.topAppBar}>
            <TouchableOpacity style={{}} onPress={() => {
              if (profileData != null) {
                navigation.navigate('ProfileScreen')
              } else {
                if (profileLoading) return
                showToast("Session expired Please login again to continue!", true)
                clearDataBeforeLogout()
                dispatch(logout());
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Login" }],
                });
              }
            }}>
              {profileData && (
                <FirstLetterAvatar
                  width={30}
                  fontSize={12}
                  height={30}
                  input={profileData?.fullName}
                />
              )}

            </TouchableOpacity>

            <Text style={titleConfig}>Pure Plus</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
              <View>
                <Ionicons name="notifications-outline" size={26} color="#000" style={{ color: theme.text }} />
              </View>
            </TouchableOpacity>
          </View>

          {/* <Text style={[headerConfig, { marginTop: 10 }]}>Delivery within <Text style={titleConfig}>5 mins</Text></Text> */}

          <AddressBar
            onClick={() => setShowAddressBottomSheet(true)}
            address={
              currentLocationFormattedAddress && currentLocationFormattedAddress.trim() !== ""
                ? currentLocationFormattedAddress                      // ← saved display address ALWAYS wins
                : isAddressBarLoading
                  ? "Loading..."                      // ← use loading only when no saved address
                  : display_name
                    ? display_name                    // ← fallback: geocoder result
                    : "Not fetched. Please refresh."  // ← last fallback
            }
          />
        </View>

        {/* === Carousel === */}
        {list && list.length >= 1 && (
          <View style={[styles.carouselContainer]}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              onScroll={(e) => {
                const index = Math.round(
                  e.nativeEvent.contentOffset.x / ITEM_WIDTH
                );
                setActiveIndex(index);
              }}
            >
              {list && list.map((item, index) => (
                <Banner
                  key={index}
                  description={item.bannerDescription}
                  title={item.bannerName}
                  img={item.bannerImageURL}
                />
              ))}
            </ScrollView>
            {/* === Indicators === */}
            <View style={styles.indicatorContainer}>
              {list && list.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicatorDot,
                    { backgroundColor: index === activeIndex ? '#007AFF' : '#ccc' },
                  ]}
                />
              ))}
            </View>
          </View>
        )}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 4 }}
        >
          {TagData.map((item) => (
            <Tag key={item.id} icon={item.icon} title={item.title} badgeNeed={item.badgeNeed} onPress={() => {
              if (item.routeName) {
                navigation.navigate(item.routeName)
              }
            }} />
          ))}
        </ScrollView>





        {/* Unserviceable area: pincode has no serving store -> hide catalog, block ordering. */}
        {svcChecked && serviceable === false ? (
          <UnserviceableArea
            pincode={svcPincode}
            reason={svcReason}
            onChangeAddress={() => setShowAddressBottomSheet(true)}
          />
        ) : (
          /* product section */
          <View style={[styles.productSection]}>
            <Text style={[textConfig, { paddingVertical: 5 }]}>
              Our products{svcStoreName ? ` · ${svcStoreName}` : ''}
            </Text>

            {/* {productsLoading && (
            <View style={{ flexDirection: "row" }}>


              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                shimmerColors={['#F3F3F980', '#ccd9e990', '#F3F3F980']} // smooth light shimmer
                style={{
                  height: 150,
                  width: 100,
                  borderRadius: 12,
                  marginBottom: 12,
                  marginHorizontal: 10,
                  backgroundColor: '#F3F3F980'
                }}
              />

              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                shimmerColors={['#F3F3F980', '#ccd9e990', '#F3F3F980']}
                style={{
                  height: 150,
                  width: 100,
                  borderRadius: 12,
                  marginHorizontal: 10,
                  backgroundColor: '#F3F3F980'
                }}
              />

              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                shimmerColors={['#F3F3F980', '#ccd9e990', '#F3F3F980']}
                style={{
                  height: 150,
                  width: 100,
                  borderRadius: 12,
                  marginHorizontal: 10,
                  backgroundColor: '#F3F3F980'
                }}
              />

              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                shimmerColors={['#F3F3F980', '#ccd9e990', '#F3F3F980']}
                style={{
                  height: 150,
                  width: 100,
                  borderRadius: 12,
                  marginHorizontal: 10,
                  backgroundColor: '#F3F3F980'
                }}
              />
            </View>
          )} */}

            {/* {productError && !productsLoading && (
            <View style={{ alignSelf: "center", }}>
              <Text style={[headerConfig, { color: theme.error, fontFamily: Fonts.family.regular }]}>
                Couldn’t load products
              </Text>
              <TouchableOpacity style={{ backgroundColor: theme.error, borderRadius: 10, padding: 10, alignSelf: "center", marginTop: 10 }} onPress={() => dispatch(loadProducts())}>
                <Text style={[headerConfig, { color: theme.buttonText }]}>Retry</Text>
              </TouchableOpacity>
            </View>
          )} */}
            {/* 
          {isProductsFetched && !productError && productList.length === 0 && (
            <Text style={[headerConfig, { alignSelf: "center", margin: 10 }]}>
              No Products Found
            </Text>
          )} */}

            {/* {isProductsFetched && !productError && productList.length > 0 && ( */}
            <ScrollView
              showsHorizontalScrollIndicator={false}
              horizontal
              style={styles.productGrid}
            >
              {productList.data && productList.data.map((product, index) => (
                // <ProductCardRect
                //   key={index}
                //   category="Soft Drink"
                //   title="Sparkle Cola 300ml"
                //   navigate={() => navigation.navigate("DetailedProductScreen", { product })}
                //   price="$1.50"
                //   onRefillQuantityChange={(q) => Alert.alert(`Cola quantity set to ${q}`)}
                // />
                <ProductCard1
                  key={index}
                  product={product}
                  onPress={() => {
                    if (userID != -1) {
                      navigation.navigate("DetailedProductScreen", { product, userID })
                    }
                  }

                  }
                  onInfoClick={() => {
                    setShowBottomSheet((prev) => !prev);
                    setBottomSheetProductDetailsData(product);
                  }}
                />
              ))}
            </ScrollView>
            {/* )} */}
          </View>
        )}




        <AppAdvertiseMent />


      </ScrollView>

      {currentOrder && (
        <OrderTracking currentOrder={currentOrder} style={{ marginBottom: insets.bottom }} title={"Track Your current Order"} description={`Arriving in ${currentOrder?.data?.eta}`} img={require('../../../assets/images/person.png')} navigation={navigation} />
      )}

      {console.log("cart", cartItems)}
      {!loading && cartIsFetched && cartItems.length > 0 && serviceable !== false && (
        <ViewCartButton navigation={navigation} cart={cartItems} />
      )}


      <BottomSheet
        visible={showAddressBottomSheet}
        onClose={() => setShowAddressBottomSheet(false)}
      >
        <AddressScreen
          navigation={navigation}
          onClose={() => setShowAddressBottomSheet(false)}
          callGetSelectedAddressCallBack={() => {
            dispatch(getAddressList())
          }}
        />
      </BottomSheet>


    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
  },
  warehouseContainer: {

  },
  suggestedWareHouseContainer: {

  },
  header: {
    paddingBottom: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  productSection: {
    margin: 10
  },
  topAppBar: {
    flexDirection: "row",
    justifyContent: 'space-between',
    paddingVertical: 10

  },

  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  carouselContainer: {
    marginBottom: 20,
  },
  carouselImage: {
    width: ITEM_WIDTH,
    height: 160,
    marginHorizontal: 10,
    borderRadius: 20,
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignSelf: "center",
    marginTop: 10,
  },
  indicatorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  productGrid: {
    flexDirection: 'row',
  },
  productBox: {
    width: (width - 48) / 3,
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
