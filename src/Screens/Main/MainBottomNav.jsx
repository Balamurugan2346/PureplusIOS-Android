import { useTabBarVisibility } from '../../Context/BottomBarContext';
import { useTheme } from '../../Context/ThemeContext';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MyCart from '../../Screens/Product/CartScreen';
import MyOrders from '../Product/Order/MyOrdersScreen';
import Dashboard from './Dashboard';
import Notification from './Notification';
import { fontFamily, radius, spacing, floatShadow } from '../../Themes/Themes';

const Tab = createBottomTabNavigator();

const TAB_META = {
  Dashboard: { icon: 'home', label: 'Home' },
  CartScreen: { icon: 'cart', label: 'Cart' },
  MyOrdersScreen: { icon: 'list', label: 'Orders' },
  Notification: { icon: 'notifications', label: 'Alerts' },
};

export default function MainBottomNav() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const { isTabBarVisible } = useTabBarVisibility();
  const animatedValue = useRef(new Animated.Value(1)).current;

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
          position: 'absolute',
          left: spacing.xl,
          right: spacing.xl,
          bottom: insets.bottom + spacing.lg,
          height: 68,
          borderRadius: radius.pill,
          backgroundColor: theme.surfaceCard,
          borderTopWidth: 0,
          paddingHorizontal: spacing.sm,
          ...floatShadow,
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [120, 0],
              }),
            },
          ],
        },
        tabBarItemStyle: { height: 68 },
        tabBarIcon: ({ focused }) => {
          const meta = TAB_META[route.name] || { icon: 'ellipse', label: route.name };
          const iconName = focused ? meta.icon : `${meta.icon}-outline`;
          const color = focused ? theme.primary : theme.inkMuted;
          return (
            <View style={{ alignItems: 'center', justifyContent: 'center', gap: 2, paddingTop: spacing.md }}>
              <Ionicons name={iconName} size={24} color={color} />
              <Text style={{ fontFamily: fontFamily.medium, fontSize: 11, lineHeight: 14, color }}>
                {meta.label}
              </Text>
              {focused && (
                <View style={{ width: 6, height: 6, backgroundColor: theme.primary, borderRadius: 3, marginTop: 2 }} />
              )}
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="CartScreen" component={MyCart} />
      <Tab.Screen name="MyOrdersScreen" component={MyOrders} />
      <Tab.Screen name="Notification" component={Notification} />
    </Tab.Navigator>
  );
}
