import { useAppContext } from '../../Context/AppContext';
import { useTheme } from '../../Context/ThemeContext';
import Fonts from '../../../assets/fonts/Fonts';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BottomPayMentBar = () => {

  
  const insets = useSafeAreaInsets();
  const { addToCart, cart, reduceQuantity, removeFromCart, usersAddress } = useAppContext()
  const { theme } = useTheme()

  const headerConfig = {
    color: theme.greyText,
    fontFamily: Fonts.family.semiBold,
    fontSize: Fonts.size.lg
  }

  const paratextConfig = {
    color: theme.secondaryText,
    fontFamily: Fonts.family.medium,
    fontSize: Fonts.size.xs
  }

  return (
    <View style={styles.paymentContainer}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View>
          <Text style={[headerConfig, { fontSize: Fonts.size.base }]}>To Pay</Text>
          <Text style={[paratextConfig, { fontSize: 10, marginTop: 5 }]}>Incl All Taxes and Charges</Text>
        </View>
        <View style={{ justifyContent: "center", alignItems: "center", marginTop: 10 }}>
          <View style={{ flexDirection: "row" }}>
            <Text style={[paratextConfig, { textDecorationLine: "line-through" }]}>140</Text>
            <Text style={[paratextConfig, { color: theme.greyText, marginLeft: 5 }]}>120</Text>
          </View>
          <View style={{ borderRadius: 10, backgroundColor: "lightgreen", padding: 5, marginTop: 5 }}>
            <Text style={[paratextConfig, { color: "green" }]}>Saving 50%</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default BottomPayMentBar;

const styles = StyleSheet.create({
  paymentContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 12,
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    marginRight: 8,
  },
  paymentText: {

    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  payButton: {
    alignSelf: "flex-end",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});
