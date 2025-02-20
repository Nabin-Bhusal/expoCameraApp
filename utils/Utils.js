import axios from "axios";
import { Alert } from "react-native";
import * as Location from "expo-location";
export default Utils = {
  ApiRequestWithImage: async function (route, data, imageData) {
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
  },
  GetLocation: async function GetLocation() {
    try {
      const startTime = Date.now();
      let location = await Location.getCurrentPositionAsync();
      const elapsedTime = Date.now() - startTime;
      console.log("Time taken to fetch location:", elapsedTime, "ms");
      if (location != null) {
        return {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        };
      }
    } catch (error) {
      return { errorMessage: "Unable to give location " + error };
      // ToastMessage.Long("Unable to give location " + error);
    }
  },
};
