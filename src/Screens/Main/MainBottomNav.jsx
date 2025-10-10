import { useTabBarVisibility } from '../../Context/BottomBarContext';
import { useTheme } from '../../Context/ThemeContext';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Use icons of your choice
import MyCart from '../../Screens/Product/CartScreen';
import MyOrders from '../Product/Order/MyOrdersScreen';
import Dashboard from './Dashboard';
import Notification from './Notification';


const Tab = createBottomTabNavigator();




export default function MainBottomNav() {

  const {theme}  = useTheme()

 const { isTabBarVisible } = useTabBarVisibility();
  const animatedValue = useRef(new Animated.Value(1)).current;

  console.log("v",isTabBarVisible)
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isTabBarVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isTabBarVisible]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
    
        tabBarStyle: {
          bottom:"5%",
          alignSelf:"center",
          justifyContent:"center",
          alignItems:"center",
          borderRadius: 50,
          height: 70,
          elevation:9,
          shadowColor:"black",
          shadowOffset:{width:10,height:10},
          shadowRadius:10,
          backgroundColor: theme.background,
               transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [100, 0],
              }),
            },
          ],
          position: 'absolute',
        },

        tabBarItemStyle : {
          marginTop:13
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'CartScreen') iconName = focused ? 'cart' : 'cart-outline';
          else if (route.name === 'MyOrdersScreen') iconName = focused ? 'list' : 'list-outline';
          else if (route.name === 'Notification') iconName = focused ? 'notifications' : 'notifications-outline';

          return (
            <View style={{ alignItems: 'center' }}>
              <Ionicons name={iconName} size={28} color={focused ? '#4a90e2' : '#ccc'} />
              {focused && (
                <View
                  style={{
                    width: 6,
                    height: 6,
                    backgroundColor: '#4a90e2',
                    borderRadius: 3,
                    marginTop: 4,
                  }}
                />
              )}
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="CartScreen" component={MyCart} />
      <Tab.Screen name='MyOrdersScreen' component={MyOrders} />
      <Tab.Screen name='Notification' component={Notification} />
    </Tab.Navigator>
  );
}
