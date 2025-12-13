import { useTheme } from '../../Context/ThemeContext';
import Fonts from '../../../assets/fonts/Fonts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { clearAddressState, getAddressList, saveAddress } from '../../Redux/Slices/AddressSlice';
import AppLoading from '../../Components/AppLoading';
import { useToast } from '../../Components/Toast/ToastProvider';
import { getData, storeData } from '../../OfflineStore/OfflineStore';
import { saveCurrentLocationFormattedAddress } from '../../Redux/Slices/LocationSlice';

const AddressInputForm = ({ navigation, pickedAddress, onNavigate }) => {
    const { theme } = useTheme();
    const [userID, setUserID] = useState(-1)
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.address);
    const { loginData } = useSelector((s) => s.auth)
    const { showToast } = useToast()
    //USER PROFILE
    const { error: ProfileError, loading: profileLoading, isFetched: isProfileApiFetched, profileData } = useSelector((state) => state.profile)
    const [formData, setFormData] = useState({
        userId: userID,
        addressType: '',
        addressLine1: pickedAddress.addressLine1 ?? "",
        addressLine2: pickedAddress.addressLine2 ?? "",
        city: pickedAddress.city ?? "",
        state: pickedAddress.state ?? "",
        pinCode: pickedAddress.pinCode ?? "",
        landmark: '',
        tag: 'Home',
        receiverName: profileData.fullName ?? "",
        receiverNumber: '',
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

    const renderInput = (label, key, type = 'default', optional = false) => (
        <View style={{ marginTop: 12 }}>
            <Text style={[styles.label, { color: theme.text }]}>
                {label} {optional && <Text style={{ color: theme.secondaryText }}>(Optional)</Text>}
            </Text>
            <TextInput
                placeholder={label}
                placeholderTextColor={theme.secondaryText}
                value={formData[key]}
                keyboardType={type}
                onChangeText={(text) => handleChange(key, text)}
                style={[
                    styles.input,
                    {
                        backgroundColor: theme.inputContainer,
                        borderColor: errors[key] ? 'red' : theme.inputContainerBorder,
                        color: theme.buttonText
                    }
                ]}
            />
            {errors[key] ? <Text style={styles.error}>{errors[key]}</Text> : null}
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

        try {
            //----------------------------------------
            // 1️⃣ Save Address
            //----------------------------------------
            const res = await dispatch(
                saveAddress({
                    body: formData,
                    onSuccess: async (data) => {
                        console.log("data from api0addre0", data.addressId)
                        await storeData("selectedAddressID", data.addressId.toString());
                        //for live reflection in ui in dashboard purpose only  (((((need to work)))))
                        dispatch(saveCurrentLocationFormattedAddress(`${formData.addressLine1} ${formData.addressLine2}`))
                    },
                    onError: () => {
                        showToast("Failed to save address", true);
                    }
                })
            );

            // ❌ Wrong: res.error → doesn't work
            // ✔ Correct:
            if (!saveAddress.fulfilled.match(res)) {
                showToast("Failed to save address", true);
                return;
            }

            //----------------------------------------
            // 2️⃣ Fetch updated address list
            //----------------------------------------
            const listRes = await dispatch(getAddressList(formData.userId));

            if (!getAddressList.fulfilled.match(listRes)) {
                showToast("Address saved but failed to refresh list", true);
                onNavigate()
                return;
            }

            //----------------------------------------
            // 3️⃣ All Good
            //----------------------------------------
            showToast("Address added successfully");
            onNavigate()
        } catch (e) {
            showToast("Unexpected error occurred", true);
        }
    };





    return (
        <View style={[styles.card, { backgroundColor: theme.card }]}>
            <View style={{ flexDirection: "row" }}>
                <View style={styles.iconContainer}>
                    <View style={styles.iconInner}>
                        <Ionicons name='location' color={"lightgreen"} size={20} />
                    </View>
                </View>

                <View>
                    <Text style={[styles.headerText, { color: theme.buttonText }]}>Delivery Address</Text>
                    <Text
                        style={[styles.uneditableText, { color: theme.secondaryText, marginRight: 10 }]}
                        numberOfLines={4}
                        ellipsizeMode="tail"
                    >
                        {pickedAddress.formattedAddress ?? ""}
                    </Text>

                </View>
            </View>

            <Text style={[styles.label, { marginTop: 16, color: theme.buttonText }]}>Residence Type</Text>

            <View style={styles.radioGroup}>
                {['Apartment', 'House'].map(option => (
                    <TouchableOpacity
                        key={option}
                        style={[
                            styles.radioButton,
                            { backgroundColor: formData.addressType === option ? theme.primary : theme.inputContainer }
                        ]}
                        onPress={() => setFormData(prev => ({ ...prev, addressType: option }))}
                    >
                        <Text style={{ color: formData.addressType === option ? 'white' : theme.text }}>
                            {option}
                        </Text>
                    </TouchableOpacity>
                ))}

            </View>
            {errors.addressType && (
                <Text style={{ color: "red", marginTop: 6 }}>
                    {errors.addressType}
                </Text>
            )}
            {/* Inputs */}
            {renderInput('Address Line 1', 'addressLine1')}
            {renderInput('Address Line 2', 'addressLine2', 'default', true)}
            {renderInput('City', 'city')}
            {renderInput('State', 'state')}
            {renderInput('Pincode', 'pinCode', 'numeric')}
            {renderInput('Landmark', 'landmark')}

            {/* <View style={styles.switchRow}>
                <Text style={[styles.label, { color: theme.buttonText, marginRight: 10 }]}>Has Lift?</Text>
                <Switch
                    value={formData.hasLift}
                    onValueChange={(value) => handleChange('hasLift', value)}
                />
            </View> */}

            {loading && (
                <AppLoading isVisible={loading} />
            )}

            <Text style={[styles.label, { marginTop: 16, color: theme.buttonText }]}>Address Tag</Text>

            <View style={styles.radioGroup}>
                {['Home', 'Work', 'Others'].map(option => (
                    <TouchableOpacity
                        key={option}
                        style={[
                            styles.radioButton,
                            { backgroundColor: formData.tag === option ? theme.primary : theme.inputContainer }
                        ]}
                        onPress={() => setFormData(prev => ({ ...prev, tag: option }))}
                    >
                        <Text style={{ color: formData.tag === option ? 'white' : theme.text }}>{option}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {formData.tag === 'Others' && (
                <>
                    {renderInput('Receiver Name', 'receiverName')}
                    {renderInput('Receiver Phone Number', 'receiverNumber', 'phone-pad')}
                </>
            )}

            <TouchableOpacity
                onPress={() => handleAddressSubmit()}
                style={[styles.saveBtn, { backgroundColor: theme.primary }]}
            >
                <Text style={[styles.saveText, { color: theme.buttonText }]}>
                    {loading ? 'Saving...' : 'Save Address'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default AddressInputForm;

const styles = StyleSheet.create({
    card: {
        padding: 16,
        borderRadius: 20,
        marginVertical: 20,
        elevation: 3,
    },
    iconContainer: {
        backgroundColor: "lightgreen",
        borderRadius: 10,
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10
    },
    iconInner: {
        backgroundColor: "white",
        width: 25,
        height: 25,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center"
    },
    headerText: {
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.lg,
    },
    uneditableText: {
        fontSize: Fonts.size.xs,
        fontFamily: Fonts.family.regular,
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: Fonts.size.sm,
        fontFamily: Fonts.family.medium,
    },
    label: {
        fontSize: Fonts.size.sm,
        fontFamily: Fonts.family.medium,
        marginBottom: 5,
    },
    error: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
    },
    radioGroup: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 8,
    },
    radioButton: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
    },
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
    },
    saveBtn: {
        paddingVertical: 12,
        marginTop: 20,
        borderRadius: 14,
        alignItems: "center",
    },
    saveText: {
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.lg,
    }
});

