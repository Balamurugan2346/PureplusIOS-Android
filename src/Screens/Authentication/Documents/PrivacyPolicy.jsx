import { useTheme } from '../../../Context/ThemeContext';
import Fonts from '../../../../assets/fonts/Fonts';
import { useMemo } from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { privacypolicy } from '../../../Documents/Privacypolicy';
const PrivacyPolicy = () => {

    const { theme, toggleTheme, isDark } = useTheme();
    const textConfig = useMemo(() => ({
        color: theme.highlightedText,
        fontFamily: Fonts.family.medium,
        fontSize: Fonts.size.xxxl,
        paddingLeft: 10
    }), [theme]);


      const paraconfig = useMemo(() => ({
        color: theme.highlightedText,
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.xs,
        paddingLeft: 10
    }), [theme]);

    return (
        <SafeAreaView style={{backgroundColor:theme.background}}>
                <StatusBar   />
            
            <ScrollView contentContainerStyle={{padding: 13}}>
                <View style={{
                    flexDirection: "row", alignSelf: "center",
                    background:theme.background,
                    margin: 10,
                    marginBottom: 30
                }}>
                    <Image source={require('../../../../assets/images/logoDesign.png')} />
                    <Text style={textConfig}>Pure plus</Text>

                </View>
                <Text style={paraconfig}>{privacypolicy}</Text>

            </ScrollView>
        </SafeAreaView>
    )
}

export default PrivacyPolicy

const styles = StyleSheet.create({})