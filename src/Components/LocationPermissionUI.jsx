import Fonts from '../../assets/fonts/Fonts';
import { useMemo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../Context/ThemeContext';
import AppButton from './AppButton';

const LocationPermissionUI = ({onContinueClick}) => {
  const { theme, toggleTheme , isDark } = useTheme();


  
    const textConfig = useMemo(() => ({
        color: theme.highlightedText,
        fontFamily: Fonts.family.bold,
        fontSize: Fonts.size.base,
        paddingLeft: 10
    }), [theme]);

        const paraTextConfig = useMemo(() => ({
        color: theme.text,
        fontFamily: Fonts.family.medium,
        fontSize: Fonts.size.xs,
        paddingLeft: 10
    }), [theme]);

  return (
    <View style={[styles.container,{backgroundColor:theme.background}]}>
        <View style={styles.body}>
            <Image source={require('../../assets/images/location.png')} style={styles.img} />
            <Text style={textConfig}>Your device location is off</Text>
            <Text style={paraTextConfig}>Please enable location permission for better delivery</Text>
            <AppButton title={"Continue"} borderOnly={true}  onAction={onContinueClick}/>
        </View>
    </View>
  )
}

export default LocationPermissionUI

const styles = StyleSheet.create({
    container : {
        flex:1,
        position:"absolute",
        borderTopLeftRadius:50,
        borderTopRightRadius:50,
        
    // Android
    elevation: 20, // 80 is too high and might not be effective; 20 is strong enough

    // iOS Shadow
    shadowColor: "blue",
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 30,      
        width:"100%",
        height:"40%",
        bottom:0,
        padding:10
    },
    img : {
        width:150,
        height:150,
        backgroundColor:"red"
    },
    body : {
       alignItems:"center"
    }
})