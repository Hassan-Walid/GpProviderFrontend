import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Switch } from "react-native-paper";

const SwitchStatus = ({ setIsSwitchOn, isSwitchOn, disableSwitch }) => {
  // handleSwitchChange(isSwitchOn);

  const onToggleSwitch = () => setIsSwitchOn((old) => !old);
  return (
    <View style={styles.statusStyle}>
      <Text
        style={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: 20,
          margin: 3,
          marginTop: 10,
          fontStyle: "italic",
          color: "#3D3B3B",
          marginRight: 15,
        }}
      >
        Available
      </Text>

      <Switch
        style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
        value={isSwitchOn}
        onValueChange={onToggleSwitch}
        disabled={disableSwitch}
        trackColor={{ false: "#3e3e3e", true: "#f4f3f4" }}
        thumbColor={isSwitchOn ? "#9AB3CA" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  statusStyle: {
    flexDirection: "row",
    backgroundColor: "#FFF394",
    elevation: 3,
    borderRadius: 30,
    padding: 10,
    marginVertical: 10,
  },
});

export default SwitchStatus;
