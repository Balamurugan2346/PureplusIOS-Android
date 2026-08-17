import React, { useCallback, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import NavScreen from '../../Components/NavScreen';
import AppText from '../../Components/AppText';
import StateView from '../../Components/StateView';
import StatusBadge from '../../Components/StatusBadge';
import formatCurrency from '../../Utils/formatCurrency';
import BulkService from '../../API/modules/BulkService';
import { spacing, radius } from '../../Themes/Themes';
import { useTheme } from '../../Context/ThemeContext';

/** CUS-27 · Bulk request status — track approval lifecycle. */
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

  return (
    <NavScreen title="My Bulk Requests" navigation={navigation}>
      <StateView loading={state.loading} error={state.error} empty={!state.data.length}
        onRetry={load} emptyText="No bulk requests yet">
        <FlatList
          data={state.data}
          keyExtractor={(item, i) => String(item?.id ?? i)}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation?.navigate?.('BulkRequestDetail', { id: item?.id })}
              style={[styles.card, { backgroundColor: theme.card }]}
            >
              <View style={styles.rowBetween}>
                <AppText variant="bodyStrong" color={theme.highlightedText}>
                  {item?.purpose ?? 'Request'} · {item?.quantity ?? '-'} units
                </AppText>
                <StatusBadge status={item?.status} />
              </View>
              <AppText variant="caption" color={theme.secondaryText} style={{ marginTop: spacing.xs }}>
                Required: {item?.requiredDate ?? '-'}
              </AppText>
              {item?.quotedPrice != null && (
                <AppText variant="body" color={theme.text} style={{ marginTop: spacing.xs }}>
                  Quote: {formatCurrency(item.quotedPrice)}
                </AppText>
              )}
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
        />
      </StateView>
    </NavScreen>
  );
};

const styles = StyleSheet.create({
  card: { padding: spacing.lg, borderRadius: radius.md, marginBottom: spacing.sm },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});

export default BulkRequestStatusScreen;
