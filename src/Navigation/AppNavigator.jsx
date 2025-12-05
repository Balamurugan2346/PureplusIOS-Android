import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useAppContext } from '../Context/AppContext';
import { useTheme } from '../Context/ThemeContext';
import DetailedAddressInputScreen from '../Screens/Address/DetailedAddressInputScreen';
import UsersLocationScreen from '../Screens/Address/Location/LocationScreen';
import PrivacyPolicy from '../Screens/Authentication/Documents/PrivacyPolicy';
import Login from "../Screens/Authentication/Login";
import LoginOrRegister from '../Screens/Authentication/LoginOrRegister';
import OtpVerficationScreen from '../Screens/Authentication/OtpVerificationScreen';
import Signup from "../Screens/Authentication/Signup";
import EmailScreen from '../Screens/Authentication/UserProfile/EmainScreen';
import LocationScreen from '../Screens/Authentication/UserProfile/LocationScreen';
import Username from '../Screens/Authentication/UserProfile/UserName';
import GetStarted from '../Screens/GetStarted/GetStarted';
import Dashboard from '../Screens/Main/Dashboard';
import MainBottomNav from '../Screens/Main/MainBottomNav';
import { default as Profile, default as ProfileScreen } from '../Screens/Main/ProfileScreen';
import CartScreen from '../Screens/Product/CartScreen';
import DetailedProductScreen from '../Screens/Product/DetailedProductScreen';
import MyOrdersScreen from '../Screens/Product/Order/MyOrdersScreen';
import OrderDetailedScreen from '../Screens/Product/Order/OrderDetailedScreen';
import ActivityEntry from '../Navigation/ActivityEntry'
import AppEntry from '../Navigation/ActivityEntry';
import EditProfileScreen from '../Screens/Profile/EditProfileScreen'

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { theme, toggleTheme, isDark } = useTheme();
  const {isBottomBarVisible,setIsBottomBarVisible} = useAppContext()
  const colorScheme = isDark ? "light" : "dark"



  return (
    <>

      <Stack.Navigator
        // initialRouteName='GetStarted'
        screenOptions={{

          headerShown: false, // No header by default
        }}
      >
        
          <Stack.Screen name="AppEntry" component={AppEntry} />

         {/* {devloping purpose } */}
        <Stack.Screen name='MainBottomNav' component={MainBottomNav}/>

        {/* Authentication and  onbaord */}
        <Stack.Screen name="GetStarted" component={GetStarted} />
        {/* <Stack.Screen name='AddressScreen' component={AddressScreen}/> */}
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name='Username' component={Username} />
        <Stack.Screen name='Profile' component={Profile} />
        <Stack.Screen name='EmailScreen' component={EmailScreen} />
        <Stack.Screen name='LocationScreen' component={LocationScreen} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
        <Stack.Screen name='LoginOrRegister' component={LoginOrRegister} />
        <Stack.Screen name='OtpVerification' component={OtpVerficationScreen} />
        <Stack.Screen name='EditProfileScreen' component={EditProfileScreen} />



        {/* dashboard and dashboard related screens */}
        <Stack.Screen name='DashBoard' component={Dashboard} />

        {/* drawer navigation screen */}
        {/* <Stack.Screen name='Main' component={DrawerNavigator} />  //no need drawer for this app */}


          {/* product and checkout product related screens  */}
        <Stack.Screen name='DetailedProductScreen' component={DetailedProductScreen} />
        <Stack.Screen name='UsersLocationScreen' component={UsersLocationScreen} />
        <Stack.Screen name='CartScreen' component={CartScreen} />
        <Stack.Screen name='DetailedAddressInputScreen' component={DetailedAddressInputScreen}/>

        {/* Order Details */}
       <Stack.Screen name='MyOrdersScreen' component={MyOrdersScreen}/>
          <Stack.Screen name='OrderDetailedScreen' component={OrderDetailedScreen}/>


          {/* user screens  */}
          <Stack.Screen name='ProfileScreen' component={ProfileScreen} />

      </Stack.Navigator>
    </>
  );
}
