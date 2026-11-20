import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import AccountService from '../../API/modules/AccountService';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TopAppBar from '../../Components/TopAppBar';
import AppText from '../../Components/AppText';
import AppButton from '../../Components/AppButton';
import AppModal from '../../Components/AppModal';
import ListRow from '../../Components/ListRow';
import FirstLetterAvatar from '../../Components/Profile/FirstLetterAvatar';
import { radius, spacing, floatShadow } from '../../Themes/Themes';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { clearDataBeforeLogout, removeData } from '../../OfflineStore/OfflineStore';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '../../Components/Toast/ToastProvider';
import { getSelectedAddressId } from '../../Utils/GetSelectedAddress'
import { useTheme } from '../../Context/ThemeContext';
import { logout } from '../../Redux/LogoutActions';

// --- Account / services list items (key = navigator route name) ---
const ACCOUNT_ITEMS = [
  { name: 'Wallet', icon: 'wallet-outline', tone: 'primary', key: 'Wallet' },
  { name: 'My Cans', icon: 'water-outline', tone: 'success', key: 'MyCans' },
  { name: 'Billing', icon: 'receipt-outline', tone: 'warning', key: 'Billing' },
  { name: 'My Subscriptions', icon: 'repeat-outline', tone: 'info', key: 'ManageSubscription' },
  { name: 'New Subscription', icon: 'add-circle-outline', tone: 'info', key: 'CreateSubscription' },
  { name: 'My Bulk Requests', icon: 'list-outline', tone: 'primary', key: 'BulkRequestStatus' },
  { name: 'Quality & Certification', icon: 'shield-checkmark-outline', tone: 'success', key: 'Certification' },
  { name: 'Delivery & Charges', icon: 'pricetag-outline', tone: 'info', key: 'ChargesInfo' },
];

// --- Services & support (moved here from the Dashboard quick-actions to de-duplicate). ---
const SUPPORT_ITEMS = [
  { name: 'Service Requests', icon: 'construct-outline', tone: 'warning', key: 'ServiceRequest' },
  { name: 'My Tickets', icon: 'receipt-outline', tone: 'info', key: 'MyServiceTickets' },
  { name: 'Help & Support', icon: 'headset-outline', tone: 'primary', key: 'CustomerSupportScreen' },
];

const SETTINGS_ITEMS = [
  { name: 'Privacy Policy', icon: 'document-text-outline', tone: 'neutral', key: 'PrivacyPolicy' },
  { name: 'Terms and Conditions', icon: 'document-outline', tone: 'neutral', key: 'Terms' },
];

const ProfileScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { showToast } = useToast()
  const [displayAddress, setDisplayAddress] = useState('')

  const dispatch = useDispatch()

  const { error: ProfileError, loading: profileLoading, isFetched: isProfileApiFetched, profileData } = useSelector((state) => state.profile)
  const { addressList, error, loading, isFetched: isAddressApiListFetched, selectedAddress } = useSelector((state) => state.address)

  const getAddressFromStateList = async () => {
    const id = await getSelectedAddressId();
    if (addressList) {
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
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  const [isDeleting, setIsDeleting] = useState(false);
  const [blockersModal, setBlockersModal] = useState({ visible: false, lines: '' });
  const [closeModal, setCloseModal] = useState(false);

  // CUS-33: preview dues/blockers first; only offer to close when clear. The backend also
  // enforces this (DELETE returns 409 with blockers), so this never closes an account with dues.
  const handleDeleteAccount = async () => {
    if (isDeleting) return;
    try {
      setIsDeleting(true);
      const check = await AccountService.deletionCheck();
      const blockers = check?.blockers ?? check?.reasons ?? [];
      const canClose = check?.canClose ?? check?.canDelete ?? blockers.length === 0;

      if (!canClose) {
        const lines = Array.isArray(blockers) && blockers.length
          ? blockers.map((b) => `• ${typeof b === 'string' ? b : b?.message ?? JSON.stringify(b)}`).join('\n')
          : '• You still have outstanding dues, held cans, or active orders.';
        setBlockersModal({ visible: true, lines });
        return;
      }

      setCloseModal(true);
    } catch (err) {
      showToast(err?.message || 'Could not check account status. Please try again.', true);
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmCloseAccount = async () => {
    try {
      await AccountService.deleteAccount();
      await clearDataBeforeLogout();
      dispatch(logout());
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    } catch (err) {
      showToast(err?.message || 'Could not close the account. Please try again.', true);
    }
  };

  const insets = useSafeAreaInsets()

  const InfoRow = ({ icon, tone, label, value }) => {
    const color = theme[tone] || theme.primary;
    const tint = theme[`${tone}Tint`] || theme.primaryTint;
    return (
      <View style={styles.infoRow}>
        <View style={[styles.infoWell, { backgroundColor: tint }]}>
          <Ionicons name={icon} size={18} color={color} />
        </View>
        <View style={{ flex: 1 }}>
          <AppText variant="caption" color={theme.inkMuted}>{label}</AppText>
          <AppText variant="bodyStrong" color={theme.ink} style={{ marginTop: 2 }}>{value}</AppText>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>

      <TopAppBar title="Profile" navigation={navigation} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>

        {/* PROFILE CARD */}
        <View style={[styles.card, { backgroundColor: theme.surfaceCard }]}>
          <View style={styles.sectionHeader}>
            <AppText variant="badge" color={theme.inkMuted} style={styles.sectionTitle}>PROFILE</AppText>
            <TouchableOpacity
              style={[styles.editButton, { backgroundColor: theme.primaryTint }]}
              onPress={() => navigation.navigate("EditProfileScreen")}
            >
              <AppText variant="label" color={theme.primary}>Edit profile</AppText>
            </TouchableOpacity>
          </View>

          {/* Identity */}
          <View style={styles.identityRow}>
            <FirstLetterAvatar width={56} height={56} fontSize={22} input={profileData?.fullName} />
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <AppText variant="display" color={theme.ink} style={styles.identityName} numberOfLines={1}>
                {profileData?.fullName ?? '--'}
              </AppText>
              <AppText variant="caption" color={theme.inkMuted}>Pureplus customer</AppText>
            </View>
          </View>

          <InfoRow icon="person-outline" tone="primary" label="Full Name" value={profileData?.fullName ?? '--'} />
          <InfoRow icon="call-outline" tone="success" label="Phone Number" value={profileData?.mobileNumber ?? '--'} />
          <InfoRow icon="mail-outline" tone="warning" label="Email Address" value={profileData?.email ?? '--'} />
        </View>

        {/* MY ACCOUNT CARD */}
        <View style={[styles.card, styles.listCard, { backgroundColor: theme.surfaceCard }]}>
          <AppText variant="badge" color={theme.inkMuted} style={styles.listCardTitle}>MY ACCOUNT</AppText>
          {ACCOUNT_ITEMS.map((item, i) => (
            <ListRow key={item.key} icon={item.icon} label={item.name} tone={item.tone} first={i === 0} onPress={() => navigation.navigate(item.key)} />
          ))}
        </View>

        {/* SERVICES & SUPPORT CARD */}
        <View style={[styles.card, styles.listCard, { backgroundColor: theme.surfaceCard }]}>
          <AppText variant="badge" color={theme.inkMuted} style={styles.listCardTitle}>SERVICES & SUPPORT</AppText>
          {SUPPORT_ITEMS.map((item, i) => (
            <ListRow key={item.key} icon={item.icon} label={item.name} tone={item.tone} first={i === 0} onPress={() => navigation.navigate(item.key)} />
          ))}
        </View>

        {/* SETTINGS CARD */}
        <View style={[styles.card, styles.listCard, { backgroundColor: theme.surfaceCard }]}>
          <AppText variant="badge" color={theme.inkMuted} style={styles.listCardTitle}>SETTINGS</AppText>
          {SETTINGS_ITEMS.map((item, i) => (
            <ListRow key={item.key} icon={item.icon} label={item.name} tone={item.tone} first={i === 0} onPress={() => handleAction(item.key)} />
          ))}
        </View>

        {/* DELETE ACCOUNT */}
        <View style={[styles.card, styles.listCard, { backgroundColor: theme.surfaceCard, borderColor: theme.dangerTint, borderWidth: 1.5 ,marginBottom:20 }]}>
          <ListRow icon="trash-outline" label="Delete Account" tone="danger" first onPress={handleDeleteAccount} labelColor={theme.danger} />
        </View>

      </ScrollView>

      {/* LOGOUT */}
      <View style={[styles.footer, { backgroundColor: theme.surfaceCard, paddingBottom: insets.bottom + 16 }, floatShadow]}>
        <AppButton title="Logout" icon="log-out-outline" borderOnly onAction={handleLogout} />
      </View>

      {/* Delete-account blockers */}
      <AppModal
        visible={blockersModal.visible}
        setModalVisible={(v) => setBlockersModal((s) => ({ ...s, visible: v }))}
        title="Can't close your account yet"
        description={`Please sort these out first:\n${blockersModal.lines}`}
        confirmText="OK"
        hideCancel
        onPositive={() => setBlockersModal({ visible: false, lines: '' })}
      />

      {/* Delete-account confirm */}
      <AppModal
        visible={closeModal}
        setModalVisible={setCloseModal}
        title="Close account?"
        description="This deactivates your account and you won’t be able to log back in. Financial history is retained as required."
        destructive
        confirmText="Close account"
        cancelText="Cancel"
        onPositive={confirmCloseAccount}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollBody: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm, paddingBottom: 120, gap: spacing.lg },

  card: {
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  listCard: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  sectionTitle: { letterSpacing: 0.6 },
  listCardTitle: { letterSpacing: 0.6, marginTop: spacing.sm, marginBottom: spacing.xs },

  editButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },

  identityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  identityName: { fontSize: 20, lineHeight: 26 },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  infoWell: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
});

export default ProfileScreen;
