import React, { useCallback, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import NavScreen from '../../Components/NavScreen';
import AppText from '../../Components/AppText';
import AppButton from '../../Components/AppButton';
import StateView from '../../Components/StateView';
import StatusBadge from '../../Components/StatusBadge';
import formatCurrency from '../../Utils/formatCurrency';
import SubscriptionService from '../../API/modules/SubscriptionService';
import { spacing, radius } from '../../Themes/Themes';
import { useTheme } from '../../Context/ThemeContext';

/**
 * CUS-22 · Manage Subscription. Real controls (pause / resume / cancel),
 * not just a product list. Auto-pauses when postpaid goes overdue.
 */
const ManageSubscriptionScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [state, setState] = useState({ loading: true, error: null, data: [] });
  const [busyId, setBusyId] = useState(null);

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

  const confirmCancel = (id) =>
    Alert.alert('Cancel subscription?', 'Future deliveries stop. Any outstanding balance still applies.', [
      { text: 'Keep' },
      { text: 'Cancel it', style: 'destructive', onPress: () => act(id, SubscriptionService.cancel.bind(SubscriptionService), 'cancel') },
    ]);

  return (
    <NavScreen title="My Subscriptions" navigation={navigation}>
      <StateView loading={state.loading} error={state.error} empty={!state.data.length}
        onRetry={load} emptyText="No active subscriptions">
        <FlatList
          data={state.data}
          keyExtractor={(item, i) => String(item?.id ?? i)}
          renderItem={({ item }) => {
            const id = item?.id;
            const status = String(item?.status || '').toUpperCase();
            const paused = status === 'PAUSED';
            const busy = busyId === id;
            return (
              <View style={[styles.card, { backgroundColor: theme.card }]}>
                <View style={styles.rowBetween}>
                  <AppText variant="bodyStrong" color={theme.highlightedText}>
                    {item?.productName ?? item?.product ?? 'Subscription'}
                  </AppText>
                  <StatusBadge status={item?.status} />
                </View>
                <AppText variant="caption" color={theme.secondaryText} style={{ marginTop: spacing.xs }}>
                  {item?.frequency ?? ''} · {item?.quantity ?? '-'} per delivery
                </AppText>
                {item?.unbilledBalance != null && (
                  <AppText variant="body" color={theme.text} style={{ marginTop: spacing.xs }}>
                    Unbilled: {formatCurrency(item.unbilledBalance)} · Next bill: {item?.nextBillingDate ?? '-'}
                  </AppText>
                )}
                <View style={styles.actions}>
                  {paused ? (
                    <AppButton title="Resume" isLoading={busy} style={styles.btn}
                      onAction={() => act(id, SubscriptionService.resume.bind(SubscriptionService), 'resume')} />
                  ) : (
                    <AppButton title="Pause" borderOnly isLoading={busy} style={styles.btn}
                      onAction={() => act(id, SubscriptionService.pause.bind(SubscriptionService), 'pause')} />
                  )}
                  <AppButton title="Cancel" borderOnly style={styles.btn} onAction={() => confirmCancel(id)} />
                </View>
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
        />
      </StateView>
    </NavScreen>
  );
};

const styles = StyleSheet.create({
  card: { padding: spacing.lg, borderRadius: radius.md, marginBottom: spacing.md },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  btn: { flex: 1 },
});

export default ManageSubscriptionScreen;
