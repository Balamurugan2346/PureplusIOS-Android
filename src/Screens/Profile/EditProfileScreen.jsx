import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useToast } from '../../Components/Toast/ToastProvider';
import { updateUserProfile, getUserProfile } from '../../Redux/Slices/ProfileSlice';
import FirstLetterAvatar from '../../Components/Profile/FirstLetterAvatar'

const EditProfileScreen = ({ navigation }) => {

  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { showToast } = useToast();

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

    const emailRegex =
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

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

    <View style={[styles.container, { paddingBottom: insets.bottom }]}>

      {/* HEADER */}

      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backButton, {
            backgroundColor: "#8fa6bf",
            padding: 10,
            borderRadius: 12,
            marginRight: 12
          }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        {/* AVATAR */}

        <View style={styles.avatarContainer}>

          <FirstLetterAvatar
            input={profileData.fullName}
          />

          {/* <View style={styles.editIcon}>
            <Ionicons name="pencil" size={14} color="#fff" />
          </View> */}

          <Text style={styles.changePhoto}>Profile</Text>

        </View>


        {/* NAME */}

        <Text style={styles.label}>Name</Text>

        <View style={styles.inputCard}>
          <Ionicons name="person-outline" size={18} color="#888" />
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={validateName}
          />
        </View>

        {nameError ? <Text style={styles.error}>{nameError}</Text> : null}


        {/* EMAIL */}

        <Text style={styles.label}>Email</Text>

        <View style={styles.inputCard}>
          <Ionicons name="mail-outline" size={18} color="#888" />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={validateEmail}
          />
        </View>

        {emailError ? <Text style={styles.error}>{emailError}</Text> : null}


        {/* PHONE */}

        <Text style={styles.label}>Phone Number</Text>

        <View style={[styles.inputCard, { backgroundColor: "#f1f4f7" }]}>
          <Ionicons name="call-outline" size={18} color="#888" />
          <TextInput
            style={styles.input}
            value={phone}
            editable={false}
          />
        </View>

        <Text style={styles.note}>
          Note: Number can't be changed
        </Text>


        {/* SAVE */}

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveText}>
            {loading ? "Saving..." : "Save Changes"}
          </Text>
        </TouchableOpacity>

      </ScrollView>

    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#f5f7fa"
  },

  header: {
    backgroundColor: "#0c1c2c",
    paddingTop: 40,
    paddingBottom: 18,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    flexDirection: "row",
    alignItems: "center"
  },

  backButton: {

  },

  headerTitle: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600"
  },

  content: {
    padding: 20
  },

  avatarContainer: {
    alignItems: "center",
    marginBottom: 20
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 60
  },

  editIcon: {
    position: "absolute",
    right: 110,
    bottom: 30,
    backgroundColor: "#ff6b00",
    padding: 6,
    borderRadius: 20
  },

  changePhoto: {
    color: "black",
    fontWeight: 500,
    marginTop: 8,
    fontSize: 13
  },

  label: {
    fontSize: 13,
    color: "#666",
    marginBottom: 6,
    marginTop: 10
  },

  inputCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#d9e0e6",
    paddingHorizontal: 12,
    backgroundColor: "#fff"
  },

  input: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8
  },

  note: {
    textAlign: "center",
    fontSize: 12,
    color: "#8a9ba8",
    marginTop: 8
  },

  saveButton: {
    backgroundColor: "#1f95c9",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 25
  },

  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600"
  },

  error: {
    color: "red",
    fontSize: 12,
    marginTop: 3
  }

});