import React, { useRef, useState } from 'react';
import { Keyboard, StyleSheet, TextInput, View } from 'react-native';
import { useTheme } from '../../Context/ThemeContext';
import { fontFamily, radius } from '../../Themes/Themes';

/**
 * 4-box OTP input (00-foundation). Behavior preserved exactly: auto-advance on
 * entry, backspace moves focus back, onOtpComplete fires on the 4th digit.
 */
const OtpInput = ({ onOtpComplete }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputs = useRef([]);
  const { theme } = useTheme();

  const handleChange = (text, index) => {
    if (/^\d$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      if (index < 3) {
        inputs.current[index + 1].focus();
      } else {
        onOtpComplete?.(newOtp.join(''));
        setOtp(['', '', '', '']);
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
    <View style={styles.container}>
      {otp.map((digit, index) => {
        const focused = focusedIndex === index;
        const filled = !!digit;
        const borderColor = focused || filled ? theme.primary : theme.borderStrong;
        const borderWidth = focused ? 2 : filled ? 1.5 : 1;
        const backgroundColor = filled ? theme.primaryTint : theme.surfaceCard;
        return (
          <TextInput
            key={index}
            ref={(r) => (inputs.current[index] = r)}
            value={digit}
            returnKeyType={index > 2 ? 'done' : 'next'}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(-1)}
            keyboardType="number-pad"
            maxLength={1}
            style={[styles.input, { color: theme.ink, borderColor, borderWidth, backgroundColor }]}
          />
        );
      })}
    </View>
  );
};

export default OtpInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 20,
    justifyContent: 'space-between',
  },
  input: {
    width: 72,
    height: 68,
    borderRadius: radius.sm,
    textAlign: 'center',
    fontSize: 22,
    lineHeight: 28,
    fontFamily: fontFamily.semibold,
  },
});
