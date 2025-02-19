import { Stack } from "expo-router";

const headerOptions = {
  headerShown: true,
  headerTitleStyle: {
    color: "#fff",
    fontFamily: "Medium",
  },
  headerTintColor: "#fff",
  headerStyle: {
    backgroundColor: "#27AE60",
  },
};

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#27AE60",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
          fontFamily: "Bold",
        },
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="camera2"
        options={{ ...headerOptions, title: "Camera" }}
      />
      <Stack.Screen
        name="videocamera2"
        options={{ ...headerOptions, title: "Video" }}
      />
      <Stack.Screen
        name="audio"
        options={{ ...headerOptions, title: "Audio" }}
      />
      <Stack.Screen name="index" options={{ ...headerOptions }} />
    </Stack>
  );
}
