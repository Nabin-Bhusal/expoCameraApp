import React, { useState } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { Audio } from "expo-av";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import Api from "../constants/Api";
import qs from "qs";
import request from "../config/RequestManager";

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

export default function AudioRecorderScreen() {
  const searchParams = useLocalSearchParams();
  console.log(searchParams);
  const [recording, setRecording] = useState(null);
  const [audioUri, setAudioUri] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);

  const startRecording = async () => {
    try {
      console.log("Requesting permissions...");
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Please allow audio recording permissions."
        );
        return;
      }

      console.log("Starting recording...");
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await recording.startAsync();
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording:", err);
    }
  };

  const stopRecording = async () => {
    console.log("Stopping recording...");
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log("Recording stopped and saved at", uri);
      setRecording(null);
      setAudioUri(uri);
    } catch (err) {
      console.error("Failed to stop recording:", err);
    }
  };

  const playAudio = async () => {
    if (!audioUri) {
      Alert.alert("No audio", "Please record an audio first.");
      return;
    }

    try {
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }

      console.log("Playing audio:", audioUri);
      const { sound: playbackSound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: true }
      );

      setSound(playbackSound);
      setIsPlaying(true);

      playbackSound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isPlaying) {
          setIsPlaying(false);
        }
      });
    } catch (err) {
      console.error("Failed to play audio:", err);
    }
  };

  const uploadAudio = async () => {
    if (!audioUri) {
      Alert.alert("No audio", "Please record an audio first.");
      return;
    }

    try {
      console.log("Uploading audio...");
      const fileUri = audioUri;
      const fileName = fileUri.split("/").pop();
      const fileType = "audio/m4a";

      const formData = new FormData();
      formData.append("files", {
        uri: fileUri,
        name: fileName,
        type: fileType,
      });

      // return

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
      if (response?.data?.url[0]) {
        let data = qs.stringify({
          image_video: searchParams.imageUrl,
          gps_location: "string",
          any_user: "string",
          voice: response?.data?.url[0],
          incident_type: "animal",
          location: "Achham",
          is_acknowledged: true,
        });
        var finalResponse = await (await request())
          .post(Api.SendReport, data)
          .catch(function (error) {
            Alert.alert("Error Ocurred Contact Support");
          });
        console.log(finalResponse);
        if (finalResponse.data?.Code == 200) {
          console.log(finalResponse?.data);
          Alert.alert(finalResponse?.data?.Message);
        } else {
          Alert.alert(finalResponse.data?.Message);
        }
      } else {
        Alert.alert("Error Ocurred Contact Support");
      }
    } catch (err) {
      console.error("Failed to upload audio:", err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Audio Recorder</Text>

      <View style={styles.buttonsContainer}>
        {recording ? (
          <Button
            title="Stop Recording"
            onPress={stopRecording}
            color="#e63946"
          />
        ) : (
          <Button
            title="Start Recording"
            onPress={startRecording}
            color="#2a9d8f"
          />
        )}
      </View>

      <View style={styles.buttonsContainer}>
        <Button
          title={isPlaying ? "Playing..." : "Play Audio"}
          onPress={playAudio}
          disabled={isPlaying || !audioUri}
        />
      </View>

      <View style={styles.buttonsContainer}>
        <Button
          title="Upload Audio"
          onPress={uploadAudio}
          disabled={!audioUri}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  buttonsContainer: {
    marginVertical: 10,
    width: "100%",
  },
});
