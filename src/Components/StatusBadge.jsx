import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from './AppText';
import { spacing, radius } from '../Themes/Themes';
import { useTheme } from '../Context/ThemeContext';

/**
 * Colored pill for order-lifecycle / postpaid / request statuses.
 * Maps common backend status strings to a semantic color.
 */
const COLOR_KEY = {
  PLACED: 'info', ASSIGNED: 'warning', LOADED: 'warning', OUT_FOR_DELIVERY: 'warning',
  DELIVERED: 'success', DELIVERED_PAYMENT_PENDING: 'warning', FAILED: 'error',
  CANCELLED: 'disabled', DISPUTED: 'error',
  PAID: 'success', OVERDUE: 'error', PENDING: 'warning',
  APPROVED: 'success', REJECTED: 'error', CONFIRMED: 'success', SUBMITTED: 'info',
};

const StatusBadge = ({ status, label }) => {
  const { theme } = useTheme();
  const key = COLOR_KEY[String(status || '').toUpperCase()] || 'info';
  const color = theme[key] || theme.info;
  const text = label || String(status || '').replace(/_/g, ' ');
  return (
    <View style={[styles.pill, { backgroundColor: `${color}22`, borderColor: color }]}>
      <AppText variant="label" color={color}>{text}</AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
});

export default StatusBadge;
