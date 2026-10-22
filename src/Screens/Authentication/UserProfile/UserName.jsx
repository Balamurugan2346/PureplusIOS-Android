import React, { useCallback, useRef, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import AppButton from '../../../Components/AppButton';
import AppModal from '../../../Components/AppModal';
import AppText from '../../../Components/AppText';
import AuthShell from '../../../Components/AuthShell';
import CustomInput from '../../../Components/Inputs/CustomInput';
import { clearState, saveTempUserDetails } from '../../../Redux/Slices/AuthSlice';
import { useTheme } from '../../../Context/ThemeContext';
import { useToast } from '../../../Components/Toast/ToastProvider';

const UserName = ({ navigation }) => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [modalVisible, setModalVisible] = useState(false);
  const usernameRef = useRef(null);
  const [userName, setUserName] = useState({ data: null, error: null });
  const { theme } = useTheme();

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        setModalVisible(true);
        return true;
      };
      const subscription = BackHandler.addEventListener('hardwareBackPress', backAction);
      return () => subscription.remove();
    }, [])
  );

  const topRight = <AppText variant="caption" color={theme.inkMuted}>Step 1 of 2</AppText>;

  return (
    <AuthShell variant="name" onBack={() => setModalVisible(true)} topRight={topRight}>
      <AppModal
        title="Reset Login?"
        description="Are you sure you want to log in with a different mobile number?"
        visible={modalVisible}
        setModalVisible={setModalVisible}
        onPositive={() => {
          navigation.goBack();
          setModalVisible(false);
          dispatch(clearState());
        }}
        onNegative={() => {
          setModalVisible(false);
        }}
      />

      <AppText variant="display" color={theme.ink} style={styles.center}>Welcome</AppText>
      <AppText variant="body" color={theme.inkMuted} style={styles.center}>Enter your name to continue</AppText>

      <View>
        <CustomInput
          inputRef={usernameRef}
          icon={require('../../../../assets/images/user.png')}
          label="Full name"
          placeholder="Enter your name"
          type="Username"
          onValidateInput={(data) => setUserName({ data: data.input, error: data.error })}
          returnKeyType="done"
        />
        <AppText variant="caption" color={theme.inkMuted} style={styles.helper}>
          This is how your delivery partner will greet you.
        </AppText>
      </View>

      <AppButton
        title="Continue"
        onAction={() => {
          if (userName.data != null) {
            dispatch(saveTempUserDetails({ userName: userName }));
            navigation.navigate('EmailScreen');
          } else {
            showToast('Incomplete Username', true);
          }
        }}
      />
    </AuthShell>
  );
};

export default UserName;

const styles = StyleSheet.create({
  center: { textAlign: 'center' },
  helper: { marginTop: 6 },
});
