import Fonts from '../../assets/fonts/Fonts'
import React from 'react'
import { Image, StyleSheet, View } from 'react-native'

const SplashScreen = () => {
    return (
        <View style={{ flex: 1, backgroundColor: "#3274CC", justifyContent: "center" ,alignItems:"center"}}>
            <View style={{ flexDirection: "column" }}>
                <Image source={require("../../assets/images/logo.png")} resizeMode='contain' style={{ alignSelf:"center", width: 200, height: 200 }} />
            </View>
        </View>
    )
}

export default SplashScreen

const styles = StyleSheet.create({
    Label: {
        color : "black",
        alignSelf:"center",
        fontFamily: Fonts.family.bold,
        fontSize: Fonts.size.xxxl,
        fontWeight: Fonts.weight.bold,
        
    }
})