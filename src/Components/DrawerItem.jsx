import Ionicons from 'react-native-vector-icons/Ionicons'
import { StyleSheet, Switch, TouchableOpacity, View } from 'react-native'
import RegularText from '../Components/Text/RegularText'
import Fonts from '../../assets/fonts/Fonts'
import {useTheme} from '../Context/ThemeContext'

const DrawerItem = ({icon,label,onClick,style,toggleNeeded=false}) => {

    const {theme,isDark,toggleTheme}  = useTheme()
  return (
   <View style={[styles.drawerItem , style]}>
    <TouchableOpacity onPress={onClick} style={{flexDirection:"row",alignItems:"center",width:"100%",justifyContent:"space-between"}}>

          <View style={{flexDirection:"row",alignItems:"center"}}>
   <Ionicons name={icon} size={Fonts.Iconsize.medium} color={theme.primary} />
          <RegularText text={label}  style={{marginLeft:20}} />
          </View>
          {toggleNeeded && (
             <Switch
        value={isDark}
        onValueChange={toggleTheme}
        thumbColor={isDark ? '#fff' : '#f4f3f4'}
        trackColor={{ false: '#767577', true: '#4a90e2' }}
        ios_backgroundColor="#3e3e3e" 
      />
          )}

          {!toggleNeeded &&(
          <Ionicons name='arrow-forward-outline' size={Fonts.Iconsize.medium} color={theme.primary} />
          )}
       
    </TouchableOpacity>

        </View>
  )
}

export default DrawerItem

const styles = StyleSheet.create({
    drawerItem:{
    padding:10,
    marginVertical:10,
    borderBottomColor:"yellow",
    flexDirection:"row",
    justifyContent:"space-between"
  },
})