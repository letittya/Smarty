import { StatusBar } from 'expo-status-bar';
import { Link, useRouter } from 'expo-router';
import { TouchableOpacity, Text, View, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../constants';
import { useState } from 'react';
import * as Animatable from 'react-native-animatable';

export default function App() {
  const router = useRouter(); // Use the router from expo-router

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="justify-center items-center mt-11 px-5">
        <Image
          source={images.logo}
          className="w-[220px] h-[115px]"
          resizeMode='contain'
        />
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 8 , paddingTop: 80}}
      >
        <TouchableOpacity onPress={() => router.push('/lock')} activeOpacity={0.5}>
          <Image source={images.lock_img} style={{ width: 270, height: 350,  resizeMode: 'contain' }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/temp')} activeOpacity={0.5}>
          <Image source={images.temp_img} style={{ width: 270, height: 350,  resizeMode: 'contain' }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/lock')} activeOpacity={0.5}>
          <Image source={images.lock_img} style={{ width: 270, height: 350,  resizeMode: 'contain' }} />
        </TouchableOpacity>
        
      </ScrollView>

      <StatusBar style="light"></StatusBar>
    </SafeAreaView>
  );
}
