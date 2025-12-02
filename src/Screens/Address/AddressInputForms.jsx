import { useTheme } from '../../Context/ThemeContext';
import Fonts from '../../../assets/fonts/Fonts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, { useState } from 'react';
import { StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { clearAddressState, saveAddress } from '../../Redux/Slices/AddressSlice';
import AppLoading from '../../Components/AppLoading';


const AddressInputForm = ({ navigation }) => {
    const { theme } = useTheme();
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.address);

    const [formData, setFormData] = useState({
        userId: 18,
        addressType: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pinCode: '',
        landmark: '',
        tag: 'Home',
        receiverName: '',
        receiverNumber: '',
        latitude: 0.0,
        longitude: 0.0,
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


    const validateAddressForm = (formData) => {
        let errors = {};

        // Base required fields
        const baseRequiredFields = [
            "addressLine1",
            "city",
            "state",
            "pinCode",
            "landmark",
            "addressType"  // this was missing earlier
        ];

        baseRequiredFields.forEach((field) => {
            if (!formData[field] || formData[field].trim() === "") {
                errors[field] = `${field} is required`;
            }
        });

        // Conditional validation for "Others" tag
        if (formData.tag === "Others") {
            if (!formData.receiverName?.trim()) {
                errors.receiverName = "Receiver name is required";
            }
            if (!formData.receiverNumber?.trim()) {
                errors.receiverNumber = "Receiver phone number is required";
            }
        }

        return errors;
    };



    const handleAddressSubmit = () => {
        const validationErrors = validateAddressForm(formData);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        console.log("Submitting:", formData);
        dispatch(saveAddress(formData));
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
                    <Text style={[styles.uneditableText, { color: theme.secondaryText }]}>
                        Nandanam Extension, Chamiers Road
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
                onPress={handleAddressSubmit}
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

