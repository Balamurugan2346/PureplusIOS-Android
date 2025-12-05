import { clearError, clearIsFetched, Login, saveMobileNumberLocally, saveNumberLocally, sendMobileNumber } from '../../Redux/Slices/AuthSlice';
import Fonts from '../../../assets/fonts/Fonts';
import { useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useToast } from '../../Components/Toast/ToastProvider';
import { storeData } from '../../OfflineStore/OfflineStore';

const OtpVerificationScreen = ({ navigation }) => {

    const dispatch = useDispatch();
    const { showToast } = useToast()

    const { sendMobile, loginState } = useSelector((state) => state.auth);

    const { loading, error, isFetched, isSuccess, mobileNumber, otp: savedOtp } = sendMobile

    const { loading: isLoginLoading, error: isLoginError, isFetched: isLoginApiFetched, isSuccess: isLoginApiSuccess, } = loginState

    const timer = 5

    const insets = useSafeAreaInsets()

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
            console.log("before sending to login api,", mobileNumber, otp)
            dispatch(
                Login({
                    mobileNumber: `${mobileNumber}`,
                    otp: otp,
                    onSuccess: (data) => {
                        console.log('dataaaaaaaa', data)
                        try {
                            if (savedOtp == otp) {
                                if (data.success && data.isNewUser) {
                                    showToast(`Successfully completed`)
                                    storeData('preAuthToken', data.preAuthToken)
                                    navigation.replace('Username')
                                } else if (data.success) {
                                    showToast(`Successfully completed11`)
                                    storeData('isLoggedIn', "1")
                                    storeData('accessToken', data.token)
                                    storeData('userID', data.user.id.toString())
                                    navigation.reset({
                                        index: 0,
                                        routes: [{ name: 'DashBoard' }],
                                    });

                                }
                            } else {
                                showToast("Invalid OTP", true)
                            }
                        } catch (e) {
                            showToast(`ERROR:${e}`)
                        }

                    },
                    onError: (err) => {
                        showToast(`ERROR: ${err} from login`, true)
                        dispatch(clearError())
                    }
                })
            );
        } else {
            showToast(`Please try again later...`, true)
        }
    }

    const restartTimer = () => {
        if (mobileNumber != null) {
            console.log("mb", mobileNumber)
            sendNumber(mobileNumber)
        } else {
            showToast(`Please enter the mobile number again`, true)
        }
        if (!loading) {
            startTimer();
        }
    };

    const sendNumber = (ml) => {
        dispatch(
            sendMobileNumber({
                mobileNumber: `${ml}`,
                onSuccess: (data) => {
                    console.log("received data", data)
                    //   dispatch(saveMobileNumberLocally(ml))
                    //   dispatch(clearIsFetched())
                    showToast(`SUCCESS: OTP sent to ${ml} and OTP is ${data.otp}`)
                    //   navigation.navigate("OtpVerification")
                },
                onError: (err) => {
                    showToast(`ERROR: ${err} from login`, true)
                    dispatch(clearError())
                }
            })
        );

    }

    useEffect(() => {
        if (!loading) {
            startTimer();   // ✅ only start timer after OTP API has finished
        }
        return () => clearInterval(intervalRef.current); // cleanup on unmount
    }, [loading]);  // 👈 depend on loading


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

                    {isLoginLoading && (
                        <AppLoading isVisible={isLoginLoading} />
                    )}

                    {loading && (
                        <AppLoading isVisible={loading} />
                    )}

                    <ImageBackground
                        source={require('../../../assets/images/otpbg.png')}
                        // blurRadius={4}
                        style={{ zIndex: -1, width: "100%", height: "100%", backgroundColor: theme.primary }}
                        resizeMode='cover'
                    />

                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={{ zIndex: 1, position: "absolute", marginVertical: insets.top + 10, marginHorizontal: 20 }}
                    >
                        <AppNavButton color={theme.secondary} />
                    </TouchableOpacity>


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
                                    login(mobileNumber, otp)
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