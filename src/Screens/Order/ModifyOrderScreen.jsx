import React, { useCallback, useEffect, useState } from 'react';
import {
  View, StyleSheet, TouchableOpacity, FlatList,
  Platform, Alert, ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDispatch, useSelector } from 'react-redux';
import NavScreen from '../../Components/NavScreen';
import AppText from '../../Components/AppText';
import AppButton from '../../Components/AppButton';
import StateView from '../../Components/StateView';
import OrderService from '../../API/modules/OrderService';
import { loadSheduleSlots } from '../../Redux/Slices/SheduleOrderSlice';
import { spacing, radius } from '../../Themes/Themes';
import { useTheme } from '../../Context/ThemeContext';

/**
 * CUS-19 · Modify Order. Only reachable while order.status === 'PLACED'.
 * Lets the customer pick a new delivery slot + date, then PUT /orders/{id}.
 *
 * Payload shape (verify against Swagger): { slotId, deliveryDate }
 * The backend enforces the ASSIGNED-lock — it will reject if already assigned.
 */
const ModifyOrderScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const orderId = route?.params?.orderId;

  const { slots, loading: slotsLoading, error: slotsError } = useSelector((s) => s.sheduleOrder);

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { dispatch(loadSheduleSlots()); }, [dispatch]);

  const slotList = Array.isArray(slots)
    ? slots
    : slots?.data ?? slots?.slots ?? [];

  const formatDate = (d) => d?.toISOString?.().slice(0, 10) ?? '';

  const save = async () => {
    if (!selectedSlot) { Alert.alert('Pick a slot', 'Please choose a delivery slot.'); return; }
    setSaving(true);
    try {
      await OrderService.modify(orderId, {
        slotId: selectedSlot?.id ?? selectedSlot?.slotId,
        deliveryDate: formatDate(selectedDate),
      });
      Alert.alert('Order updated', 'Your delivery slot has been changed.', [
        { text: 'OK', onPress: () => navigation?.goBack?.() },
      ]);
    } catch (e) {
      if (e?.status === 409 || /assign/i.test(e?.message ?? '')) {
        Alert.alert(
          'Cannot modify',
          'Your order has already been assigned to a delivery partner and can no longer be changed.',
        );
      } else {
        Alert.alert('Could not update', e?.message || 'Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <NavScreen title="Modify Order" navigation={navigation}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Date picker */}
        <AppText variant="label" color={theme.secondaryText} style={{ marginBottom: spacing.sm }}>
          Delivery date
        </AppText>
        <TouchableOpacity
          onPress={() => setShowPicker(true)}
          style={[styles.datePill, { borderColor: theme.divider, backgroundColor: theme.card }]}
        >
          <AppText variant="bodyStrong" color={theme.text}>{formatDate(selectedDate)}</AppText>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            minimumDate={new Date()}
            onChange={(_, date) => {
              setShowPicker(Platform.OS === 'ios');
              if (date) setSelectedDate(date);
            }}
          />
        )}

        {/* Slot picker */}
        <AppText variant="label" color={theme.secondaryText} style={{ marginVertical: spacing.md }}>
          Delivery slot
        </AppText>

        <StateView
          loading={slotsLoading}
          error={slotsError}
          empty={!slotList.length}
          emptyText="No slots available"
        >
          <FlatList
            data={slotList}
            keyExtractor={(item, i) => String(item?.id ?? item?.slotId ?? i)}
            scrollEnabled={false}
            renderItem={({ item }) => {
              const id = item?.id ?? item?.slotId;
              const active = (selectedSlot?.id ?? selectedSlot?.slotId) === id;
              const label = item?.label ?? item?.slotLabel ?? item?.name ?? String(id);
              return (
                <TouchableOpacity
                  onPress={() => setSelectedSlot(item)}
                  style={[styles.slotRow, {
                    borderColor: active ? theme.primary : theme.divider,
                    backgroundColor: active ? `${theme.primary}18` : theme.card,
                  }]}
                >
                  <AppText variant="bodyStrong" color={active ? theme.primary : theme.text}>
                    {label}
                  </AppText>
                  {active && (
                    <AppText variant="caption" color={theme.primary}>Selected</AppText>
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </StateView>

        <View style={{ height: spacing.xl }} />

        <AppText variant="caption" color={theme.secondaryText} style={{ marginBottom: spacing.md }}>
          Changes are only possible while your order is in PLACED status. Once a delivery partner
          is assigned, this option locks.
        </AppText>

        <AppButton title="Save changes" isLoading={saving} onAction={save} />
        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </NavScreen>
  );
};

const styles = StyleSheet.create({
  datePill: {
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  slotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
});

export default ModifyOrderScreen;
