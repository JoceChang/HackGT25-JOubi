import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons"; // or use your ChestIcon

// Screens
import HomeScreen from "../(tabs)/HomeScreen";
import TrackerScreen from "../(tabs)/TrackerScreen";
import RoadmapScreen from "../(tabs)/RoadmapScreen";
import { TasksProvider } from "../context/TasksContext";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <TasksProvider>
        <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === "Home") iconName = "home";
            else if (route.name === "Tracker") iconName = "bar-chart";
            else if (route.name === "Roadmap") iconName = "map";
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#007AFF",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: { height: 60, backgroundColor: "#000" },
          tabBarLabelStyle: { fontSize: 14, color: "#fff" },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Tracker" component={TrackerScreen} />
        <Tab.Screen name="Roadmap" component={RoadmapScreen} />
        </Tab.Navigator>
      </TasksProvider>
    </NavigationContainer>
  );
}
