import { useAppContext } from '../../Context/AppContext';
import { useTheme } from '../../Context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useEffect, useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppText from '../../Components/AppText';
import { radius, spacing } from '../../Themes/Themes';
import Toast from 'react-native-toast-message';
import SearchBar from '../../Components/SearchBar';
import Addresses from '../../Data/Adresses';
import { useDispatch, useSelector } from 'react-redux';
import { clearAddressState, getAddressList, deleteAddress, saveSelectedAddress } from '../../Redux/Slices/AddressSlice'
import AppLoading from '../../Components/AppLoading';
import { fetchCurrentLocation } from '../../Utils/LocationUtil';
import { decodeAddress, saveCurrentLocationFormattedAddress } from '../../Redux/Slices/LocationSlice';
import { getData, storeData } from '../../OfflineStore/OfflineStore';
import { useToast } from '../../Components/Toast/ToastProvider';
import { getSelectedAddressId } from '../../Utils/GetSelectedAddress'
import AppModal from '../../Components/AppModal'

const AddressScreen = ({ onClose, navigation , callGetSelectedAddressCallBack }) => {

    const { theme } = useTheme()
    const [userID, setUserID] = useState(-1)
    const { showToast } = useToast()
    const {
        usersAddress,
        setUsersAddress,
        currentLocation,
        setCurrentLocation
    } = useAppContext()

    const [refresh, setRefresh] = useState(false)
    const [coords, setCoords] = useState({
        latitude: 0.0,
        longitude: 0.0
    });
    const [isLocationFetching, setIsLocationFetching] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState(null);


    useEffect(() => {
        const loadUserId = async () => {
            const storedId = await getData('userID');
            const parsed = Number(storedId);
            setUserID(isNaN(parsed) ? -1 : parsed);
        };
        loadUserId();
    }, []);



    const dispatch = useDispatch()

    const { addressList, error, loading, isFetched: isAddressApiListFetched, selectedAddress } = useSelector((state) => state.address)
    //LOCATIONS + GEOCODING API DATA  
    const { error: LocationError, display_name, address: DetailedAddress, isFetched: isLocationApiFetched, entireGEOData, loading: isGEOcodingApiLoading } = useSelector((state) => state.locations)

    const refreshLocation1 = async () => {
        try {
            setIsLocationFetching(true)
            const pos = await fetchCurrentLocation();
            setCurrentLocation({
                lat: pos.latitude,
                long: pos.longitude,
                displayAddress: ""
            })
            if (pos) {
                console.log("before sending to api", "lat", pos.latitude, "lonh", pos.longitude)
                dispatch(decodeAddress({ lat: pos.latitude, long: pos.longitude }));
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
        // syncAddress()
        refreshLocation1()
    }, [refresh])



    const syncAddress = () => {
        dispatch(clearAddressState())
        dispatch(getAddressList())
    }

    useEffect(() => {
        if (userID === -1) return;
        syncAddress();
    }, [userID, refresh]);




    const [selectedId, setSelectedId] = useState("-1");

    useEffect(() => {
        const loadSelected = async () => {
            const id = await getSelectedAddressId();
            setSelectedId(id);
        };
        loadSelected();
    }, []);


    useEffect(()=>{
        console.log("selectedIDDD",selectedId)
    },[selectedId])

    const sortedAddressList = useMemo(() => {
     if (selectedId === null || selectedId === undefined || selectedId === "-1") {
    return addressList;
}


        // Bring selected item to top
        const selectedItem = addressList.find(a => a.id.toString() === selectedId);
        if (!selectedItem) return addressList;

        const remaining = addressList.filter(a => a.id.toString() !== selectedId);

        return [selectedItem, ...remaining];
    }, [addressList, selectedId]);

    const handleLongPress = (id) => {
        setPendingDeleteId(id)
        setDeleteModalVisible(true)
    };

    const confirmDelete = async () => {
        const id = pendingDeleteId
        if (id == selectedId) {
            showToast("Cant't able to delete",true)
            return
        } else {
            await dispatch(deleteAddress(id))
            syncAddress()
            showToast("Address deleted")
        }
    };


    return (
        <View style={styles.container}>

            {/* Header */}
            <View style={styles.header}>
                <AppText variant="title" color={theme.ink}>Select delivery address</AppText>
                <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: theme.surfaceSunken }]}>
                    <Ionicons name='close' color={theme.ink} size={22} />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                {/* Sync + Add new row */}
                <View style={styles.actionRow}>
                    <TouchableOpacity disabled={loading} onPress={() => syncAddress()} style={[styles.syncBtn, { opacity: loading ? 0.5 : 1 }]}>
                        <Ionicons name='refresh' color={theme.primary} size={18} />
                        <AppText variant="label" color={theme.primary} style={{ marginLeft: 6 }}>
                            {loading ? 'Syncing…' : 'Sync'}
                        </AppText>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        onClose()
                        navigation.navigate('UsersLocationScreen', {
                            fromEdit: false,
                            lat: currentLocation.lat,
                            long: currentLocation.long,
                            data: null
                        })
                    }} style={[styles.addNewPill, { backgroundColor: theme.primaryTint }]}>
                        <Ionicons color={theme.primary} name='add' size={18} />
                        <AppText variant="label" color={theme.primary} style={{ marginLeft: 4 }}>Add new</AppText>
                    </TouchableOpacity>
                </View>

                <AppText variant="badge" color={theme.inkMuted} style={styles.sectionLabel}>SAVED ADDRESSES</AppText>

                {addressList && addressList.length == 0 && isAddressApiListFetched && (
                    <View style={styles.emptyWrap}>
                        <View style={[styles.emptyIcon, { backgroundColor: theme.primaryTint }]}>
                            <Ionicons name="location-outline" size={28} color={theme.primary} />
                        </View>
                        <AppText variant="bodyStrong" color={theme.ink} style={{ marginTop: spacing.md }}>No saved addresses yet</AppText>
                        <TouchableOpacity
                            onPress={() => {
                                onClose()
                                navigation.navigate('UsersLocationScreen', {
                                    fromEdit: false,
                                    lat: currentLocation.lat,
                                    long: currentLocation.long,
                                    data: null
                                })
                            }}
                            style={[styles.emptyBtn, { backgroundColor: theme.primary }]}
                        >
                            <AppText variant="button" color={theme.onPrimary}>Add new address</AppText>
                        </TouchableOpacity>
                    </View>
                )}

                <ScrollView style={{ marginTop: 10, flex: 1 }} contentContainerStyle={{ paddingBottom: 50 }}>
                    {sortedAddressList && sortedAddressList.map((item, index) => {
                        const isSelected = selectedId == item.id;
                        return (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.card,
                                    { backgroundColor: theme.surfaceCard, borderColor: theme.borderSubtle },
                                    isSelected && {
                                        borderColor: theme.primary,
                                        backgroundColor: theme.primaryTint,
                                    }
                                ]}
                                onPress={() => {
                                    setUsersAddress(item.address);
                                    // dispatch(saveSelectedAddress(item.id));
                                    storeData('selectedAddress', JSON.stringify(item))
                                    storeData('selectedAddressID', item.id.toString()) //now we only store id instead whole address

                                    //for live reflection in ui in dashboard purpose only
                                    dispatch(saveCurrentLocationFormattedAddress(`${item.addressLine1} ${item.addressLine2}`))

                                    onClose();
                                    showToast("Address Added");
                                    callGetSelectedAddressCallBack()
                                }}
                                onLongPress={() => handleLongPress(item.id)}
                            >
                                <View style={styles.row}>
                                    {/* RADIO */}
                                    <Ionicons
                                        name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                                        size={22}
                                        color={isSelected ? theme.primary : theme.borderStrong}
                                        style={{ marginRight: spacing.md, marginTop: 2 }}
                                    />

                                    {/* LEFT SIDE TEXT */}
                                    <View style={{ flex: 1, marginRight: 10 }}>
                                        <View style={styles.tagRow}>
                                            <AppText variant="bodyStrong" color={theme.ink}>{item.tag}</AppText>
                                            {/* {isSelected && (
                                                <View style={[styles.hereBadge, { backgroundColor: theme.primary }]}>
                                                    <AppText variant="badge" color={theme.onPrimary}>DELIVERING HERE</AppText>
                                                </View>
                                            )} */}
                                        </View>

                                        <AppText variant="caption" color={theme.inkMuted} numberOfLines={2} style={{ marginTop: 2 }}>
                                            {item.addressLine1 + "\n" + item.addressLine2}
                                        </AppText>
                                    </View>

                                    {/* RIGHT ICONS */}
                                    <View style={styles.iconContainer}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                onClose();
                                                navigation.navigate('DetailedAddressInputScreen', {
                                                    isEdit: true,
                                                    pickedAddress: item,
                                                });
                                            }}
                                            style={[styles.iconCircle, { backgroundColor: theme.surfaceSunken }]}
                                        >
                                            <Ionicons name="create-outline" size={18} color={theme.ink} />
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={() => handleLongPress(item.id)}
                                            style={[styles.iconCircle, { backgroundColor: theme.surfaceSunken }]}
                                        >
                                            <Ionicons name="trash-outline" size={18} color={theme.danger} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            <AppModal
                title="Delete address?"
                description="This address will be permanently removed."
                confirmText="Delete"
                cancelText="Cancel"
                destructive
                visible={deleteModalVisible}
                setModalVisible={setDeleteModalVisible}
                onPositive={confirmDelete}
                onNegative={() => setDeleteModalVisible(false)}
            />

        </View>
    );
};

export default AddressScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.sm,
        paddingBottom: spacing.md,
    },
    closeBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        marginHorizontal: spacing.sm,
        flex: 1,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.sm,
    },
    syncBtn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addNewPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: radius.pill,
    },
    sectionLabel: {
        marginTop: spacing.md,
        marginBottom: spacing.sm,
        letterSpacing: 0.5,
    },
    card: {
        padding: spacing.sm,
        borderRadius: radius.md,
        borderWidth: 1.5,
        marginVertical: 5,
    },
    row: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
    tagRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    hereBadge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: 3,
        borderRadius: radius.pill,
    },
    iconContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
    },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyWrap: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 50,
    },
    emptyIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyBtn: {
        borderRadius: radius.pill,
        paddingHorizontal: spacing.xl,
        paddingVertical: 12,
        marginTop: spacing.lg,
    },
});
