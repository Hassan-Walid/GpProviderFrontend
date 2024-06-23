import React, { useEffect, useState } from 'react';
import { View, Text, Button, Platform,StyleSheet } from 'react-native';
import * as Location from 'expo-location';

const TestLocation = () => {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
  
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
  
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    };

    let text = 'Waiting..';
    if (errorMsg) {
      text = errorMsg;
    } else if (location) {
      text = JSON.stringify(location);
    }
  
    return (
      <View>
        <Text>Location: {text}</Text>
        <Button title="Get Location" onPress={getLocation} />
      </View>
    );
}

const styles = StyleSheet.create({})

export default TestLocation;
