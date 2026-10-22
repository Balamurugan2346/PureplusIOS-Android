import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Platform,
    StyleSheet,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';

import TopAppBar from '../../Components/TopAppBar';
import AppButton from '../../Components/AppButton';
import AppText from '../../Components/AppText';
import { useToast } from '../../Components/Toast/ToastProvider';
import { useTheme } from '../../Context/ThemeContext';
import Fonts from '../../../assets/fonts/Fonts';
import { fontFamily, radius, spacing } from '../../Themes/Themes';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { loadSheduleSlots, saveSelectedSlot } from '../../Redux/Slices/SheduleOrderSlice'
import AppLoading from '../../Components/AppLoading';

/* ======================================================
   MAIN SCREEN
====================================================== */
const ScheduleDeliveryScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { showToast } = useToast();
    const { theme } = useTheme()
    const dispatch = useDispatch()

    const { cartItems } = useSelector(state => state.cart);
    const { slots: slotsState, loading: GetSlotLoading, error: GetSlotError } = useSelector(state => state.sheduleOrder);

    const [deliveryType, setDeliveryType] = useState('instant');
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false);

    const hasLoaded = useRef(false);

    useEffect(() => {
        console.log("calleed")
        console.log("slots", slots)
        if (hasLoaded.current) return;
        hasLoaded.current = true;
        dispatch(loadSheduleSlots())
    }, [dispatch])

    useEffect(() => {
        if (GetSlotError) {
            showToast('Failed to load delivery slots', true);
        }
    }, [GetSlotError]);


    /* ======================================================
       BACKEND DRIVEN SLOT DATA (MOCK)
    ====================================================== */
    // const slots = useMemo(() => ([
    //     { id: 1, label: '09:00 - 10:00', enabled: true },
    //     { id: 2, label: '10:00 - 11:00', enabled: true },
    //     { id: 3, label: '11:00 - 12:00', enabled: false }, // hidden
    //     { id: 4, label: '12:00 - 13:00', enabled: true },
    //     { id: 5, label: '13:00 - 14:00', enabled: true },
    // ]), []);

    const slots = useMemo(() => {
        if (!slotsState || !Array.isArray(slotsState)) return [];
        return slotsState;
    }, [slotsState]);


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


    useEffect(() => {
        setSelectedSlot(null);
    }, [selectedDate]);


    /* ======================================================
       CONFIRM BUTTON LOGIC
    ====================================================== */
    const handleConfirm = () => {
        // ⚡ Instant delivery — clear any prior schedule and go back.
        if (deliveryType === 'instant') {
            dispatch(saveSelectedSlot({
                id: 0,
                type: 'instant',
                date: null,
                label: null,
            }))
            showToast('Instant delivery selected');
            navigation.goBack();
            return;
        }

        // ⛔ Validation for scheduled
        if (!selectedDate || !selectedSlot) {
            showToast('Please select both date and time slot', true);
            return;
        }

        // Persist the FULL schedule — id, the picked date, and a readable label — so the
        // cart can send them to /orders/place. Backend expects deliveryType === "scheduled"
        // (exact string) + slotId + deliveryDate; anything else is treated as instant.
        dispatch(saveSelectedSlot({
            id: selectedSlot.slotId,
            type: 'scheduled',
            date: selectedDate,                 // 'YYYY-MM-DD'
            label: selectedSlot.slotName ?? null,
        }))
        showToast(`Scheduled for ${selectedDate}`);
        navigation.goBack();
    };

    /* ======================================================
       DAY STRIP (today → +7), replaces the native date button
    ====================================================== */
    const dayList = useMemo(() => {
        const out = [];
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        for (let i = 0; i <= 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() + i);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            out.push({
                value: `${year}-${month}-${day}`,
                top: i === 0 ? 'Today' : weekdays[d.getDay()],
                num: String(d.getDate()),
            });
        }
        return out;
    }, []);

    const confirmLabel = (() => {
        if (deliveryType === 'instant') return 'Confirm instant delivery';
        if (selectedDate && selectedSlot) {
            const d = dayList.find((x) => x.value === selectedDate);
            const dayPart = d ? `${d.top} ${d.num}` : selectedDate;
            return `Confirm · ${dayPart}, ${selectedSlot.slotName ?? ''}`.trim();
        }
        return 'Confirm';
    })();

    /* ======================================================
       UI
    ====================================================== */
    return (
        <View style={[styles.container, { backgroundColor: theme.surface, marginBottom: insets.bottom }]}>

            <TopAppBar title="Schedule your order" navigation={navigation} />

            <FlatList
                data={deliveryType === 'schedule' ? slots : []}
                numColumns={2}
                keyExtractor={(item, idx) => (item.slotId ?? idx).toString()}
                columnWrapperStyle={{ gap: spacing.md }}
                contentContainerStyle={styles.scrollBody}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View>
                        {/* Shipment Info */}
                        <View style={styles.shipmentRow}>
                            <AppText variant="label" color={theme.inkMuted}>Items: </AppText>
                            <AppText variant="bodyStrong" color={theme.ink}>{cartItems.length}</AppText>
                        </View>

                        {/* Delivery Type cards */}
                        <View style={styles.row}>
                            <DeliveryOption
                                theme={theme}
                                icon="flash-outline"
                                title="Instant delivery"
                                subtitle="Within ~30 min"
                                active={deliveryType === 'instant'}
                                onPress={() => setDeliveryType('instant')}
                            />
                            <DeliveryOption
                                theme={theme}
                                icon="calendar-outline"
                                title="Schedule delivery"
                                subtitle="Pick a day & slot"
                                active={deliveryType === 'schedule'}
                                onPress={() => setDeliveryType('schedule')}
                            />
                        </View>

                        {deliveryType === 'schedule' ? (
                            <>
                                {/* Delivery date strip */}
                                <AppText variant="label" color={theme.ink} style={styles.sectionTitle}>Delivery date</AppText>
                                <FlatList
                                    data={dayList}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    keyExtractor={(d) => d.value}
                                    contentContainerStyle={{ gap: spacing.md, paddingVertical: spacing.sm }}
                                    renderItem={({ item: d }) => {
                                        const active = selectedDate === d.value;
                                        return (
                                            <TouchableOpacity
                                                onPress={() => setSelectedDate(d.value)}
                                                style={[
                                                    styles.dayTile,
                                                    { backgroundColor: active ? theme.ink : theme.surfaceCard, borderColor: active ? theme.ink : theme.borderSubtle },
                                                ]}
                                            >
                                                <AppText variant="caption" color={active ? theme.onInk : theme.inkMuted}>{d.top}</AppText>
                                                <AppText variant="title" color={active ? theme.onInk : theme.ink} style={{ marginTop: 2 }}>{d.num}</AppText>
                                            </TouchableOpacity>
                                        );
                                    }}
                                />

                                <AppText variant="label" color={theme.ink} style={styles.sectionTitle}>Time slot</AppText>
                            </>
                        ) : (
                            /* Instant info card */
                            <View style={[styles.instantCard, { backgroundColor: theme.surfaceCard }]}>
                                <View style={[styles.instantIcon, { backgroundColor: theme.successTint }]}>
                                    <Ionicons name="flash" size={22} color={theme.success} />
                                </View>
                                <AppText variant="bodyStrong" color={theme.ink} style={{ marginTop: spacing.md }}>We'll deliver right away</AppText>
                                <AppText variant="caption" color={theme.inkMuted} style={{ marginTop: 2, textAlign: 'center' }}>
                                    Any slot you picked earlier is cleared.
                                </AppText>
                            </View>
                        )}

                        {deliveryType === 'schedule' && GetSlotLoading && (
                            <AppLoading isVisible={GetSlotLoading} />
                        )}
                    </View>
                }
                renderItem={({ item }) => (
                    <SlotItem
                        theme={theme}
                        slot={item}
                        selected={selectedSlot?.slotId === item.slotId}
                        onPress={() => setSelectedSlot(item)}
                    />
                )}
                ListFooterComponent={
                    deliveryType === 'schedule' ? (
                        <View style={[styles.infoBanner, { backgroundColor: theme.infoTint }]}>
                            <Ionicons name="information-circle-outline" size={18} color={theme.info} />
                            <AppText variant="caption" color={theme.info} style={{ marginLeft: spacing.sm, flex: 1 }}>
                                You can cancel up to 30 minutes prior to delivery time
                            </AppText>
                        </View>
                    ) : null
                }
            />

            {/* Confirm Button */}
            <View style={[styles.buttonContainer, { backgroundColor: theme.surface }]}>
                <AppButton title={confirmLabel} onAction={handleConfirm} />
            </View>
        </View>
    );
};

