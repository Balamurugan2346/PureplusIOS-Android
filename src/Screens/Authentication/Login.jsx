import React, { useRef, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { clearError, sendMobileNumber, clearIsFetched, saveMobileNumberLocally } from '../../Redux/Slices/AuthSlice';
import NumberInput from '../../Components/Inputs/NumberInput';
import AppButton from '../../Components/AppButton';
import AppText from '../../Components/AppText';
import AuthShell from '../../Components/AuthShell';
import { useTheme } from '../../Context/ThemeContext';
import { useToast } from '../../Components/Toast/ToastProvider';
import { fontFamily } from '../../Themes/Themes';

export default function Login({ navigation }) {
  const dispatch = useDispatch();
  const { sendMobile } = useSelector((state) => state.auth);
  const { showToast } = useToast();

  const { loading } = sendMobile;

  const [num, setNum] = useState(null);
  const { theme } = useTheme();
  const numberRef = useRef(null);

  const linkText = { fontFamily: fontFamily.medium, fontSize: 12, lineHeight: 18, color: theme.primary, textDecorationLine: 'underline' };

  const sendNumber = (ml) => {
    dispatch(
      sendMobileNumber({
        mobileNumber: `${ml}`,
        onSuccess: (data) => {
          console.log('received data', data);
          dispatch(saveMobileNumberLocally(ml));
          dispatch(clearIsFetched());
          showToast(`SUCCESS: OTP sent to ${ml} and OTP is ${data.otp}`);
          navigation.navigate('OtpVerification');
        },
        onError: (err) => {
          showToast(`ERROR: ${err} from login`, true);
          dispatch(clearError());
        },
      })
    );
  };

  const onSignIn = () => {
    num ? sendNumber(num) : showToast('Enter valid number', true);
  };

  const topLeft = (
    <View style={styles.lockup}>
      <Image source={require('../../../assets/images/logo_new.png')} resizeMode="contain" style={styles.logo} />
      <Text style={[styles.brand, { color: theme.ink }]}>Pureplus</Text>
    </View>
  );

  return (
    <AuthShell variant="login" topLeft={topLeft}>
      <View>
        <AppText variant="displayLight" color={theme.ink}>Drink Water</AppText>
        <AppText variant="display" color={theme.ink}>Live Better</AppText>
      </View>

      <AppText variant="body" color={theme.inkMuted}>
        Sign in with your mobile number. We'll send you a 4-digit code.
      </AppText>

      <NumberInput
        ref={numberRef}
        label="Mobile number"
        onClick={() => setNum(null)}
        onValidateNumber={(val) => (val.number ? setNum(val.number) : setNum(null))}
        onSubmitEditing={onSignIn}
      />

      <AppButton title="Sign in" isLoading={loading} loadingText="Signing in…" onAction={onSignIn} />

      <Text style={[styles.terms, { color: theme.inkMuted }]}>
        By signing in, you agree to our{' '}
        <Text style={linkText} onPress={() => navigation.navigate('PrivacyPolicy')}>Terms</Text>
        {' '}and{' '}
        <Text style={linkText} onPress={() => navigation.navigate('PrivacyPolicy')}>Privacy Policy</Text>
      </Text>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  lockup: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logo: { width: 36, height: 36 },
  brand: { fontFamily: fontFamily.semibold, fontSize: 20, lineHeight: 24 },
  terms: { textAlign: 'center', fontFamily: fontFamily.regular, fontSize: 12, lineHeight: 18 },
});
