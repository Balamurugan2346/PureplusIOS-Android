// import AppNavButton from '../../Components/AppNavButton';
// import { useTheme } from '../../Context/ThemeContext';
// import Fonts from '../../../assets/fonts/Fonts';
// import React from 'react';
// import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import UsernameInput from '../../Components/Inputs/CustomInput';
// import EmailInput from '../../Components/Inputs/EmailInput';
// import PhoneNumberInput from '../../Components/Inputs/NumberInput';

// const ProfileScreen = ({navigation}) => {

//    const { theme } = useTheme()

//   const appVersion = '1.0';


//     const headerConfig = {
//     color: theme.text,
//     fontFamily: Fonts.family.semiBold,
//     fontSize: Fonts.size.sm
//   }

//   const textConfig = {
//     fontFamily: Fonts.family.semiBold,
//     fontSize: Fonts.size.lg
//   }

//   const titleConfig = {
//     color: theme.text,
//     fontFamily: Fonts.family.semiBold,
//     fontSize: Fonts.size.lg
//   }

//    const paratextConfig = {
//         color: theme.secondaryText,
//         fontFamily: Fonts.family.medium,
//         fontSize: Fonts.size.xs
//     }


//   const shadow = {
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: -4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 10,
//     elevation: 80,
//   }

//   return (

//     <View style={[styles.container,{backgroundColor:'#EDEFF2'}]}>

//       {/* Profile Header */}

//      <View style={[styles.header, { backgroundColor: theme.background }, shadow]}>
//         <TouchableOpacity
//                     onPress={() => navigation.goBack()}
//                 >
//                       <AppNavButton style={{backgroundColor:theme.text,alignSelf:"flex-start"}}/>
//                 </TouchableOpacity>

//          <View style={styles.profileHeader}>
//           <View>
//             <Image
//           source={require('../../../assets/images/person.png')} // Your rounded profile image
//           style={styles.profileImage}
//         />
//         <Image source={require('../../../assets/images/edit.png')}  style={{width:30,height:30,position:"absolute",alignSelf:"flex-end",justifyContent:"flex-end",right:7}}/>
//           </View>
//         <Text style={[paratextConfig]}>Note:You can update your details anytime</Text>
//       </View>

//         </View>



//       <View style={{alignItems:"center",flex:1}}>
//   {/* Editable Fields */}
//       <View style={styles.inputContainer}>
//         <UsernameInput  type={"Username"} label={"Username"} placeholder={"Balamurugan"} icon={require('../../../assets/images/user.png')}/>
//         <PhoneNumberInput />
//         <EmailInput style={[styles.cardContainer,{backgroundColor:"white",borderWidth:0}]}  styleText={{color:theme.background}}/>
//         <TouchableOpacity style={[styles.saveButton,{backgroundColor:theme.primary}]}>
//           <Text style={styles.saveButtonText}>Save Details</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Footer */}
//       <View style={styles.footer}>
//         <Text style={styles.footerText}>PurePlus © 2025. All rights reserved.</Text>
//         <Text style={styles.versionText}>Version {appVersion}</Text>
//       </View>
//       </View>


//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex:1,
//   },


//   cardContainer: {
//         borderRadius: 10,
//         elevation: 3,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 5,
//     },

