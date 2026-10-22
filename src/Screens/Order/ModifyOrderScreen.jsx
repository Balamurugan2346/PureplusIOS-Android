import React, { useCallback, useEffect, useState } from 'react';
import {
  View, StyleSheet, TouchableOpacity, FlatList,
  Platform, Alert, ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
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
 * CUS-19 · Modify Order (prompt 03 restyle, pureLight). Only reachable while
 * order.status === 'PLACED'. Lets the customer pick a new delivery slot + date, then
 * PUT /orders/{id}. Backend enforces the ASSIGNED-lock — it rejects if already assigned.
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

  // ISO date for the payload (unchanged); friendly label for the field.
  const formatDate = (d) => d?.toISOString?.().slice(0, 10) ?? '';
  const displayDate = (d) =>
    d?.toLocaleDateString?.('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }) ?? '';

  const save = async () => {
    if (!selectedSlot) { Alert.alert('Pick a slot', 'Please choose a delivery slot.'); return; }
    setSaving(true);
    try {
      await OrderService.modify(orderId, {
        slotId: selectedSlot?.slotId ?? selectedSlot?.id,
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
    <NavScreen title="Modify Order" navigation={navigation} background={theme.surface}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Date picker */}
        <AppText variant="label" color={theme.ink} style={{ marginBottom: spacing.sm }}>
          Delivery date
        </AppText>
        <TouchableOpacity
          onPress={() => setShowPicker(true)}
          style={[styles.dateField, { borderColor: theme.borderStrong, backgroundColor: theme.surfaceCard }]}
        >
          <Ionicons name="calendar-outline" size={20} color={theme.primary} />
          <AppText variant="bodyStrong" color={theme.ink} style={{ flex: 1, marginLeft: spacing.md }}>
            {displayDate(selectedDate)}
          </AppText>
          <Ionicons name="chevron-down" size={20} color={theme.inkMuted} />
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
        <AppText variant="label" color={theme.ink} style={{ marginTop: spacing.xl, marginBottom: spacing.sm }}>
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
              const id = item?.slotId ?? item?.id;
              const active = (selectedSlot?.slotId ?? selectedSlot?.id) === id;
              // Slot label is `slotName` (matches the Schedule screen); fall back before showing an id.
              const label = item?.slotName ?? item?.label ?? item?.slotLabel ?? item?.name ?? `Slot ${id}`;
              return (
                <TouchableOpacity
                  onPress={() => setSelectedSlot(item)}
                  activeOpacity={0.85}
                  style={[styles.slotRow, {
                    borderColor: active ? theme.primary : theme.borderSubtle,
                    backgroundColor: active ? theme.primaryTint : theme.surfaceCard,
                  }]}
                >
                  <Ionicons
                    name={active ? 'radio-button-on' : 'radio-button-off'}
                    size={20}
                    color={active ? theme.primary : theme.borderStrong}
                    style={{ marginRight: spacing.md }}
                  />
                  <AppText variant="bodyStrong" color={theme.ink} style={{ flex: 1 }}>
                    {label}
                  </AppText>
                  {active && (
                    <View style={[styles.selectedBadge, { backgroundColor: theme.primary }]}>
                      <AppText variant="badge" color={theme.onPrimary}>SELECTED</AppText>
                    </View>
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </StateView>

        {/* Lock banner */}
        <View style={[styles.lockBanner, { backgroundColor: theme.warningTint }]}>
          <Ionicons name="lock-closed-outline" size={18} color={theme.warning} style={{ marginRight: spacing.sm }} />
          <AppText variant="caption" color={theme.warning} style={{ flex: 1 }}>
            Changes are only possible while your order is in PLACED status. Once a delivery partner
            is assigned, this option locks.
          </AppText>
        </View>

        <AppButton title="Save changes" isLoading={saving} loadingText="Saving…" onAction={save} />
        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </NavScreen>
  );
};

const styles = StyleSheet.create({
  dateField: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  slotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1.5,
    marginBottom: spacing.sm,
  },
  selectedBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  lockBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: radius.sm,
    padding: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
});

export default ModifyOrderScreen;
