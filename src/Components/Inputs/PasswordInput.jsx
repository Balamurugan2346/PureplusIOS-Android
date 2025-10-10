import { useCallback, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fonts from '../../../assets/fonts/Fonts'; // adjust as per your fonts setup
import { useTheme } from '../../Context/ThemeContext'; // adjust import based on your project

const PasswordInput = ({ onValidPassword,onSubmitEditing ,inputRef  }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { theme } = useTheme();

  const validatePassword = useCallback((text) => {
    setPassword(text);

    if (text.length === 0) {
      setError("Password is required");
      onValidPassword?.(null);
    } else if (text.length < 6) {
      setError("Password must be at least 6 characters");
      onValidPassword?.(null);
    } else {
      setError('');
      onValidPassword?.(text);
    }
  }, [onValidPassword]);

  return (
    <>
      {/* <Text style={{
        color: theme.text,
        marginBottom: 5,
        marginLeft: 5,
        fontSize: Fonts.size.sm,
        fontFamily: Fonts.family.regular
      }}>
        Password
      </Text> */}

      <View style={[
        styles.inputContainer,
        {
         borderColor: isFocused ? theme.primary : theme.inputContainerBorder,
            borderWidth: isFocused ? 1 : 1,
            backgroundColor: theme.inputContainer
        }
      ]}>
        <Image
          source={require('../../../assets/images/lock.png')}
          style={{ width: 20, height: 20, marginLeft: 5, tintColor: theme.text }}
        />

        <TextInput
        ref={inputRef}
          style={{ marginLeft: 10, width: "85%", color: theme.text ,fontSize:Fonts.size.sm, fontFamily:Fonts.family.regular }}
          value={password}
          onChangeText={validatePassword}
          placeholder='Enter password'
          placeholderTextColor={theme.text}
          secureTextEntry={!isVisible}
          returnKeyType='done'
          onSubmitEditing={onSubmitEditing}
          onFocus={() => setIsFocused(true)}
          onBlur={()=>setIsFocused(false)}
        />

        <TouchableOpacity style={{marginLeft:-15}}  onPress={() => setIsVisible(prev => !prev)}>
          <Ionicons
            name={isVisible ? "eye-outline" : "eye-off-outline"}
            size={20}
            color={theme.text}
          />
        </TouchableOpacity>
      </View>

         <Text style={{
        marginLeft: 5, color: theme.error,
        fontFamily: Fonts.family.light, fontSize: Fonts.size.xs
      }}>{error}</Text>
    </>
  );
};

export default PasswordInput;

const styles = StyleSheet.create({
  inputContainer: {
    width: "100%",
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
  }
});
