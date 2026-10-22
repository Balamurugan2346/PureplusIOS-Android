import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppText from './AppText';
import AppButton from './AppButton';
import { spacing } from '../Themes/Themes';
import { useTheme } from '../Context/ThemeContext';

/**
 * Standard async wrapper (00-foundation): loading -> error(retry) -> empty -> children.
 * Props preserved: loading, error, empty, onRetry, emptyText, loadingText, children.
 * Added optional: emptyIcon (Ionicons name), emptyDescription.
 */
const StateView = ({
  loading,
  error,
  empty,
  onRetry,
  emptyText = 'Nothing here yet',
  emptyDescription,
  emptyIcon = 'cube-outline',
  loadingText,
  children,
}) => {
  const { theme } = useTheme();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size={32} color={theme.primary} />
        {!!loadingText && (
          <AppText variant="caption" color={theme.inkMuted}>{loadingText}</AppText>
        )}
      </View>
    );
  }

  if (error) {
    const msg = typeof error === 'string' ? error : error?.message || 'Something went wrong';
    return (
      <View style={styles.center}>
        <View style={[styles.iconCircle, { backgroundColor: theme.dangerTint }]}>
          <Ionicons name="alert-circle-outline" size={26} color={theme.danger} />
        </View>
        <AppText variant="caption" color={theme.inkMuted} style={styles.msg}>{msg}</AppText>
        {!!onRetry && <AppButton title="Retry" borderOnly onAction={onRetry} style={styles.btn} />}
      </View>
    );
  }

  if (empty) {
    return (
      <View style={styles.center}>
        <View style={[styles.iconCircle, { backgroundColor: theme.primaryTint }]}>
          <Ionicons name={emptyIcon} size={26} color={theme.primary} />
        </View>
        <AppText variant="title" color={theme.ink} style={styles.msg}>{emptyText}</AppText>
        {!!emptyDescription && (
          <AppText variant="caption" color={theme.inkMuted} style={styles.msg}>{emptyDescription}</AppText>
        )}
        {!!onRetry && <AppButton title="Refresh" borderOnly size="small" onAction={onRetry} style={styles.btnSmall} />}
      </View>
    );
  }

  return children;
};

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xl, paddingHorizontal: spacing.lg, gap: spacing.md },
  iconCircle: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  msg: { textAlign: 'center' },
  btn: { width: 160 },
  btnSmall: { width: 160 },
});

export default StateView;
