import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ImageBackground,
  Alert,
} from "react-native";
import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import { Camera, CameraView } from "expo-camera";

const ApiRequestWithImage = async (route, data, imageData) => {
  try {
    const formData = new FormData();
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        formData.append(key, data[key]);
      }
    }
    for (const key in imageData) {
      if (imageData.hasOwnProperty(key)) {
        formData.append(key, {
          uri: imageData[key],
          type: "image/png",
          name: "photo.png",
        });
      }
    }
    const response = await axios.post(route, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        key: "8623a0c8244bcdd6dd7ab48c8cef6c8546a38367839f0d00183c298bbfbc89d6",
      },
    });

    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const CameraScreen = () => {
  const cameraRef = useRef(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [photo, setPhoto] = useState();

  useEffect(() => {
    (async () => {
      let { status } = await Camera.getCameraPermissionsAsync();
    })();
    handlePhotoUpload();
  }, []);

  const handlePhotoUpload = async () => {
    let { status } = await Camera.getCameraPermissionsAsync();

    setIsCameraReady(true);
    if (!cameraRef.current) {
      return;
    }
  };

  const takePhoto = async () => {
    const options = { quality: 0.1, base64: true };
    var photo = await cameraRef.current.takePictureAsync(options);
    setPhoto(photo);
    setIsCameraReady(false);
  };

  const sendPhoto = async () => {
    try {
      let response = await ApiRequestWithImage(
        "https://fs.nicnepal.org/files/temp_fon/",
        { Remarks: "Test" },
        { files: photo?.uri }
      );
      Alert.alert("Response", response.data.url[0]);
    } catch (error) {
      console.error("Upload error:", error);

      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        console.error("Request data:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      Alert.alert(
        "Error",
        "An error occurred during upload. Check console for details."
      );
    }
  };

  return (
    <View>
      {photo && (
        <View
          style={{
            height: 300,
            width: "80%",
            marginTop: 20,
            alignSelf: "center",
          }}
        >
          <ImageBackground
            source={{
              uri: photo.uri,
            }}
            resizeMode="cover"
            style={{
              flex: 1,
              alignItems: "flex-end",
              paddingRight: 6,
            }}
          ></ImageBackground>
          <TouchableOpacity onPress={sendPhoto} style={{ alignSelf: "center" }}>
            <Text style={{ color: "#000" }}>send photo</Text>
          </TouchableOpacity>
        </View>
      )}
      {isCameraReady && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={isCameraReady}
          style={{ flex: 1 }}
        >
          <CameraView
            ref={cameraRef}
            style={{
              flex: 1,
              zIndex: 999,
              justifyContent: "space-between",
              alignItems: "center",
            }}
            ratio="16:9"
          >
            <TouchableOpacity
              style={{
                alignSelf: "flex-start",
                left: 15,
                top: 20,
                height: 35,
                width: 35,
                borderRadius: 35 / 2,
                backgroundColor: "#ffffff",
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => setIsCameraReady(false)}
            >
              <Text>Back</Text>
            </TouchableOpacity>
            <View>
              <TouchableOpacity
                style={styles.button}
                onPress={() => takePhoto()}
              ></TouchableOpacity>
            </View>
          </CameraView>
        </Modal>
      )}
    </View>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  button: {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: "white",
  },
});
