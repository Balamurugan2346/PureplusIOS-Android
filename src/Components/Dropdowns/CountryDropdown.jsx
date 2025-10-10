import { useTheme } from '../../Context/ThemeContext'
import { FlatList, Image, Modal, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { countries } from '../../Utils/CountriesPhoneRegex'
import RegularText from '../Text/RegularText'


const CountryDropdown = ({ showDropdown, setCountry, setShowDropdown, setNumber, setError, onClick }) => {

  const { isDark, theme } = useTheme()

  return (
    <Modal
      visible={showDropdown}
      transparent
      animationType="fade"
      onRequestClose={() => {
        console.log('Back pressed inside modal');
        setShowDropdown(false);
      }}
    >
      <TouchableWithoutFeedback onPress={() => setShowDropdown(false)}>
        <View style={{ flex: 1, backgroundColor: '#00000088', justifyContent: 'center' }}>
          <TouchableWithoutFeedback>
            <View style={{ margin: 20, backgroundColor: theme.card, borderRadius: 10, padding: 10 }}>
              <FlatList
                data={countries}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}
                    onPress={() => {
                      onClick()
                      setCountry(item);
                      setShowDropdown(false);
                      setNumber('');
                      setError('');
                    }}
                  >
                    <Image source={item.image} style={{ width: 25, height: 15, marginRight: 10 }} />
                    <RegularText text={`${item.name} (${item.code})`} />
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>



  )
}

export default CountryDropdown

const styles = StyleSheet.create({})