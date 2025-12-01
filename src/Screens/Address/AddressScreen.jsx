import { useAppContext } from '../../Context/AppContext';
import { useTheme } from '../../Context/ThemeContext';
import Fonts from '../../../assets/fonts/Fonts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import SearchBar from '../../Components/SearchBar';
import Addresses from '../../Data/Adresses';
import { useDispatch, useSelector } from 'react-redux';
import { clearAddressState, getAddressList, deleteAddress } from '../../Redux/Slices/AddressSlice'
import AppLoading from '../../Components/AppLoading';
import { fetchCurrentLocation } from '../../Utils/LocationUtil';


const AddressScreen = ({ onClose, navigation }) => {

    const { theme } = useTheme()

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


    const [refresh, setRefresh] = useState(false)
    const [coords, setCoords] = useState({
        latitude: 0.0,
        longitude: 0.0
    });
    const [isLocationFetching, setIsLocationFetching] = useState(false);



    const dispatch = useDispatch()

    const { addressList, error, loading } = useSelector((state) => state.address)
    //LOCATIONS + GEOCODING API DATA  
    const { error: LocationError, display_name, address: DetailedAddress, isFetched: isLocationApiFetched, entireGEOData, loading: isGEOcodingApiLoading } = useSelector((state) => state.locations)

    const refreshLocation1 = async () => {
        try {
            setIsLocationFetching(true)
            const pos = await fetchCurrentLocation();
            if (pos) {
                console.log("before sending to api", "lat", pos.latitude, "lonh", pos.longitude)
                // dispatch(decodeAddress({ lat: pos.latitude, long: pos.longitude }));
            }
            console.log("position", pos)
            setCoords({
                latitude: pos.latitude,
                longitude: pos.longitude
            });
        } finally {
            setIsLocationFetching(false)
        }
    };

    useEffect(() => {
        console.log("running....")
        refreshLocation1()
    }, []);


    useEffect(() => {
        syncAddress()
        refreshLocation1()
    }, [refresh])

    const handleLongPress = (id) => {
        Alert.alert(
            'Delete Address',
            'Do you want to delete this address?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        await dispatch(deleteAddress(id))
                        dispatch(clearAddressState())
                        dispatch(getAddressList(300))
                    },
                },
            ],
            { cancelable: true }
        );
    };

    const syncAddress = () => {
        dispatch(clearAddressState())
        dispatch(getAddressList(300))
    }

    return (
        <View style={styles.container}>



            <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 10, padding: 5, alignItems: "center" }}>
                <Text style={headerConfig}>Select delivery Address</Text>
                <Ionicons name='close-circle' onPress={onClose} size={30} />
            </View>
            <View style={styles.content}>
                {/* <SearchBar value={enteredText} placeholder='Search Address...' onSearch={(text) => console.log(text)} liveText={(text) => setEnteredText(text)} /> */}

                <TouchableOpacity disabled={loading} onPress={() => syncAddress()}>
                    <View style={[{ flexDirection: "row", alignItems: "center", paddingVertical: 10 }, { opacity: loading ? 0.5 : 1 }]}>
                        <Image source={require('../../../assets/images/cloud.png')} tintColor={theme.primary} style={[{ width: 25, height: 25 }]} />

                        <Text style={[paratextConfig, { color: theme.primary }]}>Sync</Text>
                    </View>
                </TouchableOpacity>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={headerConfig}>Saved Address</Text>
                    {!isLocationFetching && (
                        <TouchableOpacity onPress={() => {
                            navigation.navigate('UsersLocationScreen', {
                                fromEdit: false,
                                lat: coords.latitude,
                                long: coords.longitude,
                                data: null
                            })
                        }} style={{ flexDirection: "row", alignItems: "center", backgroundColor: "rgba(37, 119, 132, 0.1)", padding: 5, borderRadius: 30, paddingHorizontal: 10 }}>
                            <Ionicons color={theme.primary} name='add-circle' size={25} />
                            <Text style={[paratextConfig, { color: theme.primary }]}>Add New</Text>
                        </TouchableOpacity>
                    )}

                </View>


                <ScrollView style={{ marginTop: 10, flex: 1 }} contentContainerStyle={{ paddingBottom: 50 }}>
                    {addressList.map((item, index) => (
                        <TouchableOpacity
                            style={styles.card}
                            key={index}
                            onPress={() => {
                                //add logic to set the default address 
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

                                <View >
                                    <Text style={[headerConfig, { color: theme.background }]}>{item.addressType}</Text>
                                    <Text style={[paratextConfig, { color: theme.textForWhiteBG }]}>{item.addressLine1 + `\n ${item.addressLine2}`}</Text>
                                </View>
                                <View style={{ flexDirection: "row" }}>
                                    <TouchableOpacity onPress={() => {
                                        navigation.navigate('UsersLocationScreen', {
                                            fromEdit: true,
                                            data: item
                                        })
                                    }}>
                                        <Image source={require("../../../assets/images/edit.png")} style={{ width: 25, height: 25, marginRight: 10 }} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => {
                                        handleLongPress(item.id)
                                    }}>
                                        <Image source={require("../../../assets/images/bin.png")} style={{ width: 25, height: 25 }} />
                                    </TouchableOpacity>
                                </View>
                            </View>


                        </TouchableOpacity>
                    ))}
                </ScrollView>
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
