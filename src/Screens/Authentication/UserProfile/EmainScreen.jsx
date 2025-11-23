import AppButton from '../../../Components/AppButton';
import AppNavButton from '../../../Components/AppNavButton';
import EmailInput from '../../../Components/Inputs/EmailInput';
import useKeyboardVisible from '../../../Utils/IsKeyboardVisible';
import Fonts from '../../../../assets/fonts/Fonts';
import  LinearGradient  from 'react-native-linear-gradient';
import { useRef, useState } from 'react';
import {
    ImageBackground,
    KeyboardAvoidingView,
    Platform, StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useTheme } from '../../../Context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const EmailScreen = ({navigation}) => {



    const insets = useSafeAreaInsets()

    const emailRef = useRef(null);
    const [email, setEmail] = useState({
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
                    source={require('../../../../assets/images/EmailBG.png')}
                    // blurRadius={4}
                    style={{ zIndex: -1, width: "100%", height: "100%", backgroundColor: theme.primary }}
                    resizeMode='cover'
                />

                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ zIndex: 1, position: "absolute", marginVertical: insets.top + 10, marginHorizontal: 20 }}
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
                            style={{marginTop:10}}
                                ref={emailRef}
                                onValidEmail={(data) => {
                                    setEmail({ data: data.email, error: data.error })
                                }}
                                returnKeyType="done"
                                // onSubmitEditing={() => addressRef.current?.focus()}
                            />
                        </View>
                        <AppButton onAction={() => {
                            if(!email.error && email.data){
                                navigation.navigate("DashBoard")
                                console.log('email',email)
                            }else{
                            Toast.show({
                                type: 'error',
                                text1: 'Incomplete Email',
                                text2: email.error ? `${email.error}` : "Email required",
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

export default EmailScreen

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    innerContainer: {
        width: "100%",
         marginTop: 30,

        height: "100%",
        justifyContent:"flex-start"
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