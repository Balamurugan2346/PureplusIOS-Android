import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import NavScreen from '../../Components/NavScreen';
import AppText from '../../Components/AppText';
import AppButton from '../../Components/AppButton';
import ServiceRequestService from '../../API/modules/ServiceRequestService';
import { useToast } from '../../Components/Toast/ToastProvider';
import { fontFamily, spacing, radius } from '../../Themes/Themes';
import { useTheme } from '../../Context/ThemeContext';

const CATEGORIES = [
  { key: 'CAN_REPLACEMENT', label: 'Can replacement' },
  { key: 'LEAK', label: 'Leak / damage' },
  { key: 'WRONG_DELIVERY', label: 'Wrong delivery' },
  { key: 'MISSED_DELIVERY', label: 'Missed delivery' },
];

/**
 * CUS-31 · Service Request (prompt 05 restyle) — raise a ticket. The tickets list lives on
 * its own screen (MyServiceTickets); after submitting, we replace to it so Back returns to
 * wherever the user came from.
 */
const ServiceRequestScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { showToast } = useToast();

  const [category, setCategory] = useState(CATEGORIES[0].key);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await ServiceRequestService.create({ category, description: notes });
      setNotes('');
      showToast("Request raised. We'll get back to you soon.");
      // Pop this screen and show the tickets list.
      navigation.replace('MyServiceTickets');
    } catch (e) {
      Alert.alert('Could not submit', e?.message || 'Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <NavScreen title="Service Requests" navigation={navigation} background={theme.surface}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Raise a new request */}
        <View style={[styles.form, { backgroundColor: theme.surfaceCard }]}>
          <AppText variant="title" color={theme.ink}>Raise a new request</AppText>

          <View style={styles.chips}>
            {CATEGORIES.map((c) => {
              const active = c.key === category;
              return (
                <TouchableOpacity
                  key={c.key}
                  onPress={() => setCategory(c.key)}
                  style={[styles.chip, {
                    borderColor: active ? theme.ink : theme.borderSubtle,
                    backgroundColor: active ? theme.ink : theme.surfaceCard,
                  }]}
                >
                  <AppText variant="label" color={active ? theme.onInk : theme.ink}>{c.label}</AppText>
                </TouchableOpacity>
              );
            })}
          </View>

          <AppText variant="label" color={theme.ink} style={{ marginBottom: spacing.xs }}>Description</AppText>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Describe the issue (optional)"
            placeholderTextColor={theme.inkMuted}
            multiline
            style={[styles.input, { color: theme.ink, borderColor: theme.borderStrong, backgroundColor: theme.surfaceCard }]}
          />
          <AppButton title="Submit request" isLoading={submitting} loadingText="Submitting…" onAction={submit} />
        </View>

        {/* Shortcut to the tickets list */}
        <TouchableOpacity
          onPress={() => navigation?.navigate?.('MyServiceTickets')}
          style={[styles.ticketsLink, { backgroundColor: theme.surfaceCard }]}
          activeOpacity={0.85}
        >
          <AppText variant="bodyStrong" color={theme.ink} style={{ flex: 1 }}>My tickets</AppText>
          <AppText variant="label" color={theme.primary}>View all</AppText>
        </TouchableOpacity>
      </ScrollView>
    </NavScreen>
  );
};

const styles = StyleSheet.create({
  form: { borderRadius: radius.lg, padding: spacing.lg, gap: spacing.md },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.pill, borderWidth: 1.5 },
  input: {
    minHeight: 72,
    borderWidth: 1.5,
    borderRadius: radius.md,
    padding: spacing.md,
    textAlignVertical: 'top',
    fontFamily: fontFamily.medium,
    fontSize: 15,
  },
  ticketsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.lg,
  },
});

export default ServiceRequestScreen;
