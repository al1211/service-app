import { useEffect } from "react";
import { Slot, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        if (token) {
          router.replace("/(user)/(tabs)");
        } else {
          router.replace("/");
        }
      } catch {
        router.replace("/");
      } finally {
        // Hide AFTER router.replace() is called
        await SplashScreen.hideAsync();
      }
    };

    checkAuth();
  }, []);

  // No loading check needed — splash screen covers this gap
  return <Slot />;
}