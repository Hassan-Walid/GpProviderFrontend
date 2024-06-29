import React, { useEffect } from "react";
import { StyleSheet, View, Dimensions, Text } from "react-native";
import LottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { height } = Dimensions.get("window");

const Splashscreen = ({ navigation }) => {
  useEffect(() => {
    const getCurrentUser = async () => {
      AsyncStorage.clear();

      const userId = await AsyncStorage.getItem("userId");
      const userType = await AsyncStorage.getItem("userRole");
      console.log(userId);
      console.log(userType);

      if (!userId && navigation) {
        const timer = setTimeout(() => {
          navigation.navigate("LanguageScreen");
        }, 5000);

        return () => clearTimeout(timer);
      } else if (userId && userType == "provider" && navigation)
        navigation.navigate("ProviderHomeScreen");
    };
    getCurrentUser();
  }, [navigation]);
  return (
    <View style={styles.container}>
      <View style={styles.animationContainer}>
        <LottieView
          source={require("../../assets/animations/welcomeColors.json")}
          autoPlay
          loop
          style={styles.animation}
        />
      </View>
      {/* <Text>Hello</Text> */}
      <View style={styles.animationContainer}>
        <LottieView
          source={require("../../assets/animations/tow.json")}
          autoPlay
          loop
          style={styles.animation}
        />
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
  },
  animationContainer: {
    width: "80%",
    alignItems: "center",
  },
  animation: {
    width: "100%",
    aspectRatio: 1,
  },
});

export default Splashscreen;
