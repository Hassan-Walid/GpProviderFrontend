import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import ConsumerCard from "../../components/ProviderComponents/ConsumerCard";
import SwitchStatus from "./../../components/ProviderComponents/SwitchStatus";
import RequestScreen from "./RequestScreen";
import { ProgressBar } from "react-native-paper";
import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const ProviderHomeScreen = ({ service, navigation /*route*/ }) => {

  const [mapRegion, setMapRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // const [mapRegion2, setMapRegion2] = useState({
  //   latitude: 37.78825,
  //   longitude: -122.4324,
  //   latitudeDelta: 0.0922,
  //   longitudeDelta: 0.0421,
  // });

  // const [consumers, setConsumers] = useState([
  //   { id: "1", name: "Provider 1", distance: "2 km", carType: "Sedan" },
  //   { id: "2", name: "Provider 2", distance: "5 km", carType: "SUV" },
  //   { id: "3", name: "Provider 3", distance: "3 km", carType: "Sedan" },
  //   { id: "4", name: "Provider 4", distance: "7 km", carType: "SUV" },
  // ]);

  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [socket, setSocket] = useState(null);
  const [id, setId] = useState(null);
  const [type, setType] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [isRequestAccepted, setIsRequestAccepted] = useState(false);
  const [requestInfo, setRequestInfo] = useState({});

  let intervalRef = useRef(null);

  useEffect(() => {
    AsyncStorage.getItem("userId").then((data) => {
      // console.log(data);
      setId(data);

    });

    AsyncStorage.getItem("userRole").then((data) => {
      // console.log(data);
      setType(data);

    });
    userLocation();
  }, []);

  useEffect(() => {
    if (isRequestAccepted) {
      intervalRef.current = setInterval(() => {
        console.log("tracked");
        let { latitude, longitude } = mapRegion;
        let { consumerId, consumerLocation } = requestInfo;
        userLocation();
        socket.emit("Tracked", { userId: id, targetId: consumerId, targetLocation: consumerLocation, location: { latitude, longitude } })
      }, 3000)
    }

    return () => {
      clearInterval(intervalRef.current);
    }
  }, [isRequestAccepted])

  useEffect(() => {
    if (isSwitchOn) {
      let newsocket = io("http://192.168.1.10:8000");

      newsocket.on("connect", () => {
        console.log("Connected to server");
        newsocket.emit("connected", { id, type });
      });

      // newsocket.on('notification', (notificationData) => {
      //   console.log("Notification from server");
      //   console.log(notificationData);
      // })

      newsocket.on("GetLocation", ({ consumerId, providerId, availableProvidersLength }) => {
        newsocket.emit("Location", { consumerId, providerId, availableProvidersLength, location: mapRegion })
      })

      newsocket.on('disconnect', () => {
        console.log(`Disconnected from server`);
      })

      newsocket.on('IncomingRequest', async ({ consumerId, consumerLocation, distance }) => {

        console.log("Incoming Request from " + consumerId + " at lat: " + consumerLocation + " distance: " + distance);

        let incomingUser = await axios.get(`http://192.168.1.10:8000/api/user/${consumerId}`)
          .then(res => {
            return res.data.user;
          })
          .catch((e) => {
            console.log(e);
          })

        setPendingRequests((allRequests) => [...allRequests, { consumerId, consumerLocation, distance, incomingUser }]);

      })

      setSocket(newsocket);

    } else {
      if (socket) {
        socket.emit('disconnected', { id, type })
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


  const [isOpened, setIsOpened] = useState(false);

  const handleSwitchChange = (enabled) => {
    // console.log(enabled);
    setIsOpened(enabled);
    if (enabled) {
      // socket.connect("http://192.168.1.5:8000/");
    } else {
      // socket.disconnect();
    }
  };


  const origin = { latitude: 37.78825, longitude: -122.4324 };
  const destination = { latitude: 37.79855, longitude: -122.4324 };
  const region = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={origin}
        // initialRegion={region}
        >
          <Marker coordinate={origin} title="Consumer place"></Marker>
          {/* <Marker coordinate={origin} title="Origin" />
          {/* Show marker for destination */}
          {/* <Marker coordinate={destination} title="Destination"></Marker>  */}

          {/* <Polyline
            coordinates={[origin, destination]}
            strokeColor="#FF0000"
            strokeWidth={3}
          /> */}
        </MapView>

        <SwitchStatus isSwitchOn={isSwitchOn} setIsSwitchOn={setIsSwitchOn} />

        {isSwitchOn ? (
          <Text>Waiting For Requests...</Text>
        ) : (
          <Text>Not Available For Request</Text>
        )}

        {pendingRequests.length > 0 ? (
          <View style={styles.consumersList}>
            {/* <ProgressBar progress={1}></ProgressBar> */}
            {pendingRequests.map((r, i) => {
              return (
                // <></>
                <ConsumerCard
                  key={i}
                  consumerId={r["consumerId"]}
                  consumerLocation={r["consumerLocation"]}
                  name={r["incomingUser"]["name"].toUpperCase()}
                  carType={r["incomingUser"]["owned_cars"][0]["make"].toUpperCase() + " " + r["incomingUser"]["owned_cars"][0]["model"].toUpperCase()}
                  distance={+r.distance.toFixed(2) + "KM"}
                  setIsRequestAccepted={setIsRequestAccepted}
                  setRequestInfo={setRequestInfo}
                  setPendingRequests = {setPendingRequests}
                />
              )
            })}
          </View>
        ) : (
          <Text></Text>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    // justifyContent: "space-around",
    alignItems: "center",
  },
  map: {
    width: "100%",
    height: "80%",
  },
  consumersList: {
    flex: 1,
    width: "100%",
    marginTop: 10,
    position: "absolute",
  },
  listContentContainer: {
    paddingBottom: 16,
  },
});

export default ProviderHomeScreen;
