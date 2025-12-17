import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Platform,
    StyleSheet,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';

import TopAppBar from '../../Components/TopAppBar';
import AppButton from '../../Components/AppButton';
import { useToast } from '../../Components/Toast/ToastProvider';
import { useTheme } from '../../Context/ThemeContext';
import Fonts from '../../../assets/fonts/Fonts';
import Ionicons from 'react-native-vector-icons/Ionicons';

/* ======================================================
   MAIN SCREEN
====================================================== */
const ScheduleDeliveryScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { showToast } = useToast();
    const { theme } = useTheme()

    const { cartItems } = useSelector(state => state.cart);

    const [deliveryType, setDeliveryType] = useState('instant');
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false);

    /* ======================================================
       BACKEND DRIVEN SLOT DATA (MOCK)
    ====================================================== */
    const slots = useMemo(() => ([
        { id: 1, label: '09:00 - 10:00', enabled: true },
        { id: 2, label: '10:00 - 11:00', enabled: true },
        { id: 3, label: '11:00 - 12:00', enabled: false }, // hidden
        { id: 4, label: '12:00 - 13:00', enabled: true },
        { id: 5, label: '13:00 - 14:00', enabled: true },
    ]), []);

    /* ======================================================
       DATE HANDLING
    ====================================================== */
    const minDate = new Date();
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7); // default 7 days

    //   const onDateSelected = (event, date) => {
    //     setShowCalendar(false);
    //     if (date) {
    //       const formattedDate = date.toISOString().split('T')[0];
    //       setSelectedDate(formattedDate);
    //     }
    //   };

    const onDateSelected = (event, date) => {
        setShowCalendar(false);

        if (!date) return;

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`;

        setSelectedDate(formattedDate);
    };

    const getPickerDate = () => {
        if (!selectedDate) return new Date();

        const [year, month, day] = selectedDate.split('-').map(Number);

        // Month is 0-based in JS Date
        return new Date(year, month - 1, day);
    };



    /* ======================================================
       CONFIRM BUTTON LOGIC
    ====================================================== */
    const handleConfirm = () => {
        // ⚡ Instant delivery
        if (deliveryType === 'instant') {
            const payload = {
                orderType: 'instant',
                delivery_date: new Date().toISOString().split('T')[0],
                delivery_time: new Date().toLocaleTimeString(),
            };

            console.log('INSTANT ORDER PAYLOAD:', payload);
            return;
        }

        // ⛔ Validation for scheduled
        if (!selectedDate || !selectedSlot) {
            showToast('Please select both date and time slot', true);
            return;
        }

        const payload = {
            orderType: 'schedule',
            delivery_date: selectedDate,
            delivery_time_slot: selectedSlot.label,
            delivery_time_slot_id: selectedSlot.id,
        };

        console.log('SCHEDULE ORDER PAYLOAD:', payload);
    };

    /* ======================================================
       UI
    ====================================================== */
    return (
        <View style={[styles.container, { marginBottom: insets.bottom }]}>

            <TopAppBar title="Schedule your order" navigation={navigation} />

            {/* Shipment Info */}
            <Text style={[styles.shipmentText, { fontFamily: Fonts.family.semiBold }]}>
                Items (Units) : {cartItems.length}
            </Text>

            {/* Delivery Type Buttons */}
            <View style={styles.row}>
                <DeliveryOption
                    theme={theme}
                    title="Instant Delivery"
                    active={deliveryType === 'instant'}
                    onPress={() => setDeliveryType('instant')}
                />
                <DeliveryOption
                    theme={theme}
                    title="Schedule Delivery"
                    active={deliveryType === 'schedule'}
                    onPress={() => setDeliveryType('schedule')}
                />
            </View>

            {/* Schedule Section */}
            {deliveryType === 'schedule' && (
                <>
                    {/* Date Picker Button */}
                    <TouchableOpacity
                        onPress={() => setShowCalendar(true)}
                        style={styles.datePicker}
                    >
                        <Text style={styles.dateText}>
                            {selectedDate ? selectedDate : 'Select delivery date'}
                        </Text>
                    </TouchableOpacity>

                    {/* Time Slots */}
                    <FlatList
                        data={slots.filter(slot => slot.enabled)}
                        numColumns={2}
                        keyExtractor={item => item.id.toString()}
                        contentContainerStyle={{ paddingHorizontal: 8 }}
                        renderItem={({ item }) => (
                            <SlotItem
                                slot={item}
                                selected={selectedSlot?.id === item.id}
                                onPress={() => setSelectedSlot(item)}
                            />
                        )}
                    />
                </>
            )}

            {/* Info Text */}
            {deliveryType == 'schedule' && (
                <Text style={[styles.infoText, { fontFamily: Fonts.family.medium }]}>
                    You can cancel up to 30 minutes prior to delivery time
                </Text>
            )}

            {/* Confirm Button */}
            <View style={styles.buttonContainer}>
                <AppButton title="Confirm" onAction={handleConfirm} />
            </View>

            {/* Calendar */}
            {showCalendar && (
                <DateTimePicker
                    value={getPickerDate()}
                    mode="date"
                    minimumDate={minDate}
                    maximumDate={maxDate}
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    onChange={onDateSelected}
                />
            )}
        </View>
    );
};

export default ScheduleDeliveryScreen;

/* ======================================================
   REUSABLE COMPONENTS
====================================================== */
const DeliveryOption = ({ title, active, onPress, theme, shedule = false }) => (
    <TouchableOpacity
        onPress={onPress}
        style={[
            styles.deliveryOption,
            active && styles.deliveryOptionActive
        ]}
    >
        {shedule && (
            <Ionicons name="calendar-outline" size={26} color="#0a50e6ff" style={{ color: theme.text }} />
        )}
        <Text style={[styles.deliveryText, { fontFamily: Fonts.family.medium }]}>{title}</Text>
    </TouchableOpacity>
);

const SlotItem = ({ slot, selected, onPress }) => (
    <TouchableOpacity
        onPress={onPress}
        style={[
            styles.slotItem,
            selected && styles.slotSelected
        ]}
    >
        <Text style={styles.slotText}>{slot.label}</Text>
    </TouchableOpacity>
);

/* ======================================================
   STYLES
====================================================== */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    shipmentText: {
        margin: 16,
        fontSize: 14,
        color: '#444',
    },
    row: {
        flexDirection: 'row',
        marginHorizontal: 16,
    },
    deliveryOption: {
        flex: 1,
        padding: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 12,
        marginHorizontal: 4,
        alignItems: 'center',
    },
    deliveryOptionActive: {
        borderColor: '#ff0055',
    },
    deliveryText: {
        fontSize: 14,
    },
    datePicker: {
        margin: 16,
        padding: 14,
        borderWidth: 1,
        borderRadius: 12,
        borderColor: '#ccc',
    },
    dateText: {
        fontSize: 14,
    },
    slotItem: {
        flex: 1,
        margin: 8,
        padding: 14,
        borderWidth: 1,
        borderRadius: 12,
        borderColor: '#ccc',
        alignItems: 'center',
    },
    slotSelected: {
        borderColor: '#ff0055',
    },
    slotText: {
        fontSize: 13,
    },
    infoText: {
        fontSize: 12,
        marginTop: 12,
        marginLeft: 12,
        color: '#777',
    },
    buttonContainer: {
        margin: 12
    },
});
