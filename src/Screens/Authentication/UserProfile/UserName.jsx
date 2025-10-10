import AppButton from '../../../Components/AppButton';
import AppNavButton from '../../../Components/AppNavButton';
import CustomInput from '../../../Components/Inputs/CustomInput';
import { clearState } from '../../../Redux/Slices/AuthSlice';
import useKeyboardVisible from '../../../Utils/IsKeyboardVisible';
import Fonts from '../../../../assets/fonts/Fonts';
import { useFocusEffect } from '@react-navigation/native';
import  LinearGradient  from 'react-native-linear-gradient';
import { useCallback, useRef, useState } from 'react';
import {
    BackHandler,
    ImageBackground,
    KeyboardAvoidingView,
    Platform, StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import AppModal from '../../../Components/AppModal';
import { useTheme } from '../../../Context/ThemeContext';
const UserName = ({ navigation }) => {


    const dispatch = useDispatch()
    const [modalVisible, setModalVisible] = useState(false);
    const usernameRef = useRef(null);
    const [userName, setUserName] = useState({
        data: null,
        error: null
    })
    const { theme, isDark, toggleTheme } = useTheme()
    const isKeyboardVisible = useKeyboardVisible();


    useFocusEffect(
        useCallback(() => {
            const backAction = () => {
                setModalVisible(true)
                return true
            }

            const subscription = BackHandler.addEventListener(
                'hardwareBackPress',
                backAction
            )

            return () => subscription.remove()
        }, [])
    )



    return (
        <KeyboardAvoidingView
            style={[styles.mainContainer]}
            behavior={Platform.OS === 'ios' ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
            <AppModal
                title="Reset Login?"
                description="Are you sure you want to login with different mobileNo"
                visible={modalVisible}
                setModalVisible={setModalVisible}
                onClose={() => setModalVisible(false)}
                onPositive={() => {
                    navigation.goBack()
                    setModalVisible(false);
                    dispatch(clearState())
                }}
                onNegative={() => {
                    console.log("Cancelled!");
                    setModalVisible(false);
                }}
            />
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
                    source={require('../../../../assets/images/UsernameBG.png')}
                    // blurRadius={4}
                    style={{ zIndex: -1, width: "100%", height: "100%", backgroundColor: theme.primary }}
                    resizeMode='cover'
                />

                <TouchableOpacity
                    onPress={() => setModalVisible(true)}
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
                        }]}>Welcome</Text>


                        <Text style={[styles.text, {
                            color: theme.secondaryText,
                            fontFamily: Fonts.family.regular,
                            alignSelf: "center",
                            fontSize: Fonts.size.sm,
                            fontWeight: Fonts.weight.medium,
                            marginTop: 10,
                        }]}>Enter your name to continue</Text>

                        <View style={{ marginBottom: 0 }}>
                            <CustomInput
                                inputRef={usernameRef}
                                icon={require('../../../../assets/images/user.png')}
                                label={"Username"}
                                placeholder={"Enter your name"}
                                type={"Username"}
                                onValidateInput={(data) => {
                                    setUserName({ data: data.input, error: data.error })
                                }}
                                // onSubmitEditing={() => { emailRef.current?.focus() }}
                                returnKeyType='done'
                            />
                        </View>
                        <AppButton onAction={() => {
                            if (userName.data != null) {
                                console.log("username", userName)
                                navigation.navigate("EmailScreen")
                            } else {
                                Toast.show({
                                    type: 'error',
                                    text1: 'Incomplete Username',
                                    text2: userName.error ? `${userName.error}` : "Username required",
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

export default UserName

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
        // borderTopLeftRadius: 20,
        // borderTopRightRadius: 20,
        paddingHorizontal: 30,
        paddingVertical: 10,
    },
})