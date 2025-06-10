// File: LoadingScreen.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const LoadingScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // Simulate loading time then navigate to PlanReady
    const timer = setTimeout(() => {
      navigation.navigate('PlanReady');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Icon name="baseball-outline" size={60} color="#000" />
        <Text style={styles.title}>Creating Your Plan</Text>
        <Text style={styles.subtitle}>Analyzing your data and generating a personalized program...</Text>
        <ActivityIndicator size="large" color="#000" style={styles.loader} />
        
        <View style={styles.stepsContainer}>
          <Text style={styles.step}>✓ Analyzing experience level</Text>
          <Text style={styles.step}>✓ Calculating optimal training volume</Text>
          <Text style={styles.step}>✓ Customizing exercises</Text>
          <Text style={styles.step}>• Finalizing your plan...</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  loader: {
    marginVertical: 20,
  },
  stepsContainer: {
    width: '100%',
    marginTop: 20,
  },
  step: {
    fontSize: 16,
    color: '#333',
    marginVertical: 8,
  },
});

export default LoadingScreen;
