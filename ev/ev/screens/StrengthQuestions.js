import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StrengthQuestions = () => {
  const navigation = useNavigation();
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [deadliftMax, setDeadliftMax] = useState('');
  const [squatMax, setSquatMax] = useState('');
  const [reverseLungeMax, setReverseLungeMax] = useState('');
  const [benchPressMax, setBenchPressMax] = useState('');
  const [dashTime, setDashTime] = useState('');
  const [splitTime, setSplitTime] = useState('');

  const handleContinue = async () => {
    if (currentQuestion === 1 && selectedAnswer) {
      setCurrentQuestion(2);
    } else if (currentQuestion === 2 && deadliftMax) {
      setCurrentQuestion(3);
    } else if (currentQuestion === 3 && squatMax) {
      setCurrentQuestion(4);
    } else if (currentQuestion === 4 && reverseLungeMax) {
      setCurrentQuestion(5);
    } else if (currentQuestion === 5 && benchPressMax) {
      setCurrentQuestion(6);
    } else if (currentQuestion === 6 && dashTime) {
      setCurrentQuestion(7);
    } else if (currentQuestion === 7 && splitTime) {
      try {
        // Save all strength metrics to AsyncStorage
        await AsyncStorage.setItem('deadliftMax', deadliftMax);
        await AsyncStorage.setItem('squatMax', squatMax);
        await AsyncStorage.setItem('reverseLungeMax', reverseLungeMax);
        await AsyncStorage.setItem('benchPressMax', benchPressMax);
        await AsyncStorage.setItem('dashTime', dashTime);
        await AsyncStorage.setItem('splitTime', splitTime);

        // Log for verification
        console.log('Saved strength info:', {
          deadliftMax,
          squatMax,
          reverseLungeMax,
          benchPressMax,
          dashTime,
          splitTime
        });

        navigation.navigate('HealthQuestions');
      } catch (error) {
        console.error('Error saving strength information:', error);
        Alert.alert('Error', 'Failed to save your strength information. Please try again.');
      }
    }
  };

  const renderQuestion = () => {
    switch (currentQuestion) {
      case 1:
        return (
          <>
            <Text style={styles.title}>Do You Have Access To A Gym Or Gym Equipment?</Text>
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
          </>
        );
      
      case 2:
        return (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>What is your deadlift max?</Text>
              <View style={styles.textInputContainer}>
                <TextInput
                  style={styles.textInput}
                  value={deadliftMax}
                  onChangeText={setDeadliftMax}
                  placeholder="Enter weight in lbs"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        );
      
      case 3:
        return (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>What is your squat max?</Text>
              <View style={styles.textInputContainer}>
                <TextInput
                  style={styles.textInput}
                  value={squatMax}
                  onChangeText={setSquatMax}
                  placeholder="Enter weight in lbs"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        );
      
      case 4:
        return (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>What is your reverse lunge max?</Text>
              <View style={styles.textInputContainer}>
                <TextInput
                  style={styles.textInput}
                  value={reverseLungeMax}
                  onChangeText={setReverseLungeMax}
                  placeholder="Enter weight in lbs"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        );
      
      case 5:
        return (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>What is your bench press max?</Text>
              <View style={styles.textInputContainer}>
                <TextInput
                  style={styles.textInput}
                  value={benchPressMax}
                  onChangeText={setBenchPressMax}
                  placeholder="Enter weight in lbs"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        );
      
      case 6:
        return (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>What is your 60-yard dash time?</Text>
              <View style={styles.textInputContainer}>
                <TextInput
                  style={styles.textInput}
                  value={dashTime}
                  onChangeText={setDashTime}
                  placeholder="Enter time in seconds"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        );
      
      case 7:
        return (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>What is your 10-yard split time?</Text>
              <View style={styles.textInputContainer}>
                <TextInput
                  style={styles.textInput}
                  value={splitTime}
                  onChangeText={setSplitTime}
                  placeholder="Enter time in seconds"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        );
    }
  };

  return (
    <View style={styles.container}>
      {renderQuestion()}
      
      <Text style={styles.subtitle}>
        Please answer all questions accurately to ensure the best possible training program.
      </Text>

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
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
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
  textInputContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 20,
    marginTop: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 5,
  },
  textInput: {
    height: 50,
    padding: 10,
    fontSize: 16,
    color: 'black',
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

export default StrengthQuestions; 