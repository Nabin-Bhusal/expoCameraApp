import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageBackground,
  Alert,
} from "react-native";
import MyCamera from "../components/MyCamera";
import Ionicons from "@expo/vector-icons/Ionicons";
import Utils from "../utils/Utils";
import AppStyles from "../styles/AppStyles";

const ParentComponent = () => {
  const [isCaptureEnabled, setIsCaptureEnabled] = useState(true);
  const [capturedPhoto, setCapturedPhoto] = useState(null);

  const handlePhotoCapture = (photo) => {
    setCapturedPhoto(photo); // Store the captured photo in the state
    // console.log("Photo captured:", photo);
  };

  const sendPhoto = async () => {
    try {
      let response = await Utils.ApiRequestWithImage(
        "https://fs.nicnepal.org/files/temp_fon/",
        { Remarks: "Test" },
        { files: capturedPhoto?.uri }
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
    <View style={styles.container}>
      {!capturedPhoto && (
        <TouchableOpacity
          style={AppStyles.button}
          onPress={() => setIsCaptureEnabled(true)}
        >
          <Text style={AppStyles.buttonText}>Capture a photo</Text>
        </TouchableOpacity>
      )}
      {capturedPhoto && (
        <>
          <View style={styles.previewContainer}>
            <Text style={styles.previewText}>Captured Photo:</Text>
            <ImageBackground
              source={{ uri: capturedPhoto.uri }}
              style={styles.photoPreview}
            >
              <Ionicons name="camera" size={48} color="blue" />
            </ImageBackground>
          </View>
          <TouchableOpacity onPress={sendPhoto} style={AppStyles.button}>
            <Text style={AppStyles.buttonText}>send photo</Text>
          </TouchableOpacity>
        </>
      )}

      <MyCamera
        isCaptureEnabled={isCaptureEnabled}
        onCapture={(photo) => {
          handlePhotoCapture(photo);
          setIsCaptureEnabled(false);
        }}
        onClose={() => setIsCaptureEnabled(false)}
      />
    </View>
  );
};

export default ParentComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  captureButton: {
    backgroundColor: "#333333",
    padding: 15,
    borderRadius: 8,
    marginVertical: 20,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
  },
  previewContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  previewText: {
    fontSize: 16,
    marginBottom: 10,
  },
  photoPreview: {
    width: 300,
    height: 300,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
