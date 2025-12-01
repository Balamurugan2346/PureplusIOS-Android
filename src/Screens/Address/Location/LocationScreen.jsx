import AppButton from '../../../Components/AppButton';
import TopAppBar from '../../../Components/TopAppBar';
import { useTheme } from '../../../Context/ThemeContext';
import Fonts from '../../../../assets/fonts/Fonts';
import Ionicons from 'react-native-vector-icons/Ionicons'; // or use react-native-vector-icons/Ionicons
import { useEffect, useState, useRef } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker, Heatmap, Polyline } from 'react-native-maps';
import {
    Dimensions,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import {decodeAddress,clearDecodedAddress} from '../../../Redux/Slices/LocationSlice'




const { width, height } = Dimensions.get('window');
const LocationScreen = ({ navigation }) => {


    const { theme } = useTheme()
    const dispatch = useDispatch()
    //LOCATIONS + GEOCODING API DATA  
    const { error: LocationError,
         display_name, 
         address_line1 : a1,
         address_line2 : a2,
         address: DetailedAddress, 
         isFetched: isLocationApiFetched, 
         entireGEOData,
          loading: isGEOcodingApiLoading
         } = useSelector((state) => state.locations)


    //ui logic
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

    //get route params
    const route = useRoute();


    //states
    const [isLocationFetching, setIsLocationFetching] = useState(false);
    const [refresh, setRefresh] = useState(false)
    const [text, setText] = useState()
    const [address, setAddress] = useState({
        addressline1: "",
        addressline2: "",
        formattedAddress:"",
        state: "",
        city: "",
        latitude: 0.0,
        longitude: 0.0
    });



    const insets = useSafeAreaInsets();

    useEffect(() => {
        const { fromEdit, data, lat, long } = route.params ?? {};

        console.log("params data:",lat,long)
        // Case 1: Add New (fromEdit = false)
        if (fromEdit === false && lat  && long ) {
            dispatch(decodeAddress({lat,long}))
            setAddress(prev => ({
                ...prev,
                addressline1: a1,
                addressline2:a2,
                formattedAddress:display_name,
                latitude: lat,
                longitude: long
            }));
            return;
        }

        // Case 2: Edit mode (fromEdit = true)
        if (fromEdit === true && data) {
            setAddress({
                addressline1: data.addressLine1,
                addressline2: data.addressLine2,
                formattedAddress:`${data.addressLine1}\n${data.addressLine2}`,
                state: data.state,
                city: data.city,
                latitude: data.latitude,
                longitude: data.longitude
            });
        }

    }, [route.params]);





    const mapRef = useRef(null);

    useEffect(() => {
        console.log("address", address)
    }, [address])


    useEffect(() => {
        if (address.latitude !== 0 && address.longitude !== 0) {
            mapRef.current?.animateCamera({
                center: { latitude: address.latitude, longitude: address.longitude },
                pitch: 60,
                heading: 45,
                zoom: 18,
            });
        }
    }, [address]);




    const handleRegionChange = async (region) => {
        const { latitude: latReg, longitude } = region;

        console.log('called', latReg)
    };

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <TopAppBar navigation={navigation} title='Location' />



            {/* SEARCH BAR */}
            <View style={[styles.searchBarContainer]}>
                <Ionicons name="search" size={20} color="#999" style={{ marginHorizontal: 8 }} />
                <TextInput
                    value={text}
                    placeholder="Search area or address"
                    style={styles.searchInput}
                    placeholderTextColor="#999"
                />
            </View>

            {/* MAP VIEW */}
            {/* <Image source={require('../../../../assets/images/StaticMapView.jpeg')} resizeMode='cover' style={{ height: "60%", width: "100%" }} />
         */}

            <View style={{
                position: 'absolute',
                top: '45%',
                left: '50%',
                marginLeft: -15,
                zIndex: 10,
            }}>
                <Ionicons name='location-sharp' size={30} color='red' />
            </View>
            <MapView
                style={{ flex: 1, marginHorizontal: 10 }}
                onRegionChangeComplete={handleRegionChange}
                provider={PROVIDER_GOOGLE}
                initialRegion={{

                    latitude: address.latitude,
                    longitude: address.longitude,
                    latitudeDelta: 0.0022,
                    longitudeDelta: 0.0021,
                }}
                showsTraffic={false}
                showsCompass={false}
                showsIndoorLevelPicker={false}
                pitchEnabled={false}
                rotateEnabled={true}
            >
                <Marker coordinate={{ latitude: address.latitude, longitude: address.longitude }}>

                </Marker>
            </MapView>

            {/* FOOTER */}
            <View style={[styles.footer, { marginBottom: insets.bottom }]}>
                <Text style={[headerConfig]}>{address.addressline1}</Text>
                <Text style={[paratextConfig]}>{address.addressline2}</Text>
                <AppButton title={"Confirm Location"} onAction={() => navigation.navigate('DetailedAddressInputScreen')} />
            </View>
        </View>
    );
};

export default LocationScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    backBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 12,
        paddingHorizontal: 10,
        backgroundColor: '#f1f1f1',
        borderRadius: 8,
        height: 40,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },
    mapContainer: {
        flex: 1,
        marginHorizontal: 0,
    },
    map: {
        width: width,
        height: height * 0.55, // adjust map height as needed
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        padding: 12,
        backgroundColor: '#fff',
    },
    areaName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 6,
        color: '#333',
    },
    fullAddress: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
        flexWrap: 'wrap',
    },
    confirmBtn: {
        backgroundColor: '#6200EE',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    confirmText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});