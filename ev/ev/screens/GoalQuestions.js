import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GoalQuestions = () => {
  const navigation = useNavigation();
  const [goals, setGoals] = useState('');

  const handleContinue = async () => {
    try {
      // Save just the baseball goals
      await AsyncStorage.setItem('goals', goals);

      // Log for verification
      console.log('Saved goals info:', {
        goals
      });

      navigation.navigate('Loading');
    } catch (error) {
      console.error('Error saving goals:', error);
      Alert.alert('Error', 'Failed to save your goals. Please try again.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>What Are Your Baseball Goals?</Text>
        
        <Text style={styles.subtitle}>
          Be specific about what you want to achieve
        </Text>

        <TextInput
          style={styles.input}
          multiline={true}
          numberOfLines={4}
          placeholder="Enter your baseball goals here..."
          value={goals}
          onChangeText={setGoals}
        />

        <TouchableOpacity 
          style={styles.continueButton} 
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Continue →</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    minHeight: 120,
    fontSize: 16,
    marginBottom: 20,
  },
  continueButton: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GoalQuestions; 