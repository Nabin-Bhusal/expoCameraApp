import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ImageBackground,
  Alert,
} from "react-native";
import { Camera, CameraView } from "expo-camera";

const MyCamera = ({ isCaptureEnabled, onCapture, onClose }) => {
  const cameraRef = useRef(null);
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [photo, setPhoto] = useState(null);

  const openCamera = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === "granted") {
      setIsCameraVisible(true);
    } else {
      Alert.alert("Permission Denied", "Camera access is required.");
    }
  };

  const closeCamera = () => {
    setIsCameraVisible(false);
    if (onClose && typeof onClose === "function") {
      onClose();
    }
  };

  const takePhoto = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true };
      const takenPhoto = await cameraRef.current.takePictureAsync(options);
      setPhoto(takenPhoto);
      setIsCameraVisible(false);
      if (onCapture && typeof onCapture === "function") {
        onCapture(takenPhoto);
      }
    }
  };

  if (isCaptureEnabled && !isCameraVisible) {
    openCamera();
  }

  return (
    <View style={styles.container}>
      {isCameraVisible && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={isCameraVisible}
        >
          <CameraView ref={cameraRef} style={styles.camera} ratio="16:9">
            <View style={styles.cameraControls}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeCamera}
              >
                <Text>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.captureButton}
                onPress={takePhoto}
              >
                <View style={styles.innerCaptureButton} />
              </TouchableOpacity>
            </View>
          </CameraView>
        </Modal>
      )}
    </View>
  );
};

export default MyCamera;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  closeButton: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 5,
  },
  captureButton: {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  innerCaptureButton: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: "#1a1a1a",
  },
});
