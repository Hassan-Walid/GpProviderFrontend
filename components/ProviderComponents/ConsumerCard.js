import * as React from "react";
import { View, StyleSheet, Linking } from "react-native";
import { Avatar, Button, Card, Text } from "react-native-paper";
import CustomButton from "../CustomButton";

const LeftContent = (props) => <Avatar.Icon {...props} icon="account" />;

const ConsumerCard = ({
  confirmAccept,
  id,
  map,
  name,
  distance,
  carType,
  consumerId,
  consumerLocation,
  targetLocation,
  setIsRequestAccepted,
  setRequestInfo,
  setPendingRequests,
  serviceType,
}) => {
  let [showNavigateButton, setShowNavigateButton] = React.useState(false);

  let handleAccept = () => {
    setIsRequestAccepted(true);
    setPendingRequests((old) => {
      return old.filter((r) => {
        return r["consumerId"] === consumerId;
      });
    });
    ///Socket.emit("sdada")
    setShowNavigateButton(true);
    if (!targetLocation) {
      setRequestInfo({ consumerId, consumerLocation });
    } else {
      setRequestInfo({ consumerId, consumerLocation, targetLocation });
    }
    confirmAccept(consumerId, id);
  };

  let handleReject = () => {
    setPendingRequests((old) => {
      return old.filter((r) => {
        return r["consumerId"] !== consumerId;
      });
    });
  };

  let handleLink = () => {
    console.log(consumerLocation);
    const url = `https://www.google.com/maps/dir/?api=1&destination=${consumerLocation.latitude},${consumerLocation.longitude}`;
    Linking.openURL(url);
  };
  console.log("mappp", map);
  let focusOnMarker = () => {
    let latitude = +consumerLocation["latitude"];
    let longitude = +consumerLocation["longitude"];

    map.current.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      1000
    );
  };

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
              <View style={{ flexDirection: "row" }}>
                {serviceType ? (
                  serviceType.map((s, i) => {
                    return (
                      <Text variant="bodyMedium" style={styles.carType}>
                        {s}
                        {serviceType.length - 1 == i ? " " : ","}
                      </Text>
                    );
                  })
                ) : (
                  <Text variant="bodyMedium" style={styles.carType}>
                    Winch
                  </Text>
                )}
              </View>

              {/* <Text variant="bodyMedium" style={styles.carType}>
                {serviceType}
                {console.log("ser_type", serviceType)}
              </Text> */}

              {targetLocation && (
                <Text variant="bodyMedium" style={styles.carType}>
                  {targetLocation["name"]}
                </Text>
              )}
            </View>
          </View>
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <View style={styles.button}>
            {!showNavigateButton ? (
              <>
                <View style={{ width: "33%" }}>
                  <CustomButton
                    title={"Accept"}
                    onPressHandler={handleAccept}
                  ></CustomButton>
                </View>

                <View style={{ width: "33%" }}>
                  <CustomButton
                    title={"Skip"}
                    onPressHandler={handleReject}
                  ></CustomButton>
                </View>

                <View style={{ width: "33%" }}>
                  <CustomButton
                    title={"Get Marker"}
                    onPressHandler={focusOnMarker}
                  ></CustomButton>
                </View>
              </>
            ) : (
              <View style={{ width: "50%" }}>
                <CustomButton
                  title={"Get Location"}
                  onPressHandler={handleLink}
                ></CustomButton>
              </View>
            )}
          </View>
          {/* <Button title="Get Location" onPress={handleLink}></Button> */}
        </Card.Actions>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: "100%",
    padding: 10,
  },

  card: {
    // flexDirection: 'column',
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
    // padding: 2,
  },
  button: {
    flexDirection: "row",
    marginHorizontal: 4,
    justifyContent: "space-around",
    width: "100%",
  },
});

export default ConsumerCard;
