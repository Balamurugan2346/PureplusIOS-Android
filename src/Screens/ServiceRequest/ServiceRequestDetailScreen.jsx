import React, { useCallback, useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import NavScreen from '../../Components/NavScreen';
import AppText from '../../Components/AppText';
import AppButton from '../../Components/AppButton';
import StateView from '../../Components/StateView';
import StatusBadge from '../../Components/StatusBadge';
import ServiceRequestService from '../../API/modules/ServiceRequestService';
import { spacing, radius, lightSurface } from '../../Themes/Themes';
import { useTheme } from '../../Context/ThemeContext';

/**
 * CUS-31 · Service Request detail — wired to:
 *   GET  service-requests/{id}         → ServiceRequestDto
 *   POST service-requests/{id}/cancel  → ServiceRequestDto (no body)
 * Rendered on a WHITE surface (lightSurface) to match the Refill screen; brand primary kept.
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
  // White surface palette; keep the brand primary + a legible error red for white bg.
  const s = { ...lightSurface, primary: theme.primary, error: '#D90202' };

  const [state, setState] = useState({ loading: true, error: null, data: null });
  const [busy, setBusy] = useState(false);

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

  const onCancel = () => {
    Alert.alert(
      'Cancel request?',
      'This withdraws your service request. You can raise a new one anytime.',
      [
        { text: 'Keep', style: 'cancel' },
        {
          text: 'Cancel request',
          style: 'destructive',
          onPress: () => doAction(() => ServiceRequestService.cancel(id)),
        },
      ],
    );
  };

  return (
    <NavScreen title="Service Request" navigation={navigation} background={s.background}>
      <StateView loading={state.loading} error={state.error} onRetry={load}>
        {data && (
          <ScrollView showsVerticalScrollIndicator={false}>

            {/* Header */}
            <View style={[styles.card, { backgroundColor: s.card }]}>
              <View style={styles.headerRow}>
                <AppText variant="h3" color={s.highlightedText}>
                  {CATEGORY_LABELS[data.category] ?? data.category ?? 'Request'}
                </AppText>
                <StatusBadge status={data.status} />
              </View>
              <Row s={s} label="Request ID" value={`#${data.id}`} />
              <Row s={s} label="Raised" value={formatDate(data.createdAt)} />
              {data.slaDueAt ? <Row s={s} label="SLA due" value={formatDate(data.slaDueAt)} /> : null}
              {data.slaBreached ? (
                <AppText variant="caption" color={s.error} style={{ marginTop: spacing.xs }}>
                  SLA breached — our team is on it.
                </AppText>
              ) : null}
            </View>

            {/* Issue */}
            {!!data.description && (
              <View style={[styles.card, { backgroundColor: s.card, marginTop: spacing.md }]}>
                <AppText variant="label" color={s.secondaryText} style={{ marginBottom: spacing.xs }}>Issue</AppText>
                <AppText variant="body" color={s.text}>{data.description}</AppText>
              </View>
            )}

            {/* Visit / schedule */}
            {(data.scheduledDate || data.scheduledSlot || data.scheduleNote) && (
              <View style={[styles.card, { backgroundColor: s.card, marginTop: spacing.md }]}>
                <AppText variant="label" color={s.secondaryText} style={{ marginBottom: spacing.xs }}>Visit</AppText>
                {data.scheduledDate ? <Row s={s} label="Scheduled" value={formatDate(data.scheduledDate)} /> : null}
                {data.scheduledSlot ? <Row s={s} label="Slot" value={data.scheduledSlot} /> : null}
                {data.scheduleNote ? <Row s={s} label="Note" value={data.scheduleNote} /> : null}
              </View>
            )}

            {/* Resolution */}
            {(data.resolutionNote || data.resolvedAt || data.canSwapQty > 0) && (
              <View style={[styles.card, { backgroundColor: s.card, marginTop: spacing.md }]}>
                <AppText variant="label" color={s.secondaryText} style={{ marginBottom: spacing.xs }}>Resolution</AppText>
                {data.resolvedAt ? <Row s={s} label="Resolved" value={formatDate(data.resolvedAt)} /> : null}
                {data.canSwapQty > 0 ? <Row s={s} label="Cans swapped" value={String(data.canSwapQty)} /> : null}
                {data.resolutionNote ? <Row s={s} label="Note" value={data.resolutionNote} /> : null}
              </View>
            )}

            <View style={{ height: spacing.xl }} />

            {canCancel && (
              <AppButton title="Cancel request" borderOnly isLoading={busy} onAction={onCancel} />
            )}
            <View style={{ height: spacing.xxl }} />
          </ScrollView>
        )}
      </StateView>
    </NavScreen>
  );
};

const Row = ({ s, label, value }) => (
  <View style={styles.row}>
    <AppText variant="body" color={s.secondaryText}>{label}</AppText>
    <AppText variant="bodyStrong" color={s.text}>{value}</AppText>
  </View>
);

const styles = StyleSheet.create({
  card: { borderRadius: radius.md, padding: spacing.lg },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs },
});

export default ServiceRequestDetailScreen;
