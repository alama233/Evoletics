import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const FirstBaseSpecificQuestions = () => {
  const navigation = useNavigation();
  const [selectedAnswer, setSelectedAnswer] = useState('');

  const handleContinue = () => {
    navigation.navigate('AccessibilityQuestions');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Do You Have Access To Throwing-Specific Tools?</Text>
      
      <Text style={styles.subtitle}>
        Please answer all questions accurately to ensure the best possible training program.
      </Text>

      <Text style={styles.description}>
        (e.g., Jaeger Bands, weighted balls)
      </Text>

      <View style={styles.optionsContainer}>
        <TouchableOpacity 
          style={[
            styles.optionButton,
            selectedAnswer === 'Yes' && styles.selectedOption
          ]}
          onPress={() => setSelectedAnswer('Yes')}
        >
          <Text style={[
            styles.optionText,
            selectedAnswer === 'Yes' && styles.selectedOptionText
          ]}>Yes</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.optionButton,
            selectedAnswer === 'No' && styles.selectedOption
          ]}
          onPress={() => setSelectedAnswer('No')}
        >
          <Text style={[
            styles.optionText,
            selectedAnswer === 'No' && styles.selectedOptionText
          ]}>No</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.continueButton} 
        onPress={handleContinue}
      >
        <Text style={styles.continueButtonText}>Continue →</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    fontStyle: 'italic',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  optionButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  selectedOption: {
    backgroundColor: '#000',
  },
  optionText: {
    fontSize: 16,
    color: '#000',
  },
  selectedOptionText: {
    color: '#fff',
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

export default FirstBaseSpecificQuestions; 