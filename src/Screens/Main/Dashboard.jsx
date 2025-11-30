import BottomSheet from '../../Components/BottomSheet';
import { useAppContext } from '../../Context/AppContext';
import { useTabBarVisibility } from '../../Context/BottomBarContext';
import { useTheme } from '../../Context/ThemeContext';
import { clearBanners, loadBanners } from '../../Redux/Slices/BannerSlice';
import { clearDecodedAddress, decodeAddress } from '../../Redux/Slices/LocationSlice';
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


  const insets = useSafeAreaInsets()

  const [refreshing, setRefreshing] = React.useState(false);



  const dispatch = useDispatch();
  const { list, loading, error, isFetched: isBannerFetched } = useSelector((state) => state.banners);


  //LOCATIONS + GEOCODING API LOGIC
  const {error : LocationError,display_name,address:DetailedAddress,isFetched : isLocationApiFetched,entireGEOData,loading:isGEOcodingApiLoading} = useSelector((state)=>state.locations)

    const [refreshLocation, setRefreshLocation] = useState(false);
  const [coords, setCoords] = useState(null);
  const [isLocationFetching, setIsLocationFetching] = useState(false);

  const refreshLocation1 = async () => {
    try {
      setIsLocationFetching(true)
      const pos = await fetchCurrentLocation();
      if(pos){
        console.log("before sending to api","lat",pos.latitude,"lonh",pos.longitude)
       dispatch(decodeAddress({ lat: pos.latitude, long: pos.longitude }));
      }
      console.log("position", pos)
      setCoords(pos);
    } finally {
      setIsLocationFetching(false)
    }
  };

  useEffect(() => {
    console.log("running....")
    refreshLocation1()
  }, [refreshLocation]);



  const {
    productList,
    loading: productsLoading,
    error: productError,
    isFetched: isProductsFetched
  } = useSelector((state) => state.products)



  //INITAL API CALLS WHEN THE DASHBOARD RENDERS 
  useEffect(() => {
    if (!isProductsFetched) {
      dispatch(loadProducts())
      // console.log("APICALL PRODUCTS triggered");
      // console.log("product list ", productList)
    }
  }, [isProductsFetched, dispatch])

  useEffect(() => {
    if (!isBannerFetched) {
      // console.log("APICALL BANNER triggered");
      dispatch(loadBanners());
      // console.log("product list ", list)
    }
  }, [dispatch, isBannerFetched]); // 🔹 only run on mount




  const [showAddressBottomSheet, setShowAddressBottomSheet] = useState(false)


  const shadow = {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 80,
  }

  const { theme, toggleTheme, isDark } = useTheme();

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

  const { setIsTabBarVisible, isTabBarVisible } = useTabBarVisibility();

  //this state is for to show the dialog
  const [isDialogVisible, setIsDialogVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0);
  const [showBottomSheet, setShowBottomSheet] = useState(false)
  const [bottomSheetProductDetailsData, setBottomSheetProductDetailsData] = useState(null)


  const onScroll = useScrollDirection((direction) => {
    if (direction === 'down') setIsTabBarVisible(false);
    else setIsTabBarVisible(true);
  });


  useEffect(() => {
    if (!isDialogVisibleAtOnce) {
      setIsDialogVisible(true)
      setIsDialogVisibleAtOnce(true)
    }

  }, [])

  useEffect(() => {
    if (showAddressBottomSheet) {
      console.log("close this")
      setIsTabBarVisible(false)
    }
  }, [showAddressBottomSheet])




  const handleRefresh = () => {
    console.log("reloading...")
    dispatch(clearProducts())
    dispatch(clearBanners())
    setRefreshing(true);
    dispatch(loadBanners())
    dispatch(loadProducts())
    setRefreshLocation(prev => !prev)
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }


  //for only logs 
  // useEffect(() => {
  //   console.log("banners", list)
  //   console.log("products list", productList)
  // }, [list, productList])



  const isAddressBarLoading  = (isGEOcodingApiLoading || isLocationFetching) 
 

  return (
    <View
      style={[styles.container, { backgroundColor: theme.secondaryBackground }]}
    >

     {/* {isLocationFetching && (
            <AppLoading isVisible={isLocationFetching}/>
          )} */}

      {isDialogVisible && <CustomDialog visible={isDialogVisible} setVisible={setIsDialogVisible} />}

      <StatusBar />

      {/* === Header === */}
      <ScrollView onScroll={onScroll} refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }>


        <View style={[styles.header, { backgroundColor: theme.background, paddingTop: insets.top + 10 }, shadow]}>
          <View style={styles.topAppBar}>
            <TouchableOpacity style={{}} onPress={() => navigation.navigate('ProfileScreen')}>
              <Image source={require('../../../assets/images/person.png')} style={{ width: 30, height: 30, borderRadius: 30 }} />
            </TouchableOpacity>

            <Text style={titleConfig}>Pure Plus</Text>
            <TouchableOpacity>
              <View>
                <Ionicons name="notifications-outline" size={26} color="#000" style={{ color: theme.text }} />
                <View style={{ backgroundColor: "red", alignItems: "center", borderRadius: 50, position: "absolute", alignSelf: "flex-end", marginTop: -6, marginRight: -6 }}>
                  <Text style={{ color: "white", fontSize: 8, padding: 4, paddingHorizontal: 8 }}>1</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <Text style={[headerConfig, { marginTop: 10 }]}>Delivery within <Text style={titleConfig}>5 mins</Text></Text>

          <AddressBar  onClick={() => setShowAddressBottomSheet(true)} address={isAddressBarLoading ? "Loading...." : display_name ? display_name : "Not fetched Please refresh"} />
        </View>

        {/* === Carousel === */}
        <View style={styles.carouselSection}>

          {/* === Loading Shimmer === */}
          {/* {loading && (
            <View style={{ flexDirection: "row", marginBottom: 10 }}>
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                shimmerColors={['#F3F3F980', '#ccd9e990', '#F3F3F980']}
                style={{
                  height: 150,
                  width: 200,
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
                  width: 200,
                  borderRadius: 12,
                  marginHorizontal: 10,
                  backgroundColor: '#F3F3F980'
                }}
              />
            </View>
          )} */}

          {/* === Error State === */}
          {/* {error && !loading && (
            <View style={{ alignSelf: "center", marginBottom: 10 }}>
              <Text style={[headerConfig, { color: theme.error, fontFamily: Fonts.family.regular }]}>
                Couldn’t load banners
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: theme.error,
                  borderRadius: 10,
                  padding: 10,
                  alignSelf: "center",
                  marginTop: 10
                }}
                onPress={() => {
                  dispatch(clearBanners())
                  dispatch(loadBanners())
                }}
              >
                <Text style={[headerConfig, { color: theme.buttonText }]}>Retry</Text>
              </TouchableOpacity>
            </View>
          )} */}

          {/* === No Data State === */}
          {/* {isBannerFetched && !error && list.length === 0 && (
            <Text style={[headerConfig, { alignSelf: "center", margin: 10 }]}>
            </Text>
          )} */}

          {/* === Data State === */}
          {/* {isBannerFetched && !error && list.length > 0 && ( */}

          
          <View style={styles.carouselContainer}>
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
              {bannerData.map((item, index) => (
                <Banner
                  key={index}
                  description={item.description}
                  title={item.title}
                  img={item.image}
                />
              ))}
            </ScrollView>

            <Button title='press' onPress={() => {
              refreshLocation1()
            }} />

            {/* === Indicators === */}
            <View style={styles.indicatorContainer}>
              {bannerData.map((_, index) => (
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
          {/* )} */}
        </View>





        {/*<View style={styles.suggestedWareHouseContainer}>
          <View style={{ flexDirection: "row", flex: 1, justifyContent: "space-between", paddingHorizontal: 10 }}>
            <HighLightedText text={"Suggested suppliers"} style={{ color: theme.background }} />
            <UnderLinedText text={"View All"} />
          </View>
          
          sort by filter
          <View style={{flexDirection:"row",paddingHorizontal:10,alignItems:"center"}}>
             <RegularText text={"Sort by"} style={{ color: theme.background }} />
         {filterTags.suggested.map((tag,index)=>(
            <FilterTag text={tag} key={index}/>
          ))}
          </View>
 
          <View >
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {suggestedWarehouseList.map((warehouse, index) => (
                <WarehouseCard warehouse={warehouse} key={warehouse.id} />
              ))}
            </ScrollView>

          </View>

        </View> */}

        {/* <View style={styles.warehouseContainer}>
          <View style={{ flexDirection: "row", flex: 1, justifyContent: "space-between", paddingHorizontal: 10 }}>
            <HighLightedText text={"Our suppliers"} style={{ color: theme.background }} />
            <UnderLinedText text={"View All"} />
          </View>
          <View style={{alignSelf:"flex-end",flexDirection:"row",paddingHorizontal:10,alignItems:"center"}}>
             <RegularText text={"Sort by"} style={{ color: theme.background }} />
         {filterTags.suggested.map((tag,index)=>(
            <FilterTag text={tag} key={index}/>
          ))}
          </View>
          <View >
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {warehouses.map((warehouse, index) => (
                <WarehouseCard warehouse={warehouse} key={warehouse.id} />
              ))}
            </ScrollView>
          </View>

        </View> */}

        <View style={{ flexDirection: 'row', justifyContent: "space-around", marginHorizontal: 15 }}>

          {TagData.map((item, index) => (
            <Tag key={item.id} icon={item.icon} title={item.title} badgeNeed={item.badgeNeed} onPress={() => {
              if (item.id == 1) {
                navigation.navigate(item.routeName)
              }
            }} />
          ))}
        </View>

        <OrderTracking title={"Track Your current Order"} description={"Arriving in 4 mins"} img={require('../../../assets/images/person.png')} />



        {/* product section */}
        <View style={[styles.productSection]}>
          <Text style={[textConfig, { paddingVertical: 5 }]}>Our products</Text>

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
            {products.map((product, index) => (

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
                onPress={() =>
                  navigation.navigate("DetailedProductScreen", { product })
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





        <AppAdvertiseMent />


      </ScrollView>

      {cart.length > 0 && <ViewCartButton navigation={navigation} cart={cart} />}

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
