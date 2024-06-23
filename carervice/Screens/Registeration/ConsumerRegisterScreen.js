import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Button, ScrollView, StyleSheet, Text, View } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormInput from "../../components/formInput";


const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
    name: z.string().min(3, " Name must be at least 3 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    contact_number: z.string().regex(/^(011|012|015|010)\d{8}$/, " Invalid Phone Number "),
    car_make:z.string(),
    model:z.string(),
    year:z.number(),
    location:z.string(),
  
  });

const ConsumerLoginScreen = () => {
  const { control, handleSubmit } =
    useForm (
    {
      defaultValues: {
        email: "",
        name: "",
        password: "",
      },
      resolver: zodResolver(formSchema),
    });

  const onSubmit = (data) => {
    Alert.alert("Successful", JSON.stringify(data));
  };

  return (
    <ScrollView>
    <View style={styles.container}>
      <Text style={styles.heading}>Login</Text>
      <FormInput
        control={control}
        name="name"
        placeholder="name"
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
        placeholder="Year"
        style={styles.input}
      />
      <View style={styles.buttonContainer}>
        <Button
          title="Submit"
          onPress={handleSubmit(onSubmit)}
          color="#6200ee"
        />
      </View>
      <View style={styles.registerTxtContainer}>
        <Text style={styles.registerTxt}>Don't have an account?  <Text style={{color: 'blue', marginHorizontal: 3}}>Register Now</Text></Text>
      </View>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f5f5f5',
      },
      heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        color: '#333',
      },
      input: {
        width: '100%',
        padding: 12,
        marginBottom: 16,
        borderRadius: 8,
        borderColor: '#ccc',
        borderWidth: 1,
        backgroundColor: '#fff',
      },
      buttonContainer: {
        marginTop: 16,
        width: '100%',
        borderRadius: 8,
        overflow: 'hidden',
      },
      registerTxtContainer: {
        marginVertical: 15
      },
      registerTxt: {
        fontSize: 17,

      }
});

export default ConsumerLoginScreen;
