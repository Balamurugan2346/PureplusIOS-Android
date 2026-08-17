import React, { useCallback, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import NavScreen from '../../Components/NavScreen';
import AppText from '../../Components/AppText';
import StateView from '../../Components/StateView';
import formatCurrency from '../../Utils/formatCurrency';
import WalletService from '../../API/modules/WalletService';
import { spacing, radius } from '../../Themes/Themes';
import { useTheme } from '../../Context/ThemeContext';

/**
 * CUS-24 · Wallet. Holds credit issued from floor-charge overcharges (drivers
 * never hand back cash) + any Super-Admin dispute credit. Auto-applies to orders.
 */
const WalletScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [state, setState] = useState({ loading: true, error: null, data: null });

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await WalletService.get();
      setState({ loading: false, error: null, data });
    } catch (e) {
      setState({ loading: false, error: e, data: null });
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const balance = state.data?.balance ?? state.data?.walletBalance ?? 0;
  const ledger = state.data?.ledger ?? state.data?.transactions ?? state.data?.history ?? [];

  return (
    <NavScreen title="Wallet" navigation={navigation}>

      <View style={[styles.balanceCard, { backgroundColor: theme.primary }]}>
        <AppText variant="caption" color={theme.buttonText}>Available balance</AppText>
        <AppText variant="h1" color={theme.buttonText} style={{ marginTop: spacing.xs }}>
          {formatCurrency(balance)}
        </AppText>
        <AppText variant="caption" color={theme.buttonText} style={{ marginTop: spacing.sm, opacity: 0.9 }}>
          Credit auto-applies to your next order.
        </AppText>
      </View>

      <AppText variant="h3" color={theme.highlightedText} style={{ marginVertical: spacing.md }}>
        History
      </AppText>

      <StateView
        loading={state.loading}
        error={state.error}
        empty={!ledger.length}
        onRetry={load}
        emptyText="No wallet activity yet"
      >
        <FlatList
          data={ledger}
          keyExtractor={(item, i) => String(item?.id ?? i)}
          renderItem={({ item }) => {
            const amt = item?.amount ?? item?.value ?? 0;
            const credit = amt >= 0;
            return (
              <View style={[styles.row, { backgroundColor: theme.card }]}>
                <View style={{ flex: 1 }}>
                  <AppText variant="body" color={theme.text}>
                    {item?.reason ?? item?.source ?? item?.description ?? 'Adjustment'}
                  </AppText>
                  <AppText variant="caption" color={theme.secondaryText}>
                    {item?.createdAt ?? item?.date ?? ''}
                  </AppText>
                </View>
                <AppText variant="bodyStrong" color={credit ? theme.success : theme.error}>
                  {credit ? '+' : '-'} {formatCurrency(Math.abs(amt))}
                </AppText>
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
  balanceCard: { borderRadius: radius.lg, padding: spacing.xl },
  row: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: spacing.md, borderRadius: radius.md, marginBottom: spacing.sm,
  },
});

export default WalletScreen;
