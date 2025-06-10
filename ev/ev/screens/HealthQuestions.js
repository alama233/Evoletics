import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HealthQuestions = () => {
  const navigation = useNavigation();
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [injuries, setInjuries] = useState('');
  const [conditions, setConditions] = useState('');
  const [allergies, setAllergies] = useState('');

  const handleContinue = async () => {
    if (currentQuestion === 1 && injuries) {
      setCurrentQuestion(2);
    } else if (currentQuestion === 2 && conditions) {
      setCurrentQuestion(3);
    } else if (currentQuestion === 3 && allergies) {
      try {
        // Save all health information
        await AsyncStorage.setItem('injuries', injuries);
        await AsyncStorage.setItem('conditions', conditions);
        await AsyncStorage.setItem('allergies', allergies);

        // Log for verification
        console.log('Saved health info:', {
          injuries,
          conditions,
          allergies
        });

        navigation.navigate('GoalQuestions');
      } catch (error) {
        console.error('Error saving health information:', error);
        Alert.alert('Error', 'Failed to save your health information. Please try again.');
      }
    }
  };

  const renderQuestion = () => {
    switch (currentQuestion) {
      case 1:
        return (
          <>
            <Text style={styles.title}>Do You Have Any Current Or Past Injuries?</Text>
            <Text style={styles.subtitle}>
              Please be specific about any baseball-related injuries
            </Text>
            <TextInput
              style={styles.input}
              multiline={true}
              numberOfLines={4}
              placeholder="Enter any injuries here..."
              value={injuries}
              onChangeText={setInjuries}
            />
          </>
        );
      case 2:
        return (
          <>
            <Text style={styles.title}>Do You Have Any Medical Conditions?</Text>
            <Text style={styles.subtitle}>
              Please list any conditions that might affect your training
            </Text>
            <TextInput
              style={styles.input}
              multiline={true}
              numberOfLines={4}
              placeholder="Enter any medical conditions here..."
              value={conditions}
              onChangeText={setConditions}
            />
          </>
        );
      case 3:
        return (
          <>
            <Text style={styles.title}>Do You Have Any Allergies?</Text>
            <Text style={styles.subtitle}>
              Please list any allergies we should be aware of
            </Text>
            <TextInput
              style={styles.input}
              multiline={true}
              numberOfLines={4}
              placeholder="Enter any allergies here..."
              value={allergies}
              onChangeText={setAllergies}
            />
          </>
        );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {renderQuestion()}
        
        <TouchableOpacity 
          style={styles.continueButton} 
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>
            {currentQuestion < 3 ? 'Next →' : 'Continue →'}
          </Text>
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

export default HealthQuestions; 