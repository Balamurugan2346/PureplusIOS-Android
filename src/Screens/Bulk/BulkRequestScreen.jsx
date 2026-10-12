import React, { useState } from 'react';
import { View, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import NavScreen from '../../Components/NavScreen';
import AppText from '../../Components/AppText';
import AppButton from '../../Components/AppButton';
import BulkService from '../../API/modules/BulkService';
import { getSelectedAddressId } from '../../Utils/GetSelectedAddress';
import { spacing, radius, lightSurface } from '../../Themes/Themes';
import { useTheme } from '../../Context/ThemeContext';

/**
 * CUS-26 · Bulk / Event request — a request, not an instant order. Enters the
 * Store-Admin approval queue. B2B captures GSTIN; Event uses an advance token.
 */
const BulkRequestScreen = ({ navigation }) => {
  const { theme } = useTheme();
  // White surface (this screen renders on white, not the dark theme bg) — keep brand primary.
  const s = { ...lightSurface, primary: theme.primary };
  const [purpose, setPurpose] = useState('B2B'); // B2B | EVENT
  const [form, setForm] = useState({
    productId: '', quantity: '', requiredDate: '', venueAddress: '',
    contactPerson: '', gstin: '', notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.quantity || !form.requiredDate) {
      Alert.alert('Missing info', 'Quantity and required date are needed.');
      return;
    }
    if (purpose === 'B2B' && !form.gstin) {
      Alert.alert('GSTIN required', 'B2B requests need a GSTIN.');
      return;
    }
    setSubmitting(true);
    try {
      const addressId = Number(await getSelectedAddressId());
      if (!addressId || addressId === -1) {
        Alert.alert('Select an address', 'Please choose a delivery address before requesting.');
        setSubmitting(false);
        return;
      }
      // Backend CreateBulkRequest shape (verified against Swagger):
      // { requestType, productId, quantity, requestedDate, addressId, gstin, eventDetails }
      await BulkService.create({
        requestType: purpose,                         // 'B2B' | 'EVENT'
        productId: Number(form.productId) || 0,
        quantity: Number(form.quantity),
        requestedDate: form.requiredDate,
        addressId,
        gstin: purpose === 'B2B' ? form.gstin : undefined,
        eventDetails: [form.venueAddress, form.contactPerson, form.notes]
          .filter(Boolean)
          .join(' | '),
      });
      Alert.alert('Submitted', 'Your request is in the approval queue.', [
        { text: 'OK', onPress: () => navigation?.navigate?.('BulkRequestStatus') },
      ]);
    } catch (e) {
      Alert.alert('Could not submit', e?.message || 'Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const Field = ({ label, value, onChangeText, ...rest }) => (
    <View style={{ marginBottom: spacing.md }}>
      <AppText variant="label" color={s.secondaryText} style={{ marginBottom: spacing.xs }}>{label}</AppText>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={s.secondaryText}
        style={[styles.input, { color: s.text, borderColor: s.inputContainerBorder,
          backgroundColor: s.inputContainer }]}
        {...rest}
      />
    </View>
  );

  return (
    <NavScreen title="Bulk / Event Request" navigation={navigation} background={s.background}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.toggle}>
          {['B2B', 'EVENT'].map((p) => {
            const active = p === purpose;
            return (
              <TouchableOpacity key={p} onPress={() => setPurpose(p)}
                style={[styles.toggleBtn, { borderColor: active ? theme.primary : s.divider,
                  backgroundColor: active ? `${theme.primary}22` : 'transparent' }]}>
                <AppText variant="bodyStrong" color={active ? theme.primary : s.secondaryText}>
                  {p === 'B2B' ? 'B2B (business)' : 'Event / Function'}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>

        <Field label="Product" value={form.productId} onChangeText={set('productId')} placeholder="Product id or name" />
        <Field label="Quantity" value={form.quantity} onChangeText={set('quantity')} keyboardType="numeric" placeholder="e.g. 50" />
        <Field label="Required date" value={form.requiredDate} onChangeText={set('requiredDate')} placeholder="YYYY-MM-DD" />
        <Field label="Venue address" value={form.venueAddress} onChangeText={set('venueAddress')} placeholder="Delivery venue" />
        <Field label="Contact person" value={form.contactPerson} onChangeText={set('contactPerson')} placeholder="Name & phone" />
        {purpose === 'B2B' && (
          <Field label="GSTIN" value={form.gstin} onChangeText={set('gstin')} placeholder="GST number" autoCapitalize="characters" />
        )}
        <Field label="Notes" value={form.notes} onChangeText={set('notes')} placeholder="Anything else" multiline />

        <AppText variant="caption" color={s.secondaryText} style={{ marginBottom: spacing.md }}>
          {purpose === 'EVENT'
            ? 'Events are confirmed once the advance token is paid. Cancelling inside the window forfeits the advance.'
            : 'B2B orders are billed monthly against your approved postpaid account.'}
        </AppText>

        <AppButton title="Submit request" isLoading={submitting} onAction={submit} />
        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </NavScreen>
  );
};

const styles = StyleSheet.create({
  toggle: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  toggleBtn: { flex: 1, alignItems: 'center', paddingVertical: spacing.md, borderRadius: radius.md, borderWidth: 1 },
  input: { borderWidth: 1, borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, minHeight: 44 },
});

export default BulkRequestScreen;