//   profileHeader: {
//     alignItems: 'center',
//     marginTop: 30,
//     marginBottom: 20,
//   },
//   profileImage: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     marginBottom: 10,
//     borderWidth: 2,
//     borderColor: '#ccc',
//   },
//   editText: {
//     fontSize: 14,
//     color: 'gray',
//   },
//   inputContainer: {
//     width: '90%',
//     paddingHorizontal: 10,
//   },
//   saveButton: {
//     padding: 12,
//     borderRadius: 8,
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   saveButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   footer: {
//     marginTop: 40,
//     alignItems: 'center',
//     paddingVertical: 20,
//   },
//   footerText: {
//     fontSize: 12,
//     color: 'gray',
//   },
//   versionText: {
//     fontSize: 12,
//     color: 'gray',
//     marginTop: 4,
//   },

//   header: {
//     paddingTop: 50,
//     paddingBottom: 20,
//     paddingHorizontal: 20,
//     marginBottom: 20,
//     borderBottomLeftRadius: 30,
//     borderBottomRightRadius: 30,
//   },
//   topAppBar: {
//     flexDirection: "row",
//     justifyContent: 'space-between',
//     paddingVertical: 10

//   },
// });

// export default ProfileScreen;


import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // You'll need to install this library: npm install react-native-vector-icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import TopAppBar from '../../Components/TopAppBar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { removeData } from '../../OfflineStore/OfflineStore';

// --- Data Structure for the main list items ---
const SETTINGS_ITEMS = [
  { name: 'Notification', icon: 'notifications', type: 'toggle', key: 'notification' },
  { name: 'Language Settings', icon: 'language', type: 'link', key: 'language' },
  { name: 'Privacy Policy', icon: 'clipboard-outline', type: 'link', key: 'privacy' },
  { name: 'Terms and Conditions', icon: 'document', type: 'link', key: 'terms' },
];

/**
 * Reusable component for the profile list and actions,
 * excluding the main header/image section.
 */
const ProfileScreen = ({ navigation }) => {
  // State for the Notification Switch
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);

  // Example handlers for actions
  const handleAction = (key) => {
    console.log(`Action triggered for: ${key}`);
    // In a real app, you would navigate or open a modal here.
    alert(`Navigating to ${key} screen...`);
  };

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
    removeData('isLoggedIn')
    // Implement your actual logout logic (clear tokens, navigate to login)
  };

  const handleDeleteAccount = () => {
    console.log('Deleting account...');
    alert('Account Deletion initiated.');
    // Implement account deletion flow
  };

  // --- Helper Component for a single list item ---
  const SettingsItem = ({ item, isDestructive = false }) => {
    const isLink = item.type === 'link';
    const isToggle = item.type === 'toggle';

    return (
      <TouchableOpacity
        style={styles.listItem}
        onPress={() => isLink && handleAction(item.key)}
        disabled={isToggle} // Disable touch feedback for the toggle item itself
        activeOpacity={isLink || isDestructive ? 0.7 : 1}
      >
        <View style={styles.iconBackground}>
          <Ionicons name={item.icon} color={'#3498db'} size={22} />
          {/* <Icon 
            name={item.icon} 
            size={22} 
            color={isDestructive ? '#e74c3c' : '#3498db'} // Red for destructive, blue otherwise
          /> */}
        </View>
        <Text style={[styles.itemText, isDestructive && styles.destructiveText]}>
          {item.name}
        </Text>

        {isLink && (
          <Ionicons name={'arrow-forward-outline'} color={'#3498db'} size={22} />
        )}

        {isToggle && (
          <Switch
            trackColor={{ false: "#ecf0f1", true: "#3498db" }}
            thumbColor={isNotificationEnabled ? "white" : "#f4f3f4"}
            ios_backgroundColor="#ecf0f1"
            onValueChange={setIsNotificationEnabled}
            value={isNotificationEnabled}
          />
        )}
      </TouchableOpacity>
    );
  };
  // -----------------------------------------------

  const insets = useSafeAreaInsets()

  return (
    <View style={[styles.screenContainer, { marginBottom: insets.bottom }]}>
      <TopAppBar title='Profile' navigation={navigation} />
      <ScrollView contentContainerStyle={styles.contentContainer}>

        {/* --- Profile Information Section --- */}
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Profile</Text>
          <View style={styles.infoItem}>
            <Ionicons name={'person'} color={'#3498db'} size={22} />
            <Text style={styles.infoValue}>Balamurugan</Text>
            {/* The pencil icon for edit is excluded as per "no header with back navigation" */}
          </View>

          <View style={styles.infoItem}>
            <Ionicons name={'call'} color={'#3498db'} size={22} />
            <Text style={styles.infoValue}>7397014106</Text>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name={'mail'} color={'#3498db'} size={22} />
            <Text style={styles.infoValue}>balaiItsme23@gmail.com</Text>
            <TouchableOpacity style={styles.manageButton} onPress={() => handleAction('Manage Email')}>
              <Text style={styles.manageButtonText}>MANAGE</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name={'home'} color={'#3498db'} size={22} />
            <Text style={styles.infoValue}>
              123, Bharathi Nagar, Main Road, Coimbatore, 641001
            </Text>
          </View>
        </View>

        {/* --- Settings List Section --- */}
        <View style={styles.settingsSection}>
          <Text style={styles.infoLabel}>Settings</Text>
          {SETTINGS_ITEMS.map((item) => (
            <SettingsItem item={item} key={item.key} />
          ))}
        </View>

        {/* --- Destructive Action --- */}
        <View style={styles.settingsSection}>
          <TouchableOpacity
            style={styles.listItem}
            onPress={handleDeleteAccount}
            activeOpacity={0.7}
          >
            <View style={styles.iconBackground}>
              <Ionicons name={'remove-circle'} color={'red'} size={22} />
            </View>
            <Text style={[styles.itemText, styles.destructiveText]}>
              Delete Account
            </Text>
            {/* <Ionicons name={'arrow-forward-outline'} color={'red'} size={22} /> */}
          </TouchableOpacity>
        </View>

        {/* Padding View to ensure content scrolls above the fixed footer */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* --- Fixed Logout Button (Footer) --- */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
          <Icon name="logout" size={20} color="white" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// --- Stylesheet ---
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#f4f4f4', // Light gray background
  },
  contentContainer: {
    paddingTop: 10,
    paddingBottom: 20, // Extra space at the bottom for scrolling
  },

  // --- Profile Info Section Styles ---
  infoSection: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34495e',
    marginBottom: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  infoIcon: {
    marginRight: 15,
    marginTop: 2, // Align icon better with multi-line text
  },
  infoValue: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    marginLeft: 10,
    lineHeight: 20,
  },
  manageButton: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#3498db',
    marginLeft: 10,
    justifyContent: 'center',
    height: 30, // Fixed height to align
  },
  manageButtonText: {
    color: '#3498db',
    fontSize: 11,
    fontWeight: 'bold',
  },

  // --- Settings List Item Styles ---
  settingsSection: {
    backgroundColor: 'white',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  iconBackground: {
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  destructiveText: {
    color: '#e74c3c',
  },

  // --- Footer and Logout Button Styles ---
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    zIndex: 10, // Ensure it stays on top
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3498db',
    borderRadius: 8,
    paddingVertical: 14,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
});

export default ProfileScreen;