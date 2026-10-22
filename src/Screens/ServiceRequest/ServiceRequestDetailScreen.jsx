import React, { useCallback, useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavScreen from '../../Components/NavScreen';
import AppText from '../../Components/AppText';
import AppButton from '../../Components/AppButton';
import AppModal from '../../Components/AppModal';
import StateView from '../../Components/StateView';
import StatusBadge from '../../Components/StatusBadge';
import KeyValueRows from '../../Components/Money/KeyValueRows';
import SectionLabel from '../../Components/Money/SectionLabel';
import ServiceRequestService from '../../API/modules/ServiceRequestService';
import { spacing, radius } from '../../Themes/Themes';
import { useTheme } from '../../Context/ThemeContext';

/**
 * CUS-31 · Service Request detail (prompt 05 restyle, pureLight).
 *   GET  service-requests/{id}         → ServiceRequestDto
 *   POST service-requests/{id}/cancel  → ServiceRequestDto
 * Cancel is gated off the backend's allowedTransitions (customer may cancel only while non-terminal).
 */

const CATEGORY_LABELS = {
  CAN_REPLACEMENT: 'Can replacement',
  LEAK: 'Leak / damage',
  DAMAGE: 'Damage',
  WRONG_DELIVERY: 'Wrong delivery',
  MISSED_DELIVERY: 'Missed delivery',
};

const TERMINAL = new Set(['RESOLVED', 'CANCELLED', 'CLOSED']);

const formatDate = (v) => {
  if (!v) return '—';
  const d = new Date(v);
  return isNaN(d.getTime()) ? String(v) : d.toLocaleString();
};

const ServiceRequestDetailScreen = ({ navigation, route }) => {
  const { id } = route.params;
  const { theme } = useTheme();

  const [state, setState] = useState({ loading: true, error: null, data: null });
  const [busy, setBusy] = useState(false);
  const [cancelVisible, setCancelVisible] = useState(false);

  const load = useCallback(async () => {
    setState((p) => ({ ...p, loading: true, error: null }));
    try {
      const data = await ServiceRequestService.byId(id);
      setState({ loading: false, error: null, data });
    } catch (e) {
      setState({ loading: false, error: e, data: null });
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const doAction = async (fn) => {
    if (busy) return;
    setBusy(true);
    try {
      await fn();
      await load();
    } catch (e) {
      Alert.alert('Action failed', e?.message || 'Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const data = state.data;
  const status = String(data?.status ?? '').toUpperCase();
  const canCancel = data
    ? (Array.isArray(data.allowedTransitions)
        ? data.allowedTransitions.includes('CANCELLED')
        : !TERMINAL.has(status))
    : false;

  return (
    <NavScreen title="Service Request" navigation={navigation} background={theme.surface}>
      <StateView loading={state.loading} error={state.error} onRetry={load}>
        {data && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: spacing.md, paddingBottom: 40 }}>

            {/* Header */}
            <View style={[styles.card, { backgroundColor: theme.surfaceCard, gap: spacing.md }]}>
              <View style={styles.headerRow}>
                <AppText variant="title" color={theme.ink} style={{ flex: 1, marginRight: spacing.sm }}>
                  {CATEGORY_LABELS[data.category] ?? data.category ?? 'Request'}
                </AppText>
                <StatusBadge status={data.status} />
              </View>
              <KeyValueRows
                rows={[
                  { label: 'Request ID', value: `#${data.id}` },
                  { label: 'Raised', value: formatDate(data.createdAt) },
                  data.slaDueAt && { label: 'SLA due', value: formatDate(data.slaDueAt) },
                ]}
              />
              {data.slaBreached ? (
                <View style={[styles.banner, { backgroundColor: theme.dangerTint }]}>
                  <Ionicons name="time-outline" size={18} color={theme.danger} style={{ marginRight: spacing.sm }} />
                  <AppText variant="caption" color={theme.danger} style={{ flex: 1 }}>SLA breached — our team is on it.</AppText>
                </View>
              ) : null}
            </View>

            {/* Issue */}
            {!!data.description && (
              <View style={[styles.card, { backgroundColor: theme.surfaceCard, gap: spacing.sm }]}>
                <SectionLabel>ISSUE</SectionLabel>
                <AppText variant="body" color={theme.ink}>{data.description}</AppText>
              </View>
            )}

            {/* Visit */}
            {(data.scheduledDate || data.scheduledSlot || data.scheduleNote) && (
              <View style={[styles.card, { backgroundColor: theme.surfaceCard, gap: spacing.md }]}>
                <SectionLabel>VISIT</SectionLabel>
                <KeyValueRows
                  rows={[
                    data.scheduledDate && { label: 'Scheduled', value: formatDate(data.scheduledDate) },
                    data.scheduledSlot && { label: 'Slot', value: data.scheduledSlot },
                    data.scheduleNote && { label: 'Note', value: data.scheduleNote },
                  ]}
                />
              </View>
            )}

            {/* Resolution */}
            {(data.resolutionNote || data.resolvedAt || data.canSwapQty > 0) && (
              <View style={[styles.card, { backgroundColor: theme.successTint, gap: spacing.md }]}>
                <View style={styles.resolutionHeader}>
                  <Ionicons name="checkmark" size={20} color={theme.success} style={{ marginRight: spacing.sm }} />
                  <AppText variant="bodyStrong" color={theme.success}>Resolution</AppText>
                </View>
                <KeyValueRows
                  rows={[
                    data.resolvedAt && { label: 'Resolved', value: formatDate(data.resolvedAt) },
                    data.canSwapQty > 0 && { label: 'Cans swapped', value: String(data.canSwapQty) },
                    data.resolutionNote && { label: 'Note', value: data.resolutionNote },
                  ]}
                />
              </View>
            )}

            {canCancel && (
              <AppButton title="Cancel request" variant="dangerSoft" isLoading={busy} onAction={() => setCancelVisible(true)} />
            )}
          </ScrollView>
        )}
      </StateView>

      <AppModal
        visible={cancelVisible}
        setModalVisible={setCancelVisible}
        title="Cancel request?"
        description="This withdraws your service request. You can raise a new one anytime."
        destructive
        confirmText="Cancel it"
        cancelText="Keep it"
        onPositive={() => doAction(() => ServiceRequestService.cancel(id))}
      />
    </NavScreen>
  );
};

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, padding: spacing.lg },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resolutionHeader: { flexDirection: 'row', alignItems: 'center' },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.sm,
    padding: spacing.md,
  },
});

export default ServiceRequestDetailScreen;
