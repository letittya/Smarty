import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, ScrollView, View, FlatList , RefreshControl } from 'react-native';
import { db } from '../config';
import { ref, onValue } from 'firebase/database';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

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

  const renderItem = ({ item }) => (
    <View style={styles.entry}>
      <Text className='text-green-200'>Access: {item.access}</Text>
      <Text className='text-green-200'>Data: {item.data}</Text>
      <Text className='text-green-200'>ID: {item.id}</Text>
      <Text className='text-green-200'>Timestamp: {item.timestamp}</Text>
    </View>
  );

  return (
    
      <SafeAreaView  className='bg-primary'style={styles.container}>
        <FlatList
          data={entries}
          renderItem={renderItem}
           keyExtractor={item => item.firebaseKey}
           ListEmptyComponent={<Text className='text-green-200'>No data found</Text>}
           style={styles.scrollView}
         />
         {error ? <Text className='text-green-200'>Error: {error}</Text> : null}
        <StatusBar style="dark" />

        <StatusBar style="light"></StatusBar>
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
    borderColor: '#cccccc',
    borderRadius: 5,
    color : 'light'
  }
});
