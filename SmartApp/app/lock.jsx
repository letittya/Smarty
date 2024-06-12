import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, ScrollView, View, FlatList , ActivityIndicator } from 'react-native';
import { db } from '../config';
import { ref, onValue } from 'firebase/database';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

const Lock = () => {
  const [entries, setEntries] = useState([]); //stores all RFID entries
  const [error, setError] = useState('');  // in case of errors 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const entriesRef = ref(db, 'RFID_scans'); //reference to the db child RFID_scans
    // listener for changes tied to the RFID_scans, snapshot is current value
    const unsubscribe = onValue(entriesRef, (snapshot) =>{ 
      // data returned by Firebase, holds all entries 
      const data = snapshot.val();
      if (data) {
        // if not empty , transforms values pairs into array
        const loadedData = Object.keys(data).map(key => ({
          firebaseKey: key,  //unique ID 
          ...data[key]   //rest of data 
        })).reverse();   // to show the data from database starting from the newest entry 
        setEntries(loadedData); //update entries state 
        setIsLoading(false);  //loading complete!!!
      } else {
        console.log("Empty! No data");
      }
      //if there is an error 
    }, (error) => {
      setError(error.toString());
      console.error("Firebase read error: ", error);
    });

    return () => {
      unsubscribe();
    };
  }, []); //no dependencies 

  //displays a loading circle-thing while data is being fetched 
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

  //style each entry in the FlatList 
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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
