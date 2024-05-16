import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, ScrollView, View, FlatList , RefreshControl } from 'react-native';
import { db } from '../config';
import { ref, onValue } from 'firebase/database';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { icons } from '../constants';

const Lock = () => {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const entriesRef = ref(db, 'RFID_scans');
    const unsubscribe = onValue(entriesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedData = Object.keys(data).map(key => ({
          firebaseKey: key,
          ...data[key]
        })).reverse();   // to show the data from database starting from the newest entry 
        setEntries(loadedData);
      } else {
        console.log("No data available");
      }
    }, (error) => {
      setError(error.toString());
      console.error("Firebase read error: ", error);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const renderItem = ({ item }) => {
    const borderColor = item.access === 'granted' ? '#226711' : '#760B0B';
    return (
      <View style={[styles.entry, { borderColor }]}>
        <Text className='text-white font-pbold text-lg'>{item.data}</Text>
        <Text className='text-white font-pmedium'>
          <Text className= 'font-bold'>ID:</Text> {item.id}
        </Text>
        <Text className='text-white font-pmedium'>
          <Text className= 'font-bold'>Date & time:</Text> {item.timestamp}
        </Text>
        <View style={[
          styles.accessBadge, 
          item.access === 'granted' ? styles.accessGranted : styles.accessDenied
        ]}>
          <Text className='text-white font-pmedium'>
            {item.access === 'granted' ? 'Granted' : 'Denied'}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className='bg-primary' style={styles.container}>
      <FlatList
        data={entries}
        renderItem={renderItem}
        keyExtractor={item => item.firebaseKey}
        style={styles.scrollView}
      />
      {error ? <Text className='text-green-200'>Error: {error}</Text> : null}
      <StatusBar style="dark" />
      <StatusBar style="light" />
    </SafeAreaView>
  );
};

export default Lock;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scrollView: {
    width: '100%',
  },
  entry: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
  accessBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginVertical: 5,
  },
  accessGranted: {
    backgroundColor: '#226711', 
  },
  accessDenied: {
    backgroundColor: '#760B0B', 
  },
});
