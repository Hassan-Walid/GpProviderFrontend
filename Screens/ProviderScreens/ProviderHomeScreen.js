import React, { useEffect, useState } from "react";
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

const ProviderHomeScreen = ({ service, navigation /*route*/ }) => {
  // const { socket } = route.params;
  // console.log(socket);

  const [mapRegion, setMapRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [mapRegion2, setMapRegion2] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [consumers, setConsumers] = useState([
    { id: "1", name: "Provider 1", distance: "2 km", carType: "Sedan" },
    { id: "2", name: "Provider 2", distance: "5 km", carType: "SUV" },
    { id: "3", name: "Provider 3", distance: "3 km", carType: "Sedan" },
    { id: "4", name: "Provider 4", distance: "7 km", carType: "SUV" },
  ]);

  const [isSwitchOn, setIsSwitchOn] = useState(false);

  useEffect(() => {
    userLocation();
  }, []);
  useEffect(() => {
    if (isSwitchOn) {
      const socket = io("http://192.168.1.5:8000");
      // let x = socket.connect("http://192.168.1.5:8000");
      socket.on("connect", () => {
        console.log("Connected to server");
        socket.emit("connected", { id: "1", type: "provider" });
      });

      // socket.on('notification', (notificationData) => {
      //   console.log("Notification from server");
      //   console.log(notificationData);
      // })

      // socket.on("GetLocation", ({ consumerId, providerId, availableProvidersLength }) => {
      //   socket.emit("Location", { consumerId, providerId, availableProvidersLength, location })
      // })
    } else {
      // socket.disconnect();
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
  const [isRequest, setIsRequest] = useState(true);

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
          region={mapRegion}
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

        {isRequest ? (
          <View style={styles.consumersList}>
            {/* <ProgressBar progress={1}></ProgressBar> */}
            <ConsumerCard
              name="Consumer 1"
              distance={"2 Km"}
              carType={"Sedan"}
            />
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
