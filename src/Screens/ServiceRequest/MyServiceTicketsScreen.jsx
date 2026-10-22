import React, { useCallback, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavScreen from '../../Components/NavScreen';
import AppText from '../../Components/AppText';
import StateView from '../../Components/StateView';
import StatusBadge from '../../Components/StatusBadge';
import ServiceRequestService from '../../API/modules/ServiceRequestService';
import { spacing, radius } from '../../Themes/Themes';
import { useTheme } from '../../Context/ThemeContext';

const CATEGORY_LABELS = {
  CAN_REPLACEMENT: 'Can replacement',
  LEAK: 'Leak / damage',
  DAMAGE: 'Damage',
  WRONG_DELIVERY: 'Wrong delivery',
  MISSED_DELIVERY: 'Missed delivery',
};

/**
 * CUS-31 · My Tickets — the customer's service-request history on its own screen.
 * Fetches ServiceRequestService.list() with pull-to-refresh; tap → detail.
 */
const MyServiceTicketsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [state, setState] = useState({ loading: true, error: null, data: [] });
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setState((p) => ({ ...p, loading: true, error: null }));
    try {
      const data = await ServiceRequestService.list();
      setState({ loading: false, error: null, data: Array.isArray(data) ? data : data?.items ?? [] });
    } catch (e) {
      setState((p) => ({ loading: false, error: e, data: silent ? p.data : [] }));
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try { await load({ silent: true }); } finally { setRefreshing(false); }
  }, [load]);

  return (
    <NavScreen title="My Tickets" navigation={navigation} background={theme.surface}>
      <StateView loading={state.loading} error={state.error} empty={!state.data.length}
        onRetry={load} emptyText="No service requests yet">
        <FlatList
          data={state.data}
          keyExtractor={(item, i) => String(item?.id ?? i)}
          contentContainerStyle={{ gap: spacing.md, paddingBottom: 40 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} colors={[theme.primary]} />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation?.navigate?.('ServiceRequestDetail', { id: item?.id })}
              style={[styles.card, { backgroundColor: theme.surfaceCard }]}
            >
              <View style={{ flex: 1, marginRight: spacing.md }}>
                <AppText variant="label" color={theme.ink}>
                  {CATEGORY_LABELS[item?.category] ?? item?.categoryLabel ?? item?.category ?? 'Request'}
                </AppText>
                <AppText variant="caption" color={theme.inkMuted} style={{ marginTop: 2 }}>
                  {item?.createdAt ?? item?.date ?? ''}
                </AppText>
              </View>
              <StatusBadge status={item?.status} />
              <Ionicons name="chevron-forward" size={18} color={theme.inkMuted} style={{ marginLeft: spacing.sm }} />
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
        />
      </StateView>
    </NavScreen>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: radius.lg,
  },
});

export default MyServiceTicketsScreen;
