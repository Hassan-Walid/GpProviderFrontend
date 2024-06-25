import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar, Platform} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/AntDesign';
import Home from "../Screens/Home/Home"
import Vehicles from "../Screens/RoadServices/Vehicles"
import Profile from "../Screens/Profile/profile"

const Tab = createBottomTabNavigator();
const BottomTabNavigator = () => {


    return (
        
        <>
            {/* <StatusBar animated={true} backgroundColor="#9AB3CA" /> */}
    
        <Tab.Navigator
        screenOptions={({route}) => ({
            tabBarHideOnKeyboard: true,
            tabBarStyle: {
              display: 'flex',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              elevation: 5,
              backgroundColor: "#9AB3CA",
              borderRadius: 15,
              height: 50,
              marginTop:20
            },
            tabBarShowLabel: false,
            headerShown: false,
          })}>

{/* <Tab.Screen
          name="Vehicles"
          component={Vehicles}
          options={{
            tabBarIcon: ({focused}) => (
              <View
                style={{
                  top: Platform.OS === 'ios' ? 10 : 0,
                }}>
                <Icon
                  name="message1"
                  size={30}
                  color={focused ? 'white' : "black"}
                />
              </View>
            ),
          }}
        /> */}


<Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: ({focused}) => (
              <View
                style={{
                  top: Platform.OS === 'ios' ? 10 : 0,
                }}>
                <Icon
                  name="home"
                  size={30}
                  color={focused ? 'white' : "lightgray"}
                />
              </View>
            ),
          }}
        />

<Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarIcon: ({focused}) => (
              <View
                style={{
                  top: Platform.OS === 'ios' ? 10 : 0,
                }}>
                <Icon
                  name="user"
                  size={30}
                  color={focused ? 'white' : "lightgray"}
                />
              </View>
            ),
          }}
        />

        </Tab.Navigator>
    
        </>
    );
}

const styles = StyleSheet.create({})

export default BottomTabNavigator;
