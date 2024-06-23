import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, TextInput, Button } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import ConsumerCard from "../../components/ProviderComponents/ConsumerCard";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from "react-native-gesture-handler";

const ProviderHomeScreen2 = ({navigation}) => {
  const [mapRegion, setMapRegion] = useState({
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

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    userLocation();
  }, []);

  const userLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status === "granted") {
      let location = await Location.getCurrentPositionAsync({
        enableHighAccuracy: true,
      });

      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) return;

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}&countrycodes=eg&bounded=1&viewbox=24.7,31.917,36.9,22.0`
      );

      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setMapRegion({
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        });
      }
    } catch (error) {
      console.error("Error searching location:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search location..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />

        <TouchableOpacity onPress={handleSearch} style={styles.searchIcon}>
          <Ionicons name="search" size={24} color="#587FA7" />
        </TouchableOpacity>
        {/* <Button title="Search" onPress={handleSearch} /> */}
      </View>
      <MapView style={styles.map} region={mapRegion}>
        <Marker coordinate={mapRegion} title="Selected Location" />
      </MapView>

      <View style={styles.consumersList}>
        <FlatList
          data={consumers}
          renderItem={({ item }) => (
            <ConsumerCard
              name={item.name}
              distance={item.distance}
              carType={item.carType}
              navigation={navigation}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContentContainer}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 15
  },
  map: {
    width: "100%",
    height: "50%",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  consumersList: {
    flex: 1,
    width: "100%",
  },
  listContentContainer: {
    paddingVertical: 16,
  },

  searchIcon: {
    padding: 10,
    
  },
});

export default ProviderHomeScreen2;
