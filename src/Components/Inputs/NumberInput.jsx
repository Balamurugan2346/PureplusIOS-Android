import Fonts from '../../../assets/fonts/Fonts';
import React, { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '../../Context/ThemeContext';
import { countries } from '../../Utils/CountriesPhoneRegex';



const NumberInput = forwardRef(({ onValidateNumber, returnKeyType = 'done', onSubmitEditing ,onClick }, ref) => {
    const [number, setNumber] = useState('');
    const [error, setError] = useState('');
    const { theme } = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    const [country, setCountry] = useState(countries[0]);
    const [showDropdown, setShowDropdown] = useState(false);

    useImperativeHandle(ref, () => ({
        closeDropdown: () => setShowDropdown(false),
        isDropdownOpen: () => showDropdown
    }));

    const validateNumber = useCallback((num) => {
        setNumber(num);
        const phoneRegex = country.regex;
        if (num.length === 0) {
            const errorMessage = 'Phone number required';
            setError(errorMessage);
            onValidateNumber?.({ number: null, error: errorMessage });
        } else if (!phoneRegex.test(num)) {
            const errorMessage = 'Invalid number';
            setError(errorMessage);
            onValidateNumber?.({ number: null, error: errorMessage });
        } else {
            setError('');
            // ${country.code}
            onValidateNumber?.({ number: `${num}`, error: '' });
        }
    }, [country, onValidateNumber]);

    return (
        <>
            {/* {showDropdown && (
                <CountryDropdown
                    setCountry={setCountry}
                    setError={setError}
                    onClick={onClick}
                    setNumber={setNumber}
                    setShowDropdown={setShowDropdown}
                    showDropdown={showDropdown}
                />
            )} */}

            <View
                style={[
                    styles.inputContainer,
                    {
                        borderColor: isFocused ? theme.primary : theme.inputContainerBorder,
                        borderWidth: 1,
                        backgroundColor: theme.inputContainer
                    }
                ]}
            >
                {/* <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 5, height: '100%' }}
                    onPress={() => setShowDropdown(true)}
                >
                    <Ionicons
                        style={{ marginRight: 5 }}
                        name="chevron-down-outline"
                        size={10}
                        color={theme.text}
                    />
                    <Image source={country.image} style={{ width: 25, height: 15, marginRight: 5 }} />
                    <Text style={{ color: theme.text, fontFamily: Fonts.family.regular, fontSize: Fonts.size.sm }}>
                        {country.code}
                    </Text>
                </TouchableOpacity> */}

                <TextInput
                    style={{
                        marginLeft: 10,
                        width: '100%',
                        color: theme.text,
                        fontSize: Fonts.size.sm,
                        fontFamily: Fonts.family.regular
                    }}
                    value={number}
                    onChangeText={validateNumber}
                    keyboardType="number-pad"
                    placeholder="Enter your phone number"
                    returnKeyType={returnKeyType}
                    onSubmitEditing={onSubmitEditing}
                    placeholderTextColor={theme.text}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
            </View>

            <Text
                style={{
                    marginLeft: 5,
                    color: theme.error,
                    fontFamily: Fonts.family.light,
                    fontSize: Fonts.size.xs
                }}
            >
                {error}
            </Text>
        </>
    );
});



export default NumberInput

const styles = StyleSheet.create({
    inputContainer: {
        width: "100%",
        padding: 5,
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 15,
    }
});
