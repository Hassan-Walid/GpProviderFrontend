import { createStackNavigator } from "@react-navigation/stack";
import ConsumerRegisterScreen from "../Screens/Registeration/ConsumerRegisterScreen";
import ProviderRegisterScreen from "../Screens/Registeration/ProviderRegisterScreen";
import LoginScreen from "../Screens/Login/ConsumerLoginScreen";
import userTypeScreen from "@/Screens/SplashScreens/userTypeScreen";
import SplashScreen from "@/Screens/SplashScreens/splashscreen";
import RoadServiceScreen from "@/Screens/RoadServices/roadServiceScreen";
// import Home from "../Screens/Home/Home"
import Vehichles from "../Screens/RoadServices/Vehicles";
import ProviderHomeScreen from "../Screens/ProviderScreens/ProviderHomeScreen";
// import Profile from "../Screens/Profile/profile"

import BottomTabNavigator from "./BottomTabNavigator";

const Stack = createStackNavigator();
export function MyStack(/*{ socket }*/) {
  return (

    <Stack.Navigator>
      <Stack.Screen
        name="ProviderRegScreen"
        component={ProviderRegisterScreen}
        options={{ headerShown: false }}
      />
      
      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />

    <Stack.Screen
        name="Profile"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProviderHomeScreen"
        component={ProviderHomeScreen}
        options={{ headerShown: false }}
        // initialParams={{ socket }}
      />

      
      
    </Stack.Navigator>
  );
}
export default MyStack;
