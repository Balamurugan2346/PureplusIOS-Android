import AppButton from '../../../Components/AppButton';
import AppNavButton from '../../../Components/AppNavButton';
import CustomInput from '../../../Components/Inputs/CustomInput';
import useKeyboardVisible from '../../../Utils/IsKeyboardVisible';
import Fonts from '../../../../assets/fonts/Fonts';
import  LinearGradient  from 'react-native-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import {
    ImageBackground,
    KeyboardAvoidingView,
    Platform, StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useTheme } from '../../../Context/ThemeContext';
import { storeData } from '../../../OfflineStore/OfflineStore';
const LocationScreen = ({ navigation  }) => {

   

    storeData('UsersCurrentAddress',"12a Nandanam Extenstion chamiers road..")


    const locationRef = useRef(null);
    const [location, setLocation] = useState({
        data: null,
        error: null
    })
    const { theme, isDark, toggleTheme } = useTheme()
    const isKeyboardVisible = useKeyboardVisible();

  

    return (
        <KeyboardAvoidingView
            style={[styles.mainContainer]}
            behavior={Platform.OS === 'ios' ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >

            {/* <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} /> */}

            {/* Gradient overlay */}
            <LinearGradient
                colors={['rgba(0, 0, 0, 0.3)', 'rgba(1, 17, 34, 1)', theme.background]}
                style={[StyleSheet.absoluteFill, { zIndex: 1 }]}
            />
            <View style={[styles.mainContainer]}
            // contentContainerStyle={{ flexGrow: 1 }}
            // keyboardShouldPersistTaps="handled"
            >

                <ImageBackground
                    source={require('../../../../assets/images/locationscreenBG.png')}
                    // blurRadius={4}
                    style={{ zIndex: -1, width: "100%", height: "80%", backgroundColor: theme.primary }}
                    resizeMode='cover'
                />

                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ zIndex: 1, position: "absolute", marginVertical: 46, marginHorizontal: 20 }}
                >
                    {/* <Image
                        source={require('../../../assets/images/arrowLeft.png')}
                        style={{ width: 30, height: 30 }}
                    /> */}
                    <AppNavButton color={theme.secondary} />
                </TouchableOpacity>

                {/* <Text style={{
                    top: "24%", color: "white", marginLeft: 19,
                    fontFamily: Fonts.family.bold, fontSize: Fonts.size.xxl,
                    position: "absolute", zIndex: 2, elevation: 60,
                    textShadowColor: "black", textShadowRadius: 10
                }}>
                    Verification
                </Text> */}

                <View style={[styles.container2, { height: isKeyboardVisible ? "70%" : "50%" }]}>
                    <View style={styles.innerContainer}>

                        <Text style={[styles.text, {
                            color: theme.highlightedText,
                            fontFamily: Fonts.family.bold,
                            alignSelf: "center",
                            fontSize: Fonts.size.xxxl,
                            fontWeight: Fonts.weight.bold,
                        }]}>Address</Text>


                        <Text style={[styles.text, {
                            color: theme.secondaryText,
                            fontFamily: Fonts.family.regular,
                            alignSelf: "center",
                            fontSize: Fonts.size.sm,
                            fontWeight: Fonts.weight.medium,
                            marginTop: 10,
                        }]}>Enter your Address to continue</Text>

                        <View style={{ marginBottom: 0 }}>
                            <CustomInput
                                inputRef={locationRef}
                                icon={require('../../../../assets/images/pin.png')}
                                label={"Location"}
                                placeholder={"Enter your Address"}
                                type={"Address"}
                                onValidateInput={(data) => {
                                    setLocation({ data: data.input, error: data.error })
                                }}
                                // onSubmitEditing={() => { emailRef.current?.focus() }}
                                returnKeyType='done'
                            />
                        </View>
                        <AppButton onAction={() => {
                            // navigation.navigate("Signup")
                            if (!location.error && location.data) {
                                console.log('Address', location)
                                navigation.navigate('DashBoard')
                            } else {
                                Toast.show({
                                    type: 'error',
                                    text1: 'Incomplete Address',
                                    text2: location.error ? `${location.error}` : "Address required",
                                    position: 'bottom',
                                });
                            }
                        }} title={"Continue"} />
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

export default LocationScreen

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    innerContainer: {
        width: "100%",
        marginTop: 30,

        height: "100%",
        justifyContent: "flex-start"
    },
    container2: {
        zIndex: 2,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        // borderTopLeftRadius: 20,
        // borderTopRightRadius: 20,
        paddingHorizontal: 30,
        paddingVertical: 10,
    },
})