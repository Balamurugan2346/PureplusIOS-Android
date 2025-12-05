import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TopAppBar from '../../Components/TopAppBar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

// Your Inputs
import CustomInput from '../../Components/Inputs/CustomInput';
import EmailInput from '../../Components/Inputs/EmailInput';
import NumberInput from '../../Components/Inputs/NumberInput';
import { useToast } from '../../Components/Toast/ToastProvider';
import { useTheme } from '../../Context/ThemeContext';
import { clearProfileState, saveProfileData, updateUserProfile } from '../../Redux/Slices/ProfileSlice';
import AppLoading from '../../Components/AppLoading';
import { opacity } from 'react-native-reanimated/lib/typescript/Colors';


const EditProfileScreen = ({ navigation }) => {

  const insets = useSafeAreaInsets();
  const { showToast } = useToast()
  const { theme } = useTheme()
  const dispatch = useDispatch()

  // -------- GET EXISTING DATA FROM STORE ----------
  const { profileData, loading, error, isFetched } = useSelector((state) => state.profile);

  // -------- LOCAL STATES FOR EDITING ----------
  const [fullName, setFullName] = useState({ data: profileData.fullName, error: "" });
  const [email, setEmail] = useState({ data: profileData.email, error: "" });
  const [mobile, setMobile] = useState({
    data: profileData.mobileNumber || "",
    error: ""
  });


  // -------- INPUT REFS ----------
  const nameRef = useRef();
  const emailRef = useRef();
  const numRef = useRef()

  // -------- Save Handler ----------
  const handleSave = () => {

    if (fullName.error || email.error || mobile.error) {
      alert("Please fix errors before saving.");
      return;
    }

    const body = {
      fullName: fullName.data,
      email: email.data,
      mobileNumber: mobile.data
    };

    console.log("SAVE BODY:", body);

    // You will call redux or api here:
    // dispatch(updateProfile(body))
    dispatch(
      updateUserProfile({
        profileData: body,
        onSuccess: (data) => {
          console.log("received data", data)
          dispatch(clearProfileState())
          dispatch(saveProfileData(data))
          showToast(`SUCCESS: ProfileUpdated Successfully`)
          navigation.goBack();
        },
        onError: (err) => {
          showToast(`ERROR: ${err} while updating`, true)
          dispatch(clearError())
        }
      })
    );
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <TopAppBar title="Edit Profile" navigation={navigation} />

      <View
      >
        <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>

          {/* <Text style={styles.headerText}>Update Your D?etails</Text> */}

          {/* USERNAME */}
          <CustomInput
            tintColor={theme.background}
            inputRef={nameRef}
            textStyle={{ color: theme.background }}
            style={{ backgroundColor: theme.secondaryBackground }}
            icon={require('../../../assets/images/user.png')}
            label={"Full Name"}
            placeholder={"Enter your name"}
            type={"Username"}
            initialValue={fullName.data}
            onValidateInput={(data) => setFullName({ data: data.input, error: data.error })}
            returnKeyType='next'
            onSubmitEditing={() => emailRef.current?.focus()}
          />

          {/* {loading && (
            <AppLoading isVisible={loading} />
          )} */}
          {/* EMAIL */}
          <EmailInput
            tintColor={theme.background}
            styleText={{ color: theme.background }}
            style={{ backgroundColor: theme.secondaryBackground, marginTop: 15 }}
            ref={emailRef}
            initialValue={email.data}
            onValidEmail={(data) => {
              setEmail({ data: data.email, error: data.error });
            }}
            returnKeyType="done"
          />

          {/* MOBILE NUMBER - NON EDITABLE */}
          {/* <NumberInput
          initialValue ={profileData.mobileNumber}
          textStyle={{color:theme.background}}
           style={{marginTop:10,backgroundColor:theme.secondaryBackground}}
            ref={numRef}
            onClick={() => setMobile(null)}
            onValidateNumber={(val) =>
            // console.log(val)
            { val.number ? setMobile(val.number) : setMobile(null) }
            }
            onSubmitEditing={() => {
              console.log(mobile)
              mobile ? showToast('validate') : setMobile(null)
            }}
          /> */}
          <NumberInput
            editable={false}
            initialValue={profileData.mobileNumber}
            textStyle={{ color: theme.background }}
            style={{ marginTop: 10, backgroundColor: theme.secondaryBackground }}
            ref={numRef}

            // to clear error when user clicks
            onClick={() =>
              setMobile(prev => ({ ...prev, error: "" }))
            }

            // validate (NumberInput gives something like {number:true/false})
            onValidateNumber={(val) => {
              if (val.number) {
                setMobile({ data: val.number, error: "" });
              } else {
                setMobile({ data: "", error: "Invalid mobile number" });
              }
            }}

            onSubmitEditing={() => {
              if (mobile.error || !mobile.data) {
                showToast("Enter valid mobile number", true);
              } else {
                showToast("Valid");
              }
            }}
          />

        </View>

        {/* SAVE BUTTON */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.saveButton,
              {
                opacity: loading ? 0.4 : 1,
                backgroundColor: loading ? "#999" : styles.saveButton.backgroundColor,
              },
            ]}
            disabled={loading}
            onPress={handleSave}
          >
            <Text style={styles.saveBtnText}>
              {loading ? "Saving..." : "Save Changes"}
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#34495e',
    marginBottom: 20,
  },
  readonlyLabel: {
    marginTop: 5,
    fontSize: 13,
    color: '#7f8c8d',
  },
  readonlyValue: {
    marginTop: 3,
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },

  footer: {
    // backgroundColor: 'white',
    padding: 15,
    // borderTopWidth: 1,
    // borderTopColor: '#ecf0f1',
  },
  saveButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveBtnText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
  },
});
