import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState} from 'react';
import { Slot , Stack, SplashScreen } from 'expo-router'
import {useFonts} from 'expo-font'

//prevent splash screen from hiding automatically 
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  //loading custom fonts while monitoring the load status and errors 
  const [fontsLoaded, error] = useFonts ( {
    "Poppins-Black" : require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold" : require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold" : require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight" : require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light" : require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium" : require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular" : require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold" : require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin" : require("../assets/fonts/Poppins-Thin.ttf"),
  });

  // check font loading status
  useEffect(() => {
    if(error)
      throw error;
    //if fonts are loaded, splashscreen is hidden
    if(fontsLoaded)
      SplashScreen.hideAsync();
  }, [fontsLoaded,error])

  //no error and fonts didnt load yet -> keep splashscreen visible 
  if(!fontsLoaded && !error)
    return null;

  return (
    //hide the header for all the screens
    <Stack>
        <Stack.Screen name="index" options={{ headerShown: false}}/>
        <Stack.Screen name="lock" options={{ headerShown: false}}/> 
        <Stack.Screen name="temp" options={{ headerShown: false}}/> 
        <Stack.Screen name="blinds" options={{ headerShown: false}}/> 
        <Stack.Screen name="fan" options={{ headerShown: false}}/> 
        <Stack.Screen name="heat" options={{ headerShown: false}}/> 
    </Stack>

  )
}

export default RootLayout

