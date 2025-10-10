import { useTheme } from '../../Context/ThemeContext';
import Fonts from '../../../assets/fonts/Fonts';
import Ionicons from 'react-native-vector-icons/Ionicons'; // for tick/check icon
import  LinearGradient  from 'react-native-linear-gradient'; // or react-native-linear-gradient
import { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

const PaymentSection = ({ navigation }) => {
  const { theme } = useTheme();

  const [selectedMethod, setSelectedMethod] = useState('UPI');

  const paymentMethods = [
    { id: 'UPI', label: 'Google Pay / UPI', icon: require('../../../assets/images/gpayLogo.png') },
    { id: 'COD', label: 'Cash on Delivery', icon: require('../../../assets/images/cash.png') },
  ];

  return (
    <LinearGradient
      colors={[theme.card, theme.card]}
      style={[styles.paymentContainer, { backgroundColor: theme.background }]}
    >
      {/* Header */}
      <Text style={[styles.headerText, { color: theme.buttonText }]}>Select Payment Method</Text>

      {/* Radio Buttons */}
      {paymentMethods.map((method) => (
        <TouchableOpacity
          key={method.id}
          onPress={() => setSelectedMethod(method.id)}
          style={styles.optionRow}
        >
          <View style={styles.radioCircle}>
            {selectedMethod === method.id && (
              <Ionicons name="checkmark-circle" size={24} color={theme.primary} />
            )}
            {selectedMethod !== method.id && (
              <Ionicons name="ellipse-outline" size={24} color="gray" />
            )}
          </View>
          <Image source={method.icon} style={styles.icon} />
          <Text style={[styles.optionText, { color: theme.buttonText }]}>{method.label}</Text>
        </TouchableOpacity>
      ))}

      {/* Checkout Button */}
      <View style={styles.footer}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={
              selectedMethod === 'UPI'
                ? require('../../../assets/images/gpayLogo.png')
                : require('../../../assets/images/cash.png')
            }
            style={styles.icon}
          />
          <Text style={{ color: theme.buttonText, marginLeft: 10 }}>{selectedMethod}</Text>
        </View>

        <TouchableOpacity onPress={() => {
          Toast.show({
            type: 'success',
            text1: 'Product Checked out',
            text2: `Note : For more details please check the order history`,
            position: 'bottom',
          });
        }} style={[styles.payButton, { backgroundColor: theme.primary }]}>
          <Text style={{ color: theme.buttonText, fontFamily: Fonts.family.medium }}>
            Check out ₹234.87
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default PaymentSection;

const styles = StyleSheet.create({
  paymentContainer: {
    borderRadius: 20,
    padding: 15,
    margin: 10,
    elevation: 3,
  },
  headerText: {
    fontFamily: Fonts.family.semiBold,
    fontSize: Fonts.size.base,
    marginBottom: 10,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  radioCircle: {
    marginRight: 10,
  },
  optionText: {
    fontFamily: Fonts.family.medium,
    fontSize: Fonts.size.sm,
    marginLeft: 10,
  },
  icon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  footer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  payButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
});
