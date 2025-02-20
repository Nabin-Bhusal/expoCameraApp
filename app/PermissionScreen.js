import {
  View,
  Text,
  Linking,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import * as Location from "expo-location";
import { Camera } from "expo-camera";
import WarningModal from "../components/WarningModal";
const PermissionScreen = (props) => {
  let type = props.route.params.type;
  let permission = {
    type: "",
    title: "",
    subtitle: "",
  };

  switch (type) {
    case "location":
      permission.type = "location";
      permission.title = "Enable Location Permission";
      permission.subtitle =
        "To use the application you need to provide location permission. Your location will be tracked in foreground.You can always change permission from settings.";
      permission.popUpTitle = "Location permission needed";
      permission.popUpSubTitle =
        "To deliver the best experience we need to access your location, enable it from location permission settings! Your location will be tracked in foreground while you report a complain";
      permission.popUpButtonText = "Give Location Permission";
      break;
    case "camera":
      permission.type = "camera";
      permission.title = "Enable Camera Permission";
      permission.subtitle =
        "To use the application you need to provide camera permission.Your camera will be used to take the photo of the any complain to be made";
      permission.popUpTitle = "Camera permission needed";
      permission.popUpSubTitle =
        "To deliver the best experience we need to access your camera, enable it from camera permission settings!Your camera will be used to take the photo of the any complain to be made";
      permission.popUpButtonText = "Give Camera Permission";
      break;

    default:
      break;
  }

  const [showPopUp, setShowPopUp] = useState(false);

  const openDeviceSettings = () => {
    setShowPopUp(false);
    Linking.openSettings();
  };

  const onGivePermission = async () => {
    if (permission.type == "location") {
      let takePermission = await Location.requestForegroundPermissionsAsync();
      if (takePermission.status !== "granted") {
        setShowPopUp(true);

        return;
      }
    }
    if (permission.type == "camera") {
      let takePermission = await Camera.requestCameraPermissionsAsync();
      if (takePermission.status !== "granted") {
        setShowPopUp(true);
        return;
      }
    }
  };
  return (
    <View
      style={[
        { backgroundColor: "white", justifyContent: "space-between", flex: 1 },
      ]}
    >
      <View></View>
      <View>
        <Image
          style={{
            height: 160,
            aspectRatio: 1,
            alignSelf: "center",
            resizeMode: "contain",
          }}
          source={require("../assets/images/icon.png")}
        />
        <View style={{ marginTop: 8 }}>
          <Text
            style={[{ alignSelf: "center", fontSize: 20, fontWeight: "600" }]}
          >
            {permission.title}
          </Text>
          <Text
            style={{
              alignSelf: "center",
              fontSize: 16,
              color: "gray",
              alignSelf: "center",
              textAlign: "center",
              marginTop: 6,
            }}
          >
            {permission.subtitle}
          </Text>
        </View>
      </View>
      {showPopUp && (
        <View>
          <WarningModal
            text1={permission.popUpTitle}
            text2={permission.popUpSubTitle}
            onConfirm={openDeviceSettings}
            onCancel={() => setShowPopUp(false)}
            isLoading={false}
            warning
          />
        </View>
      )}

      <View>
        <TouchableOpacity
          onPress={async () => await onGivePermission()}
          style={{
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 12,
            backgroundColor: "blue",
            borderRadius: 4,
          }}
        >
          <Text
            style={{ color: "white", fontSize: 18, fontFamily: "SemiBold" }}
          >
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PermissionScreen;
