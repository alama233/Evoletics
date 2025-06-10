import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

const DHSpecificQuestions = () => {
  const navigation = useNavigation();
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [exitVelocity, setExitVelocity] = useState('');
  const [hittingAbility, setHittingAbility] = useState('');
  const [rankedAspects, setRankedAspects] = useState([
    { id: '1', text: 'Contact Ability', rank: null },
    { id: '2', text: 'Power Hitting', rank: null },
    { id: '3', text: 'Plate Discipline', rank: null },
    { id: '4', text: 'Bat Speed', rank: null }
  ]);
  const [currentRank, setCurrentRank] = useState(1);
  const [improvementGoal, setImprovementGoal] = useState('');
  const [shortTermGoals, setShortTermGoals] = useState('');
  const [longTermGoals, setLongTermGoals] = useState('');

  const handleRankSelection = (aspect) => {
    if (aspect.rank === null) {
      const updatedAspects = rankedAspects.map(item => 
        item.id === aspect.id ? { ...item, rank: currentRank } : item
      );
      setRankedAspects(updatedAspects);
      setCurrentRank(prev => prev + 1);
    }
  };

  const handleContinue = () => {
    if (currentQuestion === 1 && exitVelocity !== '') {
      setCurrentQuestion(2);
    } else if (currentQuestion === 2 && hittingAbility) {
      setCurrentQuestion(3);
    } else if (currentQuestion === 3 && currentRank > 4) {
      setCurrentQuestion(4);
    } else if (currentQuestion === 4 && improvementGoal) {
      setCurrentQuestion(5);
    } else if (currentQuestion === 5 && shortTermGoals.trim()) {
      setTimeout(() => {
        setCurrentQuestion(6);
      }, 0);
    } else if (currentQuestion === 6 && longTermGoals.trim()) {
      navigation.navigate('AccessibilityQuestions');
    }
  };

  const renderQuestion = () => {
    switch (currentQuestion) {
      case 1:
        return (
          <>
            <Text style={styles.title}>What Is Your Top Exit Velocity?</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={exitVelocity}
                onValueChange={(itemValue) => setExitVelocity(itemValue)}
                style={styles.picker}
                dropdownIconColor="black"
              >
                <Picker.Item label="Select Exit Velocity (mph)" value="" />
                {Array.from({ length: 51 }, (_, i) => i + 70).map((speed) => (
                  <Picker.Item 
                    key={speed.toString()} 
                    label={`${speed} mph`} 
                    value={speed.toString()}
                    color="black"
                  />
                ))}
              </Picker>
            </View>
          </>
        );
      case 2:
        return (
          <>
            <Text style={styles.title}>How Would You Rate Your Hitting Ability?</Text>
            <View style={styles.optionsContainer}>
              {['1 - Weak', '2 - Below Average', '3 - Average', '4 - Above Average', '5 - Excellent'].map((rating, index) => (
                <TouchableOpacity 
                  key={index}
                  style={[
                    styles.optionButton,
                    hittingAbility === (index + 1).toString() && styles.selectedOption
                  ]}
                  onPress={() => setHittingAbility((index + 1).toString())}
                >
                  <Text style={[
                    styles.optionText,
                    hittingAbility === (index + 1).toString() && styles.selectedOptionText
                  ]}>
                    {rating}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        );
      case 3:
        return (
          <>
            <Text style={styles.title}>Rank These Hitting Aspects From Weakest to Strongest:</Text>
            <View style={styles.optionsContainer}>
              {rankedAspects.map((aspect) => (
                <TouchableOpacity 
                  key={aspect.id}
                  style={[
                    styles.optionButton,
                    aspect.rank !== null && styles.selectedOption
                  ]}
                  onPress={() => handleRankSelection(aspect)}
                  disabled={aspect.rank !== null}
                >
                  <Text style={[
                    styles.optionText,
                    aspect.rank !== null && styles.selectedOptionText
                  ]}>
                    {aspect.rank ? `${aspect.rank}. ${aspect.text}` : aspect.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        );
      case 4:
        return (
          <>
            <Text style={styles.title}>What is the main aspect of your hitting game that you want to improve using Evoletics?</Text>
            <View style={styles.optionsContainer}>
              <TouchableOpacity 
                style={[
                  styles.optionButton,
                  improvementGoal === 'Contact' && styles.selectedOption
                ]}
                onPress={() => setImprovementGoal('Contact')}
              >
                <Text style={[
                  styles.optionText,
                  improvementGoal === 'Contact' && styles.selectedOptionText
                ]}>Contact</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.optionButton,
                  improvementGoal === 'Power' && styles.selectedOption
                ]}
                onPress={() => setImprovementGoal('Power')}
              >
                <Text style={[
                  styles.optionText,
                  improvementGoal === 'Power' && styles.selectedOptionText
                ]}>Power</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.optionButton,
                  improvementGoal === 'Plate Discipline' && styles.selectedOption
                ]}
                onPress={() => setImprovementGoal('Plate Discipline')}
              >
                <Text style={[
                  styles.optionText,
                  improvementGoal === 'Plate Discipline' && styles.selectedOptionText
                ]}>Plate Discipline</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.optionButton,
                  improvementGoal === 'Bat Speed' && styles.selectedOption
                ]}
                onPress={() => setImprovementGoal('Bat Speed')}
              >
                <Text style={[
                  styles.optionText,
                  improvementGoal === 'Bat Speed' && styles.selectedOptionText
                ]}>Bat Speed</Text>
              </TouchableOpacity>
            </View>
          </>
        );
      case 5:
        return (
          <>
            <Text style={styles.title}>What are your short-term goals as a hitter?</Text>
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                value={shortTermGoals}
                onChangeText={setShortTermGoals}
                placeholder="Enter your short-term goals"
                placeholderTextColor="#999"
                multiline={true}
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </>
        );
      case 6:
        return (
          <>
            <Text style={styles.title}>What are your long-term goals as a hitter?</Text>
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                value={longTermGoals}
                onChangeText={setLongTermGoals}
                placeholder="Enter your long-term goals"
                placeholderTextColor="#999"
                multiline={true}
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </>
        );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {renderQuestion()}
        
        <Text style={styles.subtitle}>
          Please answer all questions accurately to ensure the best possible training program.
        </Text>

        <TouchableOpacity 
          style={[
            styles.continueButton,
            ((currentQuestion === 1 && exitVelocity === '') || 
             (currentQuestion === 2 && !hittingAbility) ||
             (currentQuestion === 3 && currentRank <= 4) ||
             (currentQuestion === 4 && !improvementGoal) ||
             (currentQuestion === 5 && !shortTermGoals.trim()) ||
             (currentQuestion === 6 && !longTermGoals.trim())) && 
            styles.disabledButton
          ]} 
          onPress={() => {
            Keyboard.dismiss();
            handleContinue();
          }}
          disabled={
            (currentQuestion === 1 && exitVelocity === '') || 
            (currentQuestion === 2 && !hittingAbility) ||
            (currentQuestion === 3 && currentRank <= 4) ||
            (currentQuestion === 4 && !improvementGoal) ||
            (currentQuestion === 5 && !shortTermGoals.trim()) ||
            (currentQuestion === 6 && !longTermGoals.trim())
          }
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
    marginTop: 10,
    marginBottom: 30,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 20,
    marginTop: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  picker: {
    height: 50,
    width: '100%',
    color: 'black',
  },
  optionsContainer: {
    width: '100%',
    gap: 10,
    marginTop: 10,
  },
  optionButton: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  selectedOption: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
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
  },
  disabledButton: {
    opacity: 0.5,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
    height: 100,
    padding: 10,
    fontSize: 16,
    color: 'black',
    textAlignVertical: 'top',
  },
});

export default DHSpecificQuestions; 