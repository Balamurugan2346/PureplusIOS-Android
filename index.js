/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { displayNotificationBGState } from './src/Utils/FirebaseUtils';

displayNotificationBGState()

AppRegistry.registerComponent(appName, () => App);
