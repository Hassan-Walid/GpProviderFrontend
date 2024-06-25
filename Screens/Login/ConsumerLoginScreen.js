import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Button,
  I18nManager,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormInput from "../../components/formInput.js";
import CustomButton from "@/components/CustomButton";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native-gesture-handler";

const ConsumerLoginScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;

  const formSchema = z.object({
    email: z.string().email(t("emailValidation")),
    password: z.string().min(8, t("passwordValidation")),
  });

  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      full_name: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data) => {
    Alert.alert("Successful", JSON.stringify(data));
    // navigation.navigate("Home");
    navigation.navigate("ProviderHomeScreen");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{t("Login")}</Text>
      <Image
        style={styles.LoginImage}
        source={require("../../assets/images/loginimg.jpeg")}
      ></Image>
      <FormInput
        control={control}
        name="email"
        placeholder={t("email")}
        style={[styles.input, { textAlign: isRTL ? "right" : "left" }]}
      />
      <FormInput
        control={control}
        name="password"
        placeholder={t("password")}
        secureTextEntry
        style={[styles.input, { textAlign: isRTL ? "right" : "left" }]}
      />
      <View style={styles.buttonContainer}>
        <CustomButton
          title={t("Login")}
          onPressHandler={handleSubmit(onSubmit)}
        />
      </View>
      <View style={styles.registerTxtContainer}>
        <Text style={styles.registerTxt}>
          {t("no_account")}?
          <TouchableOpacity
            onPress={() => navigation.navigate("ProviderRegScreen")}
          >
            <Text style={{ color: "blue", marginHorizontal: 3 }}>
              {t("register_now")}
            </Text>
          </TouchableOpacity>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
  },
  heading: {
    // fontSize: 24,
    // fontWeight: 'bold',
    marginBottom: 24,
    // color: '#333',
    fontSize: 25,
    fontFamily: "Oswald",
  },
  LoginImage: {
    width: 250,
    height: 200,
    resizeMode: "contain",
    marginBottom: 2,
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    marginTop: 16,
    width: "100%",
    borderRadius: 8,
    overflow: "hidden",
    alignItems: "center",
  },
  registerTxtContainer: {
    marginVertical: 15,
  },
  registerTxt: {
    fontSize: 17,
  },
});

export default ConsumerLoginScreen;
