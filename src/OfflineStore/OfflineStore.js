import AsyncStorage from '@react-native-async-storage/async-storage';

// Save data
const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
    console.log(`${key} stored successfully to ${value}`)
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

/**
 * Clear all data except `isGetStartedViewed`
 */
const clearDataBeforeLogout = async () => {
  try {
    const KEYS_TO_KEEP = ['isGetStartedViewed'];

    // get all keys currently stored
    const allKeys = await AsyncStorage.getAllKeys();

    // filter out keys we want to keep
    const keysToDelete = allKeys.filter(
      (key) => !KEYS_TO_KEEP.includes(key)
    );

    // remove everything except the preserved keys
    if (keysToDelete.length > 0) {
      await AsyncStorage.multiRemove(keysToDelete);
    }

    console.log("Storage cleared except kept keys:", KEYS_TO_KEEP);
  } catch (e) {
    console.error("Clear error", e);
  }
};


export { getData, removeData, storeData , clearDataBeforeLogout };

