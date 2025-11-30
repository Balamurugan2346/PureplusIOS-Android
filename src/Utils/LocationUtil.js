import { useState, useEffect } from 'react';
import { Platform, Alert, Linking } from 'react-native';
import GetLocation from 'react-native-get-location';
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import { promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler';

async function enableGPS() {
  if (Platform.OS === 'android') {
    try {
      const result = await promptForEnableLocationIfNeeded({ interval: 10000, fastInterval: 5000 });
      return result === 'enabled' || result === 'already-enabled';
    } catch (err) {
      console.log('GPS enable error:', err);
      return false;
    }
  } else {
    const status = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    if (status === RESULTS.DENIED || status === RESULTS.BLOCKED) {
      Alert.alert(
        'Enable Location Services',
        'Please enable Location Services in settings to continue.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openURL('App-Prefs:root=LOCATION_SERVICES') },
        ]
      );
      return false;
    }
    return true;
  }
}

async function requestLocationPermission() {
  if (Platform.OS === 'android') {
    const result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    if (result === RESULTS.GRANTED) return true;
    if (result === RESULTS.DENIED) return false;
    if (result === RESULTS.BLOCKED) {
      Alert.alert(
        'Permission Blocked',
        'Enable location permission in app settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ]
      );
      return false;
    }
  } else {
    const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    if (result === RESULTS.GRANTED) return true;
    if (result === RESULTS.DENIED) return false;
    if (result === RESULTS.BLOCKED) {
      Alert.alert(
        'Permission Blocked',
        'Enable location permission in app settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => openSettings() },
        ]
      );
      return false;
    }
  }
}

export async function fetchCurrentLocation() {
  const gpsEnabled = await enableGPS();
  if (!gpsEnabled) return null;

  const hasPermission = await requestLocationPermission();
  if (!hasPermission) return null;

  try {
    const location = await GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
      maximumAge: 1000,
    });
    return {
      latitude: location.latitude,
      longitude: location.longitude,
      accuracy: location.accuracy,
    };
  } catch (err) {
    if(enableGPS) return 
    
    Alert.alert(
      'GPS Disabled',
      'Please enable GPS to continue.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Open Settings',
          onPress: () =>
            Platform.OS === 'android'
              ? Linking.openSettings()
              : Linking.openURL('App-Prefs:root=LOCATION_SERVICES'),
        },
      ]
    );
    return null;
  }
}

