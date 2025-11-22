// import AppNavButton from '@/app/Components/AppNavButton';
// import Fonts from '@/assets/fonts/Fonts';
// import React, { useMemo, useRef, useState } from 'react';
// import {
//     Image,
//     ImageBackground,
//     KeyboardAvoidingView,
//     Platform,
//     StyleSheet,
//     Text, TouchableOpacity,
//     View
// } from 'react-native';
// import Toast from 'react-native-toast-message';
// import AppButton from '../../Components/AppButton';
// import NumberInput from '../../Components/Inputs/NumberInput';
// import { useTheme } from '../../Context/ThemeContext';

// const Login = ({ navigation }) => {
//     const emailRef = useRef(null);
//     const passwordRef = useRef(null);
//     const numberRef = useRef(null)
//     const [num,setNum] = useState(null)


//     const { theme, isDark, toggleTheme } = useTheme()


//     const textConfig = useMemo(() => ({
//         color: theme.highlightedText,
//         fontFamily: Fonts.family.medium,
//         fontSize: Fonts.size.xxxl,
//         paddingLeft: 10
//     }), [theme]);

//         const paraTextConfig = useMemo(() => ({
//         color: theme.primary,
//         fontFamily: Fonts.family.medium,
//         fontSize: Fonts.size.xs,
//         paddingLeft: 10
//     }), [theme]);


//     return (
//         <KeyboardAvoidingView
//             style={styles.mainContainer}
//             behavior={Platform.OS === 'ios' ? "padding" : undefined}
//             keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
//         >
//             <View style={styles.mainContainer}
//             // contentContainerStyle={{ flexGrow: 1 }}
//             // keyboardShouldPersistTaps="handled"
//             >

//                 <ImageBackground
//                     blurRadius={4}
//                     style={{ zIndex: -1, width: "100%", height: "60%", backgroundColor: theme.primary }}
//                     resizeMode='cover'
//                 />

//                 <TouchableOpacity
//                     onPress={() => navigation.goBack()}
//                     style={{ zIndex: 1, position: "absolute", marginVertical: 46, marginHorizontal: 20 }}
//                 >
//                     {/* <Image
//                         source={require('../../../assets/images/arrowLeft.png')}
//                         style={{ width: 30, height: 30 }}
//                     /> */}
//                     <AppNavButton />
//                 </TouchableOpacity>

//                 {/* <Text style={{
//                      top: "24%", color: "white", marginLeft:19,
//                     fontFamily: Fonts.family.bold, fontSize: Fonts.size.xxl,
//                     position: "absolute", zIndex: 2, elevation: 60,
//                     textShadowColor: "black", textShadowRadius: 10
//                 }}>
//                     Login
//                 </Text> */}

//                 <View style={[styles.container2, { backgroundColor: theme.background }]}>
//                     <View style={styles.innerContainer}>

//                         <View style={styles.logo}>
//                             <Image source={require(('../../../assets/images/logoDesign.png'))} />
//                             <Text style={textConfig}>Pure plus</Text>

//                         </View>

//                         <View style={{ marginBottom: 0 }}>
//                             {/* ✅ EMAIL INPUT */}
//                             {/* <EmailInput
//                                 ref={emailRef}
//                                 onValidEmail={(data) => console.log(data)}
//                                 returnKeyType="next"
//                                 onSubmitEditing={() => passwordRef.current?.focus()}
//                             /> */}

//                             {/* ✅ Password */}
//                             {/* <PasswordInput
//                                 inputRef={passwordRef}
//                                 onValidPassword={(val) => console.log(val)}
//                                 onSubmitEditing={() => { }}
//                             /> */}

//                             {/* ✅ PhoneNumber */}
//                             <NumberInput
//                                 inputRef={numberRef}
//                                 onValidateNumber={(val) => 
//                                     // console.log(val)
//                                     {val.number ? setNum(val.number) : setNum(null)}
//                                 }
//                                 onSubmitEditing={() => { }}
//                             />
//                             {/* <OtpInput onOtpComplete={(otp) => {
//   console.log("OTP entered:", otp);
// }} /> */}


//                         </View>




//                         <AppButton onAction={() => {
//                             {num ? navigation.navigate('OtpVerification') : Toast.show({
//                                   type: 'error',
//                                   text1: 'Validation Failed',
//                                   text2: `Enter valid number`,
//                                   position: 'bottom',
//                                 });  }
//                         }} title={"Verify"} />

// <TouchableOpacity onPress={()=>navigation.navigate('PrivacyPolicy')}>
//       <Text style={[paraTextConfig,{alignSelf:"center",textDecorationLine: 'underline'}]}>Privacy policy</Text>

// </TouchableOpacity>

//                         {/* <TouchableOpacity onPress={()=>{navigation.goBack()}}>
//               <Text style={{ alignSelf:"center", color:theme.text, fontFamily: Fonts.family.regular, fontSize: Fonts.size.sm}}>Don't have an account? <Text style={{marginLeft:10,color:theme.primary, fontFamily: Fonts.family.medium, fontSize: Fonts.size.sm}}>Signup</Text></Text>

// </TouchableOpacity> */}
//                     </View>
//                 </View>
//             </View>
//         </KeyboardAvoidingView>
//     );
// }

// export default Login

// const styles = StyleSheet.create({
//     mainContainer: {
//         flex: 1,
//     },
//     innerContainer: {
//         justifyContent: "flex-start",
//         marginTop: 30,
//         width: "100%",
//         height: "100%",
//     },
//     container2: {
//         height: "80%",
//         position: 'absolute',
//         bottom: 0,
//         left: 0,
//         right: 0,
//         borderTopLeftRadius: 20,
//         borderTopRightRadius: 20,
//         paddingHorizontal: 30,
//         paddingVertical: 10,
//     },

