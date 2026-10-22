import React, { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../Context/ThemeContext';
import { countries } from '../../Utils/CountriesPhoneRegex';
import { fontFamily, radius, spacing } from '../../Themes/Themes';

/**
 * Phone-number input (00-foundation). A "+91" prefix (the slot for a future
 * country picker) sits before the field. Props/behavior preserved exactly:
 * onValidateNumber, returnKeyType, onSubmitEditing, onClick, textStyle, style,
 * initialValue, editable + the closeDropdown/isDropdownOpen imperative handle.
 */
const NumberInput = forwardRef(({ onValidateNumber, returnKeyType = 'done', onSubmitEditing, onClick, textStyle, style, initialValue, editable = true, label }, ref) => {
  const [number, setNumber] = useState(initialValue);
  const [error, setError] = useState('');
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [country, setCountry] = useState(countries[0]);
  const [showDropdown, setShowDropdown] = useState(false);

  useImperativeHandle(ref, () => ({
    closeDropdown: () => setShowDropdown(false),
    isDropdownOpen: () => showDropdown,
  }));

  const validateNumber = useCallback((num) => {
    setNumber(num);
    const phoneRegex = country.regex;
    if (num.length === 0) {
      const errorMessage = 'Phone number required';
      setError(errorMessage);
      onValidateNumber?.({ number: null, error: errorMessage });
    } else if (!phoneRegex.test(num)) {
      const errorMessage = 'Invalid number';
      setError(errorMessage);
      onValidateNumber?.({ number: null, error: errorMessage });
    } else {
      setError('');
      onValidateNumber?.({ number: `${num}`, error: '' });
    }
  }, [country, onValidateNumber]);

  const borderColor = error ? theme.danger : isFocused ? theme.primary : theme.borderStrong;
  const borderWidth = error || isFocused ? 2 : 1;

  return (
    <View style={{ marginTop: spacing.md }}>
      {label ? <Text style={[styles.label, { color: theme.ink }]}>{label}</Text> : null}

      <View style={[styles.inputContainer, { borderColor, borderWidth, backgroundColor: theme.surfaceCard }, style]}>
        <Ionicons name="call-outline" size={18} color={isFocused ? theme.primary : theme.inkMuted} />
        {/* "+91" prefix — the slot for the future country picker */}
        <View style={[styles.prefix, { borderRightColor: theme.borderSubtle }]}>
          <Text style={[styles.prefixText, { color: theme.ink }]}>+91</Text>
        </View>

        <TextInput
          style={[styles.textInput, { color: theme.ink }, textStyle]}
          editable={editable}
          value={number}
          onChangeText={validateNumber}
          keyboardType="number-pad"
          placeholder="Enter your phone number"
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          placeholderTextColor={theme.inkMuted}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>

      {error ? <Text style={[styles.error, { color: theme.danger }]}>{error}</Text> : null}
    </View>
  );
});

export default NumberInput;

const styles = StyleSheet.create({
  label: { fontFamily: fontFamily.medium, fontSize: 13, lineHeight: 18, marginBottom: 6 },
  inputContainer: {
    width: '100%',
    height: 52,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.md,
  },
  prefix: {
    borderRightWidth: 1,
    paddingRight: spacing.md,
    justifyContent: 'center',
  },
  prefixText: { fontFamily: fontFamily.medium, fontSize: 15, lineHeight: 22 },
  textInput: { flex: 1, fontSize: 15, lineHeight: 22, fontFamily: fontFamily.regular, padding: 0 },
  error: { marginTop: 6, fontSize: 12, lineHeight: 16, fontFamily: fontFamily.regular },
});
