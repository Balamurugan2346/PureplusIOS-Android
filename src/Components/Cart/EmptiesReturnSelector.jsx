import Fonts from '../../../assets/fonts/Fonts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../Context/ThemeContext';

/**
 * CUS-12: lets the customer declare how many empty cans they'll hand back on THIS order,
 * so the refundable-deposit estimate is honest. Deposit is charged on cans kept after the swap.
 *
 * IMPORTANT business rule — a normal order can only SWAP or ADD cans, never net-reduce them.
 * So the return is capped at the cans being DELIVERED in this order (`maxReturn`), not at the
 * total held. Returning more than that is a net reduction = a deposit REFUND, which this flow
 * does not settle; those extra cans must go through the dedicated refund flow (My Cans).
 *
 * Props:
 *  - heldCans   total empty cans the customer holds (for the "you hold X" line)
 *  - maxReturn  the swap cap for this order = min(heldCans, cans delivered). Defaults to heldCans.
 *  - value      the empties the customer will return (default 0)
 *  - onChange   (next:number) => void — parent re-quotes the estimate
 *  - disabled   true while an estimate request is in flight
 */
export default function EmptiesReturnSelector({ heldCans, maxReturn, value, onChange, disabled }) {
  const { theme } = useTheme();
  const held = Number(heldCans) || 0;
  const cap = Math.min(Number(maxReturn ?? heldCans) || 0, held);
  if (!(held > 0) || !(cap > 0)) return null;

  const current = Math.min(Math.max(Number(value) || 0, 0), cap);
  const headerConfig = { color: theme.greyText, fontFamily: Fonts.family.regular, fontSize: Fonts.size.sm };
  const paraConfig = { color: theme.secondaryText, fontFamily: Fonts.family.medium, fontSize: 12 };

  const set = (next) => {
    if (disabled) return;
    const clamped = Math.min(Math.max(next, 0), cap);
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
        You hold {held} empty can{held === 1 ? '' : 's'}. How many will you swap on this delivery?
      </Text>

      <View style={styles.stepperRow}>
        <StepBtn icon="remove" onPress={() => set(current - 1)} off={current <= 0} />
        <Text style={[headerConfig, { fontSize: Fonts.size.lg, minWidth: 40, textAlign: 'center' }]}>{current}</Text>
        <StepBtn icon="add" onPress={() => set(current + 1)} off={current >= cap} />
        <Pressable onPress={() => set(cap)} disabled={disabled || current === cap} style={{ marginLeft: 12 }}>
          <Text style={[paraConfig, { color: theme.primary, opacity: current === cap ? 0.4 : 1 }]}>Swap all ({cap})</Text>
        </Pressable>
      </View>

      <Text style={[paraConfig, { marginTop: 12, fontSize: 11 }]}>
        You can swap up to {cap} on this order (one empty per can delivered). Returning fewer adds a refundable
        deposit for the cans you keep; the delivery partner confirms the final count at your door.
      </Text>
      {held > cap && (
        <Text style={[paraConfig, { marginTop: 6, fontSize: 11, color: theme.inkMuted ?? theme.greyText }]}>
          Holding {held - cap} more empt{held - cap === 1 ? 'y' : 'ies'}? To return those and get the deposit back,
          request a refund from My Cans.
        </Text>
      )}
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
