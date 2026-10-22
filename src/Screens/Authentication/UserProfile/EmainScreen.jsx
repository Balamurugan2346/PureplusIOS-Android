import React, { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import AppButton from '../../../Components/AppButton';
import AppText from '../../../Components/AppText';
import AuthShell from '../../../Components/AuthShell';
import EmailInput from '../../../Components/Inputs/EmailInput';
import AppLoading from '../../../Components/AppLoading';
import { useTheme } from '../../../Context/ThemeContext';
import { clearError, clearState, createProfile, saveTempUserDetails } from '../../../Redux/Slices/AuthSlice';
import { useToast } from '../../../Components/Toast/ToastProvider';
import { storeData } from '../../../OfflineStore/OfflineStore';

const EmailScreen = ({ navigation }) => {
  const { showToast } = useToast();
  const dispatch = useDispatch();

  const emailRef = useRef(null);
  const [email, setEmail] = useState({ data: null, error: null });
  const { theme } = useTheme();

  const { tempUserDetails, createProfile: createProfileState } = useSelector((state) => state.auth);

  const topRight = <AppText variant="caption" color={theme.inkMuted}>Step 2 of 2</AppText>;

  return (
    <AuthShell variant="email" onBack={() => navigation.goBack()} topRight={topRight}>
      {createProfileState.loading && <AppLoading isVisible={createProfileState.loading} />}

      <AppText variant="display" color={theme.ink} style={styles.center}>Email</AppText>
      <AppText variant="body" color={theme.inkMuted} style={styles.center}>Enter your email to continue</AppText>

      <View>
        <EmailInput
          ref={emailRef}
          label="Email address"
          onValidEmail={(data) => setEmail({ data: data.email, error: data.error })}
          returnKeyType="done"
        />
        <AppText variant="caption" color={theme.inkMuted} style={styles.helper}>
          We'll send order receipts and invoices here.
        </AppText>
      </View>

      <AppButton
        title="Continue"
        onAction={() => {
          if (!email.error && email.data) {
            dispatch(saveTempUserDetails({ email: email.data }));
            const userName = tempUserDetails.userName;
            if (userName && email.data) {
              dispatch(createProfile({
                fullName: userName.data,
                email: email.data,
                onSuccess: (data) => {
                  if (data.success == true) {
                    var userId = data.data.userId;
                    storeData('userID', userId.toString());
                    storeData('isLoggedIn', '1');
                    dispatch(clearState());
                    // Reset the stack so the auth screens (Login/OTP/Name/Email) are
                    // cleared — back from Dashboard then exits to the launcher instead
                    // of returning to the Email step.
                    navigation.reset({ index: 0, routes: [{ name: 'DashBoard' }] });
                  } else {
                    showToast(`Something went wrong`, true);
                  }
                },
                onError: (err) => {
                  showToast(`ERROR: ${err}`, true);
                  dispatch(clearError());
                },
              }));
            }
          } else {
            showToast(`Incomplete Email : ${email.error}`, true);
          }
        }}
      />
    </AuthShell>
  );
};

export default EmailScreen;

const styles = StyleSheet.create({
  center: { textAlign: 'center' },
  helper: { marginTop: 6 },
});
