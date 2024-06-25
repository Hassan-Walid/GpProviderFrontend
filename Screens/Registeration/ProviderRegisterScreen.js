import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Picker } from "@react-native-picker/picker";
import FormInput from "../../components/formInput";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import CustomButton from "@/components/CustomButton";
import { useTranslation } from "react-i18next";
import i18n from "../../app/(tabs)/i18n";
import axios from "axios";
import { firebase } from "../../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Callout } from "react-native-maps";
const ProviderRegisterScreen = ({ navigation }) => {
  const { t } = useTranslation();

  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [photos, setPhotos] = useState([]);

  const formSchema = z.object({
    email: z.string().email(t("emailValidation")),
    name: z.string().min(3, t("nameValidation")),
    password: z.string().min(8, t("passwordValidation")),
    contact_number: z
      .string()
      .regex(/^(011|012|015|010)\d{8}$/, t("phoneValidation")),
    make: z.string(),
    model: z.string(),
    year: z.string(),
    location: z.string(),
    service_type: z.string().toLowerCase(),
    profile_pic: z.string(),
    license_plate:z.string()
  });

  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      email: "",
      name: "",
      password: "",
      contact_number: "",
      make: "",
      model: "",
      year: "",
      location: "",
      service_type: "",
      profile_pic: "",
      license_plate:""
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data) => {

    // Alert.alert("Successful", JSON.stringify(data));

    if (photos.length < 4) return;
    Alert.alert("Successful", ""+photos.length);


    await axios
      .post("http://192.168.1.2:8000/api/serviceProvider", data)
      .then(async (res) => {
        if (res.status === 200) {
          AsyncStorage.setItem("userId", res.data._id);
          AsyncStorage.setItem("userRole", "provider");
          navigation.navigate("ProviderHomeScreen");
          try {
            photos.forEach(async (photo) => {
              let imageUri = Object.values(photo)[0];
              let photoId = Object.keys(photo)[0];

              const { uri } = await FileSystem.getInfoAsync(imageUri);
              const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = () => {
                  resolve(xhr.response);
                };

                xhr.onerror = (e) => {
                  reject(new TypeError("network request failed"));
                };

                xhr.responseType = "blob";
                xhr.open("GET", uri, true);
                xhr.send(null);
              });

              const lastIndexOfDot = imageUri.lastIndexOf(".");
              const ext = imageUri.substring(lastIndexOfDot);

              const fileName = data.email.split(".")[0] + "_" + photoId + ext;
              const ref = firebase.storage().ref("/uploads").child(fileName);
              
              await ref.put(blob);
            });
          } catch (e) {
            console.log(e);
          }
        }
      })
      .catch((error) => {
        // Handle errors
        console.error("Request failed", error);
      });
      
  };
  console.log(photos[0]);
  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(status === "granted");
    })();
  }, []);

  const selectImage = async (field) => {
    if (hasGalleryPermission === false) {
      Alert.alert("No Access to Internal Storage");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhotos((photos) => [...photos, { [field]: result.assets[0].uri }]);
    }
  };
  
  
  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.heading}>{t("Register")}</Text>
        <View style={styles.imageContainer}>
          <Image
            source={require("../../assets/images/23.jpg")}
            style={styles.image}
          ></Image>
        </View>
        <FormInput
          control={control}
          name="name"
          placeholder={t("name")}
          style={styles.input}
        />
        <FormInput
          control={control}
          name="email"
          placeholder={t("email")}
          style={styles.input}
        />
        <FormInput
          control={control}
          name="password"
          placeholder={t("password")}
          secureTextEntry
          style={styles.input}
        />
        <FormInput
          control={control}
          name="contact_number"
          placeholder={t("phone number")}
          style={styles.input}
        />
        <FormInput
          control={control}
          name="license_plate"
          placeholder={t("license plate")}
          style={styles.input}
        />
        <FormInput
          control={control}
          name="make"
          placeholder={t("car make")}
          style={styles.input}
        />
        <FormInput
          control={control}
          name="model"
          placeholder={t("model")}
          style={styles.input}
        />
        <FormInput
          control={control}
          name="year"
          keyboardType="number-pad"
          placeholder={t("year")}
          style={styles.input}
        />
        <Controller
          control={control}
          name="service_type"
          render={({ field: { value, onChange } }) => (
            <View style={styles.inputList}>
              <Picker
                selectedValue={value}
                onValueChange={(itemValue) => onChange(itemValue)}
              >
                <Picker.Item
                  label={t("Select Service Type")}
                  style={{ color: "gray" }}
                  value=""
                />
                <Picker.Item label={t("Pick Up")} value="pickup" />
                <Picker.Item label={t("Repair")} value="repair" />
                <Picker.Item
                  label={t("Pick Up & Repair")}
                  value="pickup and repair"
                />
              </Picker>
            </View>
          )}
        />
        {[
          "car_licence_pic",
          "driver_licence_pic",
          "national_id_pic",
          "profile_pic",
        ].map((field,index) => (
          <Controller
            key={field}
            control={control}
            name={field}
            render={({ field: { value } }) => (
              <View style={styles.imagePickerContainer}>
                <TouchableOpacity
                  onPress={() => selectImage(field)}
                  style={styles.imagePicker}
                >
                  <Text style={styles.imagePickerText}>
                    Select {t(field.replace(/_/g, " "))}
                  </Text>
                </TouchableOpacity>
                {photos[index]&&<Image source={{uri: photos[index][field]}} style={{width:100,height:70,borderRadius:15}}></Image>}
                {console.log(photos[index])}

              </View>
            )}
          />
        ))}
        
        <View style={styles.buttonContainer}>
          <CustomButton
            title={t("Submit")}
            onPressHandler={handleSubmit(onSubmit)}
          ></CustomButton>
        </View>
        <View style={styles.registerTxtContainer}>
          <Text style={styles.registerTxt}>
            {t("have_account")}?{" "}
            <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
              <Text style={{ color: "blue", marginHorizontal: 3 }}>
                {t("Login")}
              </Text>
            </TouchableOpacity>
          </Text>
        </View>
      </View>
    </ScrollView>
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
    // fontWeight: "bold",
    // marginBottom: 24,
    // color: "#333",
    marginBottom: 24,
    fontSize: 25,
    fontFamily: "Oswald",
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
  inputList: {
    width: "100%",
    height: 60,
    marginBottom: 16,
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    backgroundColor: "#fff",
  },
  imagePickerContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 16,
    display:"flex",
    flexDirection:"row",
    justifyContent:"space-between"
  },
  imagePicker: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#6200ee",
    alignItems: "center",
    width:170
  },
  imagePickerText: {
    color: "#fff",
  },
  image: {
    width: 300,
    height: 170,
    resizeMode: "contain",
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

export default ProviderRegisterScreen;
