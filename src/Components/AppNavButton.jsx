import { StyleSheet, View } from 'react-native';
import { useTheme } from '../Context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

/**
 * Back affordance (00-foundation): a 44×44 white circle with a `chevron-back`
 * icon in ink. Props preserved: `isback`, `color` (icon tint override), `style`.
 */
const AppNavButton = ({ isback = true, color, style }) => {
  const { theme } = useTheme();
  return (
    <View style={[styles.button, { backgroundColor: theme.surfaceCard }, style]}>
      <Ionicons name="chevron-back" size={20} color={color || theme.ink} />
    </View>
  );
};

export default AppNavButton;

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
