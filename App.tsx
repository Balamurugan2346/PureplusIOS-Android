import { Provider } from 'react-redux';
import AppNavigator from './src/Navigation/AppNavigator';
import { AppContextProvider } from './src/Context/AppContext';
import { TabBarVisibilityProvider } from './src/Context/BottomBarContext';
import { ThemeProvider } from './src/Context/ThemeContext';
import { store } from './src/Redux/Store';
import { NavigationContainer } from '@react-navigation/native';
import { Text } from 'react-native';
import { ToastProvider } from './src/Components/Toast/ToastProvider'
import {
  // listenForegroundNotifications,
  createNotificationChannel,
  getFcmToken,
} from './src/Utils/FirebaseUtils';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Android only, safe to call on iOS too
    createNotificationChannel();

    // Get device token
    getFcmToken();

    // Register foreground listener
    // const unsubscribe = listenForegroundNotifications();

    // // Cleanup (VERY IMPORTANT)
    // return () => {
    //   unsubscribe && unsubscribe();
    // };
  }, []);
  return (
    <NavigationContainer>
      <ToastProvider>
        <AppContextProvider>
          <ThemeProvider>
            <TabBarVisibilityProvider>
              <Provider store={store}>
                <AppNavigator />
              </Provider>
            </TabBarVisibilityProvider>
          </ThemeProvider>
        </AppContextProvider>
      </ToastProvider>
    </NavigationContainer>
  );
}



export default App