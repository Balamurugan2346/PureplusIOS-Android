import Ionicons from 'react-native-vector-icons/Ionicons';
import { BlurView } from "@react-native-community/blur";
import { useRef, useState } from 'react';
import { Keyboard, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

const SearchBar = ({ placeholder = "Search for products...", onSearch, liveText, value }) => {
  const [editable, setEditable] = useState(false);
  const inputRef = useRef(null);

  const handlePress = () => {
    setEditable(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSubmit = () => {
    onSearch?.(value);
    Keyboard.dismiss();
  };

  return (
    <TouchableOpacity activeOpacity={1} onPress={handlePress} style={styles.wrapper}>
      <BlurView intensity={40} tint="light" style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#555" style={{ marginRight: 8 }} />
        <TextInput
          ref={inputRef}
          editable={editable}
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={value}               // 👈 controlled by parent
          onChangeText={liveText}     // 👈 directly update parent
          returnKeyType="search"
          onSubmitEditing={handleSubmit}
        />
      </BlurView>
    </TouchableOpacity>
  );
};


export default SearchBar;


const styles = StyleSheet.create({
  wrapper: {
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 1)',
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
});
