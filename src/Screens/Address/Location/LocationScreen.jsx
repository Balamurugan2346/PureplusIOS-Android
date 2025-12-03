import AppButton from '../../../Components/AppButton';
import TopAppBar from '../../../Components/TopAppBar';
import { useTheme } from '../../../Context/ThemeContext';
import Fonts from '../../../../assets/fonts/Fonts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useEffect, useState, useRef, useCallback } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import {
    Dimensions,
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    FlatList,
    Keyboard,
    ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import {
    decodeAddress,
    clearDecodedAddress,
    // assume you have an autocomplete thunk/action
    autocompleteAddress,
    clearAutoComplete,
    autoCompleteAddress,
} from '../../../Redux/Slices/LocationSlice';
import { fetchCurrentLocation } from '../../../Utils/LocationUtil'
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import { useToast } from '../../../Components/Toast/ToastProvider';


const DISTANCE_THRESHOLD_METERS = 50; // only re-decode when moved > 50m
const SEARCH_DEBOUNCE_MS = 400;
const REGION_DEBOUNCE_MS = 700;


const LocationScreen = ({ navigation }) => {
    const { theme } = useTheme();
    const dispatch = useDispatch();
    const {showToast}  = useToast()
    const {
        error: LocationError,
        display_name,
        address_line1: a1,
        address_line2: a2,
        address: DetailedAddress,
        isFetched: isLocationApiFetched,
        entireGEOData,
        loading: isGEOcodingApiLoading,
        // expected: autocomplete results array from your slice
        autoList,
        autoLoading
    } = useSelector((state) => state.locations);

    const route = useRoute();
    const insets = useSafeAreaInsets();

    // UI state
    const [text, setText] = useState('');
    const [showAutocomplete, setShowAutocomplete] = useState(false);
    const [address, setAddress] = useState({
        addressline1: '',
        addressline2: '',
        formattedAddress: '',
        state: '',
        city: '',
        latitude: 0.0,
        longitude: 0.0,
    });
    const [isLocationFetching, setIsLocationFetching] = useState(false);

    //REFS
    const mapRef = useRef(null);
    const searchRef = useRef(null);
    // keep last decoded coordinate to avoid repeated decode on small moves
    const lastDecodedRef = useRef({ lat: 0, lng: 0, addressline1: '', addressline2: '' });
    // debounce refs
    const searchDebounceRef = useRef(null);
    const regionDebounceRef = useRef(null);

    // helper: haversine distance (meters)
    const haversineDistance = (lat1, lon1, lat2, lon2) => {
        const toRad = (v) => (v * Math.PI) / 180;
        const R = 6371000; // meters
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) *
            Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const isEditing = route?.params?.fromEdit === true;
    // On navigation params (edit/add)
    useEffect(() => {
        const { fromEdit, data, lat, long } = route.params ?? {};

        // Edit existing address
        if (fromEdit === true && data) {
            console.log("data from params", data)
            setAddress({
                addressline1: data.addressLine1,
                addressline2: data.addressLine2,
                formattedAddress: `${data.addressLine1}\n${data.addressLine2}`,
                state: data.state,
                city: data.city,
                latitude: data.latitude,
                longitude: data.longitude,
            });

            lastDecodedRef.current = { lat: data.latitude, lng: data.longitude, addressline1: data.addressLine1, addressline2: data.addressLine2 };
            // animate map to edit position
            setTimeout(() => {
                mapRef.current?.animateCamera({
                    center: { latitude: data.latitude, longitude: data.longitude },
                    zoom: 18,
                    pitch: 0,
                    heading: 0,
                });
            }, 250);

            return;
        }

        // Add new using lat/long passed (from e.g. map pick)
        if (fromEdit === false && lat && long) {
            // dispatch decode to fill address fields (debounced inside reducer if needed)
            dispatch(decodeAddress({ lat, long }));
            setAddress((prev) => ({
                ...prev,
                addressline1: a1 ?? prev.addressline1,
                addressline2: a2 ?? prev.addressline2,
                formattedAddress: display_name ?? prev.formattedAddress,
                latitude: lat,
                longitude: long,
            }));
            lastDecodedRef.current = { lat, lng: long, addressline1: a1, addressline2: a2 };
            setTimeout(() => {
                mapRef.current?.animateCamera({
                    center: { latitude: lat, longitude: long },
                    zoom: 18,
                });
            }, 200);
            return;
        }
    }, [route.params]);

    // When decodeAddress finishes and updates display_name / address_line fields, reflect them
    useEffect(() => {
        // if(isEditing) return 
        if (isLocationApiFetched) {
            setAddress((prev) => ({
                ...prev,
                addressline1: a1 ?? prev.addressline1,
                addressline2: a2 ?? prev.addressline2,
                formattedAddress: display_name ?? prev.formattedAddress,
            }));
        }
    }, [isLocationApiFetched, a1, a2, display_name]);

    // Debounced search for autocomplete
    const { } = useSelector(s => s.locations);

    const debounceRef = useRef(null);

    const onSearchChange = (txt) => {
        setText(txt);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            if (txt.length > 2) {
                dispatch(autoCompleteAddress(txt));
            } else {
                dispatch(clearAutoComplete());
            }
        }, 500);
    };

    // When user selects an autocomplete suggestion
    const onSelectSuggestion = (item) => {
        // item must contain lat/lon or id to fetch details
        // adapt to your autocomplete payload
        const lat = item.properties.lat
        const lon = item.properties.lon
        // fallback: if no coordinates, you might need to call a details endpoint
        if (lat && lon) {
            setAddress((prev) => ({
                ...prev,
                addressline1: item.properties.address_line1 ?? '',
                addressline2: item.properties.address_line2 ?? '',
                formattedAddress: item.properties.display_name ?? '',
                latitude: Number(lat),
                longitude: Number(lon),
            }));

            // set last decoded so region-change doesn't immediately re-decode
            lastDecodedRef.current = { lat: Number(lat), lng: Number(lon) };

            // move map
            mapRef.current?.animateCamera({
                center: { latitude: Number(lat), longitude: Number(lon) },
                zoom: 18,
            });

            // optionally call decodeAddress to fill full details if needed
            dispatch(decodeAddress({ lat: Number(lat), long: Number(lon) }));
            dispatch(clearAutoComplete());
            // hide suggestions and keyboard
            setShowAutocomplete(false);
            setText('');
            Keyboard.dismiss();
            searchRef.current?.blur();
        } else {
            //show error toast
            // if suggestion doesn't contain coordinates, attempt to fetch details via your API
            // dispatch(autoCompleteAddress({ query: item.id, details: true }));
        }
    };

    // handle region change complete with debounce & threshold
    const handleRegionChangeComplete = (region) => {
        searchRef.current?.blur();
        setShowAutocomplete(false)
        console.log("region", region)
        // region: { latitude, longitude, latitudeDelta, longitudeDelta }
        if (regionDebounceRef.current) clearTimeout(regionDebounceRef.current);
        regionDebounceRef.current = setTimeout(() => {
            const prev = lastDecodedRef.current;
            const dist = haversineDistance(
                prev.lat || 0,
                prev.lng || 0,
                region.latitude,
                region.longitude
            );
            if (dist > DISTANCE_THRESHOLD_METERS) {
                // update last decoded and call decode
                lastDecodedRef.current = { lat: region.latitude, lng: region.longitude };
                dispatch(decodeAddress({ lat: region.latitude, long: region.longitude }));
                setAddress((prev) => ({
                    ...prev,
                    latitude: region.latitude,
                    longitude: region.longitude,
                }));
            }
        }, REGION_DEBOUNCE_MS);
    };

    // sync to current device location (uses your fetchCurrentLocation util)
    const syncToCurrentLocation = async () => {
        try {
            setIsLocationFetching(true)
            const pos = await fetchCurrentLocation();
            if (!pos) return;
            const lat = pos.latitude;
            const lon = pos.longitude;

            setAddress((prev) => ({
                ...prev,
                latitude: lat,
                longitude: lon,
            }));

            lastDecodedRef.current = { lat, lng: lon };

            mapRef.current?.animateCamera({
                center: { latitude: lat, longitude: lon },
                zoom: 18,
            });

            // decode address
            dispatch(decodeAddress({ lat, long: lon }));
        } catch (err) {
            console.warn('failed to fetch current location', err);
        } finally {
            setIsLocationFetching(false)
        }
    };

    const renderSuggestion = ({ item }) => (
        <TouchableOpacity
            style={[styles.suggestionRow]}
            onPress={() => onSelectSuggestion(item)}
        >
            {console.log("item", item)}

            <Text style={[styles.suggestionText, { color: theme.text }]}>
                {item.properties.formatted || item.properties.address_line1 || item.properties.address_line2}
            </Text>
            <Text style={[styles.suggestionSubText, { color: 'white' }]}>
                {item.properties?.city || item.properties?.state || ''}-{item.properties.postcode}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container]}>
            <TopAppBar navigation={navigation} title="Location" />

            {/* SEARCH BAR */}
            <View style={[styles.searchBarContainer, { backgroundColor: theme.card }]}>
                <Ionicons name="search" size={20} color="#999" style={{ marginHorizontal: 8 }} />
                <TextInput
                    ref={searchRef}
                    value={text}
                    placeholder="Search area or address"
                    style={[styles.searchInput, { color: theme.text }]}
                    placeholderTextColor="#999"
                    onChangeText={onSearchChange}
                    onPress={() => setShowAutocomplete(true)}
                    onFocus={() => setShowAutocomplete(true)}
                />

                <TouchableOpacity onPress={()=>{
                    showToast("Hello from top!")
                }} style={styles.syncButton}>
                    <Ionicons name="locate" size={20} color={theme.text} />
                </TouchableOpacity>
            </View>
            {console.log("shw", showAutocomplete)}
            {/* AUTOCOMPLETE OVERLAY */}
            {showAutocomplete && (
                <View style={[styles.autocompleteOverlay, { marginTop: insets.top + 130 }]} pointerEvents="box-none">
                    <View style={[styles.autocompleteBox, { backgroundColor: theme.card }]}>
                        {autoLoading ? (
                            <ActivityIndicator />
                        ) : (
                            <FlatList
                                data={autoList}
                                keyExtractor={(i, idx) => (i.id ?? i.place_id ?? idx).toString()}
                                renderItem={renderSuggestion}
                                keyboardShouldPersistTaps="handled"
                                // style={{ maxHeight: 220 }}
                                ItemSeparatorComponent={() => <View style={styles.separator} />}
                                ListEmptyComponent={() => (
                                    <View style={styles.emptyRow}>
                                        <Text style={{ color: theme.secondaryText }}>No matches</Text>
                                    </View>
                                )}
                            />
                        )}
                    </View>
                </View>
            )}

            {/* MAP */}
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
                ref={mapRef}
                style={{ flex: 1, marginHorizontal: 10 }}
                onRegionChangeComplete={handleRegionChangeComplete}
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
                {/* <Marker coordinate={{ latitude: address.latitude, longitude: address.longitude }} /> */}
            </MapView>

            {/* FOOTER */}
            <View style={[styles.footer, { marginBottom: insets.bottom, backgroundColor: theme.background }]}>
                {isGEOcodingApiLoading || isLocationFetching ? (
                    <View>
                        <ShimmerPlaceholder
                            LinearGradient={LinearGradient}
                            shimmerColors={[theme.secondaryBackground, theme.secondaryBackground, theme.secondaryText]}
                            shimmerStyle={{
                                height: 20,
                                width: '100%',
                                borderRadius: 4,
                                marginBottom: 6
                            }}
                        />

                        <ShimmerPlaceholder
                            LinearGradient={LinearGradient}
                            shimmerColors={[theme.secondaryBackground, theme.secondaryBackground, theme.secondaryText]}
                            shimmerStyle={{
                                height: 12,
                                width: '40%',
                                borderRadius: 4
                            }}
                        />
                    </View>
                ) : (
                    <View>
                        <Text
                            style={{
                                color: theme.text,
                                fontFamily: Fonts.family.semiBold,
                                fontSize: Fonts.size.sm
                            }}
                        >
                            {address.addressline1 || 'No address selected'}
                        </Text>

                        <Text
                            style={{
                                color: theme.secondaryText,
                                fontFamily: Fonts.family.medium,
                                fontSize: Fonts.size.xs
                            }}
                        >
                            {address.addressline2 || address.formattedAddress || ''}
                        </Text>
                    </View>
                )}

                <AppButton
                    title={'Confirm Location'}
                    onAction={() =>
                        console.log("cliec", address)
                        // navigation.navigate('DetailedAddressInputScreen', {
                        //     pickedAddress: address,
                        // })
                    }
                />
            </View>
        </View>
    );
};

export default LocationScreen;

// styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchBarContainer: {
        margin: 10,
        borderRadius: 8,
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 50,
        elevation: 6,
    },
    searchInput: {
        flex: 1,
        height: '100%',
        paddingHorizontal: 8,
        fontSize: 14,
    },
    syncButton: {
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    autocompleteOverlay: {
        width: "100%",
        position: 'absolute',
        paddingHorizontal: 12,
        paddingBottom: 12,
        zIndex: 80,
        elevation: 8,
    },
    autocompleteBox: {
        borderRadius: 8,
        overflow: 'visible',
        // shadow for iOS
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 8,
        paddingVertical: 6,
    },
    suggestionRow: {
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    suggestionText: {
        fontSize: 14,
        fontFamily: Fonts.family.medium,
    },
    suggestionSubText: {
        fontSize: 12,
        marginTop: 2,
        fontFamily: Fonts.family.regular,
    },
    separator: {
        height: 1,
        opacity: 0.06,
        backgroundColor: '#000',
        marginHorizontal: 6,
    },
    emptyRow: {
        padding: 12,
        alignItems: 'center',
    },
    footer: {
        padding: 12,
        borderTopWidth: 0.5,
    },
});
