import React, { useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const CustomButton = ({ title, onPressHandler, fontSize = 16 }) => {
  const animationValue = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.timing(animationValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(animationValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const heightInterpolation = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const widthInterpolation = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPressHandler}
      >
        <LinearGradient
          // colors={['#4D99CC', '#96D6E4']}
          // colors={['#014871', '#D7EDE2']}
          colors={["#587FA7", "#9AB3CA"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.gradient}
        >
          <Text style={[styles.text, { fontSize }]}>{title}</Text>
        </LinearGradient>
        <Animated.View
          style={[styles.borderTop, { height: heightInterpolation }]}
        />
        <Animated.View
          style={[styles.borderRight, { width: widthInterpolation }]}
        />
        <Animated.View
          style={[styles.borderBottom, { height: heightInterpolation }]}
        />
        <Animated.View
          style={[styles.borderLeft, { width: widthInterpolation }]}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    margin: 10,
    padding: 5,
    borderRadius: 8,
    overflow: "hidden",
  },
  button: {
    padding: 5,
    position: "relative",
    width: "100%",
    height: 55,
    // marginHorizontal:4,
    borderRadius: 8,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  text: {
    color: "#fff",
    // fontSize: fontSize?fontSize:16 ,
    textAlign: "center",
  },
  borderTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    boxShadow:
      "4px 4px 6px 0 rgba(255,255,255,.9), -4px -4px 6px 0 rgba(116, 125, 136, .2), inset -4px -4px 6px 0 rgba(255,255,255,.9), inset 4px 4px 6px 0 rgba(116, 125, 136, .3)",
  },
  borderRight: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    boxShadow:
      "4px 4px 6px 0 rgba(255,255,255,.9), -4px -4px 6px 0 rgba(116, 125, 136, .2), inset -4px -4px 6px 0 rgba(255,255,255,.9), inset 4px 4px 6px 0 rgba(116, 125, 136, .3)",
  },
  borderBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    boxShadow:
      "4px 4px 6px 0 rgba(255,255,255,.9), -4px -4px 6px 0 rgba(116, 125, 136, .2), inset -4px -4px 6px 0 rgba(255,255,255,.9), inset 4px 4px 6px 0 rgba(116, 125, 136, .3)",
  },
  borderLeft: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    boxShadow:
      "4px 4px 6px 0 rgba(255,255,255,.9), -4px -4px 6px 0 rgba(116, 125, 136, .2), inset -4px -4px 6px 0 rgba(255,255,255,.9), inset 4px 4px 6px 0 rgba(116, 125, 136, .3)",
  },
});

export default CustomButton;
