// App.js
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Root, NativeBaseProvider, Avatar } from "native-base";
import CheckInScreen from "./CheckInScreen";

import { initializeApp } from "firebase/app";

import { getAnalytics } from "firebase/analytics";

const Stack = createStackNavigator();
// useEffect(() => {
//   // Replace with your Firebase configuration
//   const firebaseConfig = {
//     apiKey: "AIzaSyDyreWvsFsje3RsRNz94BuiA1JiqiLq-PI",

//     authDomain: "checkinapp-36ba3.firebaseapp.com",

//     projectId: "checkinapp-36ba3",

//     storageBucket: "checkinapp-36ba3.appspot.com",

//     messagingSenderId: "1064293880985",

//     appId: "1:1064293880985:web:5efa041c9956e726fe9408",

//     measurementId: "G-R78L22CG36",
//   };

//   // Initialize Firebase
//   if (!firebase.apps.length) {
//     firebase.initializeApp(firebaseConfig);
//   }
// }, []);
const App = () => {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="CheckIn"
            options={{
              title: "Check In",
              headerStyle: {
                backgroundColor: "#fff",
              },
              headerTintColor: "black",
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }}
            component={CheckInScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
};

export default App;
