import { StyleSheet, Text, View, SafeAreaView, Button } from 'react-native';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { db } from '../config';
import { ref, set } from 'firebase/database';

const Blinds = () => {
  const setBlinds = (status) => {
    set(ref(db, 'Blinds'), status);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="Down" onPress={() => setBlinds(0)} />
        <Button title="Up" onPress={() => setBlinds(1)} />
      </View>
      <StatusBar style="light" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
  },
});

export default Blinds;