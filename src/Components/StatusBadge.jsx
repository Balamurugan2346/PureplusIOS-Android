import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from './AppText';
import { radius } from '../Themes/Themes';
import { useTheme } from '../Context/ThemeContext';

/**
 * Colored pill for order-lifecycle / postpaid / request statuses (00-foundation).
 * Maps a backend status string to a semantic tone: tone-tint fill, 1px tone
 * border, tone text, badge type. Props preserved: `status`, `label`.
 */
const TONE_KEY = {
  PLACED: 'info', SUBMITTED: 'info',
  ASSIGNED: 'warning', LOADED: 'warning', OUT_FOR_DELIVERY: 'warning',
  PENDING: 'warning', COUNTER_OFFERED: 'warning', DELIVERED_PAYMENT_PENDING: 'warning',
  DELIVERED: 'success', PAID: 'success', APPROVED: 'success', CONFIRMED: 'success',
  ACTIVE: 'success', RESOLVED: 'success',
  FAILED: 'danger', OVERDUE: 'danger', REJECTED: 'danger', DISPUTED: 'danger',
  CANCELLED: 'neutral', PAUSED: 'neutral',
};

const StatusBadge = ({ status, label }) => {
  const { theme } = useTheme();
  const tone = TONE_KEY[String(status || '').toUpperCase()] || 'info';
  const color = theme[tone] || theme.info;
  const tint = theme[`${tone}Tint`] || theme.infoTint;
  const text = label || String(status || '').replace(/_/g, ' ');
  return (
    <View style={[styles.pill, { backgroundColor: tint, borderColor: color }]}>
      <AppText variant="badge" color={color}>{text}</AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    height: 22,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default StatusBadge;
