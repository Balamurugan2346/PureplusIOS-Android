import React, { useState } from 'react';
import { View, StyleSheet, TextInput, ScrollView, TouchableOpacity, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import NavScreen from '../../Components/NavScreen';
import AppText from '../../Components/AppText';
import AppButton from '../../Components/AppButton';
import AppModal from '../../Components/AppModal';
import AddressSelector from '../../Components/AddressSelector';
import BulkService from '../../API/modules/BulkService';
import { getSelectedAddressId } from '../../Utils/GetSelectedAddress';
import { fontFamily, spacing, radius } from '../../Themes/Themes';
import { useTheme } from '../../Context/ThemeContext';

/**
 * CUS-26 · Bulk / Event request (prompt 05 restyle, pureLight). A request, not an instant
 * order — enters the Store-Admin approval queue. B2B captures GSTIN; Event uses an advance.
 */
const BulkRequestScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [purpose, setPurpose] = useState('B2B'); // B2B | EVENT
  const [form, setForm] = useState({
    productId: '', quantity: '', requiredDate: '',
    contactPerson: '', gstin: '', notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  // Venue = the selected delivery address (via the reusable AddressSelector).
  const [venueAddr, setVenueAddr] = useState(null);

  // Reusable app dialog (replaces OS Alerts for validation + errors).
  const [dialog, setDialog] = useState({ visible: false, title: '', message: '' });
  const showDialog = (title, message = '') => setDialog({ visible: true, title, message });
  const closeDialog = () => setDialog((d) => ({ ...d, visible: false }));

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const toISO = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };
  const displayDate = (iso) => {
    if (!iso) return 'Pick a date';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
  };

  const submit = async () => {
    if (!form.quantity || !form.requiredDate) {
      showDialog('Missing info', 'Quantity and required date are needed.');
      return;
    }
    if (purpose === 'B2B' && !form.gstin) {
      showDialog('GSTIN required', 'B2B requests need a GSTIN.');
      return;
    }
    setSubmitting(true);
    try {
      const addressId = Number(await getSelectedAddressId());
      if (!addressId || addressId === -1) {
        showDialog('Select an address', 'Please choose a delivery venue address before requesting.');
        setSubmitting(false);
        return;
      }
      const venueText = venueAddr
        ? `${venueAddr.addressLine1 ?? ''} ${venueAddr.addressLine2 ?? ''}`.trim()
        : '';
      await BulkService.create({
        requestType: purpose,
        productId: Number(form.productId) || 0,
        quantity: Number(form.quantity),
        requestedDate: form.requiredDate,
        addressId,
        gstin: purpose === 'B2B' ? form.gstin : undefined,
        eventDetails: [venueText, form.contactPerson, form.notes]
          .filter(Boolean)
          .join(' | '),
      });
      // Remove this screen from the stack and show the requests list; Back then returns
      // to wherever the user opened Bulk Request from.
      navigation.replace('BulkRequestStatus');
    } catch (e) {
      showDialog('Could not submit', e?.message || 'Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const PURPOSES = [
    { value: 'B2B', title: 'B2B (business)', sub: 'Offices, shops, hostels', icon: 'briefcase-outline' },
    { value: 'EVENT', title: 'Event / Function', sub: 'Weddings, parties', icon: 'calendar-outline' },
  ];

  return (
    <NavScreen title="Bulk / Event Request" navigation={navigation} background={theme.surface}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: spacing.lg, paddingBottom: 40 }}>

        {/* Purpose toggle — two radio cards */}
        <View style={styles.purposeRow}>
          {PURPOSES.map((p) => {
            const active = p.value === purpose;
            return (
              <TouchableOpacity
                key={p.value}
                onPress={() => setPurpose(p.value)}
                style={[styles.purposeCard, {
                  borderColor: active ? theme.primary : theme.borderSubtle,
                  backgroundColor: active ? theme.primaryTint : theme.surfaceCard,
                }]}
              >
                <View style={[styles.purposeWell, { backgroundColor: theme.surfaceCard }]}>
                  <Ionicons name={p.icon} size={20} color={active ? theme.primary : theme.inkMuted} />
                </View>
                <AppText variant="bodyStrong" color={theme.ink} style={{ marginTop: spacing.sm }}>{p.title}</AppText>
                <AppText variant="caption" color={theme.inkMuted} style={{ marginTop: 2 }}>{p.sub}</AppText>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Form card */}
        <View style={[styles.formCard, { backgroundColor: theme.surfaceCard }]}>
          <Field theme={theme} label="Product" value={form.productId} onChangeText={set('productId')} placeholder="Product id or name" />

          <View style={styles.twoCol}>
            <View style={{ flex: 1 }}>
              <Field theme={theme} label="Quantity" required value={form.quantity} onChangeText={set('quantity')} keyboardType="numeric" placeholder="e.g. 50" />
            </View>
            <View style={{ flex: 1 }}>
              {/* Required date — tappable date picker (Android + iOS) */}
              <AppText variant="label" color={theme.inkMuted} style={{ marginBottom: spacing.xs }}>
                Required date<AppText variant="label" color={theme.danger}> *</AppText>
              </AppText>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={[styles.inputRow, { borderColor: theme.borderSubtle, backgroundColor: theme.surfaceCard, minHeight: 48 }]}
              >
                <Ionicons name="calendar-outline" size={18} color={theme.primary} style={{ marginRight: spacing.sm }} />
                <AppText variant="label" color={form.requiredDate ? theme.ink : theme.inkMuted} style={{ flex: 1 }}>
                  {displayDate(form.requiredDate)}
                </AppText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Venue address — reusable address selector (selected address + change) */}
          <View style={{ marginBottom: spacing.md }}>
            <AppText variant="label" color={theme.inkMuted} style={{ marginBottom: spacing.xs }}>Venue address</AppText>
            <AddressSelector navigation={navigation} onChange={setVenueAddr} placeholder="Select delivery venue" />
          </View>

          <Field theme={theme} label="Contact person" icon="person-outline" value={form.contactPerson} onChangeText={set('contactPerson')} placeholder="Name & phone" />

          {purpose === 'B2B' && (
            <Field
              theme={theme}
              label="GSTIN"
              required
              value={form.gstin}
              onChangeText={set('gstin')}
              placeholder="GST NUMBER"
              autoCapitalize="characters"
              letterSpacing
              helper="Required for business orders"
            />
          )}

          <Field theme={theme} label="Notes" value={form.notes} onChangeText={set('notes')} placeholder="Anything else" multiline />
        </View>

        {/* Info banner */}
        <View style={[styles.banner, { backgroundColor: theme.infoTint }]}>
          <Ionicons name="information-circle-outline" size={18} color={theme.info} style={{ marginRight: spacing.sm }} />
          <AppText variant="caption" color={theme.info} style={{ flex: 1 }}>
            {purpose === 'EVENT'
              ? 'Events are confirmed once the advance token is paid. Cancelling inside the window forfeits the advance.'
              : 'B2B orders are billed monthly against your approved postpaid account.'}
          </AppText>
        </View>

        <AppButton title="Submit request" isLoading={submitting} loadingText="Submitting…" onAction={submit} />
        <AppText variant="caption" color={theme.inkMuted} style={{ textAlign: 'center', marginTop: spacing.sm }}>
          Goes to the store for approval. Uses your selected delivery address.
        </AppText>
        <View style={{ height: spacing.xxl }} />
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={form.requiredDate ? new Date(form.requiredDate) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          minimumDate={new Date()}
          onChange={(_, date) => {
            setShowDatePicker(Platform.OS === 'ios');
            if (date) set('requiredDate')(toISO(date));
          }}
        />
      )}

      <AppModal
        visible={dialog.visible}
        setModalVisible={(v) => { if (!v) closeDialog(); }}
        title={dialog.title}
        description={dialog.message}
        confirmText="OK"
        hideCancel
        onPositive={closeDialog}
      />
    </NavScreen>
  );
};

const Field = ({ theme, label, required, icon, helper, multiline, letterSpacing, ...rest }) => (
  <View style={{ marginBottom: spacing.md }}>
    <AppText variant="label" color={theme.inkMuted} style={{ marginBottom: spacing.xs }}>
      {label}{required ? <AppText variant="label" color={theme.danger}> *</AppText> : null}
    </AppText>
    <View style={[
      styles.inputRow,
      { borderColor: theme.borderSubtle, backgroundColor: theme.surfaceCard },
      multiline && styles.inputMultiline,
    ]}>
      {icon ? <Ionicons name={icon} size={18} color={theme.primary} style={{ marginRight: spacing.sm, marginTop: multiline ? 2 : 0 }} /> : null}
      <TextInput
        placeholderTextColor={theme.inkMuted}
        multiline={multiline}
        style={[
          styles.input,
          { color: theme.ink },
          multiline && { minHeight: 96, textAlignVertical: 'top' },
          letterSpacing && { letterSpacing: 0.5 },
        ]}
        {...rest}
      />
    </View>
    {helper ? <AppText variant="caption" color={theme.inkMuted} style={{ marginTop: 4 }}>{helper}</AppText> : null}
  </View>
);

const styles = StyleSheet.create({
  purposeRow: { flexDirection: 'row', gap: spacing.md },
  purposeCard: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: 1.5,
    padding: spacing.lg,
    alignItems: 'flex-start',
  },
  purposeWell: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formCard: {
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  twoCol: { flexDirection: 'row', gap: spacing.md },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  inputMultiline: { alignItems: 'flex-start' },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontFamily: fontFamily.medium,
    fontSize: 13,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: radius.md,
    padding: spacing.md,
  },
});

export default BulkRequestScreen;
