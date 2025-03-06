import React, { useRef, useState, useEffect } from "react";
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
import qs from "qs";
import request from "../config/RequestManager";
import { useRouter } from "expo-router";
import Utils from "../utils/Utils";
import Api from "../constants/Api";
import * as Location from "expo-location";

const ParentComponent = () => {
  const router = useRouter();
  const [isRecordingEnabled, setIsRecordingEnabled] = useState(true);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const videoRef = useRef(null);
  const [status, setStatus] = useState({});
  const [location, setLocation] = useState();

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    let locationResponse = await Location.requestForegroundPermissionsAsync();
    let { status } = await Location.getForegroundPermissionsAsync();

    if (status !== "granted") {
      console.log("Location permission not granted");
      return;
    }

    let location = await Utils.GetLocation();
    console.log(location?.lat, location?.lng);
    setLocation(location);
  };

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
      let url = response?.data?.url[0];
      const data = {
        image_video: url,
        gps_location: location ? location?.lat + "," + location?.lng : "0, 0",
        any_user: "string",
        incident_type: "trade",
        location: "Achham",
        is_acknowledged: false,
      };
      let finalResponse = await Utils.ApiRequestPost(Api.SendReport, data);
      if (finalResponse?.data) {
        Alert.alert("success", "successfully uploaded");
        router.push("/");
      }
      // console.log("url: ", url);
      // console.log("Location ", location);
      // if (url) {
      //   const data = {
      //     image_video: url,
      //     gps_location: location ? location?.lat + "," + location?.lng : "0, 0",
      //     any_user: "string",
      //     incident_type: "animal",
      //     location: "Achham",
      //     is_acknowledged: false,
      //   };
      //   console.log(Api.SendReport);
      //   var finalResponse = await (await request())
      //     .post(Api.SendReport, data)
      //     .catch(function (error) {
      //       Alert.alert("Error Ocurred Contact Support !");
      //       console.log(JSON.stringify(error));
      //     });
      //   // console.log(finalResponse);
      //   if (finalResponse.data?.Code == 200) {
      //     Alert.alert("video successfully sent");
      //   } else {
      //     Alert.alert("video successfully sent");
      //     router.push("/");
      //   }
      // } else {
      //   Alert.alert("Error Ocurred Contact Support");
      // }
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
