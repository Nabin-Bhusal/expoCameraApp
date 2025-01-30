import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import { Camera, CameraView } from "expo-camera";
import Ionicons from "@expo/vector-icons/Ionicons";
const MyVideoCamera = ({ isRecordingEnabled, onRecord, onClose }) => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasAudioPermission, setHasAudioPermission] = useState(null);
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    console.log("isRecordingEnabled:", isRecordingEnabled);
    if (isRecordingEnabled && !isCameraVisible) {
      openCamera();
    }
  }, [isRecordingEnabled]);

  const openCamera = async () => {
    const cameraStatus = await Camera.requestCameraPermissionsAsync();
    const audioStatus = await Camera.requestMicrophonePermissionsAsync();

    if (cameraStatus.status === "granted" && audioStatus.status === "granted") {
      setHasCameraPermission(true);
      setHasAudioPermission(true);
      setIsCameraVisible(true);
    } else {
      Alert.alert(
        "Permission Denied",
        "Camera and microphone access is required."
      );
      setHasCameraPermission(false);
      setHasAudioPermission(false);
    }
  };

  const closeCamera = () => {
    setIsCameraVisible(false);
    if (onClose && typeof onClose === "function") {
      onClose(video);
    }
  };

  const startRecording = async () => {
    if (cameraRef.current) {
      try {
        setIsRecording(true);
        const itsVideo = await cameraRef.current.recordAsync();
        console.log("ts", itsVideo);
        setIsRecording(false);
        setIsCameraVisible(false);
        if (itsVideo) {
          onClose(itsVideo);
        }

        if (onRecord && typeof onRecord === "function") {
          onRecord(itsVideo);
        }
      } catch (error) {
        console.error("Error recording video:", error);
        Alert.alert("Error", "An error occurred while recording.");
        setIsRecording(false);
      }
    }
  };

  const stopRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
    }
    console.log("VID", video);
    onClose(video);
  };

  if (hasCameraPermission === false || hasAudioPermission === false) {
    return (
      <View style={styles.center}>
        <Text>No access to camera or microphone.</Text>
      </View>
    );
  }

  if (isRecordingEnabled && !isCameraVisible) {
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
          <CameraView
            ref={cameraRef}
            style={{ flex: 4 }}
            ratio="16:9"
            mode="video"
          >
            <View style={styles.controls}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeCamera}
              >
                <Ionicons name="arrow-back-outline" size={18} color="blue" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.recordButton}
                onPress={isRecording ? stopRecording : startRecording}
              >
                <View
                  style={[
                    styles.innerRecordButton,
                    isRecording && styles.innerRecordButtonActive,
                  ]}
                />
              </TouchableOpacity>
            </View>
          </CameraView>
        </Modal>
      )}
    </View>
  );
};

export default MyVideoCamera;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    flex: 1,
  },
  controls: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  closeButton: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 5,
    alignSelf: "flex-start",
    borderRadius: 50,
  },
  recordButton: {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },
  innerRecordButton: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: "white",
  },
  innerRecordButtonActive: {
    backgroundColor: "darkred",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
