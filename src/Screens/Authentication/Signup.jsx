// import {Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
// import React from 'react'
// 
// import PasswordInput from '../../Components/Inputs/PasswordInput'
// import CustomInput from '../../Components/Inputs/CustomInput'
// import { StatusBar } from 'expo-status-bar'
// import { useTheme } from '@/app/Context/ThemeContext'
// import Fonts from '@/assets/fonts/Fonts'
// import AppButton from '@/app/Components/AppButton'



import AppButton from '../../Components/AppButton';
import AppNavButton from '../../Components/AppNavButton';
import Fonts from '../../../assets/fonts/Fonts';
import React, { useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Toast from 'react-native-toast-message';
import CustomInput from '../../Components/Inputs/CustomInput';
import EmailInput from '../../Components/Inputs/EmailInput';
import { useTheme } from '../../Context/ThemeContext';

const Signup = ({ navigation }) => {
  const emailRef = useRef(null);
  const usernameRef = useRef(null);
  const addressRef = useRef(null);
  const landmarkRef = useRef(null);

  const [userData, setUserData] = useState(new Map())

  const { theme, isDark, toggleTheme } = useTheme()


const updateProfile = (userData) => {
  const requiredKeys = ['username', 'email', 'address', 'landmark'];

  if (userData.size !== requiredKeys.length) {
    Toast.show({
      type: 'error',
      text1: 'Incomplete Form',
      text2: 'Please fill all required fields',
      position: 'bottom',
    });
    return;
  }

  let hasError = false;
  const newData = new Map(userData);
  const missingFields = [];

  newData.forEach((data, key) => {
    const value = data?.value?.trim();
    let error = data?.error;

    if (!value) {
      error = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
      hasError = true;
      missingFields.push(key);
      newData.set(key, { ...data, error });
    } else if (error) {
      hasError = true;
      missingFields.push(key);
    }
  });

  if (hasError) {
    setUserData(newData);
    Toast.show({
      type: 'error',
      text1: 'Validation Failed',
      text2: `Please fix: ${missingFields.join(', ')}`,
      position: 'bottom',
    });
    return;
  }

  Toast.show({
    type: 'success',
    text1: 'Profile Updated!',
    text2: 'Your information has been saved.',
    position: 'bottom',
  });

  navigation.navigate('Main')
  console.log("✅ Submitting:", Object.fromEntries(newData));
};





  return (

    <ScrollView contentContainerStyle={{ backgroundColor: theme.primary, flexGrow: 1, borderRadius: 15 }}>

      <View style={[styles.body, { backgroundColor: theme.primary }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ zIndex: 1, position: "absolute", marginVertical: 46, marginHorizontal: 20 }}
        >

          <AppNavButton  color={theme.secondary}/>
        </TouchableOpacity>
      </View>

      <View style={{ borderRadius: 15, backgroundColor: theme.background, flex: 1, padding: 26 }}>

        <Text style={[styles.text, {
          color: theme.highlightedText,
          fontFamily: Fonts.family.bold,
          fontSize: Fonts.size.xxxl,
          fontWeight: Fonts.weight.bold,
          letterSpacing: 1
        }]}>Hello! Register to get started</Text>

        <View style={styles.inputs}>
          <CustomInput
            inputRef={usernameRef}
            icon={require('../../../assets/images/user.png')}
            label={"Username"}
            placeholder={"Enter your name"}
            type={"Username"}
            onValidateInput={(data) => {
              setUserData(prev => {
                const newData = new Map(prev);
                newData.set("username", { value: data.input, error: data.error });
                return newData;
              });
            }}
            onSubmitEditing={() => { emailRef.current?.focus() }}
            returnKeyType='next'
          />

          <EmailInput
            ref={emailRef}
            onValidEmail={(data) => {
              setUserData(prev => {
                const newData = new Map(prev);
                newData.set("email", {
                  value: data.email,
                  error: data.email?.trim() ? data.error : "Email is required"
                });
                return newData;
              });
            }}
            returnKeyType="next"
            onSubmitEditing={() => addressRef.current?.focus()}
          />

          <CustomInput
            inputRef={addressRef}
            label={"Address"}
            icon={require('../../../assets/images/home.png')}
            placeholder={"Enter your Address"}
            type={"Address"}
            onValidateInput={(data) => {
              setUserData(prev => {
                const newData = new Map(prev);
                newData.set("Address", { value: data.input, error: data.error });
                return newData;
              });
            }}
            onSubmitEditing={() => { landmarkRef.current?.focus() }}
            returnKeyType='next'
          />

          <CustomInput
            inputRef={landmarkRef}
            label={"Landmark"}
            icon={require('../../../assets/images/pin.png')}
            placeholder={"Enter your  Landmark"}
            type={"Landmark"}
            onValidateInput={(data) => {
              setUserData(prev => {
                const newData = new Map(prev);
                newData.set("Landmark", { value: data.input, error: data.error });
                return newData;
              });
            }}
            onSubmitEditing={() => { landmarkRef.current?.focus() }}
            returnKeyType='next'
          />

        </View>

        <AppButton title={"Update"} onAction={() => updateProfile(userData)} />



      </View>

    </ScrollView>
  );
}


export default Signup


const styles = StyleSheet.create({
  body: {
    flex: 1,

  },
  inputs: {
    marginTop: 20,

  }
})