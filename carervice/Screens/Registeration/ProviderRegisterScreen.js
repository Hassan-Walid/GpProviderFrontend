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
import * as ImagePicker from 'expo-image-picker';

const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  name: z.string().min(3, "Name must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  contact_number: z
    .string()
    .regex(/^(011|012|015|010)\d{8}$/, "Invalid Phone Number"),
  car_make: z.string(),
  model: z.string(),
  year: z.number(),
  location: z.string(),
  service_type: z.string(),
  car_licence_pic: z.string().optional(),
  driver_licence_pic: z.string().optional(),
  national_id_pic: z.string().optional(),
  profile_pic: z.string().optional()
});

const ProviderRegisterScreen = () => {
  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      email: "",
      name: "",
      password: "",
      contact_number: "",
      car_make: "",
      model: "",
      year: "",
      location: "",
      service_type: "",
      car_licence_pic: "",
      driver_licence_pic: "",
      national_id_pic: "",
      profile_pic: ""
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data) => {
    Alert.alert("Successful", JSON.stringify(data));
  };

  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(status === 'granted');
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
      quality: 1
    });

    if (!result.canceled) {
      setValue(field, result.assets[0].uri);
    }

    console.log(result.assets[0].uri);
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.heading}>Register</Text>
        <FormInput
          control={control}
          name="name"
          placeholder="Name"
          style={styles.input}
        />
        <FormInput
          control={control}
          name="email"
          placeholder="Email"
          style={styles.input}
        />
        <FormInput
          control={control}
          name="password"
          placeholder="Password"
          secureTextEntry
          style={styles.input}
        />
        <FormInput
          control={control}
          name="contact_number"
          placeholder="Contact Number"
          style={styles.input}
        />
        <FormInput
          control={control}
          name="car_make"
          placeholder="Car Make"
          style={styles.input}
        />
        <FormInput
          control={control}
          name="model"
          placeholder="Model"
          style={styles.input}
        />
        <FormInput
          control={control}
          name="year"
          keyboardType="number-pad"
          placeholder="Year"
          style={styles.input}
        />
        <FormInput
          control={control}
          name="location"
          placeholder="Location"
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
                  label="Select Service Type"
                  style={{ color: "gray" }}
                  value=""
                />
                <Picker.Item label="Pick Up" value="pick_up" />
                <Picker.Item label="Repair" value="repair" />
                <Picker.Item label="Consultation" value="consult" />
              </Picker>
            </View>
          )}
        />
        {["car_licence_pic", "driver_licence_pic", "national_id_pic", "profile_pic"].map((field) => (
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
                    Select {field.replace(/_/g, " ")}
                  </Text>
                </TouchableOpacity>
                {value && <Image source={{uri: value}} style={styles.image} />}
              </View>
            )}
          />
        ))}
        <View style={styles.buttonContainer}>
          <Button
            title="Submit"
            onPress={handleSubmit(onSubmit)}
            color="#6200ee"
          />
        </View>
        <View style={styles.registerTxtContainer}>
          <Text style={styles.registerTxt}>
            Don't have an account?{" "}
            <Text style={{ color: "blue", marginHorizontal: 3 }}>
              Register Now
            </Text>
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
    backgroundColor: "#f5f5f5",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#333",
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
  },
  imagePicker: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#6200ee",
    alignItems: "center",
  },
  imagePickerText: {
    color: "#fff",
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
  },
  buttonContainer: {
    marginTop: 16,
    width: "100%",
    borderRadius: 8,
    overflow: "hidden",
  },
  registerTxtContainer: {
    marginVertical: 15,
  },
  registerTxt: {
    fontSize: 17,
  },
});

export default ProviderRegisterScreen;
