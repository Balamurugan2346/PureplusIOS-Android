import React, { useCallback, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '../../Context/ThemeContext';
import { fontFamily, radius, spacing } from '../../Themes/Themes';

/**
 * Labeled text input (00-foundation). Props preserved: onValidateInput, style,
 * textStyle, type, label, icon, placeholder, inputRef, returnKeyType,
 * onSubmitEditing, initialValue, tintColor. The `label` now renders when passed.
 */
const CustomInput = ({
  onValidateInput,
  style,
  textStyle,
  type,
  label,
  icon,
  placeholder,
  inputRef,
  returnKeyType = 'next',
  onSubmitEditing,
  initialValue = '',
  tintColor,
}) => {
  const [input, setInput] = useState(initialValue);
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
  }, [onValidateInput, type]);

  const borderColor = error ? theme.danger : isFocused ? theme.primary : theme.borderStrong;
  const borderWidth = error || isFocused ? 2 : 1;
  const iconTint = error ? theme.danger : isFocused ? theme.primary : (tintColor || theme.inkMuted);

  return (
    <View style={{ marginTop: spacing.md }}>
      {label ? <Text style={[styles.label, { color: theme.ink }]}>{label}</Text> : null}

      <View style={[styles.inputContainer, { borderColor, borderWidth, backgroundColor: theme.surfaceCard }, style]}>
        {icon ? <Image source={icon} style={{ width: 20, height: 20, tintColor: iconTint }} /> : null}
        <TextInput
          ref={inputRef}
          style={[styles.textInput, { color: theme.ink }, textStyle]}
          value={input}
          onChangeText={validateInput}
          keyboardType="default"
          placeholder={placeholder}
          placeholderTextColor={theme.inkMuted}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
        />
      </View>

      {error ? <Text style={[styles.error, { color: theme.danger }]}>{error}</Text> : null}
    </View>
  );
};

export default CustomInput;

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
  textInput: { flex: 1, fontSize: 15, lineHeight: 22, fontFamily: fontFamily.regular, padding: 0 },
  error: { marginTop: 6, fontSize: 12, lineHeight: 16, fontFamily: fontFamily.regular },
});
