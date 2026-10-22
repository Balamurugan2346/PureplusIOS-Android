import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import AppButton from '../../Components/AppButton';
import AppText from '../../Components/AppText';
import BrandShape from '../../Components/BrandShape';
import { useTheme } from '../../Context/ThemeContext';
import { fontFamily, radius, spacing, floatShadow } from '../../Themes/Themes';

/**
 * Login / Register choice (redesign 01). Both buttons now route to Login — sign-up
 * happens through mobile + OTP (the standalone Signup screen is removed).
 */
const LoginOrRegister = ({ navigation }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={[styles.band, { backgroundColor: theme.sky200 }]}>
        <BrandShape shape="drop" size={220} color={theme.brandBlue} style={{ right: -60, top: -70 }} />
        <BrandShape shape="leaf" size={110} color={theme.brandGreen} style={{ left: 30, top: 60 }} />
      </View>

      <View style={[styles.sheet, { backgroundColor: theme.surfaceCard }, floatShadow]}>
        <View style={styles.lockup}>
          <Image source={require('../../../assets/images/logo_new.png')} resizeMode="contain" style={styles.logo} />
          <Text style={[styles.wordmark, { color: theme.ink }]}>Pureplus</Text>
        </View>

        <AppText variant="body" color={theme.inkMuted} style={styles.tagline}>
          Fresh drinking water at your doorstep. Pay at delivery, return your empties anytime.
        </AppText>

        <View style={styles.buttons}>
          <AppButton onAction={() => navigation.navigate('Login')} title="Login" />
          <AppButton borderOnly onAction={() => navigation.navigate('Login')} title="Register" />
        </View>
      </View>
    </View>
  );
};

export default LoginOrRegister;

const styles = StyleSheet.create({
  container: { flex: 1 },
  band: { height: 200, overflow: 'hidden' },
  sheet: {
    flex: 1,
    marginTop: -32,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingVertical: 48,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lockup: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  logo: { width: 64, height: 64 },
  wordmark: { fontFamily: fontFamily.bold, fontSize: 36, lineHeight: 40 },
  tagline: { textAlign: 'center' },
  buttons: { width: '100%', gap: spacing.md },
});
