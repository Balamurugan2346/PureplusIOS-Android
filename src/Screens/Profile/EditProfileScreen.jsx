import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useToast } from '../../Components/Toast/ToastProvider';
import { updateUserProfile, getUserProfile } from '../../Redux/Slices/ProfileSlice';
import FirstLetterAvatar from '../../Components/Profile/FirstLetterAvatar'
import TopAppBar from '../../Components/TopAppBar';
import AppText from '../../Components/AppText';
import AppButton from '../../Components/AppButton';
import { fontFamily, radius, spacing } from '../../Themes/Themes';
import { useTheme } from '../../Context/ThemeContext';

const EditProfileScreen = ({ navigation }) => {

  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { theme } = useTheme();

  const { profileData, loading } = useSelector((state) => state.profile);

  /* STATES */
  const [name, setName] = useState(profileData?.fullName || "");
  const [email, setEmail] = useState(profileData?.email || "");
  const [phone] = useState(profileData?.mobileNumber || "");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");

  /* VALIDATION */
  const validateName = (text) => {
    setName(text);
    if (text.length < 3) {
      setNameError("Name must be at least 3 characters");
    } else {
      setNameError("");
    }
  };

  const validateEmail = (text) => {
    setEmail(text);
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(text)) {
      setEmailError("Invalid email address");
    } else {
      setEmailError("");
    }
  };

  /* SAVE */
  const handleSave = () => {
    if (nameError || emailError) {
      showToast("Please fix errors", true);
      return;
    }

    const body = {
      fullName: name,
      email: email,
      mobileNumber: phone
    };

    dispatch(updateUserProfile({
      profileData: body,
      onSuccess: () => {
        dispatch(getUserProfile()).unwrap().then(() => {
          showToast("Profile Updated Successfully");
          navigation.goBack();
        });
      },
      onError: (err) => {
        showToast(err, true);
      }
    }));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>

      <TopAppBar title="Edit Profile" navigation={navigation} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* AVATAR */}
        <View style={styles.avatarContainer}>
          <FirstLetterAvatar width={88} height={88} fontSize={36} input={profileData?.fullName} />
          <AppText variant="caption" color={theme.inkMuted} style={{ marginTop: spacing.sm }}>Profile</AppText>
        </View>

        {/* NAME */}
        <AppText variant="label" color={theme.ink} style={styles.label}>Name</AppText>
        <View style={[styles.inputCard, { backgroundColor: theme.surfaceCard, borderColor: nameError ? theme.danger : theme.borderStrong }]}>
          <Ionicons name="person-outline" size={18} color={theme.inkMuted} />
          <TextInput
            style={[styles.input, { color: theme.ink }]}
            placeholderTextColor={theme.inkMuted}
            value={name}
            onChangeText={validateName}
          />
        </View>
        {nameError ? <Text style={[styles.error, { color: theme.danger }]}>{nameError}</Text> : null}

        {/* EMAIL */}
        <AppText variant="label" color={theme.ink} style={styles.label}>Email</AppText>
        <View style={[styles.inputCard, { backgroundColor: theme.surfaceCard, borderColor: emailError ? theme.danger : theme.borderStrong }]}>
          <Ionicons name="mail-outline" size={18} color={theme.inkMuted} />
          <TextInput
            style={[styles.input, { color: theme.ink }]}
            placeholderTextColor={theme.inkMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={validateEmail}
          />
        </View>
        {emailError ? <Text style={[styles.error, { color: theme.danger }]}>{emailError}</Text> : null}

        {/* PHONE (disabled) */}
        <AppText variant="label" color={theme.ink} style={styles.label}>Phone Number</AppText>
        <View style={[styles.inputCard, styles.inputDisabled, { backgroundColor: theme.surfaceSunken }]}>
          <Ionicons name="call-outline" size={18} color={theme.inkMuted} />
          <TextInput
            style={[styles.input, { color: theme.inkMuted }]}
            value={phone}
            editable={false}
          />
          <Ionicons name="lock-closed-outline" size={16} color={theme.inkMuted} />
        </View>
        <AppText variant="caption" color={theme.inkMuted} style={styles.note}>
          Note: Number can't be changed
        </AppText>

      </ScrollView>

      {/* SAVE */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.xl }]}>
        <AppButton title="Save Changes" isLoading={loading} loadingText="Saving…" onAction={handleSave} />
      </View>

    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm, paddingBottom: 40 },

  avatarContainer: {
    alignItems: "center",
    marginVertical: spacing.lg,
  },

  label: { marginBottom: 6, marginTop: spacing.md },

  inputCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.md,
    borderWidth: 1.5,
    paddingHorizontal: spacing.md,
  },
  inputDisabled: {
    borderWidth: 0,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    marginLeft: spacing.sm,
    fontFamily: fontFamily.medium,
    fontSize: 15,
  },

  note: {
    textAlign: "center",
    marginTop: spacing.sm,
  },

  error: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    marginTop: 4,
  },

  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
});
