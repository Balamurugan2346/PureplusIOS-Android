import React, { useCallback, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import NavScreen from '../../Components/NavScreen';
import AppText from '../../Components/AppText';
import AppButton from '../../Components/AppButton';
import StateView from '../../Components/StateView';
import StatusBadge from '../../Components/StatusBadge';
import ServiceRequestService from '../../API/modules/ServiceRequestService';
import { spacing, radius } from '../../Themes/Themes';
import { useTheme } from '../../Context/ThemeContext';

const CATEGORIES = [
  { key: 'CAN_REPLACEMENT', label: 'Can replacement' },
  { key: 'LEAK', label: 'Leak / damage' },
  { key: 'WRONG_DELIVERY', label: 'Wrong delivery' },
  { key: 'MISSED_DELIVERY', label: 'Missed delivery' },
];

/** CUS-31 · Service Request — raise a ticket + track my tickets. */
const ServiceRequestScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [list, setList] = useState({ loading: true, error: null, data: [] });
  const [category, setCategory] = useState(CATEGORIES[0].key);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setList((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await ServiceRequestService.list();
      setList({ loading: false, error: null, data: Array.isArray(data) ? data : data?.items ?? [] });
    } catch (e) {
      setList({ loading: false, error: e, data: [] });
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const submit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      // Backend CreateServiceRequest: { category, description, orderId?, productId?, addressId? }
      await ServiceRequestService.create({ category, description: notes });
      setNotes('');
      Alert.alert('Raised', 'Your service request has been submitted.');
      load();
    } catch (e) {
      Alert.alert('Could not submit', e?.message || 'Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <NavScreen title="Service Requests" navigation={navigation}>

      <View style={[styles.form, { backgroundColor: theme.card }]}>
        <AppText variant="bodyStrong" color={theme.highlightedText}>Raise a new request</AppText>
        <View style={styles.chips}>
          {CATEGORIES.map((c) => {
            const active = c.key === category;
            return (
              <TouchableOpacity
                key={c.key}
                onPress={() => setCategory(c.key)}
                style={[styles.chip, { borderColor: active ? theme.primary : theme.divider,
                  backgroundColor: active ? `${theme.primary}22` : 'transparent' }]}
              >
                <AppText variant="label" color={active ? theme.primary : theme.secondaryText}>{c.label}</AppText>
              </TouchableOpacity>
            );
          })}
        </View>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Describe the issue (optional)"
          placeholderTextColor={theme.secondaryText}
          multiline
          style={[styles.input, { color: theme.text, borderColor: theme.inputContainerBorder,
            backgroundColor: theme.inputContainer }]}
        />
        <AppButton title="Submit request" isLoading={submitting} onAction={submit} />
      </View>

      <AppText variant="h3" color={theme.highlightedText} style={{ marginVertical: spacing.md }}>
        My tickets
      </AppText>

      <StateView loading={list.loading} error={list.error} empty={!list.data.length}
        onRetry={load} emptyText="No service requests yet">
        <FlatList
          data={list.data}
          keyExtractor={(item, i) => String(item?.id ?? i)}
          renderItem={({ item }) => (
            <View style={[styles.ticket, { backgroundColor: theme.card }]}>
              <View style={{ flex: 1 }}>
                <AppText variant="body" color={theme.text}>
                  {item?.categoryLabel ?? item?.category ?? 'Request'}
                </AppText>
                <AppText variant="caption" color={theme.secondaryText}>
                  {item?.createdAt ?? item?.date ?? ''}
                </AppText>
              </View>
              <StatusBadge status={item?.status} />
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      </StateView>
    </NavScreen>
  );
};

const styles = StyleSheet.create({
  form: { borderRadius: radius.lg, padding: spacing.lg },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginVertical: spacing.md },
  chip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.pill, borderWidth: 1 },
  input: { minHeight: 72, borderWidth: 1, borderRadius: radius.md, padding: spacing.md,
    textAlignVertical: 'top', marginBottom: spacing.md },
  ticket: { flexDirection: 'row', alignItems: 'center', padding: spacing.md,
    borderRadius: radius.md, marginBottom: spacing.sm },
});

export default ServiceRequestScreen;
