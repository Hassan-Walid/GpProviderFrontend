import React from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormInput from "../../components/formInput";
import CustomButton from "@/components/CustomButton";
import { useTranslation } from 'react-i18next';
import i18n from '../../app/(tabs)/i18n';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage'



const ConsumerRegistrationScreen = ({navigation}) => {
  const { t } = useTranslation();

  const formSchema = z.object({
    email: z.string().email(t("emailValidation")),
    name: z.string().min(3, t("nameValidation")),
    password: z.string().min(8, t("passwordValidation")),
    contact_number: z.string().regex(/^(011|012|015|010)\d{8}$/, t("phoneValidation")),
    car_make: z.string(),
    model: z.string(),
    year: z.string(),
  });

  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data) => {
    axios.post("http://192.168.1.8:8000/api/user",data).then(async (res)=>{
      if(res.status == 200)
      {
        navigation.navigate("Home")
        let newUserId = res.data.newUser._id
      
      /// Storing The Registered user's id in Async Storage
      try{
          AsyncStorage.setItem("userId",newUserId);
          AsyncStorage.setItem("userRole","consumer");
      }
      catch(err){
        console.log(err);
      }
      }
    })
    .catch((err)=>{
      console.log(err);
    })
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.heading}>{t("register")}</Text>
        <View style={styles.imageContainer}>
          <Image source={require('../../assets/images/15.jpg')} style={styles.image} />
        </View>
        {i18n.language === 'en' && (
          <CustomButton
            title="ar"
            onPressHandler={() => i18n.changeLanguage('ar')}
          />
        )}
        {i18n.language === 'ar' && (
          <CustomButton
            title="en"
            onPressHandler={() => i18n.changeLanguage('en')}
          />
        )}
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
          placeholder={t("phone_number")}
          style={styles.input}
        />
        <FormInput
          control={control}
          name="car_make"
          placeholder={t("car_make")}
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
          placeholder={t("year")}
          style={styles.input}
        />
        <View style={styles.buttonContainer}>
          <CustomButton
            title={t('submit')}
            onPressHandler={handleSubmit(onSubmit)}
          />
        </View>
        <View style={styles.registerTxtContainer}>
          <Text style={styles.registerTxt}>
            {t("no_account")}
            <Text style={{ color: 'blue', marginHorizontal: 3 }}>
              {t("register_now")}
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
  heading: {
    // fontSize: 24,
    // fontWeight: 'bold',
    // marginBottom: 24,
    // color: '#333',
    marginBottom: 24,
    fontSize: 25,
    fontFamily: 'Oswald',
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
    alignItems: 'center',
  },
  registerTxtContainer: {
    marginVertical: 15,
  },
  registerTxt: {
    fontSize: 17,
  },
  image: {
    width: 300,
    height: 120,
    resizeMode: 'contain',
  },
});

export default ConsumerRegistrationScreen;