export default ScheduleDeliveryScreen;

/* ======================================================
   REUSABLE COMPONENTS
====================================================== */
const DeliveryOption = ({ title, subtitle, icon, active, onPress, theme }) => (
    <TouchableOpacity
        onPress={onPress}
        style={[
            styles.deliveryOption,
            { backgroundColor: active ? theme.primaryTint : theme.surfaceCard, borderColor: active ? theme.primary : theme.borderSubtle },
        ]}
    >
        <View style={[styles.deliveryIconWell, { backgroundColor: active ? theme.surfaceCard : theme.surfaceSunken }]}>
            <Ionicons name={icon} size={22} color={active ? theme.primary : theme.inkMuted} />
        </View>
        <AppText variant="bodyStrong" color={theme.ink} style={{ marginTop: spacing.md }}>{title}</AppText>
        <AppText variant="caption" color={theme.inkMuted} style={{ marginTop: 2 }}>{subtitle}</AppText>
    </TouchableOpacity>
);

const SlotItem = ({ slot, selected, onPress, theme }) => (
    <TouchableOpacity
        onPress={onPress}
        style={[
            styles.slotItem,
            { backgroundColor: selected ? theme.ink : theme.surfaceCard, borderColor: selected ? theme.ink : theme.borderSubtle },
        ]}
    >
        <AppText variant="bodyStrong" color={selected ? theme.onInk : theme.ink}>{slot.slotName}</AppText>
    </TouchableOpacity>
);

/* ======================================================
   STYLES
====================================================== */
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollBody: {
        paddingHorizontal: spacing.xl,
        paddingBottom: 100,
    },
    shipmentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: spacing.lg,
    },
    row: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    deliveryOption: {
        flex: 1,
        padding: spacing.lg,
        borderWidth: 1.5,
        borderRadius: radius.md,
        alignItems: 'flex-start',
    },
    deliveryIconWell: {
        width: 40,
        height: 40,
        borderRadius: radius.sm,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionTitle: {
        marginTop: spacing.xl,
        marginBottom: spacing.xs,
    },
    dayTile: {
        width: 52,
        height: 64,
        borderRadius: radius.md,
        borderWidth: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    slotItem: {
        flex: 1,
        marginTop: spacing.md,
        height: 48,
        borderWidth: 1.5,
        borderRadius: radius.sm,
        alignItems: 'center',
        justifyContent: 'center',
    },
    instantCard: {
        borderRadius: radius.lg,
        padding: spacing.xl,
        alignItems: 'center',
        marginTop: spacing.xl,
    },
    instantIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: radius.md,
        padding: spacing.md,
        marginTop: spacing.xl,
    },
    buttonContainer: {
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.md,
        paddingBottom: spacing.xxl,
    },
});
