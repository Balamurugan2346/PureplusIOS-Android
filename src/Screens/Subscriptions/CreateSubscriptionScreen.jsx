import React, { useState } from 'react';
import {
  View, StyleSheet, TextInput, ScrollView,
  TouchableOpacity, Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import NavScreen from '../../Components/NavScreen';
import AppText from '../../Components/AppText';
import AppButton from '../../Components/AppButton';
import StatusBadge from '../../Components/StatusBadge';
import SubscriptionService from '../../API/modules/SubscriptionService';
import { getSelectedAddressId } from '../../Utils/GetSelectedAddress';
import { spacing, radius } from '../../Themes/Themes';
import { useTheme } from '../../Context/ThemeContext';

// Backend: POST /api/customer/subscription
// Payload: { productId, addressId, quantity, frequency, startDate }
// frequency values match backend enum — verify against Swagger if rejected.
const FREQUENCIES = [
  { label: 'Daily', value: 'DAILY' },
  { label: 'Alternate days', value: 'ALTERNATE_DAY' },
  { label: 'Weekly', value: 'WEEKLY' },
];

const CreateSubscriptionScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const products = useSelector((state) => state.products.productList ?? []);
  const addressList = useSelector((state) => state.address.addressList ?? []);

  const [form, setForm] = useState({
    productId: '',
    addressId: '',
    quantity: '1',
    frequency: 'DAILY',
    startDate: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const todayISO = () => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  };

  const validate = () => {
    if (!form.productId) { Alert.alert('Select a product'); return false; }
    if (!form.quantity || Number(form.quantity) < 1) { Alert.alert('Enter a valid quantity'); return false; }
    if (!form.startDate) { Alert.alert('Enter a start date (YYYY-MM-DD)'); return false; }
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(form.startDate)) { Alert.alert('Date format must be YYYY-MM-DD'); return false; }
    return true;
  };

  const submit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      let addressId = Number(form.addressId);
      if (!addressId || addressId === -1) {
        const saved = await getSelectedAddressId();
        addressId = Number(saved);
      }
      if (!addressId || addressId === -1) {
        Alert.alert('No address', 'Please choose a delivery address first.');
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
      Alert.alert('Subscription created', 'Your subscription starts on ' + form.startDate, [
        { text: 'OK', onPress: () => navigation?.navigate?.('ManageSubscription') },
      ]);
    } catch (e) {
      Alert.alert('Could not create subscription', e?.message || 'Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <NavScreen title="New Subscription" navigation={navigation}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Product */}
        <Section theme={theme} label="Product">
          {products.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: spacing.xs }}>
              {products.map((p) => {
                const pid = String(p?.id ?? p?.productId ?? '');
                const active = form.productId === pid;
                return (
                  <TouchableOpacity
                    key={pid}
                    onPress={() => set('productId')(pid)}
                    style={[styles.chip, {
                      borderColor: active ? theme.primary : theme.divider,
                      backgroundColor: active ? `${theme.primary}22` : 'transparent',
                    }]}
                  >
                    <AppText variant="bodyStrong" color={active ? theme.primary : theme.secondaryText}>
                      {p?.productName ?? p?.name ?? pid}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          ) : (
            <Field
              theme={theme}
              placeholder="Product ID"
              value={form.productId}
              onChangeText={set('productId')}
              keyboardType="numeric"
            />
          )}
        </Section>

        {/* Quantity */}
        <Section theme={theme} label="Cans per delivery">
          <Field
            theme={theme}
            placeholder="e.g. 2"
            value={form.quantity}
            onChangeText={set('quantity')}
            keyboardType="numeric"
          />
        </Section>

        {/* Frequency */}
        <Section theme={theme} label="Frequency">
          <View style={styles.toggle}>
            {FREQUENCIES.map((f) => {
              const active = form.frequency === f.value;
              return (
                <TouchableOpacity
                  key={f.value}
                  onPress={() => set('frequency')(f.value)}
                  style={[styles.toggleBtn, {
                    borderColor: active ? theme.primary : theme.divider,
                    backgroundColor: active ? `${theme.primary}22` : 'transparent',
                  }]}
                >
                  <AppText variant="bodyStrong" color={active ? theme.primary : theme.secondaryText}>
                    {f.label}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        </Section>

        {/* Delivery address */}
        {addressList.length > 0 && (
          <Section theme={theme} label="Delivery address">
            {addressList.map((a) => {
              const aid = String(a?.id ?? '');
              const active = form.addressId === aid;
              return (
                <TouchableOpacity
                  key={aid}
                  onPress={() => set('addressId')(aid)}
                  style={[styles.addressRow, {
                    borderColor: active ? theme.primary : theme.divider,
                    backgroundColor: active ? `${theme.primary}11` : theme.card,
                  }]}
                >
                  <AppText variant="bodyStrong" color={active ? theme.primary : theme.text} numberOfLines={1}>
                    {a?.addressLine1 ?? a?.address ?? aid}
                  </AppText>
                  {a?.pincode ? (
                    <AppText variant="caption" color={theme.secondaryText}>{a.pincode}</AppText>
                  ) : null}
                </TouchableOpacity>
              );
            })}
            <AppText variant="caption" color={theme.secondaryText} style={{ marginTop: spacing.xs }}>
              Leave unselected to use your current delivery address.
            </AppText>
          </Section>
        )}

        {/* Start date */}
        <Section theme={theme} label="Start date">
          <Field
            theme={theme}
            placeholder={`YYYY-MM-DD (e.g. ${todayISO()})`}
            value={form.startDate}
            onChangeText={set('startDate')}
            keyboardType="numbers-and-punctuation"
          />
        </Section>

        <AppText variant="caption" color={theme.secondaryText} style={{ marginBottom: spacing.lg }}>
          Subscriptions are postpaid — billed monthly. You can pause, skip, or cancel any time from
          My Subscriptions. Overdue balances block new orders until cleared.
        </AppText>

        <AppButton title="Create subscription" isLoading={submitting} onAction={submit} />
        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </NavScreen>
  );
};

const Section = ({ theme, label, children }) => (
  <View style={{ marginBottom: spacing.lg }}>
    <AppText variant="label" color={theme.secondaryText} style={{ marginBottom: spacing.sm }}>
      {label}
    </AppText>
    {children}
  </View>
);

const Field = ({ theme, ...rest }) => (
  <TextInput
    placeholderTextColor={theme.secondaryText}
    style={[styles.input, {
      color: theme.text,
      borderColor: theme.inputContainerBorder,
      backgroundColor: theme.inputContainer,
    }]}
    {...rest}
  />
);

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full ?? 999,
    borderWidth: 1,
    marginRight: spacing.sm,
  },
  toggle: { flexDirection: 'row', gap: spacing.sm },
  toggleBtn: {
    flex: 1, alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.md, borderWidth: 1,
  },
  addressRow: {
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 1, borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 44,
  },
});

export default CreateSubscriptionScreen;
