import React, { useRef, useState } from 'react';
import { Keyboard, StyleSheet, TextInput, View } from 'react-native';
import { useTheme } from '../../Context/ThemeContext';

const OtpInput = ({ onOtpComplete }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputs = useRef([]);
  const { theme } = useTheme()
  const handleChange = (text, index) => {
    if (/^\d$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      if (index < 3) {
        inputs.current[index + 1].focus();
      } else {
        onOtpComplete?.(newOtp.join(''));
        setOtp(['', '', '', ''])
        Keyboard.dismiss();
      }
    } else if (text === '') {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (otp[index] === '') {
        if (index > 0) {
          inputs.current[index - 1].focus();
        }
      }
    }
  };

  return (
    <View style={{ flexDirection: "column" }}>

      {/* <RegularText text={"Otp"} /> */}
      <View style={[styles.container, {

      }]}>


        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={ref => inputs.current[index] = ref}
            value={digit}
            returnKeyType={index > 2 ? 'done' : 'next'}
            onChangeText={text => handleChange(text, index)}
            onKeyPress={e => handleKeyPress(e, index)}
            keyboardType="number-pad"
            maxLength={1}
            style={[styles.input, { backgroundColor: theme.inputContainer, color: theme.text, marginRight: 10, borderColor: digit ? theme.primary : theme.inputContainerBorder }]}
          />
        ))}
      </View>
    </View>

  );
};

export default OtpInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 20,
    justifyContent: "space-between"
  },
  input: {
    width: 55,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    textAlign: 'center',
    fontSize: 20,
  }
});
