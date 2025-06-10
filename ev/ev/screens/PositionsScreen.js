import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Checkbox from 'expo-checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PositionsScreen = () => {
  const navigation = useNavigation();
  const [selectedPositions, setSelectedPositions] = useState({
    Pitcher: false,
    Catcher: false,
    'First Base': false,
    'Second Base': false,
    'Third Base': false,
    Shortstop: false,
    Outfield: false,
    'Designated Hitter': false,
  });

  const handlePositionSelect = (position) => {
    setSelectedPositions(prev => ({
      ...prev,
      [position]: !prev[position]
    }));
  };

  const handleContinue = async () => {
    try {
      // Get selected positions as an array
      const selectedPositionsArray = Object.entries(selectedPositions)
        .filter(([_, isSelected]) => isSelected)
        .map(([position]) => position);

      if (selectedPositionsArray.length === 0) {
        Alert.alert('Error', 'Please select at least one position.');
        return;
      }

      // Save position-specific answers
      await AsyncStorage.setItem('positions', selectedPositionsArray.join(','));
      
      // Log for verification
      console.log('Saved position info:', { 
        positions: selectedPositionsArray
      });

      // Navigate based on selected position
      if (selectedPositions['Pitcher']) {
        navigation.navigate('PitcherSpecificQuestions');
      } else if (selectedPositions['Catcher']) {
        navigation.navigate('CatcherSpecificQuestions');
      } else if (selectedPositions['First Base']) {
        navigation.navigate('FirstBaseSpecificQuestions');
      } else if (selectedPositions['Second Base'] || 
                 selectedPositions['Shortstop'] || 
                 selectedPositions['Third Base']) {
        navigation.navigate('InfieldSpecificQuestions');
      } else if (selectedPositions['Outfield']) {
        navigation.navigate('OFSpecificQuestions');
      } else if (selectedPositions['Designated Hitter']) {
        navigation.navigate('DHSpecificQuestions');
      } else {
        navigation.navigate('AccessibilityQuestions');
      }
    } catch (error) {
      console.error('Error saving position information:', error);
      Alert.alert('Error', 'Failed to save your position information. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What Position(s) Do You Play?</Text>
      
      <Text style={styles.subtitle}>
        Please answer all questions accurately to ensure the best possible training program.
      </Text>

      <ScrollView style={styles.checkboxContainer}>
        {Object.keys(selectedPositions).map((position) => (
          <TouchableOpacity
            key={position}
            style={styles.checkboxRow}
            onPress={() => handlePositionSelect(position)}
          >
            <Checkbox
              value={selectedPositions[position]}
              onValueChange={() => handlePositionSelect(position)}
              style={styles.checkbox}
              color={selectedPositions[position] ? '#000' : undefined}
            />
            <Text style={styles.checkboxLabel}>{position}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
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
    marginBottom: 30,
  },
  checkboxContainer: {
    flex: 1,
    marginBottom: 20,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginVertical: 4,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  checkbox: {
    marginRight: 10,
    height: 24,
    width: 24,
  },
  checkboxLabel: {
    fontSize: 16,
  },
  continueButton: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PositionsScreen; 