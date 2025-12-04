import AppNavButton from '../../Components/AppNavButton';
import { useTheme } from '../../Context/ThemeContext';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Fonts from '../../../assets/fonts/Fonts';
import AppButton from '../../Components/AppButton';
import AppToast from '../../Components/AppToast';
import { storeData } from '../../OfflineStore/OfflineStore';

const { width } = Dimensions.get('window');

const pages = [
  { title: 'Welcome to Pureplus!', description:"Pureplus brings fresh and safe drinking water right to your doorstep", image: require('../../../assets/images/delivery.png') },
  { title: 'Fast Delivery at Your Doorstep', description:"Get your water delivered in no time! With our lightning-fast delivery service", image: require('../../../assets/images/watercandelivery.png') },
  { title: 'Stay Hydrated Always!', description:"We’re here to keep you refreshed, energized, and hydrated every day.",  image: require('../../../assets/images/DrinkingWater.png') },
];

export default function GetStarted({ navigation }) {
  const insets = useSafeAreaInsets();
  const { theme, toggleTheme , isDark } = useTheme();
  const [showToast, setShowToast] = useState(false);
  const [page, setPage] = useState(0);
  const pagerRef = useRef(null);

  useEffect(() => {
    if (pagerRef.current) {
      pagerRef.current.setPage(page);
    }
  }, [page]);




  const nav =()=>{
    if(page<2){
     setPage((prevPage)=>prevPage + 1)
    }else if(page==2){
      storeData("isGetStartedViewed","1")
      navigation.navigate('Login')
      // setPage(0)
      // setShowToast(true)
    }
  }

  // useEffect(() => {
  //   if (Platform.OS === "android") {
  //     const onBackPress = () => {
  //       setShowToast(true)
  //         return true;
  //     }

  //     const subscription = BackHandler.addEventListener(
  //       'hardwareBackPress',
  //       onBackPress
  //     );

  //     return () => subscription.remove();
  //   }
  // }, [page,navigation]);


const textConfig = useMemo(() => ({
  color: theme.highlightedText,
  fontFamily: Fonts.family.bold,
  fontSize: Fonts.size.lg
}), [theme]);

const paraTextConfig = useMemo(() => ({
  color: theme.text,
  fontFamily: Fonts.family.regular,
  fontSize: Fonts.size.sm
}), [theme]);


const  dot = { width: 10, height: 10, borderRadius: 5, backgroundColor: '#aaa', marginHorizontal: 5 }

const activeDot = { backgroundColor: theme.primary, width: 12, height: 12 }


  return (
  <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
    <StatusBar />
    {showToast && <AppToast  visible={showToast}
        message="Back button Disabled at this moment"
        onHide={() => setShowToast(false)}/>}
  <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom, marginHorizontal: 20 }}>

<TouchableOpacity style={{alignSelf: "flex-start", }} onPress={
  page <=0 ? ()=> {} : ()=>setPage(page -1)
}>
  {/* <Image tintColor={theme.text}   source={arrowLeft} style={{width:40,height:40,alignSelf:"flex-end",opacity:page > 0 ? 100 : 0}} resizeMode='contain' /> */}
    <AppNavButton   color={theme.secondary} style={{opacity:page > 0 ? 100 : 0,marginTop:10}} />
  </TouchableOpacity>
    <PagerView
      ref={pagerRef}
      style={styles.pager}
      initialPage={0}
      onPageSelected={(e) => setPage(e.nativeEvent.position)}
    >
      {pages.map((item, index) => (
        <View key={index} style={styles.page}>
          <Image source={item.image} style={styles.image} resizeMode="contain" />
          <Text style={[textConfig,{textAlign:"center"}]}>{item.title}</Text>
          <Text style={[paraTextConfig,{textAlign:"center",lineHeight:22}]}>{item.description}</Text>
        </View>
      ))}
    </PagerView>

      <AppButton onAction={nav} title={page === 2 ? "Get Started" : "Next"} />


    <View style={styles.indicatorContainer}>
      {pages.map((_, i) => (
        <View key={i} style={[dot, page === i && activeDot]} />
      ))}
    </View>

    <View>
    </View>
  </View>
  {/* <LocationPermissionUI/> */}
</SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center'},
  pager: { flex: 1, width: '100%' },
  page: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  image: { width: width * 0.8, height: 250, marginBottom: 20 },
  indicatorContainer: { flexDirection: 'row', justifyContent: 'center', marginTop:5},
});
