import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from './AppText';
import formatCurrency from '../Utils/formatCurrency';
import { spacing, radius } from '../Themes/Themes';
import { useTheme } from '../Context/ThemeContext';

/**
 * Honest checkout breakdown (CUS-12/14, 00-foundation restyle). Props preserved:
 * rows ([{label, value, hint}]), total, note. A zero value renders as FREE
 * (success). Money always via formatCurrency().
 */
const PriceBreakdown = ({ rows = [], total, note }) => {
  const { theme } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: theme.surfaceCard }]}>
      {rows.map((r, i) => {
        const isFree = r.value === 0;
        return (
          <View key={i} style={styles.row}>
            <View style={{ flex: 1 }}>
              <AppText variant="label" color={theme.inkMuted}>{r.label}</AppText>
              {!!r.hint && (
                <AppText variant="caption" color={theme.inkMuted}>{r.hint}</AppText>
              )}
            </View>
            {isFree ? (
              <AppText variant="bodyStrong" color={theme.success}>FREE</AppText>
            ) : (
              <AppText variant="bodyStrong" color={theme.ink}>
                {r.value < 0 ? `- ${formatCurrency(Math.abs(r.value))}` : formatCurrency(r.value)}
              </AppText>
            )}
          </View>
        );
      })}

      <View style={[styles.divider, { backgroundColor: theme.borderSubtle }]} />

      <View style={styles.row}>
        <AppText variant="bodyStrong" color={theme.ink} style={styles.totalLabel}>Total</AppText>
        <AppText variant="price" color={theme.ink}>{formatCurrency(total)}</AppText>
      </View>

      {!!note && (
        <AppText variant="caption" color={theme.inkMuted} style={{ marginTop: spacing.sm }}>
          {note}
        </AppText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, padding: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 6 },
  divider: { height: 1, marginVertical: spacing.sm },
  totalLabel: { fontSize: 15, fontWeight: '700' },
});

export default PriceBreakdown;
