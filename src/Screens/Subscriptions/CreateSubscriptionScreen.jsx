import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, TextInput, ScrollView,
  TouchableOpacity, Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDispatch, useSelector } from 'react-redux';
import TopAppBar from '../../Components/TopAppBar';
import AppText from '../../Components/AppText';
import AppButton from '../../Components/AppButton';
import AppModal from '../../Components/AppModal';
import AddressBar from '../../Components/AddressBar';
import BottomSheet from '../../Components/BottomSheet';
import AddressScreen from '../Address/AddressScreen';
import SubscriptionService from '../../API/modules/SubscriptionService';
import { getAddressList } from '../../Redux/Slices/AddressSlice';
import { getSelectedAddressId } from '../../Utils/GetSelectedAddress';
import { fontFamily, spacing, radius } from '../../Themes/Themes';
import { useTheme } from '../../Context/ThemeContext';

// Backend: POST /api/customer/subscription — { productId, addressId, quantity, frequency, startDate }
const FREQUENCIES = [
  { label: 'Daily', value: 'DAILY' },
  { label: 'Alternate days', value: 'ALTERNATE_DAY' },
  { label: 'Weekly', value: 'WEEKLY' },
];

const CreateSubscriptionScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  // productList is `[]` before load then the `{ data: [...] }` envelope — normalise to the array.
  const productListRaw = useSelector((state) => state.products.productList);
  const products = Array.isArray(productListRaw) ? productListRaw : (productListRaw?.data ?? []);
  const addressList = useSelector((state) => state.address.addressList ?? []);

  const [form, setForm] = useState({
    productId: '',
    quantity: '1',
    frequency: 'DAILY',
    startDate: '',
  });
  const [showPicker, setShowPicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Delivery address — the selected address (like the Dashboard address bar), not an inline list.
  const [showAddressSheet, setShowAddressSheet] = useState(false);
  const [selectedAddressObj, setSelectedAddressObj] = useState(null);

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  // Reusable app dialog (replaces OS Alerts). onOk runs after the user taps OK.
  const [dialog, setDialog] = useState({ visible: false, title: '', message: '', onOk: null });
  const showDialog = (title, message = '', onOk = null) => setDialog({ visible: true, title, message, onOk });
  const closeDialog = () => setDialog((d) => ({ ...d, visible: false }));

  // Resolve the currently selected delivery address for display.
  const resolveSelectedAddress = async () => {
    const id = await getSelectedAddressId();
    const match = (addressList || []).find((a) => String(a?.id) === String(id));
    setSelectedAddressObj(match ?? null);
  };

  useEffect(() => { dispatch(getAddressList()); }, [dispatch]);
  useEffect(() => { resolveSelectedAddress(); }, [addressList, showAddressSheet]);

  const addressText = selectedAddressObj
    ? `${selectedAddressObj.addressLine1 ?? ''} ${selectedAddressObj.addressLine2 ?? ''}`.trim()
    : 'Select a delivery address';

  const todayISO = () => new Date().toISOString().slice(0, 10);
  const toISO = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };
  const displayDate = (iso) => {
    if (!iso) return 'Select start date';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
  };

  const validate = () => {
    if (!form.productId) { showDialog('Select a product', 'Please choose a product to subscribe to.'); return false; }
    if (!form.quantity || Number(form.quantity) < 1) { showDialog('Enter a valid quantity', 'Cans per delivery must be at least 1.'); return false; }
    if (!form.startDate) { showDialog('Pick a start date', 'Please choose when the subscription should start.'); return false; }
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(form.startDate)) { showDialog('Invalid date', 'Date format must be YYYY-MM-DD.'); return false; }
    return true;
  };

  const submit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      // Address = the selected delivery address (chosen via the address sheet).
      const saved = await getSelectedAddressId();
      const addressId = Number(saved);
      if (!addressId || addressId === -1) {
        showDialog('No address', 'Please choose a delivery address first.');
        setSubmitting(false);
        return;
      }
      await SubscriptionService.create({
        productId: Number(form.productId),
        addressId,
        quantity: Number(form.quantity),
        frequency: form.frequency,
        startDate: form.startDate,
      });
      showDialog('Subscription created', 'Your subscription starts on ' + form.startDate, () => navigation?.navigate?.('ManageSubscription'));
    } catch (e) {
      showDialog('Could not create subscription', e?.message || 'Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.surface }]}>
      <TopAppBar title="New Subscription" navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.xl, paddingTop: spacing.sm, paddingBottom: 40 }}>

        {/* Product */}
        <Section theme={theme} label="Product">
          {products.length > 0 ? (
            <View style={styles.chipWrap}>
              {products.map((p) => {
                const pid = String(p?.id ?? p?.productId ?? '');
                const active = form.productId === pid;
                return (
                  <TouchableOpacity
                    key={pid}
                    onPress={() => set('productId')(pid)}
                    style={[styles.chip, {
                      borderColor: active ? theme.ink : theme.borderStrong,
                      backgroundColor: active ? theme.ink : theme.surfaceCard,
                    }]}
                  >
                    <AppText variant="label" color={active ? theme.onInk : theme.ink}>
                      {p?.productName ?? p?.name ?? pid}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <Field theme={theme} placeholder="Product ID" value={form.productId} onChangeText={set('productId')} keyboardType="numeric" />
          )}
        </Section>

        {/* Quantity */}
        <Section theme={theme} label="Cans per delivery">
          <Field theme={theme} icon="cube-outline" placeholder="e.g. 2" value={form.quantity} onChangeText={set('quantity')} keyboardType="numeric" />
        </Section>

        {/* Frequency */}
        <Section theme={theme} label="Frequency">
          <View style={[styles.segment, { backgroundColor: theme.surfaceSunken }]}>
            {FREQUENCIES.map((f) => {
              const active = form.frequency === f.value;
              return (
                <TouchableOpacity
                  key={f.value}
                  onPress={() => set('frequency')(f.value)}
                  style={[styles.segmentItem, active && { backgroundColor: theme.surfaceCard, borderColor: theme.primary, borderWidth: 1.5 }]}
                >
                  <AppText variant="label" color={active ? theme.primary : theme.inkMuted} style={{ fontSize: 13 }}>
                    {f.label}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        </Section>

        {/* Delivery address — selected address + change dropdown (opens the address sheet) */}
        <Section theme={theme} label="Delivery address">
          <AddressBar address={addressText} onClick={() => setShowAddressSheet(true)} />
          <AppText variant="caption" color={theme.inkMuted} style={{ marginTop: spacing.xs }}>
            This is where your subscription cans will be delivered.
          </AppText>
        </Section>

        {/* Start date */}
        <Section theme={theme} label="Start date">
          <TouchableOpacity
            onPress={() => setShowPicker(true)}
            style={[styles.dateField, { borderColor: theme.borderStrong, backgroundColor: theme.surfaceCard }]}
          >
            <Ionicons name="calendar-outline" size={20} color={theme.primary} />
            <AppText variant="bodyStrong" color={form.startDate ? theme.ink : theme.inkMuted} style={{ flex: 1, marginLeft: spacing.md }}>
              {displayDate(form.startDate)}
            </AppText>
            <Ionicons name="chevron-down" size={20} color={theme.inkMuted} />
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker
              value={form.startDate ? new Date(form.startDate) : new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              minimumDate={new Date()}
              onChange={(_, date) => {
                setShowPicker(Platform.OS === 'ios');
                if (date) set('startDate')(toISO(date));
              }}
            />
          )}
        </Section>

        {/* Info banner */}
        <View style={[styles.infoBanner, { backgroundColor: theme.infoTint }]}>
          <Ionicons name="information-circle-outline" size={18} color={theme.info} style={{ marginRight: spacing.sm }} />
          <AppText variant="caption" color={theme.info} style={{ flex: 1 }}>
            Subscriptions are postpaid — billed monthly. You can pause, skip, or cancel any time from
            My Subscriptions. Overdue balances block new orders until cleared.
          </AppText>
        </View>

        <AppButton title="Create subscription" isLoading={submitting} loadingText="Creating…" onAction={submit} />
        <View style={{ height: spacing.xxl }} />
      </ScrollView>

      {/* Address selection — reuses the Dashboard address sheet */}
      <BottomSheet visible={showAddressSheet} onClose={() => setShowAddressSheet(false)}>
        <AddressScreen
          navigation={navigation}
          onClose={() => setShowAddressSheet(false)}
          callGetSelectedAddressCallBack={() => {
            dispatch(getAddressList());
            resolveSelectedAddress();
          }}
        />
      </BottomSheet>

      {/* Reusable app dialog (replaces OS alerts) */}
      <AppModal
        visible={dialog.visible}
        setModalVisible={(v) => { if (!v) closeDialog(); }}
        title={dialog.title}
        description={dialog.message}
        confirmText="OK"
        hideCancel
        onPositive={() => {
          const cb = dialog.onOk;
          closeDialog();
          if (cb) cb();
        }}
      />
    </View>
  );
};

const Section = ({ theme, label, children }) => (
  <View style={{ marginBottom: spacing.xl }}>
    <AppText variant="label" color={theme.ink} style={{ marginBottom: spacing.sm }}>{label}</AppText>
    {children}
  </View>
);

const Field = ({ theme, icon, ...rest }) => (
  <View style={[styles.fieldRow, { borderColor: theme.borderStrong, backgroundColor: theme.surfaceCard }]}>
    {icon ? <Ionicons name={icon} size={18} color={theme.primary} style={{ marginRight: spacing.sm }} /> : null}
    <TextInput
      placeholderTextColor={theme.inkMuted}
      style={[styles.input, { color: theme.ink }]}
      {...rest}
    />
  </View>
);

const styles = StyleSheet.create({
  screen: { flex: 1 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1.5,
  },
  segment: {
    flexDirection: 'row',
    borderRadius: radius.sm,
    padding: 4,
    gap: 4,
  },
  segmentItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  dateField: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1.5,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontFamily: fontFamily.medium,
    fontSize: 15,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
});

export default CreateSubscriptionScreen;
