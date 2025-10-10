import { clearError, Login, saveNumberLocally, sendMobileNumber } from '../../Redux/Slices/AuthSlice';
import Fonts from '../../../assets/fonts/Fonts';
import { useFocusEffect } from '@react-navigation/native';
import  LinearGradient  from 'react-native-linear-gradient';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
    ImageBackground,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text, TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import AppLoading from '../../Components/AppLoading';
import AppNavButton from '../../Components/AppNavButton';
import OtpInput from '../../Components/Inputs/OTPInput';
import { useTheme } from '../../Context/ThemeContext';
import useKeyboardVisible from '../../Utils/IsKeyboardVisible';

const OtpVerificationScreen = ({ navigation }) => {

    const dispatch = useDispatch();

    const { sendMobile, loginState } = useSelector((state) => state.auth);

    const { loading, error, isFetched, isSuccess, mobileNumber } = sendMobile

    const { loading: isLoginLoading, error: isLoginError, isFetched: isLoginApiFetched, isSuccess: isLoginApiSuccess, } = loginState

    const timer = 5

    useMemo(() => {
        console.log("mobile number is ", mobileNumber)
    }, [mobileNumber])


    useFocusEffect(() => {
        if (error && isFetched && !loading && !isSuccess) {
            Toast.show({
                type: 'error',
                text1: 'Validation Failed',
                text2: `${error} from otp`,
                position: 'bottom',
            });
            dispatch(clearError())
        }

        if (isLoginError && isLoginApiFetched && !isLoginLoading && !isLoginApiSuccess) {
            Toast.show({
                type: 'error',
                text1: 'Login Error',
                text2: `${isLoginError} from Login`,
                position: 'bottom',
            });
            dispatch(clearError())
        }
    });

    const { theme } = useTheme()
    const isKeyboardVisible = useKeyboardVisible();

    console.log("is", isKeyboardVisible)

    const intervalRef = useRef(null);

    const [timeLeft, setTimeLeft] = useState(timer);



    const startTimer = () => {
        clearInterval(intervalRef.current); // clear previous interval
        setTimeLeft(timer); // reset
        intervalRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };



    const login = (mobileNumber, otp) => {
        if (mobileNumber != null && otp != null) {
            dispatch(Login(mobileNumber, otp))
        } else {
            Toast.show({
                type: 'error',
                text1: 'Error while login',
                text2: `Please try again later...`,
                position: 'bottom',
            });
        }
    }

    useEffect(() => {
        if (!isLoginError && isLoginApiFetched && isLoginApiSuccess) {
            Toast.show({
                type: 'success',
                text1: 'Verification Completed',
                text2: `Login Successfully completed`,
                position: 'bottom',
            });
            navigation.replace('Username')
            // dispatch(clearState())
        }
    }, [isLoginError, isLoginApiFetched, isLoginApiSuccess])


    const restartTimer = () => {
        if (mobileNumber != null) {
            sendNumber(mobileNumber, 'otp')
        } else {
            Toast.show({
                type: 'error',
                text1: 'OtP failed To Send',
                text2: `Please enter the mobile number again`,
                position: 'bottom',
            });
        }
        if (!loading) {
            startTimer();
        }
    };

    useEffect(() => {
        if (!loading) {
            startTimer();   // ✅ only start timer after OTP API has finished
        }
        return () => clearInterval(intervalRef.current); // cleanup on unmount
    }, [loading]);  // 👈 depend on loading


    const sendNumber = (mobilenumber, otp) => {
        dispatch(saveNumberLocally(mobilenumber))
        // navigation.navigate('OtpVerification')
        dispatch(sendMobileNumber(mobilenumber, otp))
    }


    const demoOnline = (mobileNumber, otp) => {
        login(mobileNumber, otp)

    }

    const demoOffline = (mobileNumber, otp) => {
        Toast.show({
            type: 'success',
            text1: 'Verification Completed',
            text2: `Login Successfully completed`,
            position: 'bottom',
        });
        navigation.replace("Username")
        // dispatch(clearState())
    }

    return (
        <TouchableWithoutFeedback accessible={false} onPress={() => Keyboard.dismiss()}>
            <KeyboardAvoidingView
                style={[styles.mainContainer]}
                behavior={Platform.OS === 'ios' ? "padding" : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            >

                {/* Gradient overlay */}
                <LinearGradient
                    colors={['rgba(0,0,0,0.3)', 'rgba(12,28,44,1)']}
                    style={[StyleSheet.absoluteFill, { zIndex: 1 }]}
                />
                <View style={[styles.mainContainer]}
                // contentContainerStyle={{ flexGrow: 1 }}
                // keyboardShouldPersistTaps="handled"
                >

                    {isLoginLoading && !isLoginApiFetched && (
                        <AppLoading isVisible={isLoginLoading && !isLoginApiFetched} />
                    )}

                    {loading && !isFetched && (
                        <AppLoading isVisible={loading && !isFetched} />
                    )}

                    <ImageBackground
                        source={require('../../../assets/images/otpbg.png')}
                        // blurRadius={4}
                        style={{ zIndex: -1, width: "100%", height: "100%", backgroundColor: theme.primary }}
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

                    <View style={[styles.container2, { backgroundColor: theme.background, height: isKeyboardVisible ? "70%" : "50%" }]}>
                        <View style={styles.innerContainer}>

                            <Text style={[styles.text, {
                                color: theme.highlightedText,
                                fontFamily: Fonts.family.bold,
                                fontSize: Fonts.size.xxxl,
                                fontWeight: Fonts.weight.bold,
                            }]}>OTP Verification</Text>

                            <View style={{ marginBottom: 0 }}>
                                <OtpInput onOtpComplete={(otp) => {
                                    console.log("OTP entered:", otp);
                                    // navigation.replace("Username")
                                    demoOffline(mobileNumber, otp)
                                }} />
                            </View>

                            {timeLeft > 0 ? (
                                <TouchableOpacity onPress={() => {

                                }}>
                                    <Text style={{ alignSelf: "center", color: theme.text, fontFamily: Fonts.family.regular, fontSize: Fonts.size.sm }}>
                                        Resend code in{" "}
                                        <Text style={{ marginLeft: 10, color: theme.primary, fontFamily: Fonts.family.medium, fontSize: Fonts.size.sm }}>
                                            {timeLeft} sec
                                        </Text>
                                    </Text>
                                </TouchableOpacity>

                            ) : (
                                <TouchableOpacity onPress={restartTimer}>
                                    <Text
                                        style={{
                                            alignSelf: "center",
                                            color: theme.primary,
                                            fontFamily: Fonts.family.regular,
                                            fontSize: Fonts.size.sm,
                                            marginTop: 10,
                                        }}
                                    >
                                        Resend OTP
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>

    );
}

export default OtpVerificationScreen
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    innerContainer: {
        justifyContent: "flex-start",
        marginTop: 30,
        width: "100%",
        height: "100%",
    },
    container2: {
        zIndex: 2,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 30,
        paddingVertical: 10,
    },

    gradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
        height: 120, // Adjust height as needed
    },
})