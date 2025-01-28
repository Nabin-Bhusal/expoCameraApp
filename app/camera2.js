import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import MyCamera from "../components/MyCamera";

const ParentComponent = () => {
  const [isCaptureEnabled, setIsCaptureEnabled] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);

  const handlePhotoCapture = (photo) => {
    setCapturedPhoto(photo); // Store the captured photo in the state
    // console.log("Photo captured:", photo);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.captureButton}
        onPress={() => setIsCaptureEnabled(true)}
      >
        <Text style={styles.buttonText}>Open Camera</Text>
      </TouchableOpacity>

      {capturedPhoto && (
        <View style={styles.previewContainer}>
          <Text style={styles.previewText}>Captured Photo:</Text>
          <Image
            source={{ uri: capturedPhoto.uri }}
            style={styles.photoPreview}
          />
        </View>
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
    marginBottom: 20,
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
    width: 200,
    height: 300,
    borderRadius: 10,
  },
});
