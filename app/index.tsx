import { Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff",
        paddingHorizontal: 20,
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          color: "#1a1a1a",
          marginBottom: 20,
        }}
      >
        Choose an Option
      </Text>

      {[
        { label: "Open Camera", route: "/camera2" },
        { label: "Open Video Cam", route: "/videocamera2" },
        { label: "Open Mic", route: "/audio" },
      ].map(({ label, route }, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => router.push(route)}
          style={{
            backgroundColor: "#e6e6e6",
            paddingVertical: 14,
            paddingHorizontal: 28,
            borderRadius: 12,
            marginBottom: 12,
            width: "100%",
            alignItems: "center",
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Text style={{ color: "#1a1a1a", fontSize: 18, fontWeight: "600" }}>
            {label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
