import React, { useEffect, useState } from 'react';
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
import { clearDataBeforeLogout, removeData } from '../../OfflineStore/OfflineStore';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '../../Components/Toast/ToastProvider';
import { getSelectedAddressId } from '../../Utils/GetSelectedAddress'
import { clearProfileState } from '../../Redux/Slices/ProfileSlice';
import { clearBanners } from '../../Redux/Slices/BannerSlice';
import { clearProducts } from '../../Redux/Slices/ProductsSlice';
import { clearAddressState } from '../../Redux/Slices/AddressSlice';
import { clearCurrentLocationFormattedAddres, clearDecodedAddress } from '../../Redux/Slices/LocationSlice';
import { clearCart } from '../../Redux/Slices/CartSlice';
import { logout } from '../../Redux/LogoutActions';

// --- Account / services list items (key = navigator route name) ---
const ACCOUNT_ITEMS = [
  { name: 'Wallet', icon: 'wallet-outline', color: '#4A90E2', key: 'Wallet' },
  { name: 'My Cans', icon: 'water-outline', color: '#27ae60', key: 'MyCans' },
  { name: 'Billing', icon: 'receipt-outline', color: '#e67e22', key: 'Billing' },
  { name: 'My Subscriptions', icon: 'repeat-outline', color: '#6C63FF', key: 'ManageSubscription' },
  { name: 'My Bulk Requests', icon: 'list-outline', color: '#8e44ad', key: 'BulkRequestStatus' },
  { name: 'Quality & Certification', icon: 'shield-checkmark-outline', color: '#16a085', key: 'Certification' },
];

// --- Data Structure for the main list items ---
const SETTINGS_ITEMS = [
  // { name: 'Notification', icon: 'notifications', type: 'toggle', key: 'notification' },
  // { name: 'Language Settings', icon: 'language', type: 'link', key: 'language' },
  { name: 'Privacy Policy', icon: 'clipboard-outline', type: 'link', key: 'PrivacyPolicy' },
  { name: 'Terms and Conditions', icon: 'document', type: 'link', key: 'Terms' },
];

/**
 * Reusable component for the profile list and actions,
 * excluding the main header/image section.
 */
