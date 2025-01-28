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
      <TouchableOpacity onPress={() => router.push("/camera2")}>
        <Text>Open Camera</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/videocamera2")}>
        <Text>Open Video Cam</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/audio")}>
        <Text>Open Mic</Text>
      </TouchableOpacity>
    </View>
  );
}
