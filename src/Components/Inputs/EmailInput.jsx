import React, { useCallback, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '../../Context/ThemeContext';
import { fontFamily, radius, spacing } from '../../Themes/Themes';

/**
 * Email input (00-foundation). Props preserved: onValidEmail, ref, returnKeyType,
 * onSubmitEditing, style, styleText, initialValue, tintColor. Added: label.
 */
const EmailInput = ({
  onValidEmail,
  ref,
  returnKeyType = 'next',
  onSubmitEditing,
  style,
  styleText,
  initialValue = '',
  tintColor,
  label,
}) => {
  const [email, setEmail] = useState(initialValue);
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const { theme } = useTheme();

  const validateEmail = useCallback((text) => {
    const trimmed = text.trim();
    setEmail(trimmed);

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (trimmed.length === 0) {
      const errorMessage = 'Email is required';
      setError(errorMessage);
      onValidEmail?.({ email: null, error: errorMessage });
    } else if (!regex.test(trimmed)) {
      const errorMessage = 'Enter a valid email';
      setError(errorMessage);
      onValidEmail?.({ email: null, error: errorMessage });
    } else {
      setError('');
      onValidEmail?.({ email: trimmed, error: '' });
    }
  }, [onValidEmail]);

  const borderColor = error ? theme.danger : isFocused ? theme.primary : theme.borderStrong;
  const borderWidth = error || isFocused ? 2 : 1;
  const iconTint = error ? theme.danger : isFocused ? theme.primary : (tintColor || theme.inkMuted);

  return (
    <View style={{ marginTop: spacing.md }}>
      {label ? <Text style={[styles.label, { color: theme.ink }]}>{label}</Text> : null}

      <View style={[styles.inputContainer, { borderColor, borderWidth, backgroundColor: theme.surfaceCard }, style]}>
        <Image source={require('../../../assets/images/mail.png')} style={{ width: 20, height: 20, tintColor: iconTint }} />
        <TextInput
          ref={ref}
          style={[styles.textInput, { color: theme.ink }, styleText]}
          value={email}
          onChangeText={validateEmail}
          keyboardType="email-address"
          placeholder="Enter your email"
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
};

export default EmailInput;

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
