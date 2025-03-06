import { Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import StoreHelper from "../redux/StoreHelper";

export default function Index() {
  const router = useRouter();
  StoreHelper.save(
    "token",
    "vCjPqrC38XhXvdIQrDJ5K43TolbOxJTFRl6ZRwvCMXssr5zTd7d7Djm81ZnW54a6"
  );
  StoreHelper.save(
    "apiKey",
    "8623a0c8244bcdd6dd7ab48c8cef6c8546a38367839f0d00183c298bbfbc89d6"
  );

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
        { label: "Photo and audio", route: "/camera2" },
        { label: "Video", route: "/videocamera2" },
        // { label: "Open Mic", route: "/audio" },
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
