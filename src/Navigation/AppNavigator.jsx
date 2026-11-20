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
import EmailScreen from '../Screens/Authentication/UserProfile/EmainScreen';
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
import SheduleOrderScreen from '../Screens/Delivery/SheduleDeliveryScreen'
import CustomerSupportScreen from '../Screens/CustomerSupport/CustomerSupportScreen'
import SubscriptionProductList from '../Screens/Subscriptions/SubscriptionProductList';
import OrderSuccessScreen from '../Screens/Order/OrderSuccessScreen'
import ModifyOrderScreen from '../Screens/Order/ModifyOrderScreen'
import OrderTrackingScreen from '../Screens/Product/Order/OrderTrackingScreen'
// New feature screens (Phase 4–7)
import WalletScreen from '../Screens/Wallet/WalletScreen'
import MyCansScreen from '../Screens/Cans/MyCansScreen'
import BillingScreen from '../Screens/Billing/BillingScreen'
import ServiceRequestScreen from '../Screens/ServiceRequest/ServiceRequestScreen'
import MyServiceTicketsScreen from '../Screens/ServiceRequest/MyServiceTicketsScreen'
import ServiceRequestDetailScreen from '../Screens/ServiceRequest/ServiceRequestDetailScreen'
import BulkRequestScreen from '../Screens/Bulk/BulkRequestScreen'
import BulkRequestStatusScreen from '../Screens/Bulk/BulkRequestStatusScreen'
import BulkRequestDetailScreen from '../Screens/Bulk/BulkRequestDetailScreen'
import ManageSubscriptionScreen from '../Screens/Subscriptions/ManageSubscriptionScreen'
import CreateSubscriptionScreen from '../Screens/Subscriptions/CreateSubscriptionScreen'
import CertificationScreen from '../Screens/Certification/CertificationScreen'
import RefillScreen from '../Screens/Refill/RefillScreen'
import NotificationScreen from '../Screens/Main/Notification'
import ChargesInfoScreen from '../Screens/Account/ChargesInfoScreen'

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { theme, toggleTheme, isDark } = useTheme();
  const { isBottomBarVisible, setIsBottomBarVisible } = useAppContext()
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
        <Stack.Screen name='MainBottomNav' component={MainBottomNav} />

        {/* Authentication and  onbaord */}
        <Stack.Screen name="GetStarted" component={GetStarted} />
        {/* <Stack.Screen name='AddressScreen' component={AddressScreen}/> */}
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name='Username' component={Username} />
        <Stack.Screen name='Profile' component={Profile} />
        <Stack.Screen name='EmailScreen' component={EmailScreen} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
        <Stack.Screen name='LoginOrRegister' component={LoginOrRegister} />
        <Stack.Screen name='OtpVerification' component={OtpVerficationScreen} />
        <Stack.Screen name='EditProfileScreen' component={EditProfileScreen} />
        <Stack.Screen  name='OrderTrackingScreen' component={OrderTrackingScreen}/>



        {/* dashboard and dashboard related screens */}
        <Stack.Screen name='DashBoard' component={Dashboard} />
        <Stack.Screen name='OrderSuccess' component={OrderSuccessScreen} />
        <Stack.Screen name='ModifyOrder' component={ModifyOrderScreen} />

        {/* drawer navigation screen */}
        {/* <Stack.Screen name='Main' component={DrawerNavigator} />  //no need drawer for this app */}


        {/* product and checkout product related screens  */}
        <Stack.Screen name='DetailedProductScreen' component={DetailedProductScreen} />
        <Stack.Screen name='UsersLocationScreen' component={UsersLocationScreen} />
        <Stack.Screen name='CartScreen' component={CartScreen} />
        <Stack.Screen name='DetailedAddressInputScreen' component={DetailedAddressInputScreen} />

        {/* Order Details */}
        <Stack.Screen name='MyOrdersScreen' component={MyOrdersScreen} />
        <Stack.Screen name='OrderDetailedScreen' component={OrderDetailedScreen} />


        {/* user screens  */}
        <Stack.Screen name='ProfileScreen' component={ProfileScreen} />

         {/* Customer support screens  */}
        <Stack.Screen name='CustomerSupportScreen' component={CustomerSupportScreen} />

        {/* shedule order screens*/}
        <Stack.Screen name='SheduleOrderScreen' component={SheduleOrderScreen} />

        { /*  Subscriptions Screens */}
        <Stack.Screen name='SubscriptionScreen' component={SubscriptionProductList}/>
        <Stack.Screen name='ManageSubscription' component={ManageSubscriptionScreen}/>
        <Stack.Screen name='CreateSubscription' component={CreateSubscriptionScreen}/>

        {/* Money & assets */}
        <Stack.Screen name='Wallet' component={WalletScreen} />
        <Stack.Screen name='MyCans' component={MyCansScreen} />
        <Stack.Screen name='Billing' component={BillingScreen} />
        <Stack.Screen name='Refill' component={RefillScreen} />

        {/* Bulk / Event */}
        <Stack.Screen name='BulkRequest' component={BulkRequestScreen} />
        <Stack.Screen name='BulkRequestStatus' component={BulkRequestStatusScreen} />
        <Stack.Screen name='BulkRequestDetail' component={BulkRequestDetailScreen} />

        {/* Support & trust */}
        <Stack.Screen name='ServiceRequest' component={ServiceRequestScreen} />
        <Stack.Screen name='MyServiceTickets' component={MyServiceTicketsScreen} />
        <Stack.Screen name='ServiceRequestDetail' component={ServiceRequestDetailScreen} />
        <Stack.Screen name='Certification' component={CertificationScreen} />

        {/* Notifications */}
        <Stack.Screen name='Notifications' component={NotificationScreen} />

        {/* Account info */}
        <Stack.Screen name='ChargesInfo' component={ChargesInfoScreen} />

      </Stack.Navigator>
    </>
  );
}
