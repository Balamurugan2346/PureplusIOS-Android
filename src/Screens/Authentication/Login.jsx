import AppButton from '../../Components/AppButton';
import { clearError, sendMobileNumber, clearIsFetched, saveMobileNumberLocally, clearState } from '../../Redux/Slices/AuthSlice';
import useKeyboardVisible from '../../Utils/IsKeyboardVisible';
import Fonts from '../../../assets/fonts/Fonts';
import { useFocusEffect } from '@react-navigation/native';
import Video from "react-native-video";
import LinearGradient from 'react-native-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import NumberInput from '../../Components/Inputs/NumberInput';
import { useTheme } from '../../Context/ThemeContext';
import { useToast } from '../../Components/Toast/ToastProvider';


export default function Login({ navigation }) {

  const dispatch = useDispatch();
  const { sendMobile } = useSelector((state) => state.auth);
  const { showToast } = useToast()

  const { loading, error, isFetched, isSuccess, otp, mobileNumber } = sendMobile


  const [num, setNum] = useState(null)
  const { theme } = useTheme()
  const numberRef = useRef(null)
  const isKeyboardVisible = useKeyboardVisible();


  const linkText = { fontFamily: Fonts.family.light, fontSize: Fonts.size.xs, color: theme.primary, textDecorationLine: "underline" }

 

  const sendNumber = (ml) => {
    dispatch(
      sendMobileNumber({
        mobileNumber: `${ml}`,
        onSuccess: (data) => {
          console.log("received data", data)
          dispatch(saveMobileNumberLocally(ml))
          dispatch(clearIsFetched())
          showToast(`SUCCESS: OTP sent to ${ml} and OTP is ${data.otp}`)
          navigation.navigate("OtpVerification")
        },
        onError: (err) => {
          showToast(`ERROR: ${err} from login`, true)
          dispatch(clearError())
        }
      })
    );

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

          <Image
            resizeMode='contain'
            style={[StyleSheet.absoluteFill]}

            source={require('../../../assets/images/loginBg.png')} />

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
                num ? sendNumber(num) : showToast(`Enter valid number`, true)
              }}
            />

            <AppButton title={"Sign in"} isLoading={loading} loadingText='Signing in... ' onAction={() => {
              {
                console.log(num)
                num ? sendNumber(num) : showToast(`Enter valid number`, true)
              }
            }} />
            <View style={styles.termsContainer}>
              <Text style={[styles.termsText, { fontFamily: Fonts.family.light }]}>
                By signing in, you agree to our{' '}
                <Text
                  style={linkText}
                  onPress={() => navigation.navigate('PrivacyPolicy')}
                >
                  Terms
                </Text>
                {' '}and{' '}
                <Text
                  style={linkText}
                  onPress={() => navigation.navigate('PrivacyPolicy')}
                >
                  Privacy Policy
                </Text>
              </Text>
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

