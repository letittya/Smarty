import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { db } from '../config';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ref, set, onValue } from 'firebase/database';

const Blinds = () => {
  const [position, setPosition] = useState(0); // 0: Closed, 0.5: Half-Open, 1: Open
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the initial state of the blinds from the database
  useEffect(() => {
    const blindsRef = ref(db, 'Blinds');
    onValue(blindsRef, (snapshot) => {
      const data = snapshot.val();
      setPosition(data);
      setIsLoading(false);  // Set loading to false after fetching data
    });
  }, []);

  const updatePosition = (newPosition) => {
    setPosition(newPosition);
    set(ref(db, 'Blinds'), newPosition);
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
    marginTop: 350,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#91BD7A',
    borderRadius: 50,
    padding: 5, 
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
