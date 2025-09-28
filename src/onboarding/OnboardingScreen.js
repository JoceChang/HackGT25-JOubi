import { View, Text, Button } from "react-native";

export default function OnboardingScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" }}>
      <Text style={{ color: "#fff", fontSize: 24 }}>Welcome to the App!</Text>
      <Button
        title="Get Started"
        onPress={() => {
          // You can use context/state to mark onboarding as done
          // For simple demo, you could navigate directly:
          navigation.replace("(tabs)");
        }}
      />
    </View>
  );
}
