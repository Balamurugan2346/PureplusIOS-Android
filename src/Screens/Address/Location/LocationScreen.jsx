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
const { width, height } = Dimensions.get('window');

const LocationScreen = ({ navigation, route }) => {
    const [routeCoords, setRouteCoords] = useState([]);
    useEffect(() => {
        const getRoute = async () => {
            try {
                const response = await fetch(
                    "https://maps.googleapis.com/maps/api/directions/json?" +
                    "origin=13.0296,80.2405&destination=13.0213,80.2270&key=AIzaSyB52U540AQbDeKq__z0IDhrDfm5ZiACqFk"
                );
                const data = await response.json();

                console.log("data",data)
                if (data.routes.length) {
                    const points = PolylineDecoder.decode(
                        data.routes[0].overview_polyline.points
                    );
                    const coords = points.map(([lat, lng]) => ({
                        latitude: lat,
                        longitude: lng,
                    }));
                    setRouteCoords(coords);
                }
            } catch (err) {
                console.error(err);
            }
        };

        getRoute();
    }, []);


    useEffect(()=>{

        console.log("routes",routeCoords)
    },[routeCoords])

    const initialText = route.params?.text ?? '';

    const [text, setText] = useState(initialText);

    const insets = useSafeAreaInsets();
    // if you expect the param to change later, sync it
    useEffect(() => {
        if (route.params?.text !== undefined) {
            setText(route.params.text);
        }
        // const userLoc = GetUserLocation()

    }, [route.params?.text]);


    const { theme } = useTheme()

    const mapRef = useRef(null);

    useEffect(() => {
        setTimeout(() => {
            mapRef.current?.animateCamera({
                center: { latitude: 37.78825, longitude: -122.4324 },
                pitch: 60,   // tilt (0 = flat, 90 = straight down)
                heading: 45, // bearing (compass direction)
                zoom: 18,
            });
        }, 1000);
    }, []);


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


    const [areaName] = useState('Chamiers Road, Nandanam');
    const [fullAddress] = useState(
        '20, Mangaiyarkarasi Street, Santosh Nagar, Kurinji Nagar, Chennai, Tamil Nadu, India'
    );

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <TopAppBar navigation={navigation} title='Location' />



            {/* SEARCH BAR */}
            <View style={[styles.searchBarContainer]}>
                <Ionicons name="search" size={20} color="#999" style={{ marginHorizontal: 8 }} />
                <TextInput
                    value={text && text}
                    placeholder="Search area or address"
                    style={styles.searchInput}
                    placeholderTextColor="#999"
                />
            </View>

            {/* MAP VIEW */}
            {/* <Image source={require('../../../../assets/images/StaticMapView.jpeg')} resizeMode='cover' style={{ height: "60%", width: "100%" }} />
         */}
            <MapView
                style={{ flex: 1, marginHorizontal: 10 }}
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                    latitude: 13.0296,
                    longitude: 80.2405,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                showsBuildings={true}
                showsTraffic={true}
                showsCompass={true}
                showsIndoorLevelPicker={true}
                pitchEnabled={true}
                rotateEnabled={true}
            >
                <Marker
                    coordinate={{ latitude: 13.0296, longitude: 80.2405 }}
                    title="Nandanam"
                />

                {/* End marker */}
                <Marker
                    coordinate={{ latitude: 13.0213, longitude: 80.2270 }}
                    title="Saidapet"
                />

                {/* Path */}
                <Polyline
                    coordinates={[
                        { latitude: 13.0296, longitude: 80.2405 }, // Nandanam
                        { latitude: 13.025, longitude: 80.235 },   // Midpoint
                        { latitude: 13.0213, longitude: 80.2270 }, // Saidapet
                    ]}
                    strokeColor="#FF0000"   // red
                    strokeWidth={4}
                />
            </MapView>





            {/* FOOTER */}
            <View style={[styles.footer, { marginBottom: insets.bottom }]}>
                <Text style={[headerConfig]}>{areaName}</Text>
                <Text style={[paratextConfig]}>{fullAddress}</Text>
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