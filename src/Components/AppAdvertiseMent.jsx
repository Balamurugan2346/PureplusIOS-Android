import { StyleSheet, View } from 'react-native';
import AppText from './AppText';
import { useTheme } from '../Context/ThemeContext';
import { radius, spacing } from '../Themes/Themes';

/**
 * Dashboard footer ad block (redesign 02). surfaceSunken card, no emoji.
 */
const AppAdvertiseMent = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.surfaceSunken }]}>
      <AppText variant="display" color={theme.inkMuted} style={styles.title}>Ithu Namma{'\n'}Ooru App</AppText>
      <AppText variant="caption" color={theme.inkMuted}>Simple, fast, and made just for you. Made in Chennai.</AppText>
    </View>
  );
};

export default AppAdvertiseMent;

const styles = StyleSheet.create({
  card: { marginHorizontal: spacing.lg, marginTop: spacing.xl, borderRadius: radius.lg, padding: spacing.xl, gap: spacing.sm },
  title: { fontSize: 26, lineHeight: 30 },
});
