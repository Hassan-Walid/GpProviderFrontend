import React from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import ConsumerLogin from "../../Screens/ConsumerLoginScreen.js";
import ConsumerRegister from "../../Screens/Registeration/ConsumerRegisterScreen.js";
import ProviderRegister from "../../Screens/Registeration/ProviderRegisterScreen.js";

export default function HomeScreen() {
  return (
    <>
      <ProviderRegister />
    </>
  );
}

const styles = StyleSheet.create({});
