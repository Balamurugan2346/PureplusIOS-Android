import React, { useCallback, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavScreen from '../../Components/NavScreen';
import AppText from '../../Components/AppText';
import AppButton from '../../Components/AppButton';
import AppModal from '../../Components/AppModal';
import StateView from '../../Components/StateView';
import StatusBadge from '../../Components/StatusBadge';
import formatCurrency from '../../Utils/formatCurrency';
import SubscriptionService from '../../API/modules/SubscriptionService';
import { spacing, radius } from '../../Themes/Themes';
import { useTheme } from '../../Context/ThemeContext';

/**
 * CUS-22 · Manage Subscription (prompt 04 restyle, pureLight). Real controls
 * (pause / resume / cancel). Auto-pauses when postpaid goes overdue.
 */
const ManageSubscriptionScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [state, setState] = useState({ loading: true, error: null, data: [] });
  const [busyId, setBusyId] = useState(null);
  const [cancelId, setCancelId] = useState(null);

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await SubscriptionService.list();
      setState({ loading: false, error: null, data: Array.isArray(data) ? data : data?.items ?? [] });
    } catch (e) {
      setState({ loading: false, error: e, data: [] });
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const act = async (id, fn, label) => {
    setBusyId(id);
    try {
      await fn(id);
      await load();
    } catch (e) {
      Alert.alert(`Could not ${label}`, e?.message || 'Please try again.');
    } finally {
      setBusyId(null);
    }
  };

  const doCancel = () => {
    const id = cancelId;
    setCancelId(null);
    if (id != null) act(id, SubscriptionService.cancel.bind(SubscriptionService), 'cancel');
  };

  return (
    <NavScreen title="My Subscriptions" navigation={navigation} background={theme.surface}>
      <AppButton
        title="+ New subscription"
        borderOnly
        style={{ marginBottom: spacing.lg }}
        onAction={() => navigation?.navigate?.('CreateSubscription')}
      />
      <StateView loading={state.loading} error={state.error} empty={!state.data.length}
        onRetry={load} emptyText="No active subscriptions">
        <FlatList
          data={state.data}
          keyExtractor={(item, i) => String(item?.id ?? i)}
          contentContainerStyle={{ paddingBottom: 40, gap: spacing.md }}
          renderItem={({ item }) => {
            const id = item?.id;
            const status = String(item?.status || '').toUpperCase();
            const paused = status === 'PAUSED';
            const overdue = status === 'OVERDUE' || item?.isOverdue === true || item?.overdue === true;
            const busy = busyId === id;
            return (
              <View style={[styles.card, { backgroundColor: theme.surfaceCard }]}>
                <View style={styles.rowBetween}>
                  <AppText variant="title" color={theme.ink} style={{ flex: 1, marginRight: spacing.sm }}>
                    {item?.productName ?? item?.product ?? 'Subscription'}
                  </AppText>
                  {overdue
                    ? <StatusBadge status="OVERDUE" label="Overdue · paused" />
                    : <StatusBadge status={item?.status} />}
                </View>

                <AppText variant="caption" color={theme.inkMuted}>
                  {item?.frequency ?? ''} · {item?.quantity ?? '-'} per delivery
                </AppText>

                {item?.unbilledBalance != null && (
                  <View style={[styles.unbilledRow, { backgroundColor: theme.surfaceSunken }]}>
                    <AppText variant="caption" color={theme.ink}>
                      Unbilled: <AppText variant="bodyStrong" color={theme.ink}>{formatCurrency(item.unbilledBalance)}</AppText>
                    </AppText>
                    <AppText variant="caption" color={theme.inkMuted}>Next bill: {item?.nextBillingDate ?? '-'}</AppText>
                  </View>
                )}

                {overdue && (
                  <View style={[styles.overdueBanner, { backgroundColor: theme.dangerTint }]}>
                    <Ionicons name="warning-outline" size={16} color={theme.danger} style={{ marginRight: 6 }} />
                    <AppText variant="caption" color={theme.danger} style={{ flex: 1 }}>
                      Paused automatically because the bill is overdue. Clear it in Billing to resume.
                    </AppText>
                  </View>
                )}

                <View style={styles.actions}>
                  <View style={{ flex: 1 }}>
                    {paused ? (
                      <AppButton title="Resume" isLoading={busy} disabled={overdue}
                        onAction={() => act(id, SubscriptionService.resume.bind(SubscriptionService), 'resume')} />
                    ) : (
                      <AppButton title="Pause" borderOnly isLoading={busy}
                        onAction={() => act(id, SubscriptionService.pause.bind(SubscriptionService), 'pause')} />
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <AppButton title="Cancel" variant="dangerSoft" onAction={() => setCancelId(id)} />
                  </View>
                </View>
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
        />
      </StateView>

      <AppModal
        visible={cancelId != null}
        setModalVisible={(v) => { if (!v) setCancelId(null); }}
        title="Cancel subscription?"
        description="Future deliveries stop. Any outstanding balance still applies."
        destructive
        confirmText="Cancel it"
        cancelText="Keep it"
        onPositive={doCancel}
        onNegative={() => setCancelId(null)}
      />
    </NavScreen>
  );
};

const styles = StyleSheet.create({
  card: { padding: spacing.lg, borderRadius: radius.lg, gap: spacing.sm },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  unbilledRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    marginTop: spacing.xs,
  },
  overdueBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.sm,
    padding: spacing.md,
  },
  actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xs },
});

export default ManageSubscriptionScreen;
