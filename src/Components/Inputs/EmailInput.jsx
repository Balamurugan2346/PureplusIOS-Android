import Fonts from '../../../assets/fonts/Fonts';
import React, { useCallback, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '../../Context/ThemeContext';


const EmailInput = ({ onValidEmail, ref, returnKeyType = 'next', onSubmitEditing ,style,styleText,initialValue='',tintColor ='#E0F1E5' }) => {
  const [email, setEmail] = useState(initialValue)

  const [error, setError] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const { theme } = useTheme()

  const validateEmail = useCallback((text) => {
    const trimmed = text.trim();
    setEmail(trimmed);

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (trimmed.length === 0) {
      const errorMessage = "Email is required"
      setError(errorMessage);
      onValidEmail?.({ email: null, error: errorMessage });
    } else if (!regex.test(trimmed)) {
      const errorMessage = "Enter a valid email"
      setError(errorMessage);
      onValidEmail?.({ email: null, error: errorMessage });
    } else {
      setError('');
      onValidEmail?.({ email: trimmed, error: '' });
    }
  }, [onValidEmail]);

  return (
    <>
      {/* <Text style={{color:theme.text,marginBottom:5,marginLeft:5,fontSize:Fonts.size.sm,fontFamily:Fonts.family.regular}}>Email Address</Text> */}

      <View
        style={
          [styles.inputContainer,
          {
            borderColor: isFocused ? theme.primary : theme.inputContainerBorder,
            borderWidth: isFocused ? 1 : 1,
            backgroundColor: theme.inputContainer
          },
            style
          ]}>

        <Image source={require('../../../assets/images/mail.png')} style={{ width: 20, tintColor: tintColor, marginLeft: 5, height: 20 }} />
        <TextInput
          ref={ref}
          style={[{ marginLeft: 10, width: "100%", color: theme.text, fontSize: Fonts.size.sm, fontFamily: Fonts.family.regular },styleText]}
          value={email}
          onChangeText={validateEmail}
          keyboardType='email-address'
          placeholder='Enter your email'
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          placeholderTextColor={theme.text}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>

      <Text style={[{
        marginLeft: 5, color: theme.error,
        fontFamily: Fonts.family.light, fontSize: Fonts.size.xs
      }]}>{error}</Text>
    </>
  );
};


export default EmailInput;

const styles = StyleSheet.create({
  inputContainer: {
    width: "100%",
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
  }
});
