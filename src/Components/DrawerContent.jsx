import { useEffect, useState } from 'react';
import { Image, Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DrawerItem from '../Components/DrawerItem';
import HighLightedText from '../Components/Text/HighLightedText';
import { useTheme } from '../Context/ThemeContext';



export default function DrawerContent() {

  const { theme, toggleTheme , isDark } = useTheme();
   const insets = useSafeAreaInsets();

 const [menus, setMenus] = useState([
  {
    icon: 'home',
    label: 'Home',
  },
  {
    icon: 'person-outline',
    label: 'Profile',
  },
  {
    icon: 'card-outline',
    label: 'Order',
  },
  {
    icon: 'cart-outline',
    label: 'Order History',
  },
  {
    icon: 'exit-outline',
    label: 'Logout',
  },
]);

useEffect(()=>{
  setMenus(prev =>
    prev.map(item =>
      item.label === 'Theme'
        ? { ...item, icon: isDark ? 'moon-outline' : 'sunny-outline' }
        : item
    )
  );
},[isDark])


   const onHomeClick =()=> {

    console.log("clicked")
   }

  return (
   <View
  style={{
    flex: 1,
    backgroundColor: theme.card,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,

    shadowColor: 'black',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 190,

    overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
  }}
>
<View style={[styles.DrawerContent,{paddingTop: insets.top, paddingBottom: insets.bottom}]}>
      <View style={[styles.header]}>
        <Image source={require('../../assets/images/person.png')} resizeMode='center'  style={styles.profile}/>
        <HighLightedText style={{marginLeft:10}} text="Username"/>
      </View> 
        
        {menus.map((menu,key)=>(
        <DrawerItem key={key} style={{marginTop:20}} icon={menu.icon} label={menu.label} onClick={()=>onHomeClick()} toggleNeeded={menu.label=='Theme'} />
        ))}
 
</View>

    </View>
  );
}


const styles = StyleSheet.create({
  DrawerContent:{
    flex:1,
    margin:20
  },

  drawerItem:{
    padding:10,
    marginVertical:10,
    borderBottomColor:"yellow",
    flexDirection:"row",
    justifyContent:"space-between"
  },

  header:{
    flexDirection:"row",
    alignItems:"center"
  },

  profile:{
    width:50,
    height:50,
    borderRadius: 30, // half of width/height to make it circular
  resizeMode: 'cover',

  }
  })