import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { Audio } from "expo-av";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import Api from "../constants/Api";
import qs from "qs";
import request from "../config/RequestManager";
import Utils from "../utils/Utils";
import StoreHelper from "../redux/StoreHelper";
import * as Location from "expo-location";

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
  const router = useRouter();
  const [recording, setRecording] = useState(null);
  const [audioUri, setAudioUri] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const [location, setLocation] = useState();

  useEffect(() => {
    getLocation();
  }, []);

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

      const response = await axios.post(
        "https://fs.nicnepal.org/files/temp_fon/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            key: StoreHelper.get("apiKey"),
          },
        }
      );
      let url = response?.data?.url[0];
      console.log("url", url);
      if (url) {
        const data = {
          image_video: searchParams.imageUrl,
          gps_location: location ? location?.lat + "," + location?.lng : "0, 0",
          any_user: "string",
          voice: url,
          incident_type: "trade",
          location: "Achham",
          is_acknowledged: false,
        };
        var finalResponse = await Utils.ApiRequestPost(Api.SendReport, data);
        if (finalResponse?.data) {
          Alert.alert("success", "successfully uploaded");
          router.push("/");
        }
      } else {
        Alert.alert("Error Ocurred Contact Support");
      }
    } catch (err) {
      console.error("Failed to upload audio:", JSON.stringify(err));
    }
  };

  const getLocation = async () => {
    let locationResponse = await Location.requestForegroundPermissionsAsync();
    let { status } = await Location.getForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Location permission not granted");
      // props.navigation.navigate("PermissionScreen", { type: "location" });
      return;
    }

    let location = await Utils.GetLocation();
    console.log(location?.lat, location?.lng);
    setLocation(location);
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
