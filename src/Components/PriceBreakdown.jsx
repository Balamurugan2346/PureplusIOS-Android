import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from './AppText';
import formatCurrency from '../Utils/formatCurrency';
import { spacing } from '../Themes/Themes';
import { useTheme } from '../Context/ThemeContext';

/**
 * Honest checkout breakdown (CUS-12/14). Feed it the /checkout/estimate rows.
 *
 *   <PriceBreakdown
 *     rows={[
 *       { label: 'Subtotal', value: 200 },
 *       { label: 'GST', value: 10 },
 *       { label: 'Floor charge (estimate)', value: 20, hint: 'finalized at the door' },
 *       { label: 'Deposit (refundable)', value: 300 },
 *     ]}
 *     total={530}
 *     note="Pay at delivery — cash or UPI"
 *   />
 */
const PriceBreakdown = ({ rows = [], total, note }) => {
  const { theme } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      {rows.map((r, i) => (
        <View key={i} style={styles.row}>
          <View style={{ flex: 1 }}>
            <AppText variant="body" color={theme.text}>{r.label}</AppText>
            {!!r.hint && (
              <AppText variant="caption" color={theme.secondaryText}>{r.hint}</AppText>
            )}
          </View>
          <AppText variant="bodyStrong" color={theme.text}>
            {r.value < 0 ? `- ${formatCurrency(Math.abs(r.value))}` : formatCurrency(r.value)}
          </AppText>
        </View>
      ))}

      <View style={[styles.divider, { backgroundColor: theme.divider }]} />

      <View style={styles.row}>
        <AppText variant="h3" color={theme.highlightedText}>Total</AppText>
        <AppText variant="price" color={theme.primary}>{formatCurrency(total)}</AppText>
      </View>

      {!!note && (
        <AppText variant="caption" color={theme.secondaryText} style={{ marginTop: spacing.sm }}>
          {note}
        </AppText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: { borderRadius: 12, padding: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.xs },
  divider: { height: 1, marginVertical: spacing.sm },
});

export default PriceBreakdown;