const ProfileScreen = ({ navigation }) => {
  // State for the Notification Switch
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);
  const { showToast } = useToast()
  const [displayAddress, setDisplayAddress] = useState('')


  const dispatch = useDispatch()

  const { error: ProfileError, loading: profileLoading, isFetched: isProfileApiFetched, profileData } = useSelector((state) => state.profile)
  const { addressList, error, loading, isFetched: isAddressApiListFetched, selectedAddress } = useSelector((state) => state.address)
  // Example handlers for actions



  const getAddressFromStateList = async () => {
    const id = await getSelectedAddressId();
    if (addressList) {
      console.log("list", addressList)
      addressList.map((address, index) => {
        if (address.id == id) {
          setDisplayAddress(`${address.addressLine1} ${address.addressLine2}`)
        }
      })
    }
  }

  useEffect(() => {
    getAddressFromStateList()
  }, [])

  const handleAction = (key) => {
    if (key == 'language' || key == 'Terms') {
      showToast("Under development")
      return
    }
    navigation.navigate(key)
  };

  const handleLogout = async () => {
    await clearDataBeforeLogout()
    dispatch(logout());
    // dispatch(clearProfileState())
    // dispatch(clearBanners())
    // dispatch(clearProducts())
    // dispatch(clearDecodedAddress())
    // dispatch(clearCart())
    // dispatch(clearCurrentLocationFormattedAddres())
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
    // removeData('isLoggedIn')
    // removeData('selectedAddress')


    // Implement your actual logout logic (clear tokens, navigate to login)
  };

  const handleDeleteAccount = () => {
    console.log('Deleting account...');
    alert('Account Deletion initiated.');
    // Implement account deletion flow
  };

  // -----------------------------------------------

  const insets = useSafeAreaInsets()

  return (
    <View style={[styles.container, { marginBottom: insets.bottom }]}>

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
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* PROFILE CARD */}

        <View style={styles.card}>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>PROFILE</Text>

            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate("EditProfileScreen")}
            >
              <Text style={styles.editText}>Edit profile</Text>
            </TouchableOpacity>

          </View>

          <View style={styles.profileRow}>
            <View style={[styles.iconCircle, { backgroundColor: "#e9f2ff" }]}>
              <Ionicons name="person" size={18} color="#4A90E2" />
            </View>

            <View>
              <Text style={styles.label}>Full Name</Text>
              <Text style={styles.value}>{profileData.fullName ?? "--"}</Text>
            </View>
          </View>


          <View style={styles.profileRow}>
            <View style={[styles.iconCircle, { backgroundColor: "#e6f7ef" }]}>
              <Ionicons name="call" size={18} color="#27ae60" />
            </View>

            <View>
              <Text style={styles.label}>Phone Number</Text>
              <Text style={styles.value}>{profileData.mobileNumber ?? "--"}</Text>
            </View>
          </View>


          <View style={styles.profileRow}>
            <View style={[styles.iconCircle, { backgroundColor: "#fff1e6" }]}>
              <Ionicons name="mail" size={18} color="#e67e22" />
            </View>

            <View>
              <Text style={styles.label}>Email Address</Text>
              <Text style={styles.value}>{profileData.email ?? "--"}</Text>
            </View>
          </View>

        </View>


        {/* MY ACCOUNT CARD */}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>MY ACCOUNT</Text>

          {ACCOUNT_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={styles.settingsRow}
              onPress={() => navigation.navigate(item.key)}
            >
              <View style={styles.settingsLeft}>
                <View style={[styles.iconCircle, { backgroundColor: `${item.color}1A` }]}>
                  <Ionicons name={item.icon} size={18} color={item.color} />
                </View>
                <Text style={styles.settingsText}>{item.name}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#bbb" />
            </TouchableOpacity>
          ))}
        </View>


        {/* SETTINGS CARD */}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>SETTINGS</Text>

          {SETTINGS_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={styles.settingsRow}
              onPress={() => handleAction(item.key)}
            >

              <View style={styles.settingsLeft}>
                <View style={[styles.iconCircle, { backgroundColor: "#eef2ff" }]}>
                  <Ionicons name={item.icon} size={18} color="#6C63FF" />
                </View>

                <Text style={styles.settingsText}>{item.name}</Text>
              </View>

              <Ionicons name="chevron-forward" size={18} color="#bbb" />

            </TouchableOpacity>
          ))}

        </View>


        {/* DELETE ACCOUNT */}

        <View style={[styles.card, { borderColor: "#ffd6d6", borderWidth: 1, marginBottom: 20 }]}>
          <TouchableOpacity
            style={styles.deleteRow}
            onPress={handleDeleteAccount}
          >
            <View style={[styles.iconCircle, { backgroundColor: "#ffeaea" }]}>
              <Ionicons name="trash" size={18} color="#e74c3c" />
            </View>

            <Text style={styles.deleteText}>Delete Account</Text>
          </TouchableOpacity>
        </View>


        <View style={{ height: 80 }} />

      </ScrollView>


      {/* LOGOUT BUTTON */}

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="white" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

    </View>
  );

};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F4F6FA"
  },

  header: {
    backgroundColor: "#0C1C2C",
    padding: 20,
    paddingTop: 40,
    flexDirection: "row",
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30
  },

  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10
  },

  card: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#999"
  },

  editButton: {
    backgroundColor: "#e9f2ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12
  },

  editText: {
    color: "#4A90E2",
    fontSize: 12
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12
  },

  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12
  },

  label: {
    fontSize: 11,
    color: "#888"
  },

  value: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333"
  },

  settingsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderTopColor: "#f1f1f1"
  },

  settingsLeft: {
    flexDirection: "row",
    alignItems: "center"
  },

  settingsText: {
    fontSize: 15,
    color: "#333",
    marginLeft: 10
  },

  deleteRow: {
    flexDirection: "row",
    alignItems: "center"
  },

  deleteText: {
    color: "#e74c3c",
    fontSize: 15,
    marginLeft: 10,
    fontWeight: "600"
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#fff"
  },

  logoutButton: {
    backgroundColor: "#3498db",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 10
  },

  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8
  }

});

export default ProfileScreen;