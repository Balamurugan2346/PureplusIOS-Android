import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Fonts from '../../assets/fonts/Fonts';
import { useTheme } from '../Context/ThemeContext';

const Tag = ({ title, onClick, icon ,badgeNeed ,onPress }) => {

    const { theme, toggleTheme, isDark } = useTheme();

    const paratextConfig = {
        color: theme.background,
        fontFamily: Fonts.family.medium,
        fontSize: Fonts.size.xs
    }

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={[styles.cardContainer, { backgroundColor: theme.cardContainer }]}>
                <Image source={icon} style={{ width: 25, height: 25 }} tintColor={theme.primary} />
            </View>
            <Text style={[paratextConfig, { marginTop: 3 }]}>{title}</Text>
            {badgeNeed && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>1</Text>
                </View>
            )}

        </TouchableOpacity>

    )
}

export default Tag

const styles = StyleSheet.create({


    container: {
        alignSelf: "flex-start",
        alignItems: "center"
    },

    cardContainer: {
        alignSelf: "flex-start",
        overflow: 'hidden',
        padding: 16,
        alignItems: "center",
        marginHorizontal: 8,
        borderRadius: 16,
        justifyContent: "center",
        padding: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },

    badge: {
        position: "absolute",
        top: -5,
        right: 5,
        backgroundColor: "red",
        borderRadius: 10,
        paddingHorizontal: 5,
        paddingVertical: 1,
    },
    badgeText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "bold",
    },
})