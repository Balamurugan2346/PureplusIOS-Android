import { useTheme } from '../../Context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppText from '../AppText';
import AppButton from '../AppButton';
import { radius, spacing } from '../../Themes/Themes';

/**
 * Payment method picker + place-order CTA (pureLight restyle).
 * Logic preserved exactly: `selectedMethod` state ('UPI' | 'COD') is passed to
 * `onPayClick`, and the button label uses `payableTotal` (estimate.grandTotal).
 */
const PaymentSection = ({ navigation, onPayClick, payableTotal }) => {
  const { theme } = useTheme();

  const [selectedMethod, setSelectedMethod] = useState('UPI');

  // Grand total to pay at the door (estimate.grandTotal). Only shown once the estimate
  // has resolved to a positive amount; otherwise the button stays a plain "Place Order".
  const hasTotal = Number(payableTotal) > 0;
  const totalLabel = hasTotal ? `₹${Number(payableTotal).toFixed(2)}` : '';

  const paymentMethods = [
    { id: 'UPI', label: 'UPI / Google Pay', caption: "Scan the partner's QR at delivery" },
    { id: 'COD', label: 'Cash on Delivery', caption: 'Pay cash to the delivery partner' },
  ];

  const payHint =
    selectedMethod === 'UPI'
      ? 'Nothing is charged now. You pay by UPI when your cans arrive.'
      : 'Nothing is charged now. You pay in cash when your cans arrive.';

  return (
    <View style={styles.wrapper}>
      <View style={[styles.card, { backgroundColor: theme.surfaceCard }]}>
        <AppText variant="title" color={theme.ink} style={{ marginBottom: spacing.md }}>
          Pay at the door with
        </AppText>

        {paymentMethods.map((method) => {
          const active = selectedMethod === method.id;
          return (
            <TouchableOpacity
              key={method.id}
              activeOpacity={0.85}
              onPress={() => setSelectedMethod(method.id)}
              style={[
                styles.optionRow,
                {
                  backgroundColor: active ? theme.primaryTint : theme.surfaceCard,
                  borderColor: active ? theme.primary : theme.borderSubtle,
                },
              ]}
            >
              <Ionicons
                name={active ? 'radio-button-on' : 'radio-button-off'}
                size={22}
                color={active ? theme.primary : theme.borderStrong}
              />
              <View style={styles.optionTextWrap}>
                <AppText variant="bodyStrong" color={theme.ink}>{method.label}</AppText>
                <AppText variant="caption" color={theme.inkMuted} style={{ marginTop: 2 }}>
                  {method.caption}
                </AppText>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <AppButton
        title={hasTotal ? `Place Order · ${totalLabel}` : 'Place Order'}
        onAction={() => onPayClick(selectedMethod)}
      />
      <AppText variant="caption" color={theme.inkMuted} style={styles.payHint}>
        {payHint}
      </AppText>
    </View>
  );
};

export default PaymentSection;

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  card: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  optionTextWrap: {
    flex: 1,
    marginLeft: spacing.md,
  },
  payHint: {
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
