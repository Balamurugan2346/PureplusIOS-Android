import React, { useCallback, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavScreen from '../../Components/NavScreen';
import AppText from '../../Components/AppText';
import StateView from '../../Components/StateView';
import StatusBadge from '../../Components/StatusBadge';
import formatCurrency from '../../Utils/formatCurrency';
import BulkService from '../../API/modules/BulkService';
import { spacing, radius } from '../../Themes/Themes';
import { useTheme } from '../../Context/ThemeContext';

/** CUS-27 · Bulk request status (prompt 05 restyle) — track approval lifecycle. */
const BulkRequestStatusScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [state, setState] = useState({ loading: true, error: null, data: [] });

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await BulkService.list();
      setState({ loading: false, error: null, data: Array.isArray(data) ? data : data?.items ?? [] });
    } catch (e) {
      setState({ loading: false, error: e, data: [] });
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const addButton = (
    <TouchableOpacity
      onPress={() => navigation?.navigate?.('BulkRequest')}
      style={[styles.addBtn, { backgroundColor: theme.primaryTint }]}
      hitSlop={8}
    >
      <Ionicons name="add" size={22} color={theme.primary} />
    </TouchableOpacity>
  );

  return (
    <NavScreen title="My Bulk Requests" navigation={navigation} background={theme.surface} right={addButton}>
      <StateView loading={state.loading} error={state.error} empty={!state.data.length}
        onRetry={load} emptyText="No bulk requests yet">
        <FlatList
          data={state.data}
          keyExtractor={(item, i) => String(item?.id ?? i)}
          contentContainerStyle={{ gap: spacing.md, paddingBottom: 40 }}
          renderItem={({ item }) => {
            const isEvent = String(item?.requestType || '').toUpperCase() === 'EVENT';
            const typeLabel = isEvent ? 'Event' : 'B2B';
            return (
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => navigation?.navigate?.('BulkRequestDetail', { id: item?.id })}
                style={[styles.card, { backgroundColor: theme.surfaceCard }]}
              >
                <View style={[styles.well, { backgroundColor: theme.primaryTint }]}>
                  <Ionicons name={isEvent ? 'calendar-outline' : 'briefcase-outline'} size={22} color={theme.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.rowBetween}>
                    <AppText variant="bodyStrong" color={theme.ink} style={{ flex: 1, marginRight: spacing.sm }}>
                      {typeLabel} · {item?.quantity ?? '-'} units
                    </AppText>
                    <StatusBadge status={item?.status} />
                  </View>
                  <AppText variant="caption" color={theme.inkMuted} style={{ marginTop: 2 }}>
                    Required: {item?.requestedDate ?? '-'}
                  </AppText>
                  {item?.estimatedAmount != null && (
                    <AppText variant="caption" color={theme.ink} style={{ marginTop: 2, fontWeight: '600' }}>
                      Quote: {formatCurrency(item.estimatedAmount)}
                    </AppText>
                  )}
                </View>
              </TouchableOpacity>
            );
          }}
          showsVerticalScrollIndicator={false}
        />
      </StateView>
    </NavScreen>
  );
};

const styles = StyleSheet.create({
  addBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
  },
  well: { width: 44, height: 44, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});

export default BulkRequestStatusScreen;
