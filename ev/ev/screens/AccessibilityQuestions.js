import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AccessibilityQuestions = () => {
  const navigation = useNavigation();
  const [hasEquipment, setHasEquipment] = useState('');
  const [gymAccess, setGymAccess] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const [trainingTime, setTrainingTime] = useState('');

  const handleContinue = async () => {
    try {
      if (!hasEquipment) {
        Alert.alert('Error', 'Please select whether you have access to equipment');
        return;
      }

      // Save accessibility answers
      await AsyncStorage.setItem('hasEquipment', hasEquipment);
      await AsyncStorage.setItem('equipmentAccess', hasEquipment); // For backwards compatibility
      
      // Log for verification
      console.log('Saved accessibility info:', {
        hasEquipment,
        equipmentAccess: hasEquipment
      });

      navigation.navigate('StrengthQuestions');
    } catch (error) {
      console.error('Error saving accessibility information:', error);
      Alert.alert('Error', 'Failed to save your accessibility information. Please try again.');
    }
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
            hasEquipment === 'Yes' && styles.selectedOption
          ]}
          onPress={() => setHasEquipment('Yes')}
        >
          <Text style={[
            styles.optionText,
            hasEquipment === 'Yes' && styles.selectedOptionText
          ]}>Yes</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.optionButton,
            hasEquipment === 'No' && styles.selectedOption
          ]}
          onPress={() => setHasEquipment('No')}
        >
          <Text style={[
            styles.optionText,
            hasEquipment === 'No' && styles.selectedOptionText
          ]}>No</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={[
          styles.continueButton,
          !hasEquipment && styles.disabledButton
        ]} 
        onPress={handleContinue}
        disabled={!hasEquipment}
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
  disabledButton: {
    opacity: 0.5,
  }
});

export default AccessibilityQuestions; 