import { useTheme } from '../../Context/ThemeContext';
import Fonts from '../../../assets/fonts/Fonts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AppText from '../../Components/AppText';
import { fontFamily, radius, spacing } from '../../Themes/Themes';
import { useDispatch, useSelector } from 'react-redux';
import { clearAddressState, getAddressList, saveAddress, updateAddress } from '../../Redux/Slices/AddressSlice';
import AppLoading from '../../Components/AppLoading';
import { useToast } from '../../Components/Toast/ToastProvider';
import { getData, storeData } from '../../OfflineStore/OfflineStore';
import { saveCurrentLocationFormattedAddress } from '../../Redux/Slices/LocationSlice';

const AddressInputForm = ({ navigation, pickedAddress, onNavigate, isEdit = false }) => {
    const { theme } = useTheme();
    const [userID, setUserID] = useState(-1)
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.address);
    const { loginData } = useSelector((s) => s.auth)
    const { showToast } = useToast()
    //USER PROFILE
    const { error: ProfileError, loading: profileLoading, isFetched: isProfileApiFetched, profileData } = useSelector((state) => state.profile)
    const [formData, setFormData] = useState({
        // present only when editing an existing address
        id: pickedAddress.id ?? pickedAddress.addressId ?? undefined,
        userId: userID,
        addressType: pickedAddress.addressType ?? '',
        addressLine1: pickedAddress.addressLine1 ?? "",
        addressLine2: pickedAddress.addressLine2 ?? "",
        city: pickedAddress.city ?? "",
        state: pickedAddress.state ?? "",
        pinCode: pickedAddress.pinCode ?? pickedAddress.pincode ?? "",
        // Backend sends floor as a NUMBER (floor_no AS FloorNo → `floorNo`). A TextInput only
        // renders string values, so coerce to a string or the field shows blank on edit.
        // A 0 floor is treated as empty (the save maps '' back to 0 losslessly).
        FloorNo: (pickedAddress.FloorNo ?? pickedAddress.floorNo)
            ? String(pickedAddress.FloorNo ?? pickedAddress.floorNo)
            : '',
        landmark: pickedAddress.landmark ?? '',
        tag: pickedAddress.tag ?? 'Home',
        receiverName: pickedAddress.receiverName ?? "",
        receiverNumber: pickedAddress.receiverNumber ?? '',
        hasLift: pickedAddress.hasLift ?? pickedAddress.lift ?? false,
        latitude: pickedAddress.latitude,
        longitude: pickedAddress.longitude,
    });

    const [errors, setErrors] = useState({});

    const requiredFields = [
        'addressLine1',
        'city',
        'state',
        'pinCode',
        'landmark',
    ];



    const handleChange = (field, value) => {
        if (field === 'receiverNumber') {
            value = value.replace(/\D/g, ''); // remove non-numeric
            if (value.length > 10) value = value.slice(0, 10);
        }

        setFormData(prev => ({ ...prev, [field]: value }));

        if (requiredFields.includes(field) && !value.trim()) {
            setErrors(prev => ({ ...prev, [field]: `${field} is required` }));
        } else {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const renderInput = (label, key, type = 'default', optional = false, required = false, placeholder) => (
        <View style={{ marginTop: spacing.lg }}>
            <Text style={[styles.label, { color: theme.inkMuted }]}>
                {label}
                {required && <Text style={{ color: theme.danger }}> *</Text>}
                {optional && <Text style={{ color: theme.inkMuted }}> (Optional)</Text>}
            </Text>
            <TextInput
                placeholder={placeholder ?? label}
                placeholderTextColor={theme.inkMuted}
                value={formData[key] != null ? String(formData[key]) : ''}
                keyboardType={type}
                onChangeText={(text) => handleChange(key, text)}
                style={[
                    styles.input,
                    {
                        backgroundColor: theme.surfaceCard,
                        borderColor: errors[key] ? theme.danger : theme.borderStrong,
                        color: theme.ink
                    }
                ]}
            />
            {errors[key] ? <Text style={[styles.error, { color: theme.danger }]}>{errors[key]}</Text> : null}
        </View>
    );

    useEffect(() => {
        const loadUserId = async () => {
            const storedId = await getData('userID');
            const parsed = Number(storedId);
            setUserID(isNaN(parsed) ? -1 : parsed);
        };
        loadUserId();
    }, []);

    useEffect(() => {
        if (userID !== -1) {
            setFormData(prev => ({
                ...prev,
                userId: userID,
            }));
        }
    }, [userID]);



    const validateAddressForm = (formData) => {
        let errors = {};

        const baseRequiredFields = [
            "addressLine1",
            "city",
            "state",
            "pinCode",
            "landmark",
            "addressType"
        ];

        baseRequiredFields.forEach((field) => {
            if (!formData[field] || formData[field].trim?.() === "") {
                if (field === "addressType") {
                    errors[field] = "Please choose residence type";
                    showToast("Please choose residence type", true);
                } else {
                    errors[field] = `${field} is required`;
                }
            }
        });

        // Conditional validation for "Others"
        if (formData.tag === "Others") {
            if (!formData.receiverName?.trim()) {
                errors.receiverName = "Receiver name is required";
            }
            if (!formData.receiverNumber?.trim()) {
                errors.receiverNumber = "Receiver phone number is required";
            } else if (formData.receiverNumber.length !== 10) {
                errors.receiverNumber = "Receiver phone number must be 10 digits";
            }
        }

        return errors;
    };




    const handleAddressSubmit = async () => {
        const validationErrors = validateAddressForm(formData);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        if (formData.userId === -1) {
            showToast("Something went wrong", true);
            return;
        }

        // Same form drives both create and edit; the thunk differs.
        const action = isEdit ? updateAddress : saveAddress;

        // Map the form's internal field names to the backend AddressRequest shape.
        // (backend expects pincode / floorNo / lift — NOT pinCode / FloorNo / hasLift)
        const apiBody = {
            ...(isEdit && formData.id ? { id: formData.id } : {}),
            userId: formData.userId,
            addressType: formData.addressType,
            addressLine1: formData.addressLine1,
            addressLine2: formData.addressLine2,
            city: formData.city,
            state: formData.state,
            pincode: formData.pinCode,
            landmark: formData.landmark,
            tag: formData.tag,
            receiverName: formData.receiverName,
            receiverNumber: formData.receiverNumber,
            latitude: formData.latitude,
            longitude: formData.longitude,
            lift: !!formData.hasLift,
            floorNo: Number(formData.FloorNo) || 0,
        };

        try {
            //----------------------------------------
            // 1️⃣ Save / Update Address
            //----------------------------------------
            const res = await dispatch(
                action({
                    body: apiBody,
                    onSuccess: async (data) => {
                        // create returns a new addressId; keep the selection pointing at it
                        if (data?.addressId) {
                            await storeData("selectedAddressID", data.addressId.toString());
                        }
                        //for live reflection in ui in dashboard purpose only
                        dispatch(saveCurrentLocationFormattedAddress(`${formData.addressLine1} ${formData.addressLine2}`))
                    },
                    onError: () => {
                        showToast(isEdit ? "Failed to update address" : "Failed to save address", true);
                    }
                })
            );

            if (!action.fulfilled.match(res)) {
                showToast(isEdit ? "Failed to update address" : "Failed to save address", true);
                return;
            }

            //----------------------------------------
            // 2️⃣ Fetch updated address list
            //----------------------------------------
            const listRes = await dispatch(getAddressList());

            if (!getAddressList.fulfilled.match(listRes)) {
                showToast("Saved but failed to refresh list", true);
                onNavigate()
                return;
            }

            //----------------------------------------
            // 3️⃣ All Good
            //----------------------------------------
            showToast(isEdit ? "Address updated successfully" : "Address added successfully");
            onNavigate()
        } catch (e) {
            showToast("Unexpected error occurred", true);
        }
    };





    return (
        <View style={[styles.card, { backgroundColor: theme.surfaceCard }]}>
            {/* Header */}
            <View style={styles.headerRow}>
                <View style={[styles.iconContainer, { backgroundColor: theme.successTint }]}>
                    <Ionicons name='location' color={theme.success} size={22} />
                </View>

                <View style={{ flex: 1 }}>
                    <AppText variant="bodyStrong" color={theme.ink}>Delivery Address</AppText>
                    <AppText
                        variant="caption"
                        color={theme.inkMuted}
                        numberOfLines={4}
                        style={{ marginTop: 2 }}
                    >
                        {pickedAddress.formattedAddress ?? ""}
                    </AppText>
                </View>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.borderSubtle }]} />

            {/* Residence type — segmented control */}
            <Text style={[styles.label, { color: theme.inkMuted }]}>
                Residence type<Text style={{ color: theme.danger }}> *</Text>
            </Text>
            <View style={[styles.segment, { backgroundColor: theme.surfaceSunken }]}>
                {['Apartment', 'House'].map(option => {
                    const active = formData.addressType === option;
                    return (
                        <TouchableOpacity
                            key={option}
                            style={[
                                styles.segmentItem,
                                active && { backgroundColor: theme.surfaceCard, borderColor: theme.primary, borderWidth: 1.5 },
                            ]}
                            onPress={() => setFormData(prev => ({ ...prev, addressType: option }))}
                        >
                            <AppText variant="bodyStrong" color={active ? theme.primary : theme.inkMuted}>
                                {option}
                            </AppText>
                        </TouchableOpacity>
                    );
                })}
            </View>
            {errors.addressType && (
                <Text style={[styles.error, { color: theme.danger }]}>{errors.addressType}</Text>
            )}

            {/* Inputs */}
            {renderInput('Address Line 1', 'addressLine1', 'default', false, true)}
            {renderInput('Address Line 2', 'addressLine2', 'default', true, false, 'Building, block or flat')}

            {/* City + Floor side by side */}
            <View style={styles.twoCol}>
                <View style={{ flex: 1 }}>
                    {renderInput('City', 'city', 'default', false, true)}
                </View>
                <View style={{ flex: 1 }}>
                    {renderInput('Floor no.', 'FloorNo', 'numeric', true)}
                </View>
            </View>

            {renderInput('State', 'state', 'default', false, true)}

            {/* Pincode highlighted panel */}
            <View style={[styles.pinPanel, { backgroundColor: theme.primaryTint }]}>
                <Text style={[styles.label, { color: theme.inkMuted }]}>
                    Pincode<Text style={{ color: theme.danger }}> *</Text>
                </Text>
                <View style={[styles.pinInputRow, { backgroundColor: theme.surfaceCard, borderColor: errors.pinCode ? theme.danger : theme.borderStrong }]}>
                    <Ionicons name="location-outline" size={18} color={theme.primary} style={{ marginRight: spacing.sm }} />
                    <TextInput
                        placeholder="600090"
                        placeholderTextColor={theme.inkMuted}
                        value={formData.pinCode != null ? String(formData.pinCode) : ''}
                        keyboardType="numeric"
                        onChangeText={(text) => handleChange('pinCode', text)}
                        style={[styles.pinInput, { color: theme.ink }]}
                    />
                </View>
                <AppText variant="caption" color={theme.ink} style={{ marginTop: spacing.sm }}>
                    Your pincode decides which Pureplus store delivers to you. Please check it's correct.
                </AppText>
                {errors.pinCode ? <Text style={[styles.error, { color: theme.danger }]}>{errors.pinCode}</Text> : null}
            </View>

            {renderInput('Landmark', 'landmark', 'default', false, true, 'Near a temple, school or shop')}

            {/* Has lift */}
            <View style={styles.switchRow}>
                <View style={{ flex: 1, marginRight: spacing.md }}>
                    <AppText variant="bodyStrong" color={theme.ink}>Has lift?</AppText>
                    <AppText variant="caption" color={theme.inkMuted} style={{ marginTop: 2 }}>
                        Floor charges may apply without a lift
                    </AppText>
                </View>
                <Switch
                    value={formData.hasLift}
                    onValueChange={(value) => handleChange('hasLift', value)}
                    trackColor={{ true: theme.primary, false: theme.borderStrong }}
                    thumbColor={theme.onPrimary}
                />
            </View>

            {loading && (
                <AppLoading isVisible={loading} />
            )}

            {/* Address tag chips */}
            <Text style={[styles.label, { marginTop: spacing.lg, color: theme.inkMuted }]}>Address tag</Text>
            <View style={styles.chipRow}>
                {['Home', 'Work', 'Others'].map(option => {
                    const active = formData.tag === option;
                    return (
                        <TouchableOpacity
                            key={option}
                            style={[
                                styles.chip,
                                { backgroundColor: active ? theme.ink : theme.surfaceCard, borderColor: active ? theme.ink : theme.borderStrong },
                            ]}
                            onPress={() => setFormData(prev => ({ ...prev, tag: option }))}
                        >
                            <AppText variant="label" color={active ? theme.onInk : theme.ink}>{option}</AppText>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {formData.tag === 'Others' && (
                <View style={[styles.receiverPanel, { backgroundColor: theme.surfaceSunken }]}>
                    <AppText variant="caption" color={theme.inkMuted}>
                        Delivering to someone else? Tell us who will receive the cans.
                    </AppText>
                    {renderInput('Receiver name', 'receiverName', 'default', false, true)}
                    {renderInput('Receiver phone number', 'receiverNumber', 'phone-pad', false, true)}
                </View>
            )}

            <TouchableOpacity
                onPress={() => handleAddressSubmit()}
                style={[styles.saveBtn, { backgroundColor: theme.primary }]}
            >
                <Text style={[styles.saveText, { color: theme.onPrimary }]}>
                    {loading ? 'Saving...' : isEdit ? 'Update Address' : 'Save Address'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default AddressInputForm;

const styles = StyleSheet.create({
    card: {
        padding: spacing.xl,
        borderRadius: radius.lg,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    iconContainer: {
        borderRadius: radius.sm,
        width: 44,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
    },
    divider: {
        height: 1,
        marginVertical: spacing.lg,
    },
    input: {
        borderWidth: 1.5,
        borderRadius: radius.sm,
        paddingHorizontal: spacing.md,
        paddingVertical: 12,
        fontSize: 13,
        fontFamily: fontFamily.medium,
        marginTop: 6,
    },
    label: {
        fontSize: 14,
        fontFamily: fontFamily.medium,
        marginBottom: 2,
    },
    error: {
        fontSize: 12,
        fontFamily: fontFamily.regular,
        marginTop: 4,
    },
    segment: {
        flexDirection: 'row',
        borderRadius: radius.sm,
        padding: 4,
        marginTop: 6,
        gap: 4,
    },
    segmentItem: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: radius.sm,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    twoCol: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    pinPanel: {
        borderRadius: radius.md,
        padding: spacing.lg,
        marginTop: spacing.lg,
    },
    pinInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderRadius: radius.sm,
        paddingHorizontal: spacing.md,
        marginTop: 6,
    },
    pinInput: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 15,
        fontFamily: fontFamily.semibold,
        letterSpacing: 1,
    },
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.lg,
    },
    chipRow: {
        flexDirection: 'row',
        gap: spacing.md,
        marginTop: spacing.sm,
    },
    chip: {
        paddingVertical: 10,
        paddingHorizontal: spacing.lg,
        borderRadius: radius.pill,
        borderWidth: 1.5,
    },
    receiverPanel: {
        borderRadius: radius.md,
        padding: spacing.lg,
        marginTop: spacing.lg,
    },
    saveBtn: {
        paddingVertical: 15,
        marginTop: spacing.xl,
        borderRadius: radius.pill,
        alignItems: "center",
    },
    saveText: {
        fontFamily: fontFamily.semibold,
        fontSize: 15,
    }
});

