import React from "react";
import {Image, StyleSheet, View } from "react-native";
import CustomButton from "../../components/CustomButton";
import { useTranslation } from "react-i18next";

const UserTypeScreen = ({ navigation }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/splashscreen.jpg")}
        style={styles.image}
      />

      <View style={styles.buttonsContainer}>
        <View style={styles.btn}>
          <CustomButton
            title={t("Register as Consumer")}
            onPressHandler={() => {
              navigation.navigate("ConsumerRegScreen");
            }}
          ></CustomButton>
        </View>
        <View style={styles.btn}>
          <CustomButton
            title={t("Register  as  Provider")}
            onPressHandler={() => {
              navigation.navigate("ProviderRegScreen");
            }}
          ></CustomButton>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(251, 245, 247)",
    padding: 20,
  },
  image: {
    width: "90%",
    height: "30%",
    resizeMode: "contain",
    paddingVertical: "50%",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent:'space-evenly',
  },
  btn: {
    // flex: 1,
    marginHorizontal: 10,
    width: "50%",
    // backgroundColor: "red"
  },
  tow: {
    // height:300,
    width: "100%",
    aspectRatio: 1,
    flexShrink: 1,
  },
});

export default UserTypeScreen;
