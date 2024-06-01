import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { db } from '../config';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ref, set, onValue } from 'firebase/database';

const Heat = () => {
  const [isHeatingOn, setIsHeatingOn] = useState(0); // 0: Off, 1: On
  const [isLoading, setIsLoading] = useState(true);
  const [automation, setAutomation] = useState('disabled'); // 'disabled' or 'enabled'
  const [heatingOnTemp, setHeatingOnTemp] = useState(18); // Default to 18 degrees
  const [heatingOffTemp, setHeatingOffTemp] = useState(21); // Default to 21 degrees

  // Fetch the initial state of the heating and automation from the database
  useEffect(() => {
    const heatingRef = ref(db, 'DHT22/Heating');
    const automationRef = ref(db, 'DHT22/Heating_automated');
    const heatingOnTempRef = ref(db, 'DHT22/Heating_on');
    const heatingOffTempRef = ref(db, 'DHT22/Heating_off');

    onValue(heatingRef, (snapshot) => {
      const data = snapshot.val();
      setIsHeatingOn(data);
      setIsLoading(false);  // Set loading to false after fetching data
    });

    onValue(automationRef, (snapshot) => {
      const data = snapshot.val();
      setAutomation(data);
    });

    onValue(heatingOnTempRef, (snapshot) => {
      const data = snapshot.val();
      setHeatingOnTemp(data);
    });

    onValue(heatingOffTempRef, (snapshot) => {
      const data = snapshot.val();
      setHeatingOffTemp(data);
    });
  }, []);

  const updateHeatingStatus = (newStatus) => {
    setIsHeatingOn(newStatus);
    set(ref(db, 'DHT22/Heating'), newStatus);
  };

  const updateAutomation = (newStatus) => {
    setAutomation(newStatus);
    set(ref(db, 'DHT22/Heating_automated'), newStatus);
  };

  const incrementTemp = (type) => {
    if (type === 'start') {
      const newTemp = parseFloat((heatingOnTemp + 0.1).toFixed(1));
      setHeatingOnTemp(newTemp);
      set(ref(db, 'DHT22/Heating_on'), newTemp);
    } else {
      const newTemp = parseFloat((heatingOffTemp + 0.1).toFixed(1));
      setHeatingOffTemp(newTemp);
      set(ref(db, 'DHT22/Heating_off'), newTemp);
    }
  };

  const decrementTemp = (type) => {
    if (type === 'start') {
      const newTemp = parseFloat((heatingOnTemp - 0.1).toFixed(1));
      setHeatingOnTemp(newTemp);
      set(ref(db, 'DHT22/Heating_on'), newTemp);
    } else {
      const newTemp = parseFloat((heatingOffTemp - 0.1).toFixed(1));
      setHeatingOffTemp(newTemp);
      set(ref(db, 'DHT22/Heating_off'), newTemp);
    }
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
          {isHeatingOn === 1 ? "Heating is on  ༄｡°" : "Heating is off 𖦹"}
        </Text>
        <View style={styles.switchContainer}>
          <TouchableOpacity
            style={[styles.switchButton, isHeatingOn === 0 && styles.activeButton]}
            onPress={() => updateHeatingStatus(0)}
          >
            <Text style={styles.switchText}>Off</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.switchButton, isHeatingOn === 1 && styles.activeButton]}
            onPress={() => updateHeatingStatus(1)}
          >
            <Text style={styles.switchText}>On</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tempControlsContainer}>
        <View style={styles.tempControl}>
        <Text className='text-white font-pbold text-lg '>Start</Text>
          <Text className='text-white font-pbold text-lg mb-3'>Temperature:</Text>
          <View style={styles.tempAdjustContainer}>
            <TouchableOpacity onPress={() => decrementTemp('start')}>
              <Text style={styles.arrow}>▼</Text>
            </TouchableOpacity>
            <Text style={styles.tempText}>{heatingOnTemp.toFixed(1)}°C</Text>
            <TouchableOpacity onPress={() => incrementTemp('start')}>
              <Text style={styles.arrow}>▲</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.tempControl}>
          <Text className='text-white font-pbold text-lg '>Goal</Text>
          <Text className='text-white font-pbold text-lg mb-3'>Temperature:</Text>
          <View style={styles.tempAdjustContainer}>
            <TouchableOpacity onPress={() => decrementTemp('goal')}>
              <Text style={styles.arrow}>▼</Text>
            </TouchableOpacity>
            <Text style={styles.tempText}>{heatingOffTemp.toFixed(1)}°C</Text>
            <TouchableOpacity onPress={() => incrementTemp('goal')}>
              <Text style={styles.arrow}>▲</Text>
            </TouchableOpacity>
          </View>
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
    marginTop: 90,
  },
  centered_2: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: -150,
  },
  tempControlsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: -250, // Additional adjustment to move the temperature controls up
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
  tempControl: {
    alignItems: 'center',
  },
  tempAdjustContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    color: '#749D60',
    fontSize: 30,
    marginHorizontal: 10,
  },
  tempText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export default Heat;
