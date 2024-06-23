import React from "react";
import { StyleSheet, View, Image, TextInput } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome"; // Example icon library
import CustomButton from "@/components/CustomButton";
const Profile = () => {
  return (
    <View style={styles.profile}>
      <View style={styles.header}>{/* Header content */}</View>
      <View style={styles.imageContainer}>
        <Image
          style={styles.img}
          source={require("../../assets/images/avatar.png")}
        />
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <Icon name="user" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Anna Avetisyan"
            placeholderTextColor="#666"
            
          />
        </View>
        <View style={styles.inputWrapper}>
          <Icon name="envelope" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="info@aplusdesign.co"
            placeholderTextColor="#666"
            keyboardType="email-address"
          />
        </View>
        <View style={styles.inputWrapper}>
          <Icon name="phone" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="818 123 4567"
            placeholderTextColor="#666"
            keyboardType="phone-pad"
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton title={"Save"} onPressHandler={() => {}}></CustomButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profile: {
    flex: 1,
  },
  header: {
    backgroundColor: "#9AB3CA",
    height: 200,
    borderBottomLeftRadius: 90,
    borderBottomRightRadius: 90,
    overflow: "hidden",
    position: "relative",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  imageContainer: {
    position: "absolute",
    top: 130,
    width: "100%",
    alignItems: "center",
    
  },
  img: {
    width: 120,
    height: 120,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: "white",
    backgroundColor:'white',
    
  },
  inputContainer: {
    flex: 1,
    // justifyContent:"space-around",
    marginVertical: 80,
    paddingHorizontal: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
    color: "#666",
  },
  icon: {
    marginRight: 10,
  },
  buttonContainer: {
    marginTop: 16,
    width: "100%",
    borderRadius: 8,
    overflow: "hidden",
    alignItems: "center",
  },
});

export default Profile;
