import { Provider } from 'react-redux';
import AppNavigator from '../pureplusApp/src/Navigation/AppNavigator';
import { AppContextProvider } from '../pureplusApp/src/Context/AppContext';
import { TabBarVisibilityProvider } from '../pureplusApp/src/Context/BottomBarContext';
import { ThemeProvider } from '../pureplusApp/src/Context/ThemeContext';
import { store } from '../pureplusApp/src/Redux/Store';
import { NavigationContainer } from '@react-navigation/native';


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