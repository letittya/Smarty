import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { db } from '../config';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ref, set, onValue } from 'firebase/database';

const Blinds = () => {
  const [position, setPosition] = useState(0); 
  const [isLoading, setIsLoading] = useState(true);
  const [automation, setAutomation] = useState('disabled'); 

  useEffect(() => {
    const blindsRef = ref(db, 'Blinds');
    const automationRef = ref(db, 'Automated_blinds');

    onValue(blindsRef, (snapshot) => {
      const data = snapshot.val();
      setPosition(data);
      setIsLoading(false);  
    });

    onValue(automationRef, (snapshot) => {
      const data = snapshot.val();
      setAutomation(data);
    });
  }, []);

  const updatePosition = (newPosition) => {
    setPosition(newPosition);
    set(ref(db, 'Blinds'), newPosition);
  };

  const updateAutomation = (newStatus) => {
    setAutomation(newStatus);
    set(ref(db, 'Automated_blinds'), newStatus);
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
          {automation === 'enabled' ? "Disable" : "Enable"} automated
        </Text>
        <Text className='text-white font-pbold text-lg mb-3'>
          closing and opening ? 
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
          {position === 1 ? "Blinds are opened  ☀︎" : position === 0.5 ? "Blinds are half-opened  ☁︎" : "Blinds are closed  ☾"}
        </Text>
        <View style={styles.switchContainer}>
          <TouchableOpacity
            style={[styles.switchButton, position === 0 && styles.activeButton]}
            onPress={() => updatePosition(0)}
          >
            <Text style={styles.switchText}>Closed</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.switchButton, position === 0.5 && styles.activeButton]}
            onPress={() => updatePosition(0.5)}
          >
            <Text style={styles.switchText}>Half-Open</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.switchButton, position === 1 && styles.activeButton]}
            onPress={() => updatePosition(1)}
          >
            <Text style={styles.switchText}>Open</Text>
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

export default Blinds;
