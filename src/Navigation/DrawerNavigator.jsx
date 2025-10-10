import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MainBottomNav from '../../app/Screens/Main/MainBottomNav'
import DrawerContent from '../Components/DrawerContent'

const Drawer = createDrawerNavigator();


export default function DrawerNavigator() {
  return (

   <Drawer.Navigator
  drawerContent={() => <DrawerContent />}
  screenOptions={{
    drawerType: 'front',
    overlayColor: 'transparent',
    drawerStyle: {
      backgroundColor: '#fff', // or your theme.card
      borderTopRightRadius: 30,
      borderBottomRightRadius: 30,
      overflow: 'hidden', // Needed to clip the borderRadius

      // iOS shadow
      shadowColor: 'black',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,

      // Android shadow
      elevation: 20,
    },
  }}
>
      <Drawer.Screen name="MainBottomNav" component={MainBottomNav} options={{ headerShown: false }} />
    </Drawer.Navigator>

  );
}
