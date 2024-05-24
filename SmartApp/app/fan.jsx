import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { db } from '../config';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ref, set, onValue } from 'firebase/database';

const Fan = () => {
  const [isFanOn, setIsFanOn] = useState(0); // 0: Off, 1: On
  const [isLoading, setIsLoading] = useState(true);
  const [automation, setAutomation] = useState('disabled'); // 'disabled' or 'enabled'

  // Fetch the initial state of the fan and automation from the database
  useEffect(() => {
    const fanRef = ref(db, 'DHT22/Fan');
    const automationRef = ref(db, 'DHT22/Fan_automated');

    onValue(fanRef, (snapshot) => {
      const data = snapshot.val();
      setIsFanOn(data);
      setIsLoading(false);  // Set loading to false after fetching data
    });

    onValue(automationRef, (snapshot) => {
      const data = snapshot.val();
      setAutomation(data);
    });
  }, []);

  const updateFanStatus = (newStatus) => {
    setIsFanOn(newStatus);
    set(ref(db, 'DHT22/Fan'), newStatus);
  };

  const updateAutomation = (newStatus) => {
    setAutomation(newStatus);
    set(ref(db, 'DHT22/Fan_automated'), newStatus);
  };

  if (isLoading) {
    return (
      <SafeAreaView className='bg-primary h-full'>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#576F00" />
        </View>
        <StatusBar style="light" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className='bg-primary h-full'>
      <View style={styles.centered}>
        <Text className='text-white font-pbold text-lg '>
          {automation === 'enabled' ? "Disable" : "Enable"} the automated
        </Text>
        <Text className='text-white font-pbold text-lg mb-3'>
         turning on and off?
        </Text>
        <View style={styles.switchContainer}>
          <TouchableOpacity
            style={[styles.switchButton, automation === 'disabled' && styles.activeButton]}
            onPress={() => updateAutomation('disabled')}
          >
            <Text style={styles.switchText}>Disabled</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.switchButton, automation === 'enabled' && styles.activeButton]}
            onPress={() => updateAutomation('enabled')}
          >
            <Text style={styles.switchText}>Enabled</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.centered_2}>
        <Text className='text-white font-pbold text-lg m-3'>
          {isFanOn === 1 ? "Fan is on  ༄｡°" : "Fan is off 𖦹"}
        </Text>
        <View style={styles.switchContainer}>
          <TouchableOpacity
            style={[styles.switchButton, isFanOn === 0 && styles.activeButton]}
            onPress={() => updateFanStatus(0)}
          >
            <Text style={styles.switchText}>Off</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.switchButton, isFanOn === 1 && styles.activeButton]}
            onPress={() => updateFanStatus(1)}
          >
            <Text style={styles.switchText}>On</Text>
          </TouchableOpacity>
        </View>
      </View>
      <StatusBar style="light" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 150,
  },
  centered_2: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: -80,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#91BD7A',
    borderRadius: 50,
    padding: 5,
    marginVertical: 10, // added margin for spacing between the switches
  },
  switchButton: {
    width: 108,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 50,
  },
  activeButton: {
    backgroundColor: '#295D0E',
  },
  switchText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Fan;
