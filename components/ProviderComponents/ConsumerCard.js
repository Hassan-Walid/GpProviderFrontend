import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Avatar, Button, Card, Text } from "react-native-paper";
import CustomButton from "../CustomButton";

const LeftContent = (props) => <Avatar.Icon {...props} icon="account" />;

const ConsumerCard = ({ name, distance, carType, consumerId, consumerLocation,  setIsRequestAccepted, setRequestInfo, setPendingRequests }) => {
  
  let handleAccept = () => {
    setIsRequestAccepted(true);
    setPendingRequests([]);
    setRequestInfo({consumerId, consumerLocation})
  }

  return (
    <View style={styles.cardContainer}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.row}>
            <Avatar.Icon icon="account" size={48} style={styles.avatar} />
            <View style={styles.textContainer}>
              <Text variant="titleLarge" style={styles.title}>
                {name}
              </Text>
              <Text variant="bodyMedium" style={styles.subtitle}>
                {distance}
              </Text>
              <Text variant="bodyMedium" style={styles.carType}>
                {carType}
              </Text>
            </View>
          </View>
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <View style={styles.button}>
            <View style={{ width: "40%" }}>
              <CustomButton
                title={"Accept"}
                onPressHandler={handleAccept}
              ></CustomButton>
            </View>
            <View style={{ width: "40%" }}>
              <CustomButton
                title={"Skip"}
                onPressHandler={() => { }}
              ></CustomButton>
            </View>
          </View>
        </Card.Actions>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: "100%",
    padding: 10,
  },

  card: {
    borderRadius: 8,
    elevation: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    // marginBottom: 10,
  },
  avatar: {
    marginRight: 16,
    // backgroundColor:'lightskyblue',
    backgroundColor: "#587FA7",
    // backgroundColor:'dodgerblue',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    marginBottom: 1,
    // fontFamily: 'Oswald',
    fontSize: 18,
  },
  subtitle: {
    color: "#6e6e6e",
  },
  carType: {
    marginTop: 2,
    // fontFamily: 'Oswald',
  },
  actions: {
    // justifyContent: "flex-end",
    padding: 2,
  },
  button: {
    flexDirection: "row",
    marginHorizontal: 4,
    justifyContent: "space-around",
    width: "100%",
  },
});

export default ConsumerCard;
