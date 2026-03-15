import { Image, StyleSheet, View } from 'react-native';
import { useTheme } from '../Context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
const AppNavButton = ({ isback = true, color, style }) => {
  const { theme, toggleTheme } = useTheme();
  return (
    <View
      style={[styles.backButton, {
        backgroundColor: "#8fa6bf",
        padding: 10,
        borderRadius: 12,
        marginRight: 12
      }]}
    >
      <Ionicons name="arrow-back" size={20} color="#fff" />
    </View>
  )
}

export default AppNavButton

const styles = StyleSheet.create({


})