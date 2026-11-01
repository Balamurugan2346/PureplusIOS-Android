import Fonts from '../../../assets/fonts/Fonts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../Context/ThemeContext';

/**
 * CUS-12: lets the customer declare how many of their held empty cans they'll hand back
 * on THIS order, so the refundable-deposit estimate is honest instead of assuming a full swap.
 *
 * The deposit is charged on cans the customer KEEPS after the swap: returning fewer empties
 * keeps more cans → a higher deposit. The backend clamps the value to [0, heldCans] and the
 * delivery partner confirms the actual count at the door (that figure stays authoritative).
 *
 * Props:
 *  - heldCans   number of empty cans the customer currently holds (estimate.depositHeldCans)
 *  - value      the empties the customer will return (effective, defaults to a full swap)
 *  - onChange   (next:number) => void — parent re-quotes the estimate with this value
 *  - disabled   true while an estimate request is in flight
 */
export default function EmptiesReturnSelector({ heldCans, value, onChange, disabled }) {
  const { theme } = useTheme();
  if (!(Number(heldCans) > 0)) return null;

  const max = Number(heldCans) || 0;
  const current = Math.min(Math.max(Number(value) || 0, 0), max);
  const headerConfig = { color: theme.greyText, fontFamily: Fonts.family.regular, fontSize: Fonts.size.sm };
  const paraConfig = { color: theme.secondaryText, fontFamily: Fonts.family.medium, fontSize: 12 };

  const set = (next) => {
    if (disabled) return;
    const clamped = Math.min(Math.max(next, 0), max);
    if (clamped !== current) onChange(clamped);
  };

  const StepBtn = ({ icon, onPress, off }) => (
    <Pressable
      onPress={onPress}
      disabled={off || disabled}
      style={[styles.stepBtn, { borderColor: theme.borderSubtle, opacity: off || disabled ? 0.4 : 1 }]}
    >
      <Ionicons name={icon} size={18} color={theme.greyText} />
    </Pressable>
  );

  return (
    <View style={[styles.cardContainer, { backgroundColor: theme.cardContainer }]}>
      <Text style={[headerConfig, { fontSize: Fonts.size.base, marginBottom: 6 }]}>Returning empty cans?</Text>
      <Text style={[paraConfig, { marginBottom: 12 }]}>
        You hold {max} empty can{max === 1 ? '' : 's'}. How many will you hand to the delivery partner?
      </Text>

      <View style={styles.stepperRow}>
        <StepBtn icon="remove" onPress={() => set(current - 1)} off={current <= 0} />
        <Text style={[headerConfig, { fontSize: Fonts.size.lg, minWidth: 40, textAlign: 'center' }]}>{current}</Text>
        <StepBtn icon="add" onPress={() => set(current + 1)} off={current >= max} />
        <Pressable onPress={() => set(max)} disabled={disabled || current === max} style={{ marginLeft: 12 }}>
          <Text style={[paraConfig, { color: theme.primary, opacity: current === max ? 0.4 : 1 }]}>Return all</Text>
        </Pressable>
      </View>

      <Text style={[paraConfig, { marginTop: 12, fontSize: 11 }]}>
        Returning fewer adds a refundable deposit for the cans you keep. The delivery partner confirms the final count at your door.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: { borderRadius: 32, padding: 16, margin: 10 },
  stepperRow: { flexDirection: 'row', alignItems: 'center' },
  stepBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
