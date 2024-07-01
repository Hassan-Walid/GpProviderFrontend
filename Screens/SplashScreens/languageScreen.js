import React from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import i18n from "@/app/(tabs)/i18n.js";

const LanguageScreen = ({ navigation }) => {
  return (
    <View style={styles.Container}>
      <View style={styles.ImageContainer}>
        <Image
          style={styles.image}
          source={require("../../assets/images/translate2.png")}
        ></Image>
      </View>
      <View style={styles.language}>
        <TouchableOpacity
          style={styles.English}
          onPress={() => {
            i18n.changeLanguage("en");
            navigation.navigate("LoginScreen");
          }}
        >
          <Text style={styles.text}>Hello</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.Arabic}
          onPress={() => {
            i18n.changeLanguage("ar");
            navigation.navigate("LoginScreen");
          }}
        >
          <Text>مرحبا</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    backgroundColor: "#FFFFFF",
    flex: 1,
    // justifyContent:"center"
  },
  ImageContainer: {
    width: "100%",
    height: 400,
    marginTop: "15%",
  },
  image: {
    width: "100%",
    height: 400,
    resizeMode: "contain",
  },
  language: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: "5%",
  },
  English: {
    width: 100,
    height: 100,
    elevation: 3,
    borderRadius: 50,
    backgroundColor: "rgb(169,220,217)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#FFF394",
  },
  Arabic: {
    width: 100,
    height: 100,
    elevation: 3,
    borderRadius: 50,
    backgroundColor: "rgb(169,220,217)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "pink",
  },
  text: {
    textAlign: "center",
    color: "#3D3B3B",
    fontSize: 22,
  },
});

export default LanguageScreen;
