import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { MyStack } from "../../Navigations/StackNavigation.js";
import { useFonts } from "expo-font";
import LoadingScreen from "../../Screens/SplashScreens/loadingScreen.js";
const fonts = {
  Oswald: require("../../assets/fonts/static/Oswald-Bold.ttf"),
};

export default function HomeScreen() {
  useEffect(() => {
    // socket.emit("connected", { id: "1", type: "provider" });
  }, []);
  const [fontsLoaded, loadFonts] = useFonts(fonts);

  // const socket = io("http://192.168.1.5:8000");
  // const socket = io;

  // const socket = io; // Replace with your Socket.IO server URL

  if (fontsLoaded) {
    return (
      <>
        <MyStack></MyStack>
      </>
    );
  }

  return (
    <>
      {/* <MyTabs /> */}
      <LoadingScreen />
      {/* <Splashscreen /> */}
      {/* <MyStack ></MyStack> */}
      {/* <ProviderRegisterScreen navigation={null}></ProviderRegisterScreen> */}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    fontFamily: "Oswald",
  },
});
