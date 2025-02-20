import {
  View,
  Text,
  Modal,
  KeyboardAvoidingView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

const WarningModal = ({
  isVisible,
  onConfirm,
  onCancel,
  text1,
  text2,
  confirmBox,
  warning,
  isLoading,
  view,
  loadingText,
  noCancel,
  containerStyle,
}) => {
  const [loading, setLoading] = useState(isLoading);
  const [loadingTexts, setLoadingTexts] = useState(loadingText);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    setLoadingTexts(loadingText);
  }, [loadingText]);
  return (
    <Modal
      isVisible={isVisible}
      animationType="slide"
      transparent={true}
      style={styles.modalContainer}
    >
      <View
        style={
          containerStyle
            ? containerStyle
            : {
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0,0,0,0.55)",
                opacity: 1,
              }
        }
      >
        <KeyboardAvoidingView
          keyboardShouldPersistTaps="always"
          style={styles.modalContainer}
        >
          <TouchableOpacity
            onPress={() => {
              if (noCancel) return;
              // onCancel();
            }}
          >
            <View
              style={{
                padding: 20,
                backgroundColor: "white",
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              }}
            >
              {!warning ? (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="arrow-forward" size={48} color="blue" />
                  {/* <SVG.tickMark height={40} width={40} fill={Colors.primary} /> */}
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="arrow-forward" size={48} color="#FFD21E" />
                </View>
              )}
              {text1 && <Text style={styles.confirmTextView}>{text1}</Text>}
              {text2 && (
                <Text
                  style={[styles.confirmText, { paddingTop: !text1 ? 12 : 0 }]}
                >
                  {text2}
                </Text>
              )}
            </View>

            {view ?? view}

            <View
              style={{
                backgroundColor: "white",
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                zIndex: 9998,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: noCancel ? "flex-end" : "space-between",
                }}
              >
                {!noCancel && (
                  <TouchableOpacity
                    style={{
                      borderColor: "gray",
                      borderWidth: 1,
                      justifyContent: "center",
                      borderRadius: 6,
                      alignItems: "center",
                      paddingHorizontal: 8,
                      backgroundColor: "white",
                      paddingVertical: 5,
                    }}
                    onPress={() => {
                      if (noCancel) return;
                      onCancel();
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <SVG.close height={10} width={10} fill={"gray"} />
                      <Text
                        style={{
                          fontFamily: "Medium",
                          fontSize: 16,
                          color: "gray",
                          marginLeft: 8,
                        }}
                      >
                        Cancel
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={{
                    borderColor: "gray",
                    justifyContent: "center",
                    borderRadius: 6,
                    alignItems: "center",
                    paddingHorizontal: 8,
                    backgroundColor: "blue",
                    paddingVertical: 5,
                  }}
                  onPress={onConfirm}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Ionicons name="arrow-forward" size={48} color="blue" />
                    <Text
                      style={{
                        fontFamily: "Medium",
                        fontSize: 16,
                        color: "white",
                        marginLeft: 8,
                      }}
                    >
                      Confirm
                    </Text>
                  </View>
                  <ActivityIndicator
                    animating={loading}
                    color="#ffa500"
                    style={styles.activityIndicator}
                  ></ActivityIndicator>
                </TouchableOpacity>
              </View>
              {loadingTexts && (
                <View
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
                  <Text style={{ color: "red" }}>{loadingTexts}</Text>
                  <ActivityIndicator
                    animating={loading}
                    color={"red"}
                  ></ActivityIndicator>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default WarningModal;

const styles = StyleSheet.create({
  modalContainer: {
    // flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
    paddingHorizontal: 10,
  },
  confirmTextView: {
    // color: "red",
    fontSize: 18,
    textAlign: "center",
    fontFamily: "Bold",
    marginBottom: 8,
  },
  confirmText: {
    // color: "red",
    fontSize: 16,
    textAlign: "justify",
    fontFamily: "Medium",
    color: "gray",
    marginTop: -8,
  },
  buttonTitle: {
    fontFamily: "Medium",
    fontSize: 16,
    color: "#fff",
  },
  activityIndicator: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "flex-end",
    alignSelf: "flex-end",
  },
});

const CloseButton = () => {
  return (
    <View
      style={{
        height: 20,
        width: 20,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: "gray",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <SVG.close height={10} width={10} fill={"gray"} />
      {/* <Text>A</Text> */}
    </View>
  );
};
const IconText = ({ icon, text, containerStyle }) => {
  return (
    <View
      style={{
        height: 20,
        width: 20,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: "gray",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <SVG.tick height={10} width={10} fill={"gray"} />
    </View>
  );
};
