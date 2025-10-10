import Fonts from '../../../assets/fonts/Fonts';
import React, { useCallback, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '../../Context/ThemeContext';


const CustomInput = ({
  onValidateInput,
  style,
  type,
  label,
  icon,
  placeholder,
  inputRef,
  returnKeyType = 'next',
  onSubmitEditing,
}) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const { theme } = useTheme();

  const validateInput = useCallback((text) => {
    setInput(text);
    if (text.length === 0) {
      const errorMessage = `${type} is required`;
      setError(errorMessage);
      onValidateInput?.({ input: null, error: errorMessage });
    } else {
      setError('');
      onValidateInput?.({ input: text, error: '' });
    }
  }, [onValidateInput]);

  return (
    <View style={{ marginTop: 10 }}>
      {/* <Text style={{
        color: theme.text, marginBottom: 5, marginLeft: 5,
        fontSize: Fonts.size.xs, fontFamily: Fonts.family.regular
      }}>{label}</Text> */}

      <View style={[
        styles.inputContainer,
        {
          borderColor: isFocused ? theme.primary : theme.inputContainerBorder,
          borderWidth: isFocused ? 1 : 1,
          backgroundColor: theme.inputContainer
        },style]}>
        <Image source={icon} style={{ width: 20, tintColor: theme.text, marginLeft: 5, height: 20 }} />
        <TextInput
          ref={inputRef}
          style={{ marginLeft: 10, width: "100%", color: theme.text , fontSize:Fonts.size.sm, fontFamily:Fonts.family.regular}}
          value={input}
          onChangeText={validateInput}
          keyboardType='default'
          placeholder={placeholder}
          placeholderTextColor={theme.text}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
        />
      </View>

      <Text style={{
        marginLeft: 5, color: theme.error,
        fontFamily: Fonts.family.light, fontSize: Fonts.size.xs
      }}>{error}</Text>
    </View>
  );
};



export default CustomInput;

const styles = StyleSheet.create({
inputContainer : {
  width:"100%",
  padding:5,
  flexDirection:"row",
  alignItems:"center",
  borderRadius:14,
}
});
