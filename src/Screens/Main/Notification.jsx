import React, { useCallback, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavScreen from '../../Components/NavScreen';
import AppText from '../../Components/AppText';
import StateView from '../../Components/StateView';
import NotificationService from '../../API/modules/NotificationService';
import { spacing, radius } from '../../Themes/Themes';
import { useTheme } from '../../Context/ThemeContext';

/**
 * CUS-34 · Notification Center — the persistent in-app inbox. Every push also
 * lands here, so nothing is lost when push is denied or missed.
 */
const Notification = ({ navigation }) => {
  const { theme } = useTheme();
  const [state, setState] = useState({ loading: true, error: null, data: [] });

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await NotificationService.list();
      setState({ loading: false, error: null, data: Array.isArray(data) ? data : data?.items ?? [] });
    } catch (e) {
      setState({ loading: false, error: e, data: [] });
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const markAllRead = async () => {
    try {
      await NotificationService.readAll();
      setState((s) => ({ ...s, data: s.data.map((n) => ({ ...n, isRead: true, read: true })) }));
    } catch (_) { /* non-fatal */ }
  };

  const openItem = async (item) => {
    if (item?.id && !(item?.isRead ?? item?.read)) {
      try {
        await NotificationService.markRead(item.id);
        setState((s) => ({
          ...s,
          data: s.data.map((n) => (n.id === item.id ? { ...n, isRead: true, read: true } : n)),
        }));
      } catch (_) { /* non-fatal */ }
    }
  };

  const hasUnread = state.data.some((n) => !(n?.isRead ?? n?.read));

  return (
    <NavScreen
      title="Notifications"
      navigation={navigation}
      background={theme.surface}
      right={hasUnread ? (
        <TouchableOpacity onPress={markAllRead} hitSlop={8}>
          <AppText variant="label" color={theme.primary}>Mark all read</AppText>
        </TouchableOpacity>
      ) : null}
    >
      <StateView loading={state.loading} error={state.error} empty={!state.data.length}
        onRetry={load} emptyText="You're all caught up">
        <FlatList
          data={state.data}
          keyExtractor={(item, i) => String(item?.id ?? i)}
          contentContainerStyle={{ paddingBottom: 110 }}
          renderItem={({ item }) => {
            const unread = !(item?.isRead ?? item?.read);
            return (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => openItem(item)}
                style={[styles.row, { backgroundColor: unread ? theme.primaryTint : theme.surfaceCard }]}
              >
                <View style={[styles.iconWrap, { backgroundColor: unread ? theme.surfaceCard : theme.primaryTint }]}>
                  <Ionicons name="notifications-outline" size={20} color={theme.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <AppText variant={unread ? 'bodyStrong' : 'body'} color={theme.ink}>
                    {item?.title ?? item?.heading ?? 'Notification'}
                  </AppText>
                  {!!(item?.body ?? item?.message) && (
                    <AppText variant="caption" color={theme.inkMuted} style={{ marginTop: 2 }}>
                      {item?.body ?? item?.message}
                    </AppText>
                  )}
                  <AppText variant="caption" color={theme.inkMuted} style={{ marginTop: 2 }}>
                    {item?.createdAt ?? item?.date ?? ''}
                  </AppText>
                </View>
                <View style={[styles.dot, { backgroundColor: unread ? theme.primary : 'transparent' }]} />
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
  header: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md },
  row: {
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md,
    paddingVertical: spacing.md, paddingHorizontal: spacing.lg,
    borderRadius: radius.md, marginBottom: spacing.sm,
  },
  iconWrap: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 8 },
});

export default Notification;
