import React from 'react';
import { StyleSheet, View } from 'react-native';
import notifee from '@notifee/react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppButton from '../../Components/AppButton';
import AppText from '../../Components/AppText';
import BrandShape from '../../Components/BrandShape';
import { useTheme } from '../../Context/ThemeContext';
import { spacing, radius } from '../../Themes/Themes';

/**
 * Enable Notifications (redesign 01).
 *
 * NOTE (human-in-the-loop): this screen is currently an orphan — it is NOT
 * registered in AppNavigator and nothing navigates to it. So the post-action
 * destination is undefined. Enable requests the OS notification permission via
 * the project's existing notifee lib; both buttons then fall back to goBack()
 * if a navigation prop is present. **Confirm where this screen sits in the flow
 * and where both buttons should go next before relying on it.**
 */
export default function EnableNotificationsScreen({ navigation }) {
  const { theme } = useTheme();

  const requestAndContinue = async () => {
    try {
      await notifee.requestPermission();
    } catch (e) {
      // permission request failed — continue regardless
    }
    navigation?.goBack?.(); // TODO: confirm real destination
  };

  const skip = () => {
    navigation?.goBack?.(); // TODO: confirm real destination
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <AppText variant="title" color={theme.ink} style={styles.headline}>
        Enable notifications to get updates about offers, order status and more
      </AppText>

      <View style={[styles.illustration, { backgroundColor: theme.sky200 }]}>
        <View style={[styles.bell, { backgroundColor: theme.primary }]}>
          <Ionicons name="notifications" size={34} color={theme.onPrimary} />
        </View>
        <BrandShape shape="leaf" size={110} color={theme.brandGreen} style={{ left: -24, bottom: -24 }} />
      </View>

      <View style={styles.buttons}>
        <AppButton title="Enable Notifications" onAction={requestAndContinue} />
        <AppButton title="Not now" borderOnly onAction={skip} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 64, paddingHorizontal: spacing.xl, paddingBottom: 48, gap: spacing.xxl },
  headline: { textAlign: 'center' },
  illustration: {
    flex: 1,
    borderRadius: radius.lg,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bell: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
  buttons: { gap: spacing.md },
});
