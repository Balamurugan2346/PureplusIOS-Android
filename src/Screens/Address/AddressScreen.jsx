import { useAppContext } from '../../Context/AppContext';
import { useTheme } from '../../Context/ThemeContext';
import Fonts from '../../../assets/fonts/Fonts';
import  Ionicons  from 'react-native-vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import SearchBar from '../../Components/SearchBar';
import Addresses from '../../Data/Adresses';


const AddressScreen = ({ onClose, navigation }) => {

    const { theme } = useTheme()

    const [enteredText, setEnteredText] = useState('')

    const {
        usersAddress,
        setUsersAddress
    } = useAppContext()

    const headerConfig = {
        color: theme.background,
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.sm
    }

    const paratextConfig = {
        color: theme.secondaryText,
        fontFamily: Fonts.family.medium,
        fontSize: Fonts.size.xs
    }
    const handleLongPress = (id) => {
        Alert.alert(
            'Delete Address',
            'Do you want to delete this address?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                    },
                },
            ],
            { cancelable: true }
        );
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => {
                setUsersAddress(item.address)
                onClose()
                Toast.show({
                    type: 'info',
                    text1: 'Address Added',
                    text2: `Note : It wont save permenant until you set as default`,
                    position: 'bottom',
                });
            }}
            onLongPress={() => handleLongPress(item.id)}
        >
            <View style={styles.row}>
                <Text style={[headerConfig, { color: theme.background }]}>{item.label}</Text>
                <Text style={[paratextConfig, { color: 'green' }]}>{item.distance}</Text>
            </View>
            <Text style={[paratextConfig, { color: theme.textForWhiteBG }]}>{item.address}</Text>
        </TouchableOpacity>
    );

    useEffect(() => {
        if (enteredText.length > 4) {
            navigation.navigate('UsersLocationScreen', {
                text: enteredText,
            });
            setEnteredText('')
        }
    }, [enteredText]);


    return (
        <View style={styles.container}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 10, padding: 5, alignItems: "center" }}>
                <Text style={headerConfig}>Select delivery Address</Text>
                <Ionicons name='close-circle' onPress={onClose} size={30} />
            </View>
            <View style={styles.content}>
                {/* <SearchBar value={enteredText} placeholder='Search Address...' onSearch={(text) => console.log(text)} liveText={(text) => setEnteredText(text)} /> */}
                <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 10 }}>
                    <Ionicons color={theme.primary} name='location' size={25} />
                    <Text style={[paratextConfig, { color: theme.primary }]}>Use my current Location</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={headerConfig}>Saved Address</Text>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('UsersLocationScreen')
                    }} style={{ flexDirection: "row", alignItems: "center", backgroundColor: "rgba(37, 119, 132, 0.1)", padding: 5, borderRadius: 30, paddingHorizontal: 10 }}>
                        <Ionicons color={theme.primary} name='add-circle' size={25} />
                        <Text style={[paratextConfig, { color: theme.primary }]}>Add New</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={{ marginTop: 10, flex: 1 }} contentContainerStyle={{ paddingBottom: 50 }}>
                    {Addresses.map((item, index) => (
                        <TouchableOpacity
                            style={styles.card}
                            key={index}
                            onPress={() => {
                                setUsersAddress(item.address)
                                onClose()
                                Toast.show({
                                    type: 'info',
                                    text1: 'Address Added',
                                    text2: `Note : It wont save permenant until you set as default`,
                                    position: 'bottom',
                                });
                            }}
                            onLongPress={() => handleLongPress(item.id)}
                        >
                            <View style={styles.row}>
                                <Text style={[headerConfig, { color: theme.background }]}>{item.label}</Text>
                                <Text style={[paratextConfig, { color: 'green' }]}>{item.distance}</Text>
                            </View>
                            <Text style={[paratextConfig, { color: theme.textForWhiteBG }]}>{item.address}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* <FlatList
                    style={{ marginVertical: 30 ,marginBottom:90}}
                    showsVerticalScrollIndicator={false}
                    data={Addresses}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 20 }}
                /> */}
            </View>

        </View>
    );
};

export default AddressScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    content: {
        marginHorizontal: 20,
        flex: 1
    },
    card: {
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6a1b9a',
    },
    distance: {
        fontSize: 14,
        color: '#e65100',
    },
    address: {
        fontSize: 14,
        color: '#333',
    },
});
