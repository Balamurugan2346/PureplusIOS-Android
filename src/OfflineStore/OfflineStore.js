import AsyncStorage from '@react-native-async-storage/async-storage';

// Save data
const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
    console.log("vvvvvvvvvvvvvvvvvvv","stored sucessfully")
  } catch (e) {
    console.error('Saving error', e);
  }
};

// Get data
const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if(value !== null) {
      return value;
    }
  } catch(e) {
    console.error('Reading error', e);
  }
};

// Remove data
const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch(e) {
    console.error('Remove error', e);
  }
};


export { getData, removeData, storeData };