//     logo: {
//         flexDirection: "row",
//         alignSelf: "center",
//         margin: 10,
//         marginBottom: 30
//     },

//     gradient: {
//         position: 'absolute',
//         bottom: 0,
//         left: 0,
//         right: 0,
//         top: 0,
//         height: 120, // Adjust height as needed
//     },
// })

import AppButton from '../../Components/AppButton';
import { clearError, saveNumberLocally, sendMobileNumber } from '../../Redux/Slices/AuthSlice';
import useKeyboardVisible from '../../Utils/IsKeyboardVisible';
import Fonts from '../../../assets/fonts/Fonts';
import { useFocusEffect } from '@react-navigation/native';
import Video from "react-native-video";
import  LinearGradient  from 'react-native-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {SafeAreaView} from 'react-native-safe-area-context'
import { Image, Keyboard, KeyboardAvoidingView, Platform,  StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import NumberInput from '../../Components/Inputs/NumberInput';
import { useTheme } from '../../Context/ThemeContext';
export default function Login({ navigation }) {

  const dispatch = useDispatch();
  const { sendMobile } = useSelector((state) => state.auth);

  const { loading, error, isFetched, isSuccess } = sendMobile


  const [num, setNum] = useState(null)
  const { theme } = useTheme()
  const numberRef = useRef(null)
  const isKeyboardVisible = useKeyboardVisible();


  const linkText = { fontFamily: Fonts.family.light, fontSize: Fonts.size.xs, color: theme.primary, textDecorationLine: "underline" }


  useFocusEffect(() => {
    if (error && isFetched && !loading && !isSuccess) {
      Toast.show({
        type: 'error',
        text1: 'Validation Failed',
        text2: `${error} from login`,
        position: 'bottom',
      });
      dispatch(clearError())
    }
  });


  useEffect(() => {
    if (!error && isFetched && isSuccess) {
      navigation.navigate('OtpVerification')
      Toast.show({
        type: 'success',
        text1: 'Login Success',
        text2: `otp sent to the ${num}`,
        position: 'bottom',
      });
    }
  }, [error, isFetched, isSuccess])

  const sendNumber = (mobilenumber, otp) => {
    // setNum(null)
    demoOffline(mobilenumber, otp)
  }

  const DemoOnline = (mobilenumber, otp) => {
    dispatch(saveNumberLocally(mobilenumber))
    dispatch(sendMobileNumber(mobilenumber, otp))
  }

  const demoOffline = (mobilenumber, otp) => {
    dispatch(saveNumberLocally(mobilenumber))
    navigation.navigate('OtpVerification')
    Toast.show({
      type: 'success',
      text1: 'Login',
      text2: `otp sent to the ${num}`,
      position: 'bottom',
    });
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.container}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
        >
          {/* Video background */}
          {/* <Video
            source={require('../../../assets/Videos/LoginScreen.mp4')}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="cover"
            shouldPlay
            isLooping
            style={[StyleSheet.absoluteFill]}
          /> */}
          <Image
           style={[StyleSheet.absoluteFill]}
          
          source={require('../../../assets/images/loginBg.png')}/>

          {/* Gradient overlay */}
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'rgba(2, 23, 44, 1)']}
            style={[StyleSheet.absoluteFill, { zIndex: 1 }]}
          />

          {/* Logo */}
          <View style={styles.logoContainer}>
            {/* <Text style={styles.logoText}>Pure Plus</Text> */}
          </View>


          <View style={[styles.bottomSheet, { backgroundColor: theme.background, height: isKeyboardVisible ? "50%" : "33%" }]}>

            <NumberInput
              ref={numberRef}
              onClick={() => setNum(null)}
              onValidateNumber={(val) =>
              // console.log(val)
              { val.number ? setNum(val.number) : setNum(null) }
              }
              onSubmitEditing={() => {
                console.log(num)
                num ? sendNumber(num, 'otp') : Toast.show({
                  type: 'error',
                  text1: 'Validation Failed',
                  text2: `Enter valid number`,
                  position: 'bottom',
                });
              }}
            />

            <AppButton title={"Sign in"} isLoading={loading} loadingText='Signing in... ' onAction={() => {
              {
                console.log(num)
                num ? sendNumber(num, 'otp') : Toast.show({
                  type: 'error',
                  text1: 'Validation Failed',
                  text2: `Enter valid number`,
                  position: 'bottom',
                });
              }
            }} />
            <View style={styles.termsContainer}>
              <Text style={[styles.termsText, { fontFamily: Fonts.family.light }]}>
                By signing in, you agree to our{' '}
                <Text style={linkText}>Terms</Text> and{' '}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy')}>
                <Text style={linkText}>Privacy Policy</Text>
              </TouchableOpacity>
            </View>

          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}




const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // backgroundColor: '#0C1C2C',
  },
  container: {
    flex: 1,
  },
  logoContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 80 : 60,
    alignSelf: 'center',
    zIndex: 2,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24 + (Platform.OS === 'android' ? 20 : 34),
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 80,
  },
  input: {
    backgroundColor: '#14293E',
    borderColor: '#2D4A68',
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    color: '#D0D8E0',
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3274CC',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  termsText: {
    color: '#A7B3C4',
    textAlign: 'center',
    fontSize: 12,
  },
  termsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  }

});

