import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AppEntry({ navigation }) {

  useEffect(() => {
    const checkStartDestination = async () => {
      try {
        const isGetStartedViewed = await AsyncStorage.getItem("isGetStartedViewed"); 
        const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");

        console.log("GetStarted:", isGetStartedViewed);
        console.log("LoggedIn:", isLoggedIn);

        // Condition 1 → Not viewed GetStarted
        if (!isGetStartedViewed) {
          return navigation.reset({
            index: 0,
            routes: [{ name: "GetStarted" }],
          });
        }

        // Condition 2 → Viewed GetStarted but not logged in
        if (isGetStartedViewed && !isLoggedIn) {
          return navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        }

        // Condition 3 → Viewed GetStarted + Logged in
        return navigation.reset({
          index: 0,
          routes: [{ name: "DashBoard" }],
        });

      } catch (err) {
        console.log("Error reading storage →", err);
      }
    };

    checkStartDestination();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
