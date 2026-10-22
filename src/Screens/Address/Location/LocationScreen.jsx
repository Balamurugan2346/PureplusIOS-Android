import React, { useEffect, useState, useRef } from 'react';
import AppButton from '../../../Components/AppButton';
import AppText from '../../../Components/AppText';
import TopAppBar from '../../../Components/TopAppBar';
import { useTheme } from '../../../Context/ThemeContext';
import Fonts from '../../../../assets/fonts/Fonts';
import { fontFamily, radius, spacing, floatShadow } from '../../../Themes/Themes';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import {
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
    const { showToast } = useToast()
    const {
        error: LocationError,
        display_name,
        address_line1: a1,
        address_line2: a2,
        address: DetailedAddress,
        isFetched: isLocationApiFetched,
        entireGEOData,
        loading: isGEOcodingApiLoading,
        autoList,
        autoLoading,
        pinCode,
        state: s,
        city: c
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
        pinCode: '',
        latitude: 0.0,
        longitude: 0.0,
    });
    const [isLocationFetching, setIsLocationFetching] = useState(false);

    // REFS
    const mapRef = useRef(null);
    const searchRef = useRef(null);
    // keep last decoded coordinate to avoid repeated decode on small moves
    const lastDecodedRef = useRef({ lat: 0, lng: 0, addressline1: '', addressline2: '' });
    // debounce refs
    const searchDebounceRef = useRef(null);
    const regionDebounceRef = useRef(null);

    // programmatic move guard: when we call animateCamera we set this true briefly so region-change ignores it
    const isProgrammaticMoveRef = useRef(false);

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

    const params = route.params ?? {};
    const isEditing = params.fromEdit === true;

    // ---------------------------
    // Handle route params (edit / add)
    // ---------------------------
    useEffect(() => {
        const { fromEdit, data, lat, long } = route.params ?? {};

        // EDIT existing address: set state EXACTLY from params and animate map (do NOT decode)
        if (fromEdit === true && data) {
            setAddress({
                addressline1: data.addressLine1 ?? '',
                addressline2: data.addressLine2 ?? '',
                formattedAddress: `${data.addressLine1 ?? ''}\n${data.addressLine2 ?? ''}`,
                state: data.state ?? '',
                city: data.city ?? '',
                latitude: Number(data.latitude) || 0,
                longitude: Number(data.longitude) || 0,
                pinCode: data.pinCode ?? ''
            });

            lastDecodedRef.current = { lat: Number(data.latitude) || 0, lng: Number(data.longitude) || 0, addressline1: data.addressLine1 ?? '', addressline2: data.addressLine2 ?? '' };

            // animate programmatically, ignore region-change triggered by this
            isProgrammaticMoveRef.current = true;
            setTimeout(() => { isProgrammaticMoveRef.current = false; }, 500);
            setTimeout(() => {
                mapRef.current?.animateCamera({
                    center: { latitude: Number(data.latitude) || 0, longitude: Number(data.longitude) || 0 },
                    zoom: 18,
                    pitch: 0,
                    heading: 0,
                });
            }, 250);

            return;
        }

        // ADD new address with lat/long passed from previous screen — decode & set address
        if (fromEdit === false && lat != null && long != null) {
            // mark programmatic move while animating map
            isProgrammaticMoveRef.current = true;
            setTimeout(() => { isProgrammaticMoveRef.current = false; }, 500);

            // trigger decode to populate fields from coords
            dispatch(decodeAddress({ lat, long }));

            setAddress((prev) => ({
                ...prev,
                addressline1: a1 ?? prev.addressline1,
                addressline2: a2 ?? prev.addressline2,
                formattedAddress: display_name ?? prev.formattedAddress,
                latitude: Number(lat),
                longitude: Number(long),
                pinCode: pinCode ?? prev.pinCode,
                city: c ?? prev.city,
                state: s ?? prev.state
            }));

            lastDecodedRef.current = { lat: Number(lat), lng: Number(long), addressline1: a1 ?? '', addressline2: a2 ?? '' };

            setTimeout(() => {
                mapRef.current?.animateCamera({
                    center: { latitude: Number(lat), longitude: Number(long) },
                    zoom: 18,
                });
            }, 200);
            return;
        }
    }, [route.params]);

    // ---------------------------
    // On mount: default-center the map on the device's CURRENT location.
    // Only when NOT editing an existing address AND no lat/long was passed in
    // (the route-params effect above already animates to a passed lat/long,
    // so we avoid double-fetching / fighting that animation).
    // syncToCurrentLocation() sets its own programmatic-move guard, so this
    // won't trigger a spurious region-change decode.
    // ---------------------------
    useEffect(() => {
        const { fromEdit, lat, long } = route.params ?? {};
        if (fromEdit !== true && lat == null && long == null) {
            syncToCurrentLocation();
        }
        // run once on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ---------------------------
    // Apply decode results — but DO NOT override when initially editing (isEditing)
    // This effect runs when decodeAddress finishes and location slice updates a1/a2/display_name/pinCode/c/s
    // ---------------------------
    useEffect(() => {
        // if (isEditing) return; // critical — block overriding initial edit data

        if (isLocationApiFetched) {
            setAddress((prev) => ({
                ...prev,
                pinCode: pinCode ?? prev.pinCode,
                state: s ?? prev.state,
                city: c ?? prev.city,
                addressline1: a1 ?? prev.addressline1,
                addressline2: a2 ?? prev.addressline2,
                formattedAddress: display_name ?? prev.formattedAddress,
            }));
        }
    }, [isLocationApiFetched, a1, a2, display_name, pinCode, c, s, isEditing]);

    // ---------------------------
    // Debounced search for autocomplete
    // ---------------------------
    const debounceRef = useRef(null);
    const onSearchChange = (txt) => {
        setText(txt);

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            if (txt.length > 2) {
                dispatch(autoCompleteAddress(txt));
            } else {
                dispatch(clearAutoComplete());
            }
        }, SEARCH_DEBOUNCE_MS);
    };

    // ---------------------------
    // When user selects an autocomplete suggestion
    // ---------------------------
    const onSelectSuggestion = (item) => {
        const lat = Number(item.properties.lat);
        const lon = Number(item.properties.lon);

        if (isNaN(lat) || isNaN(lon)) {
            showToast("No coordinates available for this suggestion", true);
            return;
        }

        // update address fields immediately
        setAddress((prev) => ({
            ...prev,
            pinCode: item.properties.postcode ?? '',
            city: item.properties.city ?? '',
            state: item.properties.state ?? '',
            addressline1: item.properties.address_line1 ?? '',
            addressline2: item.properties.address_line2 ?? '',
            formattedAddress: item.properties.display_name ?? '',
            latitude: lat,
            longitude: lon,
        }));

        // prevent immediate region-change decode caused by animateCamera
        isProgrammaticMoveRef.current = true;
        setTimeout(() => { isProgrammaticMoveRef.current = false; }, 500);

        // move map
        mapRef.current?.animateCamera({
            center: { latitude: lat, longitude: lon },
            zoom: 18,
        });

        // update last decoded to this suggestion
        lastDecodedRef.current = { lat, lng: lon, addressline1: item.properties.address_line1 ?? '', addressline2: item.properties.address_line2 ?? '' };

        // optionally call decodeAddress to fill more details (keeps UI consistent)
        dispatch(decodeAddress({ lat, long: lon }));
        dispatch(clearAutoComplete());

        // hide suggestions, keyboard
        setShowAutocomplete(false);
        setText('');
        Keyboard.dismiss();
        searchRef.current?.blur();
    };

    // ---------------------------
    // handle region change complete with debounce & threshold
    // ---------------------------
    const handleRegionChangeComplete = (region) => {
        // ignore region-change triggered by our programmatic animateCamera calls
        if (isProgrammaticMoveRef.current) {
            return;
        }

        searchRef.current?.blur();
        setShowAutocomplete(false);

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

    // ---------------------------
    // sync to current device location (uses your fetchCurrentLocation util)
    // ---------------------------
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

            // prevent decode from running on animateCamera
            isProgrammaticMoveRef.current = true;
            setTimeout(() => { isProgrammaticMoveRef.current = false; }, 500);

            mapRef.current?.animateCamera({
                center: { latitude: lat, longitude: lon },
                zoom: 18,
            });

            // decode address
            dispatch(decodeAddress({ lat, long: lon }));
        } catch (err) {
            console.warn('failed to fetch current location', err);
            showToast("Failed to fetch current location", true);
        } finally {
            setIsLocationFetching(false)
        }
    };

    // ---------------------------
    // render suggestion item
    // ---------------------------
    const renderSuggestion = ({ item }) => (
        <TouchableOpacity
            style={[styles.suggestionRow]}
            onPress={() => onSelectSuggestion(item)}
        >
            <Ionicons name="location-outline" size={18} color={theme.primary} style={{ marginRight: spacing.md, marginTop: 1 }} />
            <View style={{ flex: 1 }}>
                <Text style={[styles.suggestionText, { color: theme.ink }]}>
                    {item.properties.formatted || item.properties.address_line1 || item.properties.address_line2}
                </Text>
                <Text style={[styles.suggestionSubText, { color: theme.inkMuted }]}>
                    {(item.properties?.city || item.properties?.state || '') + (item.properties?.postcode ? ` – ${item.properties.postcode}` : '')}
                </Text>
            </View>
        </TouchableOpacity>
    );

    // ---------------------------
    // Confirm location -> navigate to details screen
    // ---------------------------
    const onConfirmLocation = () => {
        const safeAddress = {
            addressLine1: address?.addressline1 ?? "",
            addressLine2: address?.addressline2 ?? "",
            formattedAddress: address?.formattedAddress ?? "",
            state: address?.state ?? "",
            city: address?.city ?? "",
            pinCode: address?.pinCode ?? "",
            latitude: address?.latitude ?? 0.0,
            longitude: address?.longitude ?? 0.0,
        };

        navigation.navigate('DetailedAddressInputScreen', {
            pickedAddress: safeAddress,
        })
    };

    // ---------------------------
    // JSX
    // ---------------------------
    return (
        <View style={[styles.container]}>
            {/* MAP (full-screen background layer) */}
            <MapView
                ref={mapRef}
                style={StyleSheet.absoluteFillObject}
                onRegionChangeComplete={handleRegionChangeComplete}
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                    latitude: address.latitude || 12.9716, // fallback to sensible lat/lng if zero
                    longitude: address.longitude || 77.5946,
                    latitudeDelta: 0.0022,
                    longitudeDelta: 0.0021,
                }}
                showsTraffic={false}
                showsCompass={false}
                showsIndoorLevelPicker={false}
                pitchEnabled={false}
                rotateEnabled={true}
            >
            </MapView>

            <TopAppBar navigation={navigation} title="Location" />

            {/* SEARCH BAR */}
            <View style={[styles.searchBarContainer, { backgroundColor: theme.surfaceCard }, floatShadow]}>
                <Ionicons name="search" size={20} color={theme.inkMuted} style={{ marginHorizontal: spacing.md }} />
                <TextInput
                    ref={searchRef}
                    value={text}
                    placeholder="Search area or address"
                    style={[styles.searchInput, { color: theme.ink }]}
                    placeholderTextColor={theme.inkMuted}
                    onChangeText={onSearchChange}
                    onPressIn={() => setShowAutocomplete(true)}
                    onFocus={() => setShowAutocomplete(true)}
                />

                <TouchableOpacity onPress={syncToCurrentLocation} style={[styles.syncButton, { backgroundColor: theme.primaryTint }]}>
                    <Ionicons name="locate-outline" size={20} color={theme.primary} />
                </TouchableOpacity>
            </View>

            {/* AUTOCOMPLETE OVERLAY */}
            {showAutocomplete && (
                <View style={[styles.autocompleteOverlay, { marginTop: insets.top + 140 }]} pointerEvents="box-none">
                    <View style={[styles.autocompleteBox, { backgroundColor: theme.card }]}>
                        {autoLoading ? (
                            <ActivityIndicator />
                        ) : (
                            <FlatList
                                data={autoList}
                                keyExtractor={(i, idx) => (i.id ?? i.place_id ?? idx).toString()}
                                renderItem={renderSuggestion}
                                keyboardShouldPersistTaps="handled"
                                ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: theme.borderSubtle }]} />}
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

            {/* MAP CENTER PIN (branded) */}
            <View style={styles.centerPin} pointerEvents="none">
                <View style={[styles.pinPill, { backgroundColor: theme.ink }]}>
                    <AppText variant="caption" color={theme.onInk}>Deliver here</AppText>
                </View>
                <Ionicons name='location' size={40} color={theme.primary} />
                <View style={[styles.pinShadow, { backgroundColor: theme.scrim }]} />
            </View>

            {/* FOOTER */}
            <View style={[styles.footer, styles.footerFloating, { marginBottom: insets.bottom, backgroundColor: theme.surfaceCard }, floatShadow]}>
                {isGEOcodingApiLoading || isLocationFetching ? (
                    <View style={{ marginBottom: spacing.lg }}>
                        <ShimmerPlaceholder
                            LinearGradient={LinearGradient}
                            shimmerColors={[theme.surfaceSunken, theme.surfaceSunken, theme.borderSubtle]}
                            shimmerStyle={{
                                height: 20,
                                width: '100%',
                                borderRadius: 6,
                                marginBottom: 8
                            }}
                        />

                        <ShimmerPlaceholder
                            LinearGradient={LinearGradient}
                            shimmerColors={[theme.surfaceSunken, theme.surfaceSunken, theme.borderSubtle]}
                            shimmerStyle={{
                                height: 12,
                                width: '40%',
                                borderRadius: 6
                            }}
                        />
                    </View>
                ) : (
                    <View style={styles.footerAddressRow}>
                        <View style={[styles.footerWell, { backgroundColor: theme.primaryTint }]}>
                            <Ionicons name="location" size={22} color={theme.primary} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <AppText variant="bodyStrong" color={theme.ink}>
                                {address.addressline1 || 'No address selected'}
                            </AppText>

                            <AppText variant="caption" color={theme.inkMuted} style={{ marginTop: 2 }}>
                                {address.addressline2 || address.formattedAddress || ''}
                            </AppText>

                            {!!address.pinCode && (
                                <View style={[styles.pinBadge, { backgroundColor: theme.primaryTint }]}>
                                    <AppText variant="badge" color={theme.primary}>{`PINCODE ${address.pinCode}`}</AppText>
                                </View>
                            )}
                        </View>
                    </View>
                )}

                <AppButton
                    title={'Confirm location'}
                    onAction={onConfirmLocation}
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
        marginHorizontal: spacing.md,
        marginVertical: spacing.md,
        borderRadius: radius.pill,
        height: 52,
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: spacing.sm,
        zIndex: 50,
    },
    searchInput: {
        flex: 1,
        height: '100%',
        paddingHorizontal: spacing.sm,
        fontFamily: fontFamily.regular,
        fontSize: 14,
    },
    syncButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    autocompleteOverlay: {
        width: "100%",
        position: 'absolute',
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.md,
        zIndex: 80,
        elevation: 8,
    },
    autocompleteBox: {
        borderRadius: radius.md,
        overflow: 'visible',
        ...floatShadow,
        paddingVertical: 6,
    },
    suggestionRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
    },
    suggestionText: {
        fontSize: 14,
        fontFamily: fontFamily.semibold,
    },
    suggestionSubText: {
        fontSize: 12,
        marginTop: 2,
        fontFamily: fontFamily.regular,
    },
    separator: {
        height: 1,
        marginHorizontal: spacing.lg,
    },
    emptyRow: {
        padding: spacing.md,
        alignItems: 'center',
    },
    centerPin: {
        position: 'absolute',
        top: '42%',
        left: '50%',
        marginLeft: -20,
        zIndex: 10,
        alignItems: 'center',
    },
    pinPill: {
        paddingHorizontal: spacing.md,
        paddingVertical: 4,
        borderRadius: radius.pill,
        marginBottom: 2,
    },
    pinShadow: {
        width: 16,
        height: 5,
        borderRadius: 3,
        opacity: 0.3,
        marginTop: -2,
    },
    footer: {
        padding: spacing.xl,
        paddingBottom: spacing.xxl,
        borderTopLeftRadius: radius.lg,
        borderTopRightRadius: radius.lg,
    },
    footerFloating: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 60,
    },
    footerAddressRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.md,
        marginBottom: spacing.lg,
    },
    footerWell: {
        width: 44,
        height: 44,
        borderRadius: radius.sm,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pinBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: spacing.sm,
        paddingVertical: 3,
        borderRadius: radius.pill,
        marginTop: spacing.sm,
    },
});
