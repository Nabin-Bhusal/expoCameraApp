import React, { useRef, useState } from "react";
import {
  View,
  Button,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import MyVideoCamera from "../components/MyVideoCamera";
import AppStyles from "../styles/AppStyles";
import axios from "axios";

const ParentComponent = () => {
  const [isRecordingEnabled, setIsRecordingEnabled] = useState(true);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const videoRef = useRef(null);
  const [status, setStatus] = useState({});

  const handleCapture = (video) => {
    // console.log(video);
    // setRecordedVideo(video);
    // Alert.alert("Success", "Video recorded successfully!");
  };

  const handleClose = (video) => {
    if (video) {
      setRecordedVideo(video);
    }
    setIsRecordingEnabled(false);
  };

  const uploadVideo = async () => {
    if (!recordedVideo) {
      Alert.alert("No Video", "Please record a video before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("files", {
      uri: recordedVideo.uri,
      name: "video.mp4",
      type: "video/mp4",
    });

    try {
      const response = await axios.post(
        "https://fs.nicnepal.org/files/temp_fon/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            key: "8623a0c8244bcdd6dd7ab48c8cef6c8546a38367839f0d00183c298bbfbc89d6",
          },
        }
      );
      Alert.alert("Response", response.data.url[0]);
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

  return (
    <View style={styles.container}>
      {!recordedVideo && (
        <TouchableOpacity
          onPress={() => setIsRecordingEnabled(true)}
          style={AppStyles.button}
        >
          <Text style={AppStyles.buttonText}>start recording</Text>
        </TouchableOpacity>
      )}

      {recordedVideo && (
        <Video
          ref={videoRef}
          style={styles.videoPlayer}
          source={{ uri: recordedVideo.uri }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping
          onPlaybackStatusUpdate={(status) => setStatus(() => status)}
        />
      )}

      {recordedVideo && (
        <>
          <TouchableOpacity
            onPress={() =>
              status.isPlaying
                ? videoRef.current.pauseAsync()
                : videoRef.current.playAsync()
            }
            style={AppStyles.button}
          >
            <Text style={AppStyles.buttonText}>
              {status.isPlaying ? "Pause" : "Play"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => uploadVideo()}
            style={[AppStyles.button, { marginTop: 10 }]}
          >
            <Text style={AppStyles.buttonText}>Upload Video</Text>
          </TouchableOpacity>
        </>
      )}

      {recordedVideo && (
        <View style={styles.previewContainer}>
          <Text>Video URI: {recordedVideo.uri}</Text>
        </View>
      )}

      {isRecordingEnabled && (
        <MyVideoCamera
          isRecordingEnabled={isRecordingEnabled}
          onCapture={handleCapture}
          onClose={handleClose}
        />
      )}
    </View>
  );
};

export default ParentComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 15,
  },
  previewContainer: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  videoPlayer: {
    flex: 5,
    width: "100%",
    height: "100%",
  },
});
