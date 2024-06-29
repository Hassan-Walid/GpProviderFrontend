import { createStackNavigator } from "@react-navigation/stack";
import ProviderRegisterScreen from "../Screens/Registeration/ProviderRegisterScreen";
import LoginScreen from "../Screens/Login/ConsumerLoginScreen";
import SplashScreen from "@/Screens/SplashScreens/splashscreen";
import ProviderHomeScreen from "../Screens/ProviderScreens/ProviderHomeScreen";
import LanguageScreen from "../Screens/SplashScreens/languageScreen"
const Stack = createStackNavigator();
export function MyStack(/*{ socket }*/) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LanguageScreen"
        component={LanguageScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProviderRegScreen"
        component={ProviderRegisterScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerShown: false }}
      />

      {/* <Stack.Screen
        name="Home"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      /> */}

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
