import React, { useState } from "react";
import { View, Button, Text, StyleSheet, Alert } from "react-native";
import MyVideoCamera from "../components/MyVideoCamera";

const ParentComponent = () => {
  const [isRecordingEnabled, setIsRecordingEnabled] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState(null);

  const handleCapture = (video) => {
    setRecordedVideo(video);
    Alert.alert("Success", "Video recorded successfully!");
  };

  const handleClose = () => {
    setIsRecordingEnabled(false);
  };

  return (
    <View style={styles.container}>
      <Button
        title="Start Recording"
        onPress={() => setIsRecordingEnabled(true)}
      />

      {recordedVideo && (
        <View style={styles.previewContainer}>
          <Text>Video URI: {recordedVideo.uri}</Text>
        </View>
      )}

      <MyVideoCamera
        isCaptureEnabled={isRecordingEnabled}
        onCapture={handleCapture}
        onClose={handleClose}
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
  },
  previewContainer: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
});
