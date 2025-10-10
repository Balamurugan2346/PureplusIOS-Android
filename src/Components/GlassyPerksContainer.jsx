import Fonts from '../../assets/fonts/Fonts';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../Context/ThemeContext';

export default function GlassyPerksContainer() {
  const { theme } = useTheme();

  const paratextConfig = {
    color: theme.background,
    fontFamily: Fonts.family.medium,
    fontSize: Fonts.size.xs,
  };

  return (
    <View style={[styles.cardContainer, { backgroundColor: theme.cardContainer }]}>
      <View style={styles.perkItem}>
        <View style={styles.iconBadge}>
          <Image source={require('../../assets/images/deliveryBoy.png')} style={styles.perkImage} />
        </View>
        <Text style={[styles.perkTitle, paratextConfig]}>Fast Delivery</Text>
      </View>

      <View style={styles.perkItem}>
        <View style={styles.iconBadge}>
          <Image source={require('../../assets/images/30L.png')} style={styles.perkImage} />
        </View>
        <Text style={[styles.perkTitle, paratextConfig]}>Pure water</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    elevation:9,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    backgroundColor: '#F7F8FB', // light bg like screenshot
  },
  perkItem: {
    alignItems: 'center',
    width: '45%',
    backgroundColor:"#c2aee11b",
    borderRadius:20,
    padding:5
  },
  iconBadge: {
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 12,
    borderWidth: 0,
    borderColor: '#E6E6E6',
    marginBottom: 6,
  },
  perkImage: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  perkTitle: {
    fontSize: 12,
    textAlign: 'center',
  },
});
