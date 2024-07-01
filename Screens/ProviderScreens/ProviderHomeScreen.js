import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Linking,
  ScrollView,
  ImageBackground,
  Image,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import ConsumerCard from "../../components/ProviderComponents/ConsumerCard";
import SwitchStatus from "./../../components/ProviderComponents/SwitchStatus";
import { IconButton, ProgressBar } from "react-native-paper";
import io, { Socket } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { url } from "@/constants/url";
import LoadingScreen from "../SplashScreens/loadingScreen";
import CustomButton from "@/components/CustomButton";
import Icon from "react-native-vector-icons/Ionicons";
import { TouchableOpacity } from "react-native-gesture-handler";

const ProviderHomeScreen = ({ navigation, route }) => {
  const [approvalStatus, setApprovalStatus] = useState();
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const disableSwitch = approvalStatus === "approved" ? false : true;
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [socket, setSocket] = useState(null);
  const [id, setId] = useState(null);
  const [type, setType] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [isRequestAccepted, setIsRequestAccepted] = useState(false);
  const [requestInfo, setRequestInfo] = useState({});
  const [trackFlag, setTrackFlag] = useState(false);
  const [startPickUp, setStartPickUp] = useState(false);
  const [endProcess, setEndProcess] = useState(false);
  let intervalRef = useRef(null);
  let mapRef = useRef(null);

  let confirmAccept = (consumerId, providerId) => {
    socket.emit("RequestAccepted", { consumerId, userId: providerId });
  };

  useEffect(() => {
    AsyncStorage.getItem("userId").then((data) => {
      setId(data);
    });

    AsyncStorage.getItem("userRole").then((data) => {
      setType(data);
    });

    userLocation();

    return () => {
      if (socket && id && type) {
        socket.emit("disconnected", { id, type });
        socket.disconnect();
        setSocket(null);
      }
    };
  }, []);
  // console.log(route.params);

  useEffect(() => {
    if (id) {
      axios
        .post(url + "/api/serviceProvider/approvalStatus", {
          providerId: id,
        })
        .then((data) => {
          console.log(data.data);
          setApprovalStatus(data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [id]);
  useEffect(() => {
    if (isRequestAccepted) {
      intervalRef.current = setInterval(() => {
        console.log("tracked");

        userLocation();
        let { latitude, longitude } = mapRegion;
        console.log("latitude", latitude);
        console.log("longitude", longitude);

        if (trackFlag) {
          let { consumerId, consumerLocation, targetLocation } = requestInfo;
          let target = consumerLocation;

          if (startPickUp) {
            target = targetLocation;
          }

          if (socket) {
            socket.emit("PickUpTracking", {
              userId: id,
              targetId: consumerId,
              targetLocation: target,
              providerLiveLocation: { latitude, longitude },
              startPickUp,
            });
          } else {
            clearInterval(intervalRef.current);
          }
        } else {
          let { consumerId, consumerLocation } = requestInfo;

          if (socket) {
            socket.emit("Tracked", {
              userId: id,
              targetId: consumerId,
              targetLocation: consumerLocation,
              location: { latitude, longitude },
            });
          } else {
            clearInterval(intervalRef.current);
          }
        }
      }, 3000);
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [isRequestAccepted, mapRegion]);

  useEffect(() => {
    if (isSwitchOn) {
      // let newsocket = io("https://gp-backend-8p08.onrender.com/");
      let newsocket = io(url);

      newsocket.on("connect", () => {
        console.log("Connected to server");
        newsocket.emit("connected", { id, type });
      });

      // newsocket.on("notification", (data) => {
      //   console.log("message data : ", data);
      //   if (data.CancelMessage === "Cancel") {
      //     clearInterval(intervalRef.current);
      //   }
      // });
      // newsocket.on('notification', (notificationData) => {
      //   console.log("Notification from server");
      //   console.log(notificationData);
      // })

      newsocket.on(
        "GetLocation",
        ({ consumerId, providerId, availableProvidersLength }) => {
          newsocket.emit("Location", {
            consumerId,
            providerId,
            availableProvidersLength,
            location: mapRegion,
          });
        }
      );

      newsocket.on("disconnect", () => {
        console.log(`Disconnected from server`);
      });

      newsocket.on(
        "IncomingRequest",
        async ({ consumerId, consumerLocation, distance, serviceType }) => {
          console.log(
            "Incoming Request from " +
              consumerId +
              " at lat: " +
              consumerLocation +
              " distance: " +
              distance +
              " serviceType: " +
              serviceType
          );

          let incomingUser = await axios
            .get(`${url}/api/user/${consumerId}`)
            .then((res) => {
              return res.data.user;
            })
            .catch((e) => {
              console.log(e);
            });

          setPendingRequests((allRequests) => [
            ...allRequests,
            {
              consumerId,
              consumerLocation,
              distance,
              incomingUser,
              serviceType,
            },
          ]);
        }
      );

      newsocket.on(
        "IncomingPickUpRequest",
        async ({ consumerId, consumerLocation, distance, targetLocation }) => {
          console.log(
            "Incoming PickUp Request from " +
              consumerId +
              " at lat: " +
              consumerLocation +
              " distance: " +
              distance
          );

          let incomingUser = await axios
            .get(`${url}/api/user/${consumerId}`)
            .then((res) => {
              return res.data.user;
            })
            .catch((e) => {
              console.log(e);
            });

          setPendingRequests((allRequests) => [
            ...allRequests,
            {
              consumerId,
              consumerLocation,
              distance,
              incomingUser,
              targetLocation,
            },
          ]);
          setTrackFlag(true);
        }
      );

      newsocket.on("StartPickUp", () => {
        console.log("Start PickUp");
        setStartPickUp(true);
      });

      newsocket.on("PickUpFinished", () => {
        clearInterval(intervalRef.current);
        setIsRequestAccepted(false);
        setTrackFlag(false);
        // setRequestInfo({});
        setPendingRequests([]);
        setStartPickUp(false);
        setEndProcess(true);
      });

      newsocket.on("HasArrived", () => {
        clearInterval(intervalRef.current);
        setEndProcess(true);
        setIsRequestAccepted(false);
        // setRequestInfo({});
        setPendingRequests([]);
      });

      setSocket(newsocket);
    } else {
      if (socket) {
        socket.emit("disconnected", { id, type });
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [isSwitchOn]);

  const userLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status === "granted") {
      let location = await Location.getCurrentPositionAsync({
        enableHighAccuracy: true,
      });

      //   console.log("loc is" + location.coords.latitude);

      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  };

  const handleEndProcess = () => {
    console.log("end process handle ");
    setEndProcess(false);
    let consumerId = requestInfo["consumerId"];
    // console.log(consumerId);
    socket.emit("ServiceEnded", { providerId: id, consumerId });
    // console.log(requestInfo);
    setRequestInfo({});
  };

  return (
    <>
      <View style={styles.homeHeader}>
        <Text style={styles.text}>Hello, {route.params.name}</Text>

        <View style={{ flexDirection: "row" }}>
          <IconButton
            icon="earth"
            iconColor={"white"}
            size={30}
            onPress={() => {
              if (i18n.language === "en") {
                i18n.changeLanguage("ar");
              } else {
                i18n.changeLanguage("en");
              }
            }}
          />

          <IconButton
            icon="logout"
            iconColor={"white"}
            size={30}
            onPress={async () => {
              await AsyncStorage.clear();
              navigation.navigate("LoginScreen");
            }}
          />
        </View>

        {/* <Image
          style={styles.profilePicture}
          source={require("../../assets/images/person.jpg")}
        /> */}
      </View>

      {approvalStatus == "pending" && (
        <View style={styles.approvalContainer}>
          <Text style={styles.approvalText}>
            your documents is being checked
          </Text>
        </View>
      )}
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <SwitchStatus
          isSwitchOn={isSwitchOn}
          setIsSwitchOn={setIsSwitchOn}
          disableSwitch={disableSwitch}
        />
      </View>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          showsUserLocation={true}
          followsUserLocation={true}
          ref={mapRef}
          region={mapRegion}
        >
          <Marker coordinate={mapRegion} title="You"></Marker>

          {pendingRequests.map((r, i) => {
            let coordinate = r["consumerLocation"];
            let lat = +coordinate["latitude"];
            let long = +coordinate["longitude"];
            // pickup
            let latTarget;
            let longTarget;
            let coordinateTargetLocation;

            if (r["targetLocation"]) {
              coordinateTargetLocation = r["targetLocation"];
              latTarget = +coordinateTargetLocation["latitude"];
              longTarget = +coordinateTargetLocation["longitude"];
            }

            return (
              // <></>
              <>
                <Marker
                  key={i}
                  coordinate={{ latitude: lat, longitude: long }}
                  title={r["incomingUser"]["name"].toUpperCase()}
                ></Marker>
                {r["targetLocation"] && (
                  <Marker
                    coordinate={{ latitude: latTarget, longitude: longTarget }}
                    title="Target Location"
                  />
                )}
                {r["targetLocation"] && (
                  <Polyline
                    coordinates={[
                      { latitude: lat, longitude: long },
                      { latitude: latTarget, longitude: longTarget },
                    ]}
                    strokeColor="#FF0000"
                    strokeWidth={6}
                  />
                )}
              </>
            );
          })}
        </MapView>

        {isSwitchOn &&
        pendingRequests.length === 0 &&
        !startPickUp &&
        !endProcess ? (
          <View style={{ marginTop: 5, flex: 1 }}>
            <Text
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 20,
                margin: 3,
                fontStyle: "italic",
                color: "#3D3B3B",
              }}
            >
              Waiting For Requests...
            </Text>
            <LoadingScreen></LoadingScreen>
          </View>
        ) : (
          !endProcess &&
          !isSwitchOn && (
            <ImageBackground
              style={{
                flex: 1,
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
              source={require("../../assets/images/100.jpg")}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 20,
                  margin: 8,
                  fontStyle: "italic",
                  color: "rgba(151,151,151,255)",
                  position: "absolute",
                  top: "75%",
                }}
              >
                Enable Available To Receive Requests
              </Text>
            </ImageBackground>
          )
        )}

        {isSwitchOn && endProcess && (
          // <Button title="End Process" onPress={handleEndProcess}></Button>
          <View style={styles.alertBox}>
            <View style={styles.iconContainer}>
              <Icon name="checkmark" size={30} color="#fff" />
            </View>
            <Text style={styles.alertTitle}>Congratulations</Text>
            <Text style={styles.alertMessage}>
              You finished service successfully
            </Text>
            <View
              style={{
                width: "60%",
              }}
            >
              <CustomButton
                title={"End Service"}
                onPressHandler={handleEndProcess}
              ></CustomButton>
            </View>
          </View>
        )}

        {!startPickUp && pendingRequests.length > 0 ? (
          <View style={styles.consumersList}>
            {/* <ProgressBar progress={1}></ProgressBar> */}
            <ScrollView>
              {pendingRequests.map((r, i) => {
                return (
                  <>
                    <ConsumerCard
                      targetLocation={r["targetLocation"]}
                      key={r["consumerId"]}
                      consumerId={r["consumerId"]}
                      consumerLocation={r["consumerLocation"]}
                      name={r["incomingUser"]["name"].toUpperCase()}
                      serviceType={r.serviceType}
                      carType={
                        r["incomingUser"]["owned_cars"][0][
                          "make"
                        ].toUpperCase() +
                        " " +
                        r["incomingUser"]["owned_cars"][0][
                          "model"
                        ].toUpperCase()
                      }
                      distance={+r.distance.toFixed(2) + "KM"}
                      setIsRequestAccepted={setIsRequestAccepted}
                      setRequestInfo={setRequestInfo}
                      setPendingRequests={setPendingRequests}
                      map={mapRef}
                      id={id}
                      confirmAccept={confirmAccept}
                    />
                  </>
                );
              })}
            </ScrollView>
          </View>
        ) : (
          <Text></Text>
        )}

        {startPickUp && (
          <ImageBackground
            style={{
              flex: 1,
              width: "100%",
              marginTop: -15,
              // justifyContent: "center",
              alignItems: "center",
            }}
            source={require("../../assets/images/pickup.jpg")}
          >
            <Text
              style={{
                textAlign: "center",
                fontWeight: "bold",

                fontSize: 25,
                margin: 8,
                fontStyle: "italic",
                color: "rgba(151,151,151,255)",
                position: "absolute",
                top: 50,
              }}
            >
              In Pickup Process
            </Text>
          </ImageBackground>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  alertBox: {
    width: 300,
    padding: 20,
    backgroundColor: "rgb(251, 245, 247)",
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#9AB3CA",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  alertMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  doneButton: {
    width: "100%",
    padding: 10,
    backgroundColor: "#9AB3CA",
    borderRadius: 5,
    alignItems: "center",
  },
  doneButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  homeHeader: {
    height: 100,
    width: "100%",
    flexDirection: "row",
    backgroundColor: "#9AB3CA",
    borderBottomRightRadius: 50,
    justifyContent: "space-between",
    alignItems: "center",
    overflow: "hidden",
  },
  text: {
    margin: 8,
    color: "white",
    fontSize: 20,
    fontFamily: "Oswald",
  },
  approvalText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  mapContainer: {
    flex: 1,
    // justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "rgb(251, 245, 247)",
  },
  map: {
    width: "100%",
    height: "50%",
  },
  consumersList: {
    flex: 1,
    width: "100%",
    // marginTop: 10,
    // position: "absolute",
  },
  listContentContainer: {
    paddingBottom: 16,
  },
  customMarker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderColor: "#fff",
    borderWidth: 2,
  },
  originMarker: {
    backgroundColor: "blue",
  },
  approvalContainer: {
    backgroundColor: "red",
    width: "95%",
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    marginVertical: 10,
    marginHorizontal: "auto",
  },
});

export default ProviderHomeScreen;
