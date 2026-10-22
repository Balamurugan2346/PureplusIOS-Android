import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppNavButton from '../Components/AppNavButton';
import { useTheme } from '../Context/ThemeContext';
import { fontFamily, spacing } from '../Themes/Themes';

/**
 * Top app bar (00-foundation): no dark band, no rounded bottom. A light row on
 * `surface` — back button + title + optional right slot. Props preserved:
 * `title`, `style`, `navigation`, `customNav`, `callback`. Added: `right` slot.
 */
const TopAppBar = ({ title = 'Default', style, navigation, customNav = null, callback, right = null }) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.topBar,
        { backgroundColor: theme.surface, paddingTop: insets.top + 20 },
        style,
      ]}
    >
      <TouchableOpacity
        onPress={() => {
          if (customNav) {
            callback();
          } else {
            navigation.goBack();
          }
        }}
      >
        <AppNavButton color={theme.ink} />
      </TouchableOpacity>
      <Text style={[styles.title, { color: theme.ink }]} numberOfLines={1}>
        {title}
      </Text>
      {right ? <View>{right}</View> : null}
    </View>
  );
};

export default TopAppBar;

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.sm,
    gap: spacing.md,
  },
  title: {
    flex: 1,
    fontFamily: fontFamily.semibold,
    fontSize: 18,
    lineHeight: 24,
  },
});
