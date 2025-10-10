import { Provider } from 'react-redux';
import AppNavigator from './src/Navigation/AppNavigator';
import { AppContextProvider } from './src/Context/AppContext';
import { TabBarVisibilityProvider } from './src/Context/BottomBarContext';
import { ThemeProvider } from './src/Context/ThemeContext';
import { store } from './src/Redux/Store';
import { NavigationContainer } from '@react-navigation/native';
import { Text } from 'react-native';


 function App() {
  return (
    <NavigationContainer>
    <AppContextProvider>
      <ThemeProvider>
        <TabBarVisibilityProvider>
          <Provider store={store}>
            <AppNavigator />
          </Provider>
        </TabBarVisibilityProvider>
      </ThemeProvider>
    </AppContextProvider>
    </NavigationContainer>
  );
}



export default App