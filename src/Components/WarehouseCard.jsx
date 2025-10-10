import Fonts from '../../assets/fonts/Fonts'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomImage from '../Components/CustomImage';
import { useTheme } from '../Context/ThemeContext';

const WarehouseCard = ({ warehouse, onPress }) => {
  // restaurant = { name, rating, distance, image }

  const { theme } = useTheme()

  const headerConfig = {
    color: theme.background,
    fontFamily: Fonts.family.semiBold,
    fontSize: Fonts.size.sm
  }

  const paratextConfig = {
    color:theme.secondaryText,
    fontFamily: Fonts.family.semiBold,
    fontSize: Fonts.size.xs
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* Image section */}
      <CustomImage
        source={warehouse.image}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Details section */}
      <View style={styles.details}>
        <Text style={headerConfig}>{warehouse.name}</Text>
        <Text style={paratextConfig}>{warehouse.address}</Text>
        <View style={styles.row}>
          <Text style={styles.rating}>⭐ {warehouse.rating}</Text>
          <Text style={styles.dot}> • </Text>
          <Text style={styles.distance}>{warehouse.distance} km</Text>
        </View>
        <Text style={styles.cuisine}>{warehouse.cuisine}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default WarehouseCard;

const styles = StyleSheet.create({
  card: {
    width:160,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 12,
    overflow: 'hidden',
    elevation: 2, // for Android shadow
    shadowColor: '#000', // for iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    height: 100,
  },
  details: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  address: {

  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50', // greenish
  },
  dot: {
    fontSize: 14,
    color: '#777',
  },
  distance: {
    fontSize: 14,
    color: '#555',
  },
  cuisine: {
    fontSize: 12,
    color: '#888',
  },
});
