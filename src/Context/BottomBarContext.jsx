import { createContext, useContext, useState } from 'react';

const TabBarVisibilityContext = createContext();

export const TabBarVisibilityProvider = ({ children }) => {
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);
  return (
    <TabBarVisibilityContext.Provider value={{ isTabBarVisible, setIsTabBarVisible }}>
      {children}
    </TabBarVisibilityContext.Provider>
  );
};

export const useTabBarVisibility = () => useContext(TabBarVisibilityContext);
