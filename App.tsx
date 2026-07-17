import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SettingsProvider } from "./src/context/SettingsContext";
import { HistoryProvider } from "./src/context/HistoryContext";
import { HomeScreen } from "./src/screens/HomeScreen";
import { HistoryScreen } from "./src/screens/HistoryScreen";
import { SettingsScreen } from "./src/screens/SettingsScreen";
import type { RootStackParamList } from "./src/navigation/types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <HistoryProvider>
          <NavigationContainer>
            <StatusBar style="dark" />
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="History" component={HistoryScreen} />
              <Stack.Screen name="Settings" component={SettingsScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </HistoryProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
