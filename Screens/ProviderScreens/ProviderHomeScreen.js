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
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import ConsumerCard from "../../components/ProviderComponents/ConsumerCard";
import SwitchStatus from "./../../components/ProviderComponents/SwitchStatus";
import { ProgressBar } from "react-native-paper";
import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { url } from "@/constants/url";

const ProviderHomeScreen = ({}) => {
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

  useEffect(() => {
    if (id) {
      axios
        .post("http://192.168.1.2:8000/api/serviceProvider/approvalStatus", {
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

        if (trackFlag) {
          let { consumerId, consumerLocation, targetLocation } = requestInfo;
          let target = consumerLocation;

          if (startPickUp) {
            target = targetLocation;
          }

          if (socket) {
            socket.emit("PickUpTracking", {
              userId: providerId,
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
        async ({ consumerId, consumerLocation, distance }) => {
          console.log(
            "Incoming Request from " +
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
            { consumerId, consumerLocation, distance, incomingUser },
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
        setStartPickUp(true);
      });

      newsocket.on("PickUpFinished", () => {
        clearInterval(intervalRef.current);
        setIsRequestAccepted(false);
        setTrackFlag(false);
        setRequestInfo({});
        setPendingRequests([]);
      });

      newsocket.on("HasArrived", () => {
        clearInterval(intervalRef.current);
        setIsRequestAccepted(false);
        setRequestInfo({});
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

  // const origin = { latitude: 37.78825, longitude: -122.4324 };
  // const destination = { latitude: 40.79855, longitude: -100.4324 };
  // const region = {
  //   latitude: 37.78825,
  //   longitude: -122.4324,
  //   latitudeDelta: 0.0922,
  //   longitudeDelta: 0.0421,
  // };

  return (
    <>
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

            return (
              // <></>
              <Marker
                key={i}
                coordinate={{ latitude: lat, longitude: long }}
                title={r["incomingUser"]["name"].toUpperCase()}
              >
                <View style={[styles.customMarker, styles.originMarker]}></View>
              </Marker>
            );
          })}
        </MapView>

        {isSwitchOn ? (
          pendingRequests.length === 0 && <Text>Waiting For Requests...</Text>
        ) : (
          <Text>Not Available For Request</Text>
        )}

        {pendingRequests.length > 0 ? (
          <View style={styles.consumersList}>
            {/* <ProgressBar progress={1}></ProgressBar> */}
            <ScrollView>
              {pendingRequests.map((r, i) => {
                return (
                  <>
                    <ConsumerCard
                      key={r["consumerId"]}
                      consumerId={r["consumerId"]}
                      consumerLocation={r["consumerLocation"]}
                      name={r["incomingUser"]["name"].toUpperCase()}
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
      </View>
    </>
  );
};

const styles = StyleSheet.create({
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
  },
  map: {
    width: "100%",
    height: "50%",
  },
  consumersList: {
    flex: 1,
    width: "100%",
    marginTop: 10,
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
