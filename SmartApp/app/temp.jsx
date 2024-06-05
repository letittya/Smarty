import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Image, ScrollView, Dimensions } from 'react-native';
import { db } from '../config';
import { ref, onValue } from 'firebase/database';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../constants';
import { LineChart } from 'react-native-chart-kit';

const Temperature = () => {
  const [temperature, setTemperature] = useState(null);
  const [temperatureFahrenheit, setTemperatureFahrenheit] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [temperatureHistory, setTemperatureHistory] = useState([]);
  const [humidityHistory, setHumidityHistory] = useState([]);
  const [timeLabels, setTimeLabels] = useState([]);

  useEffect(() => {
    const temperatureRef = ref(db, 'DHT22/Temperature_Celcius');
    const humidityRef = ref(db, 'DHT22/Humidity');

    const unsubscribeTemperature = onValue(temperatureRef, (snapshot) => {
      const tempData = snapshot.val();
      if (tempData !== null && tempData >= 18) {
        setTemperature(tempData);
        setTemperatureFahrenheit(((tempData * 9/5) + 32).toFixed(1));
        setTemperatureHistory((prevHistory) => {
          const newHistory = [...prevHistory, tempData];
          if (newHistory.length > 10) {
            newHistory.shift();
          }
          return newHistory;
        });
        setTimeLabels((prevLabels) => {
          const newLabel = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const lastLabel = prevLabels[prevLabels.length - 1];
          const newHour = newLabel.split(':')[0];
          const lastHour = lastLabel ? lastLabel.split(':')[0] : null;
          const finalLabel = lastHour === newHour ? '' : newLabel;
          const newLabels = [...prevLabels, finalLabel];
          if (newLabels.length > 10) {
            newLabels.shift();
          }
          return newLabels;
        });
      }
    }, (error) => {
      setError(error.toString());
      console.error("Firebase read error: ", error);
    });

    const unsubscribeHumidity = onValue(humidityRef, (snapshot) => {
      const humidData = snapshot.val();
      if (humidData !== null && humidData <= 100) {
        setHumidity(humidData);
        setHumidityHistory((prevHistory) => {
          const newHistory = [...prevHistory, humidData];
          if (newHistory.length > 10) {
            newHistory.shift();
          }
          return newHistory;
        });
      }
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
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView>
        <View className="justify-center mt-20 px-4">
          <View style={styles.roundedRectangle}>
            <Text className='text-white font-pextrabold text-2xl'>Temperature</Text>
          </View>
          <View className="mb-12" style={styles.row}>
            <Image source={images.temperature_in} style={{ width: 90, height: 150, resizeMode: 'contain' }} />
            <View>
              <Text className='mb-6 ml-12 text-white font-pbold text-xl'>{temperature} °C</Text>
              <Text className='ml-12 text-white font-pbold text-xl'>{temperatureFahrenheit} °F</Text>
            </View>
          </View>
          {temperatureHistory.length > 0 && (
            <LineChart
              data={{
                labels: timeLabels,
                datasets: [
                  {
                    data: temperatureHistory,
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Line color for temperature
                  }
                ]
              }}
              width={Dimensions.get('window').width - 40} // from react-native
              height={220}
              yAxisLabel=""
              yAxisSuffix="°C"
              yAxisInterval={1} // optional, defaults to 1
              chartConfig={{
                backgroundColor: '#020E03',
                backgroundGradientFrom: '#020E03',
                backgroundGradientTo: '#020E03',
                decimalPlaces: 1, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#749D60'
                }
              }}
              yAxisMin={18}
              yAxisMax={30}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
                marginLeft: 20
              }}
            />
          )}
          <View className="justify-center mt-5" style={styles.roundedRectangle}>
            <Text className='text-white font-pextrabold text-2xl'>Humidity</Text>
          </View>
          <View className="mb-12" style={styles.row}>
            <Image source={images.humidity_in} style={{ width: 90, height: 150, resizeMode: 'contain' }} />
            <Text className='ml-12 text-white font-pbold text-xl'>{humidity} %</Text>
          </View>
          {humidityHistory.length > 0 && (
            <LineChart
              data={{
                labels: timeLabels,
                datasets: [
                  {
                    data: humidityHistory,
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Line color for humidity
                  }
                ]
              }}
              width={Dimensions.get('window').width - 40} // from react-native
              height={220}
              yAxisLabel=""
              yAxisSuffix="%"
              yAxisInterval={1} // optional, defaults to 1
              chartConfig={{
                backgroundColor: '#020E03',
                backgroundGradientFrom: '#020E03',
                backgroundGradientTo: '#020E03',
                decimalPlaces: 1, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#749D60'
                }
              }}
              yAxisMin={0}
              yAxisMax={100}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
                marginLeft: 20
              }}
            />
          )}
        </View>
        {error ? <Text className='text-green-200'>Error: {error}</Text> : null}
      </ScrollView>
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
    alignSelf: "center"
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    marginLeft: 35
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
