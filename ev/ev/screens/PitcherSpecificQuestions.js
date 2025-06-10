import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Pressable, TextInput, Alert, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import Checkbox from 'expo-checkbox';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PitcherSpecificQuestions = () => {
  const navigation = useNavigation();
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [topVelocity, setTopVelocity] = useState('');
  const [sittingVelocity, setSittingVelocity] = useState('');
  const [pitchTypes, setPitchTypes] = useState({
    '4-seam Fastball': false,
    '2-seam Fastball': false,
    'Curveball': false,
    'Slider': false,
    'Changeup': false,
    'Cutter': false,
    'Splitter': false,
    'Sinker': false,
    'Knuckleball': false
  });
  const [rankedPitches, setRankedPitches] = useState([]);
  const [trainingGoals, setTrainingGoals] = useState({
    'Gain more pitching velocity': false,
    'Improve my pitching arsenal': false,
    'Improve my pitching command': false
  });
  const [pitchingAspects] = useState([
    { key: 'Strength', label: 'Strength' },
    { key: 'Mobility', label: 'Mobility' },
    { key: 'Pitching Mechanics', label: 'Pitching Mechanics' },
    { key: 'Pitching Velocity', label: 'Pitching Velocity' },
    { key: 'Pitching Arsenal', label: 'Pitching Arsenal' },
    { key: 'Pitching Command', label: 'Pitching Command' }
  ]);
  const [rankedAspects, setRankedAspects] = useState([]);
  const [videoUri, setVideoUri] = useState(null);
  const [currentVelocity, setCurrentVelocity] = useState('');
  const [targetVelocity, setTargetVelocity] = useState('');

  // Generate velocity options from 25 to 110 mph
  const velocityOptions = Array.from({ length: 86 }, (_, i) => (i + 25).toString());

  // Update rankedPitches when pitchTypes changes
  useEffect(() => {
    const selectedPitches = Object.entries(pitchTypes)
      .filter(([_, isSelected]) => isSelected)
      .map(([pitch]) => ({
        key: pitch,
        label: pitch
      }));
    setRankedPitches(selectedPitches);
  }, [pitchTypes]);

  // Initialize rankedAspects when component mounts
  useEffect(() => {
    setRankedAspects(pitchingAspects);
  }, []);

  const handlePitchSelect = (pitch) => {
    setPitchTypes(prev => ({
      ...prev,
      [pitch]: !prev[pitch]
    }));
  };

  const handleGoalSelect = (goal) => {
    setTrainingGoals(prev => ({
      ...prev,
      [goal]: !prev[goal]
    }));
  };

  const handleVideoUpload = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        alert('Permission to access camera roll is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setVideoUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Error uploading video. Please try again.');
    }
  };

  const handleContinue = async () => {
    try {
      // Get selected pitch types and goals
      const selectedPitches = Object.entries(pitchTypes)
        .filter(([_, isSelected]) => isSelected)
        .map(([pitch]) => pitch);

      const selectedGoals = Object.entries(trainingGoals)
        .filter(([_, isSelected]) => isSelected)
        .map(([goal]) => goal);

      // Save all pitcher-specific answers
      await AsyncStorage.setItem('topVelocity', topVelocity);
      await AsyncStorage.setItem('sittingVelocity', sittingVelocity);
      await AsyncStorage.setItem('pitchTypes', selectedPitches.join(','));
      await AsyncStorage.setItem('throwingVelocity', topVelocity);
      await AsyncStorage.setItem('rankedPitches', JSON.stringify(rankedPitches));
      await AsyncStorage.setItem('pitchingGoals', JSON.stringify(selectedGoals));
      await AsyncStorage.setItem('rankedAspects', JSON.stringify(rankedAspects));
      if (videoUri) {
        await AsyncStorage.setItem('pitchingVideo', videoUri);
      }

      // Log for verification
      console.log('Saved pitcher info:', {
        topVelocity,
        sittingVelocity,
        pitchTypes: selectedPitches,
        rankedPitches,
        pitchingGoals: selectedGoals,
        rankedAspects,
        hasVideo: !!videoUri
      });

      navigation.navigate('AccessibilityQuestions');
    } catch (error) {
      console.error('Error saving pitcher information:', error);
      Alert.alert('Error', 'Failed to save your pitching information. Please try again.');
    }
  };

  const handleNextQuestion = () => {
    switch (currentQuestion) {
      case 1:
        if (!topVelocity) {
          Alert.alert('Error', 'Please select your top velocity');
          return;
        }
        setCurrentQuestion(2);
        break;
      case 2:
        if (!sittingVelocity) {
          Alert.alert('Error', 'Please select your sitting velocity');
          return;
        }
        setCurrentQuestion(3);
        break;
      case 3:
        // When moving from pitch selection to ranking
        const selectedPitches = Object.entries(pitchTypes)
          .filter(([_, isSelected]) => isSelected)
          .map(([pitch]) => ({
            key: pitch,
            label: pitch
          }));
        if (selectedPitches.length === 0) {
          Alert.alert('Error', 'Please select at least one pitch type');
          return;
        }
        setRankedPitches(selectedPitches);
        setCurrentQuestion(4);
        break;
      case 4:
        if (rankedPitches.length < 1) {
          Alert.alert('Error', 'Please rank your pitches');
          return;
        }
        setCurrentQuestion(5);
        break;
      case 5:
        if (Object.values(trainingGoals).every(Boolean)) {
          setCurrentQuestion(6);
        } else {
          Alert.alert('Error', 'Please select all training goals');
        }
        break;
      case 6:
        if (rankedAspects.length < 1) {
          Alert.alert('Error', 'Please rank these aspects');
          return;
        }
        setCurrentQuestion(7);
        break;
      case 7:
        handleContinue();
        break;
      default:
        handleContinue();
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
            <Text style={styles.title}>What Is Your Top Pitching Velocity?</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={topVelocity}
                onValueChange={(itemValue) => setTopVelocity(itemValue)}
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
      case 2:
        return (
          <>
            <Text style={styles.title}>What Is Your Sitting (Average) Pitching Velocity?</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={sittingVelocity}
                onValueChange={(itemValue) => setSittingVelocity(itemValue)}
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
          <View style={styles.questionContainer}>
            <Text style={styles.title}>What Pitches Do You Throw?</Text>
            <FlatList
              data={Object.keys(pitchTypes)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  key={item}
                  style={styles.checkboxRow}
                  onPress={() => handlePitchSelect(item)}
                >
                  <Checkbox
                    value={pitchTypes[item]}
                    onValueChange={() => handlePitchSelect(item)}
                    style={styles.checkbox}
                    color={pitchTypes[item] ? '#000' : undefined}
                  />
                  <Text style={styles.checkboxLabel}>{item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={item => item}
            />
          </View>
        );
      case 4:
        return (
          <>
            <Text style={styles.title}>Rank Your Pitches From Best To Worst</Text>
            <Text style={styles.dragInstructions}>Press and hold to drag pitches into order</Text>
            {rankedPitches.length > 0 ? (
              <DraggableFlatList
                data={rankedPitches}
                onDragEnd={({ data }) => setRankedPitches(data)}
                keyExtractor={(item) => item.key}
                renderItem={renderDraggableItem}
                style={styles.dragList}
              />
            ) : (
              <Text style={styles.noSelectionText}>
                No pitches selected. Please go back and select your pitches.
              </Text>
            )}
          </>
        );
      case 5:
        return (
          <>
            <Text style={styles.title}>What Are Your Pitching Training Goals For This Year?</Text>
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
            <Text style={styles.title}>Rank These Aspects Of Pitching From Weakest To Strongest</Text>
            <Text style={styles.dragInstructions}>Press and hold to drag aspects into order</Text>
            <DraggableFlatList
              data={rankedAspects}
              onDragEnd={({ data }) => setRankedAspects(data)}
              keyExtractor={(item) => item.key}
              renderItem={renderDraggableItem}
              style={styles.dragList}
            />
          </>
        );
      case 7:
        return (
          <>
            <Text style={styles.title}>(Optional) Upload A Video Of Your Pitching Mechanics For AI Analysis</Text>
            <View style={styles.uploadContainer}>
              <TouchableOpacity 
                style={styles.uploadButton}
                onPress={handleVideoUpload}
              >
                <MaterialIcons name="video-library" size={24} color="white" />
                <Text style={styles.uploadButtonText}>
                  {videoUri ? 'Video Selected' : 'Select Video'}
                </Text>
              </TouchableOpacity>
              {videoUri && (
                <Text style={styles.videoSelected}>
                  Video successfully selected
                </Text>
              )}
            </View>
          </>
        );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.content}>
          {renderQuestion()}
          
          <Text style={styles.subtitle}>
            Please answer all questions accurately to ensure the best possible training program.
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.continueButton} 
          onPress={handleNextQuestion}
        >
          <Text style={styles.continueButtonText}>
            {currentQuestion < 7 ? 'Next →' : 'Continue →'}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
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
  dragInstructions: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    fontStyle: 'italic',
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
  noSelectionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
  uploadContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  uploadButton: {
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    marginBottom: 10,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  videoSelected: {
    color: '#4CAF50',
    fontSize: 14,
    marginTop: 10,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  questionContainer: {
    flex: 1,
  },
});

export default PitcherSpecificQuestions; 