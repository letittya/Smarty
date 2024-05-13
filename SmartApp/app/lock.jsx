import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, ScrollView, View } from 'react-native';
import { db } from '../config';
import { ref, onValue } from 'firebase/database';
import { StatusBar } from 'expo-status-bar';

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
        }));
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

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {entries.length > 0 ? (
          entries.map((entry) => (
            <View key={entry.firebaseKey} style={styles.entry}>
              <Text>Access: {entry.access}</Text>
              <Text>Data: {entry.data}</Text>
              <Text>ID: {entry.id}</Text>
              <Text>Timestamp: {entry.timestamp}</Text>
            </View>
          ))
        ) : <Text>No data found</Text>}
      </ScrollView>
      {error ? <Text>Error: {error}</Text> : null}


      <StatusBar style="dark"></StatusBar>

    </View>
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
  }
});
