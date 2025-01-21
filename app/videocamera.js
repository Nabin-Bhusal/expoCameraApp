import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Button,
} from "react-native";
import { Camera, CameraView } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import axios from "axios";

const VideoCamera = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasAudioPermission, setHasAudioPermission] = useState(null);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] =
    useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [videoUri, setVideoUri] = useState(null);
  const cameraRef = useRef(null);

  // Request permissions on component mount
  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      const audioStatus = await Camera.requestMicrophonePermissionsAsync();
      const mediaLibraryStatus = await MediaLibrary.requestPermissionsAsync();

      setHasCameraPermission(cameraStatus.status === "granted");
      setHasAudioPermission(audioStatus.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryStatus.status === "granted");
    })();
  }, []);

  const recordVideo = async () => {
    if (cameraRef.current) {
      try {
        setIsRecording(true);
        const video = await cameraRef.current.recordAsync();
        setVideoUri(video.uri);
        setIsRecording(false);
        Alert.alert("Success", "Video recorded successfully!");
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
  };

  const uploadVideo = async () => {
    if (!videoUri) {
      Alert.alert("No Video", "Please record a video before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("files", {
      uri: videoUri,
      name: "video.mp4",
      type: "video/mp4",
    });

    try {
      console.log("pppp");

      const response = await axios.post(
        "https://fs.dev.nicnepal.org/file/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            key: "fd70a6c233162f30dedf48b131a319a02c60a17117e420907538eff6f30b3fc2",
          },
        }
      );
      console.log("pp", response.body);
      if (response.ok) {
        Alert.alert("Success", "Video uploaded successfully!");
      } else {
        console.log(response.data);
        Alert.alert("Error", `Failed to upload video: ${response.status}`);
      }
    } catch (error) {
      console.error("Upload error:", error);

      // Log detailed error information
      if (error.response) {
        // The request was made and the server responded with a status code outside the range of 2xx
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Request data:", error.request);
      } else {
        // Something happened in setting up the request that triggered an error
        console.error("Error message:", error.message);
      }
      Alert.alert(
        "Error",
        "An error occurred during upload. Check console for details."
      );
    }
  };

  if (
    hasCameraPermission === null ||
    hasAudioPermission === null ||
    hasMediaLibraryPermission === null
  ) {
    return <View />;
  }

  if (
    !hasCameraPermission ||
    !hasAudioPermission ||
    !hasMediaLibraryPermission
  ) {
    return (
      <View style={styles.center}>
        <Text>No access to camera, microphone, or media library.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        ref={cameraRef}
        style={{ flex: 4 }}
        ratio="16:9"
        mode="video"
        // type={Camera.Constants.Type.back}
      >
        <TouchableOpacity
          style={styles.recordButton}
          onPress={isRecording ? stopRecording : recordVideo}
        >
          <View
            style={[
              styles.innerCircle,
              isRecording && styles.innerCircleRecording,
            ]}
          />
        </TouchableOpacity>
      </CameraView>
      <View style={styles.actions}>
        <Button title="Upload Video" onPress={uploadVideo} />
        {videoUri && (
          <Text style={{ marginTop: 10 }}>Video saved at: {videoUri}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  recordButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },
  innerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
  },
  innerCircleRecording: {
    backgroundColor: "darkred",
  },
  actions: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default VideoCamera;
