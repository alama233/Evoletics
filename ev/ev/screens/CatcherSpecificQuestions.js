import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import Checkbox from 'expo-checkbox';

const CatcherSpecificQuestions = () => {
  const navigation = useNavigation();
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [popTime, setPopTime] = useState('');
  const [throwingVelocity, setThrowingVelocity] = useState('');
  const [blockingRating, setBlockingRating] = useState('');
  const [catchingSkills] = useState([
    { key: 'Blocking', label: 'Blocking' },
    { key: 'Framing', label: 'Framing' },
    { key: 'Throwing Accuracy', label: 'Throwing Accuracy' },
    { key: 'Throwing Strength', label: 'Throwing Strength' },
    { key: 'Receiving', label: 'Receiving' }
  ]);
  const [rankedSkills, setRankedSkills] = useState([]);
  const [trainingGoals, setTrainingGoals] = useState({
    'Improve pop time': false,
    'Gain throwing velocity to bases': false,
    'Get better at blocking': false,
    'Get better at framing': false
  });
  const [exitVelocity, setExitVelocity] = useState('');
  const [hittingRating, setHittingRating] = useState('');
  const [hittingAspects] = useState([
    { key: 'Contact Ability', label: 'Contact Ability' },
    { key: 'Power Hitting', label: 'Power Hitting' },
    { key: 'Plate Discipline', label: 'Plate Discipline' },
    { key: 'Bat Speed', label: 'Bat Speed' }
  ]);
  const [rankedHittingAspects, setRankedHittingAspects] = useState([]);
  const [hittingImprovement, setHittingImprovement] = useState('');
  const [shortTermGoals, setShortTermGoals] = useState('');
  const [longTermGoals, setLongTermGoals] = useState('');

  // Generate pop time options from 1.60 to 3.00 in increments of 0.05
  const generatePopTimes = () => {
    const times = [];
    for (let i = 160; i <= 300; i += 5) {
      times.push((i / 100).toFixed(2));
    }
    return times;
  };

  // Generate velocity options from 20 to 100 mph
  const velocityOptions = Array.from({ length: 81 }, (_, i) => (i + 20).toString());

  // Generate exit velocity options from 70 to 120 mph
  const exitVelocityOptions = Array.from({ length: 51 }, (_, i) => (i + 70).toString());

  const popTimeOptions = generatePopTimes();

  const handleGoalSelect = (goal) => {
    setTrainingGoals(prev => ({
      ...prev,
      [goal]: !prev[goal]
    }));
  };

  const handleContinue = () => {
    if (currentQuestion === 1) {
      setCurrentQuestion(2);
    } else if (currentQuestion === 2) {
      setCurrentQuestion(3);
    } else if (currentQuestion === 3) {
      setRankedSkills(catchingSkills);
      setCurrentQuestion(4);
    } else if (currentQuestion === 4) {
      setCurrentQuestion(5);
    } else if (currentQuestion === 5) {
      setCurrentQuestion(6);
    } else if (currentQuestion === 6) {
      setCurrentQuestion(7);
    } else if (currentQuestion === 7) {
      setRankedHittingAspects(hittingAspects);
      setCurrentQuestion(8);
    } else if (currentQuestion === 8) {
      setCurrentQuestion(9);
    } else if (currentQuestion === 9) {
      setCurrentQuestion(10);
    } else if (currentQuestion === 10) {
      setCurrentQuestion(11);
    } else {
      navigation.navigate('AccessibilityQuestions');
    }
  };

  const renderDraggableItem = ({ item, drag, isActive }) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity
          onLongPress={drag}
          disabled={isActive}
          style={[
            styles.dragItem,
            { backgroundColor: isActive ? '#E0E0E0' : '#f5f5f5' }
          ]}
        >
          <Text style={styles.dragItemLabel}>{item.label}</Text>
          <Text style={styles.dragHandle}>⋮⋮</Text>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  const renderQuestion = () => {
    switch (currentQuestion) {
      case 1:
        return (
          <>
            <Text style={styles.title}>What Is Your Best Pop Time?</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={popTime}
                onValueChange={(itemValue) => setPopTime(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select Pop Time" value="" />
                {popTimeOptions.map((time) => (
                  <Picker.Item 
                    key={time} 
                    label={`${time} seconds`} 
                    value={time} 
                  />
                ))}
                <Picker.Item label="3.0+ seconds" value="3.0+" />
              </Picker>
            </View>
          </>
        );
      case 2:
        return (
          <>
            <Text style={styles.title}>What Is Your Top Throwing Velocity To Second Base?</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={throwingVelocity}
                onValueChange={(itemValue) => setThrowingVelocity(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select Velocity" value="" />
                {velocityOptions.map((speed) => (
                  <Picker.Item 
                    key={speed} 
                    label={`${speed} mph`} 
                    value={speed} 
                  />
                ))}
              </Picker>
            </View>
          </>
        );
      case 3:
        return (
          <>
            <Text style={styles.title}>How Would You Rate Your Blocking Ability?</Text>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((rating) => (
                <TouchableOpacity
                  key={rating}
                  style={[
                    styles.ratingButton,
                    blockingRating === rating.toString() && styles.selectedRating
                  ]}
                  onPress={() => setBlockingRating(rating.toString())}
                >
                  <Text
                    style={[
                      styles.ratingNumber,
                      blockingRating === rating.toString() && styles.selectedRatingText
                    ]}
                  >
                    {rating}
                  </Text>
                  <Text
                    style={[
                      styles.ratingLabel,
                      blockingRating === rating.toString() && styles.selectedRatingText
                    ]}
                  >
                    {rating === 1 ? 'Weak' : rating === 5 ? 'Excellent' : ''}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        );
      case 4:
        return (
          <>
            <Text style={styles.title}>Rank These Catching Skills From Weakest To Strongest</Text>
            <Text style={styles.dragInstructions}>Press and hold to drag skills into order</Text>
            <DraggableFlatList
              data={rankedSkills}
              onDragEnd={({ data }) => setRankedSkills(data)}
              keyExtractor={(item) => item.key}
              renderItem={renderDraggableItem}
              style={styles.dragList}
            />
          </>
        );
      case 5:
        return (
          <>
            <Text style={styles.title}>What Are Your Catching Training Goals For This Year?</Text>
            <ScrollView style={styles.checkboxContainer}>
              {Object.keys(trainingGoals).map((goal) => (
                <TouchableOpacity
                  key={goal}
                  style={styles.checkboxRow}
                  onPress={() => handleGoalSelect(goal)}
                >
                  <Checkbox
                    value={trainingGoals[goal]}
                    onValueChange={() => handleGoalSelect(goal)}
                    style={styles.checkbox}
                    color={trainingGoals[goal] ? '#000' : undefined}
                  />
                  <Text style={styles.checkboxLabel}>{goal}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        );
      case 6:
        return (
          <>
            <Text style={styles.title}>What Is Your Top Exit Velocity?</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={exitVelocity}
                onValueChange={(itemValue) => setExitVelocity(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select Exit Velocity" value="" />
                {exitVelocityOptions.map((speed) => (
                  <Picker.Item 
                    key={speed} 
                    label={`${speed} mph`} 
                    value={speed} 
                  />
                ))}
              </Picker>
            </View>
          </>
        );
      case 7:
        return (
          <>
            <Text style={styles.title}>How Would You Rate Your Hitting Ability?</Text>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((rating) => (
                <TouchableOpacity
                  key={rating}
                  style={[
                    styles.ratingButton,
                    hittingRating === rating.toString() && styles.selectedRating
                  ]}
                  onPress={() => setHittingRating(rating.toString())}
                >
                  <Text
                    style={[
                      styles.ratingNumber,
                      hittingRating === rating.toString() && styles.selectedRatingText
                    ]}
                  >
                    {rating}
                  </Text>
                  <Text
                    style={[
                      styles.ratingLabel,
                      hittingRating === rating.toString() && styles.selectedRatingText
                    ]}
                  >
                    {rating === 1 ? 'Weak' : rating === 5 ? 'Excellent' : ''}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        );
      case 8:
        return (
          <>
            <Text style={styles.title}>Rank These Hitting Aspects From Weakest To Strongest</Text>
            <Text style={styles.dragInstructions}>Press and hold to drag aspects into order</Text>
            <DraggableFlatList
              data={rankedHittingAspects}
              onDragEnd={({ data }) => setRankedHittingAspects(data)}
              keyExtractor={(item) => item.key}
              renderItem={renderDraggableItem}
              style={styles.dragList}
            />
          </>
        );
      case 9:
        return (
          <>
            <Text style={styles.title}>What Is The Main Aspect Of Your Hitting Game That You Want To Improve Using Evoletics?</Text>
            <TextInput
              style={styles.textInput}
              value={hittingImprovement}
              onChangeText={setHittingImprovement}
              placeholder="Enter your hitting improvement goals..."
              multiline
              textAlignVertical="top"
              numberOfLines={4}
            />
          </>
        );
      case 10:
        return (
          <>
            <Text style={styles.title}>What Are Your Short-Term Goals As A Catcher?</Text>
            <TextInput
              style={styles.textInput}
              value={shortTermGoals}
              onChangeText={setShortTermGoals}
              placeholder="Enter your short-term goals..."
              multiline
              textAlignVertical="top"
              numberOfLines={4}
            />
          </>
        );
      case 11:
        return (
          <>
            <Text style={styles.title}>What Are Your Long-Term Goals As A Catcher?</Text>
            <TextInput
              style={styles.textInput}
              value={longTermGoals}
              onChangeText={setLongTermGoals}
              placeholder="Enter your long-term goals..."
              multiline
              textAlignVertical="top"
              numberOfLines={4}
            />
          </>
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  pickerContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
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
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  ratingButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
    margin: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedRating: {
    backgroundColor: '#000',
  },
  ratingNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  ratingLabel: {
    fontSize: 12,
    color: '#666',
  },
  selectedRatingText: {
    color: '#fff',
  },
  dragInstructions: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  dragList: {
    flex: 1,
  },
  dragItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    padding: 16,
    marginVertical: 4,
    borderRadius: 8,
  },
  dragItemLabel: {
    fontSize: 16,
  },
  dragHandle: {
    fontSize: 20,
    color: '#666',
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
  textInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    fontSize: 16,
  },
});

export default CatcherSpecificQuestions; 