import { StyleSheet, Text, View , SafeAreaView} from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar';

const Temperature = () => {
  return (
    <SafeAreaView className='bg-primary h-full'>
      <Text className=' text-white '>Temperature</Text>

      <StatusBar style="light"></StatusBar>
    </SafeAreaView>
  )
}

export default Temperature

const styles = StyleSheet.create({})