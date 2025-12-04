import AppButton from '../../../Components/AppButton';
import AppNavButton from '../../../Components/AppNavButton';
import EmailInput from '../../../Components/Inputs/EmailInput';
import useKeyboardVisible from '../../../Utils/IsKeyboardVisible';
import Fonts from '../../../../assets/fonts/Fonts';
import LinearGradient from 'react-native-linear-gradient';
import { useRef, useState } from 'react';
import {
    ImageBackground,
    KeyboardAvoidingView,
    Platform, StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useTheme } from '../../../Context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { clearError, clearState, createProfile, saveTempUserDetails } from '../../../Redux/Slices/AuthSlice';
import { useToast } from '../../../Components/Toast/ToastProvider';
import { useSelector, useDispatch } from 'react-redux';
import { storeData } from '../../../OfflineStore/OfflineStore';
import AppLoading from '../../../Components/AppLoading';
const EmailScreen = ({ navigation }) => {



    const insets = useSafeAreaInsets()

    const { showToast } = useToast()
    const dispatch = useDispatch()

    const emailRef = useRef(null);
    const [email, setEmail] = useState({
        data: null,
        error: null
    })
    const { theme, isDark, toggleTheme } = useTheme()
    const isKeyboardVisible = useKeyboardVisible();

    const { tempUserDetails, loginData , createProfile : createProfileState } = useSelector((state) => state.auth)
    return (
        <KeyboardAvoidingView
            style={[styles.mainContainer]}
            behavior={Platform.OS === 'ios' ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >

            {createProfileState.loading && (
                <AppLoading isVisible={createProfileState.loading}/>
            )}

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
                    source={require('../../../../assets/images/EmailBG.png')}
                    style={{ zIndex: -1, width: "100%", height: "100%", backgroundColor: theme.primary }}
                    resizeMode='cover'
                />

                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ zIndex: 1, position: "absolute", marginVertical: insets.top + 10, marginHorizontal: 20 }}
                >

                    <AppNavButton color={theme.secondary} />
                </TouchableOpacity>

                <View style={[styles.container2, { height: isKeyboardVisible ? "70%" : "50%" }]}>
                    <View style={styles.innerContainer}>

                        <Text style={[styles.text, {
                            color: theme.highlightedText,
                            fontFamily: Fonts.family.bold,
                            alignSelf: "center",
                            fontSize: Fonts.size.xxxl,
                            fontWeight: Fonts.weight.bold,
                        }]}>Email</Text>


                        <Text style={[styles.text, {
                            color: theme.secondaryText,
                            fontFamily: Fonts.family.regular,
                            alignSelf: "center",
                            fontSize: Fonts.size.sm,
                            fontWeight: Fonts.weight.medium,
                            marginTop: 10,
                        }]}>Enter your email to continue</Text>

                        <View style={{ marginBottom: 0 }}>
                            <EmailInput
                                style={{ marginTop: 10 }}
                                ref={emailRef}
                                onValidEmail={(data) => {
                                    setEmail({ data: data.email, error: data.error })
                                }}
                                returnKeyType="done"
                            // onSubmitEditing={() => addressRef.current?.focus()}
                            />
                        </View>
                        <AppButton onAction={() => {
                            if (!email.error && email.data) {
                                dispatch(saveTempUserDetails({ email: email.data }));
                                const userName = tempUserDetails.userName
                                if (userName && email.data) {
                                    dispatch(createProfile({
                                        fullName: userName.data,
                                        email: email.data,
                                        onSuccess: (data) => {
                                            console.log('dataaaaaaaa', data)
                                            if (data.success) {
                                                storeData("accessToken", data.token)
                                                storeData('isLoggedIn',"1") 
                                                dispatch(clearState())
                                                navigation.navigate("DashBoard")
                                            } else {
                                                showToast(`Something went wrong`, true)
                                            }
                                        },
                                        onError: (err) => {
                                            showToast(`ERROR: ${err}`, true)
                                            dispatch(clearError())
                                        }
                                    }))
                                }
                            } else {
                                showToast(`Incomplete Email : ${email.error}`, true)
                            }
                        }} title={"Continue"} />
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

export default EmailScreen

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