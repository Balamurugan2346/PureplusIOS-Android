import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { clearError, Login, sendMobileNumber } from '../../Redux/Slices/AuthSlice';
import AppLoading from '../../Components/AppLoading';
import AppText from '../../Components/AppText';
import AuthShell from '../../Components/AuthShell';
import OtpInput from '../../Components/Inputs/OTPInput';
import { useTheme } from '../../Context/ThemeContext';
import { useToast } from '../../Components/Toast/ToastProvider';
import { storeData } from '../../OfflineStore/OfflineStore';
import { fontFamily } from '../../Themes/Themes';

const OtpVerificationScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const { sendMobile, loginState } = useSelector((state) => state.auth);

  const { loading, mobileNumber, otp: savedOtp } = sendMobile;
  const { loading: isLoginLoading } = loginState;

  // Resend countdown (seconds). 5s is a testing value — bump to 30/60 later.
  const timer = 5;

  const { theme } = useTheme();

  const intervalRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState(timer);

  const startTimer = () => {
    clearInterval(intervalRef.current);
    setTimeLeft(timer);
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const login = (mobileNumber, otp) => {
    if (mobileNumber != null && otp != null) {
      dispatch(
        Login({
          mobileNumber: `${mobileNumber}`,
          otp: otp,
          onSuccess: async (data) => {
            try {
              if (savedOtp == otp) {
                if (data.success && data.isNewUser) {
                  showToast(`Successfully completed`);
                  await storeData('accessToken', data.token);
                  navigation.replace('Username');
                } else if (data.success) {
                  showToast(`Successfully completed11`);
                  await storeData('isLoggedIn', '1');
                  await storeData('accessToken', data.token);
                  await storeData('userID', data.user.id.toString());
                  navigation.reset({ index: 0, routes: [{ name: 'DashBoard' }] });
                }
              } else {
                showToast('Invalid OTP', true);
              }
            } catch (e) {
              showToast(`ERROR:${e}`);
            }
          },
          onError: (err) => {
            showToast(`ERROR: ${err} from login`, true);
            dispatch(clearError());
          },
        })
      );
    } else {
      showToast(`Please try again later...`, true);
    }
  };

  const restartTimer = () => {
    if (mobileNumber != null) {
      sendNumber(mobileNumber);
    } else {
      showToast(`Please enter the mobile number again`, true);
    }
    if (!loading) {
      startTimer();
    }
  };

  const sendNumber = (ml) => {
    dispatch(
      sendMobileNumber({
        mobileNumber: `${ml}`,
        onSuccess: (data) => {
          showToast(`SUCCESS: OTP sent to ${ml} and OTP is ${data.otp}`);
        },
        onError: (err) => {
          showToast(`ERROR: ${err} from login`, true);
          dispatch(clearError());
        },
      })
    );
  };

  useEffect(() => {
    if (!loading) {
      startTimer();
    }
    return () => clearInterval(intervalRef.current);
  }, [loading]);

  return (
    <AuthShell variant="otp" onBack={() => navigation.goBack()}>
      {isLoginLoading && <AppLoading isVisible={isLoginLoading} />}
      {loading && <AppLoading isVisible={loading} />}

      <AppText variant="display" color={theme.ink}>OTP Verification</AppText>

      <AppText variant="body" color={theme.inkMuted}>
        Enter the 4-digit code sent to{' '}
        <Text style={{ color: theme.ink, fontFamily: fontFamily.semibold }}>+91 {mobileNumber}</Text>
      </AppText>

      <OtpInput
        onOtpComplete={(otp) => {
          login(mobileNumber, otp);
        }}
      />

      {timeLeft > 0 ? (
        <Text style={[styles.resend, { color: theme.inkMuted }]}>
          Resend code in{' '}
          <Text style={{ color: theme.primary, fontFamily: fontFamily.semibold }}>{timeLeft} sec</Text>
        </Text>
      ) : (
        <TouchableOpacity onPress={restartTimer}>
          <Text style={[styles.resendLink, { color: theme.primary }]}>Resend OTP</Text>
        </TouchableOpacity>
      )}

      <AppText variant="caption" color={theme.inkMuted} style={styles.hint}>
        We verify automatically once all four digits are in.
      </AppText>
    </AuthShell>
  );
};

export default OtpVerificationScreen;

const styles = StyleSheet.create({
  resend: { alignSelf: 'center', fontFamily: fontFamily.regular, fontSize: 13, lineHeight: 18 },
  resendLink: { alignSelf: 'center', fontFamily: fontFamily.semibold, fontSize: 13, lineHeight: 18, textDecorationLine: 'underline' },
  hint: { textAlign: 'center' },
});
