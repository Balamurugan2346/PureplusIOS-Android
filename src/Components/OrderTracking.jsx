import { useTheme } from '../Context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useState } from 'react';
import { Image, LayoutAnimation, Linking, Platform, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';
import Fonts from '../../assets/fonts/Fonts';
import VectorBg from './VectorBg';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';

const OrdetTracking = ({ title, description, img }) => {


    const callNumber = (phone) => {
        let phoneNumber = `tel:${phone}`;
        Linking.openURL(phoneNumber);
    };

    const { theme, toggleTheme, isDark } = useTheme();

    if (Platform.OS === 'android') {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    const [expanded, setExpanded] = useState(false);


    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    const headerConfig = {
        color: theme.buttonText,
        fontFamily: Fonts.family.bold,
        fontSize: Fonts.size.sm
    }

    const paratextConfig = {
        color: theme.secondaryText,
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.xs
    }

    const titleConfig = {

        color: theme.text,
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.lg
    }

    return (
        <LinearGradient
            colors={[
                theme.inputContainerBorder,
                theme.card,
            ]}
            start={{ x: 0, y: 0 }}          // Left side
            end={{ x: 1, y: 0 }}            // Right side
            style={styles.cardContainer}>


            {/* <ImageBackground
                source={require('../../assets/images/otpbg.png')}
                blurRadius={4}
                style={[{ overflow: "hidden", borderRadius: 16, zIndex: -1, backgroundColor: theme.primary }, StyleSheet.absoluteFill]}
                resizeMode="cover"
            /> */}



            <View>
                <TouchableOpacity onPress={toggleExpand} style={styles.innerRow}>
                    {/* Left Text Section */}
                    <View style={{ flex: 1, paddingRight: 10 }}>
                        <View style={{ flexDirection: "row" }}>
                            <VectorBg icon={"location"} bgColor={'lightgreen'} iconTint={"green"} />
                            <View style={{ marginLeft: 10 }}>
                                <Text style={headerConfig}>{title}</Text>
                                <Text style={[paratextConfig, { marginTop: 5 }]}>{description}</Text>

                            </View>
                        </View>



                    </View>

                    {/* Right Image Section */}

                    <View style={{ alignItems: "center" }}>
                        <Ionicons style={{}} onPress={toggleExpand} name={!expanded ? 'chevron-down' : 'chevron-up'} color={theme.buttonText} size={20} />
                        <Image source={require('../../assets/images/map.png')} style={{ width: 30, height: 30 }} />
                    </View>

                </TouchableOpacity>

                {expanded && (
                    <View style={styles.expandedSection}>
                        <View style={styles.detailsContainer}>
                            <View style={{ flexDirection: "column", paddingBottom: 5 }}>
                                <Text style={[paratextConfig, { color: theme.secondaryText }]}>Order ID</Text>
                                <Text style={[paratextConfig, { color: theme.buttonText }]}>#2342422424</Text>
                            </View>
                            <View style={{ flexDirection: "column", marginVertical: 5 }}>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", flex: 1 }}>
                                    <View>
                                        <Text style={[paratextConfig, { color: theme.secondaryText }]}>Delivery Person</Text>
                                        <Text style={[paratextConfig, { color: theme.buttonText }]}>John Doe, +91 6380273804</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => callNumber('6380273804')} style={{ borderRadius: 16, backgroundColor: theme.primary, padding: 6, alignSelf: "flex-start" }}>
                                        <Text style={[paratextConfig, { color: theme.buttonText }]}>Call now</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ flexDirection: "column", paddingBottom: 5 }}>
                                <Text style={[paratextConfig, { color: theme.secondaryText }]}>Receiver's Name</Text>
                                <Text style={[paratextConfig, { color: theme.buttonText }]}>Balamurugan</Text>
                            </View>
                            <View style={{ flexDirection: "column" }}>
                                <Text style={[paratextConfig, { color: theme.secondaryText }]}>Receiver's Address</Text>
                                <Text style={[paratextConfig, { color: theme.buttonText }]}>3rd Floor, B Block, Marvel Heights</Text>
                            </View>
                            <View style={{ flexDirection: "column", marginVertical: 5 }}>
                                <Text style={[paratextConfig, { color: theme.secondaryText }]}>Order taken Time</Text>
                                <Text style={[paratextConfig, { color: theme.buttonText }]}>12:00 PM</Text>

                            </View>
                            <View style={{ flexDirection: "column", marginVertical: 5 }}>
                                <Text style={[paratextConfig, { color: theme.secondaryText }]}>Estimated Delivery Time</Text>
                                <Text style={[paratextConfig, { color: theme.buttonText }]}>12:06 PM</Text>

                            </View>
                        </View>

                        {/* MAP VIEW */}
                        <MapView
                           style={{ height: 300, width: "100%", marginTop: 10, borderRadius: 20 }}
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
                        {/* <Image source={require('../../assets/images/StaticMapView.jpeg')} style={{ height: 300, width: "100%", marginTop: 10, borderRadius: 20 }} /> */}
                    </View>
                )}
            </View>

        </LinearGradient >
    );
};

export default OrdetTracking;

const styles = StyleSheet.create({
    cardContainer: {
        overflow: 'hidden',
        padding: 16,
        marginHorizontal: 8,
        borderRadius: 16,
        justifyContent: "center",
        padding: 12,
        margin: 10,
        marginTop: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },

    detailsContainer: {
        marginTop: 10,
        paddingHorizontal: 10,
    },
    innerRow: {
        flexDirection: 'row',
        alignItems: "center"
    },
    title: {
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.lg,
        marginBottom: 6,
    },
    description: {
        fontFamily: Fonts.family.light,
        fontSize: Fonts.size.sm,
        marginBottom: 12,
        color: '#555',
    },
    button: {
        backgroundColor: '#e85c0d',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    buttonText: {
        color: '#fff',
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.sm,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: "white"
    },
});
