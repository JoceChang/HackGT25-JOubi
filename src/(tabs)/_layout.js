import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import ChestIcon from '../components/ChestIcon'; // optional icon component

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIcon: ({ focused }) => focused ? <ChestIcon /> : null,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="trackerScreen" options={{ title: 'Tracker' }} />
      <Tabs.Screen name="roadmapScreen" options={{ title: 'Roadmap' }} />
      <Tabs.Screen name="about" options={{ title: 'About' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#000',
    height: 60,
  },
  tabBarLabel: {
    color: '#fff',
    fontSize: 14,
  },
});
