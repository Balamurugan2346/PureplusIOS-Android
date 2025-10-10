import { useAppContext } from '../../Context/AppContext';
import { useTheme } from '../../Context/ThemeContext';
import Fonts from '../../../assets/fonts/Fonts';
import  Ionicons  from 'react-native-vector-icons/Ionicons';
import React, { useState } from 'react';
import { StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

const fieldValidation = {
    flatOrBlock: true,
    apartmentName: false,
    floorNumber: false,
    houseNo: true,
    houseName: false,
    landmark: true,
    receiverName: true,
    receiverPhNo: true,
};

const TagOptions = ['Home', 'Work', 'Others'];
const ResidenceOptions = ['Apartment', 'House'];

const AddressInputForm = () => {
    const { theme } = useTheme();
    const [formData, setFormData] = useState({
        residenceType: '',
        flatOrBlock: '',
        apartmentName: '',
        floorNumber: '',
        hasLift: false,
        houseNo: '',
        houseName: '',
        landmark: '',
        receiverName: '',
        receiverPhNo: '',
        tag: 'Home',
    });



    const { addToCart, cart, reduceQuantity, removeFromCart, usersAddress } = useAppContext()

    const headerConfig = {
        color: theme.greyText,
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.lg
    }

    const paratextConfig = {
        color: theme.secondaryText,
        fontFamily: Fonts.family.medium,
        fontSize: Fonts.size.xs
    }


    const [errors, setErrors] = useState({});

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        if (fieldValidation[field] && !value.trim()) {
            setErrors(prev => ({ ...prev, [field]: `${field} is required` }));
        } else {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const renderInput = (label, key, keyboardType = 'default', optional = false) => (
        <View style={{ marginTop: 12 }}>
            <Text style={[styles.label, { color: theme.text }]}>
                {label} {optional && <Text style={{ color: theme.secondaryText }}>(Optional)</Text>}
            </Text>
            <TextInput
                placeholder={label}
                placeholderTextColor={theme.secondaryText}
                value={formData[key]}
                keyboardType={keyboardType}
                onChangeText={(text) => handleChange(key, text)}
                style={[styles.input, { backgroundColor: theme.inputContainer, borderColor: errors[key] ? 'red' : theme.inputContainerBorder , color:theme.buttonText }]}
            />
            {errors[key] ? <Text style={styles.error}>{errors[key]}</Text> : null}
        </View>
    );

    return (
        <View style={[styles.card, { backgroundColor: theme.card }]}>
            <View style={{ flexDirection: "row" }}>
                <View style={{ backgroundColor: "lightgreen", borderRadius: 10, width: 40, height: 40, alignItems: "center", justifyContent: "center" ,marginRight:10 }}>

                    <View style={{ backgroundColor: "white", width: 25, height: 25, borderRadius: 30, justifyContent: "center", alignItems: "center" }}>
                        <Ionicons name='location' color={"lightgreen"} size={20} />
                    </View>
                </View>
                <View>

                    <Text style={[headerConfig, { color: theme.buttonText }]}>Delivery Address</Text>
                    <Text style={[styles.uneditableText, { color: theme.secondaryText }]}>Nandanam Extension, Chamiers Road</Text>
                </View>


            </View>


            <Text style={[styles.label, { marginTop: 16 ,color:theme.buttonText}]}>Residence Type</Text>
             <Text style={[paratextConfig, {color:theme.secondaryText}]}><Text style={{color:theme.primary}}>Note:  </Text>If your House residence is above ground floor please choose aparment instead house</Text>
            <View style={styles.radioGroup}>
                {ResidenceOptions.map(option => (
                    <TouchableOpacity
                        key={option}
                        style={[styles.radioButton, {
                            backgroundColor: formData.residenceType === option ? theme.primary : theme.inputContainer
                        }]}
                        onPress={() => setFormData(prev => ({ ...prev, residenceType: option }))}
                    >
                        <Text style={{ color: formData.residenceType === option ? 'white' : theme.text }}>{option}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {formData.residenceType === 'Apartment' && (
                <>
                    {renderInput('Flat / Block', 'flatOrBlock')}
                    {renderInput('Apartment Name', 'apartmentName', 'default', true)}
                    {renderInput('Floor Number', 'floorNumber', 'numeric')}
                    {renderInput('Landmark', 'landmark')}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
                        <Text style={[styles.label, { color: theme.buttonText, marginRight: 10 }]}>Has Lift?</Text>
                        <Switch
                            value={formData.hasLift}
                            onValueChange={(value) => handleChange('hasLift', value)}
                        />
                    </View>
                </>
            )}

            {formData.residenceType === 'House' && (
                <>
                    {renderInput('House No', 'houseNo')}
                    {renderInput('House Name', 'houseName', 'default', true)}
                    {renderInput('Landmark', 'landmark')}
                </>
            )}

            <Text style={[styles.label, { marginTop: 16  ,color:theme.buttonText }]}>Address Tag</Text>
            <View style={styles.radioGroup}>
                {TagOptions.map(option => (
                    <TouchableOpacity
                        key={option}
                        style={[styles.radioButton, {
                            backgroundColor: formData.tag === option ? theme.primary : theme.inputContainer
                        }]}
                        onPress={() => setFormData(prev => ({ ...prev, tag: option }))}
                    >
                        <Text style={{ color: formData.tag === option ? 'white' : theme.text }}>{option}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {formData.tag === 'Others' && (
                <>
                    {renderInput('Receiver Name', 'receiverName')}
                    {renderInput('Receiver Phone Number', 'receiverPhNo', 'phone-pad')}
                </>
            )}
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    title: {
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.lg,
        marginBottom: 4,
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
});
