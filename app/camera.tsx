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

const ApiRequestWithImage = async (
  route: string,
  data: any,
  imageData: object
) => {
  try {
    let token = "kkk";

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
          name: "photo",
        });
      }
    }
    //  await  axios.post(route, formData, {
    //     headers: {
    //       Authorization: `Bearer ${access_token}`,
    //       "Content-Type": "multipart/form-data",
    //       "Access-Control-Allow-Origin": "*",
    //     },
    //   })
    //   .then(response => {
    //     return response
    //   })
    //   .catch(error => {
    //     // Handle error
    //   });
    const response = await axios.post(route, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        key: "fd70a6c233162f30dedf48b131a319a02c60a17117e420907538eff6f30b3fc2",
      },
    });

    console.log(response);
    return response; // Return the response if successful
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
    let response = await ApiRequestWithImage(
      "https://fs.dev.nicnepal.org/file/",
      { Remarks: "Test" },
      { files: photo?.uri }
    );
    Alert.alert("Response", response.data);
  };

  return (
    <View>
      <TouchableOpacity
        style={{ justifyContent: "center", alignItems: "center" }}
        onPress={handlePhotoUpload}
      >
        <View>
          <Text>Open Camera </Text>
        </View>
      </TouchableOpacity>

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
            // isCameraReady={isCameraReady}
            // focusMode="continuous"
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
