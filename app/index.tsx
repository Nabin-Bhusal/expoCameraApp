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
      }}
    >
      <TouchableOpacity onPress={() => router.push("/camera")}>
        <Text>Open Camera</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/videocamera")}>
        <Text>Open Video Cam</Text>
      </TouchableOpacity>
    </View>
  );
}
