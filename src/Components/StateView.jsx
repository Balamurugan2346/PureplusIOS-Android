import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AppText from './AppText';
import AppButton from './AppButton';
import { spacing } from '../Themes/Themes';
import { useTheme } from '../Context/ThemeContext';

/**
 * Standard async wrapper: loading -> error(retry) -> empty -> children.
 * Every data screen uses this so no screen ever shows a blank white void.
 *
 *   <StateView loading={loading} error={err} empty={items.length===0}
 *              onRetry={load} emptyText="No orders yet">
 *     ...content...
 *   </StateView>
 */
const StateView = ({
  loading,
  error,
  empty,
  onRetry,
  emptyText = 'Nothing here yet',
  loadingText,
  children,
}) => {
  const { theme } = useTheme();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.primary} />
        {!!loadingText && (
          <AppText variant="caption" color={theme.secondaryText} style={{ marginTop: spacing.sm }}>
            {loadingText}
          </AppText>
        )}
      </View>
    );
  }

  if (error) {
    const msg = typeof error === 'string' ? error : error?.message || 'Something went wrong';
    return (
      <View style={styles.center}>
        <AppText variant="bodyStrong" color={theme.error} style={styles.msg}>{msg}</AppText>
        {!!onRetry && <AppButton title="Retry" onAction={onRetry} style={{ width: 160 }} />}
      </View>
    );
  }

  if (empty) {
    return (
      <View style={styles.center}>
        <AppText variant="body" color={theme.secondaryText} style={styles.msg}>{emptyText}</AppText>
        {!!onRetry && <AppButton title="Refresh" borderOnly onAction={onRetry} style={{ width: 160 }} />}
      </View>
    );
  }

  return children;
};

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  msg: { textAlign: 'center', marginBottom: spacing.md },
});

export default StateView;
