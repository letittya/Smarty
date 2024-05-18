import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Image } from 'react-native';
import { db } from '../config';
import { ref, onValue } from 'firebase/database';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../constants';

const Temperature = () => {
  const [temperature, setTemperature] = useState(null);
  const [temperatureFahrenheit, setTemperatureFahrenheit] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const temperatureRef = ref(db, 'DHT22/Temperature_Celcius');
    const humidityRef = ref(db, 'DHT22/Humidity');

    const unsubscribeTemperature = onValue(temperatureRef, (snapshot) => {
      const tempData = snapshot.val();
      setTemperature(tempData);
      setTemperatureFahrenheit(((tempData * 9/5) + 32).toFixed(1));
    }, (error) => {
      setError(error.toString());
      console.error("Firebase read error: ", error);
    });

    const unsubscribeHumidity = onValue(humidityRef, (snapshot) => {
      const humidData = snapshot.val();
      setHumidity(humidData);
    }, (error) => {
      setError(error.toString());
      console.error("Firebase read error: ", error);
    });

    setIsLoading(false);

    return () => {
      unsubscribeTemperature();
      unsubscribeHumidity();
    };
  }, []);

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
    <SafeAreaView className='bg-primary h-full' >
      <View className="justify-center mt-20 px-4">
        <View style={styles.roundedRectangle}>
          <Text className='text-white font-pextrabold text-2xl'>Temperature</Text>
        </View>
        <View className="mb-12" style={styles.row}>
          <Image source={images.temperature_in} style={{ width: 90, height: 150,  resizeMode: 'contain' }}  />
          <View>
            <Text className='mb-6 ml-12 text-white font-pbold text-lg'>{temperature}°C</Text>
            <Text className='ml-12 text-white font-pbold text-lg'>{temperatureFahrenheit}°F</Text>
          </View>
        </View>
        <View style={styles.roundedRectangle}>
          <Text className='text-white font-pextrabold text-2xl'>Humidity</Text>
        </View>
        <View className="m-5" style={styles.row}>
          <Image source={images.humidity_in} style={{ width: 90, height: 150,  resizeMode: 'contain' }}  />
          <Text className='ml-12 text-white font-pbold text-lg'>{humidity}%</Text>
        </View>
      </View>
      
      {error ? <Text className='text-green-200'>Error: {error}</Text> : null}
      <StatusBar style="light" />
    </SafeAreaView>
  );
};

export default Temperature;

const styles = StyleSheet.create({
  roundedRectangle: {
    backgroundColor: '#295D0E',
    borderRadius: 25,
    padding: 8,
    marginVertical: 10,
    alignItems: 'center',
    width: '88%',
    alignSelf:"center"
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    marginLeft : 35
  },
});
