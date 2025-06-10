import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert, Image, TextInput, Modal, Vibration } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { saveWorkoutProgress } from '../services/workoutTracker';

const RestTimer = ({ seconds, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const timerRef = useRef(null);

  useEffect(() => {
    if (timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            Vibration.vibrate();
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [timeLeft]);

  return (
    <View style={styles.timerContainer}>
      <Text style={styles.timerText}>{timeLeft}s</Text>
      <Text style={styles.timerLabel}>Rest Time</Text>
    </View>
  );
};

const WorkoutExercisesScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { workout } = route.params;
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedSets, setCompletedSets] = useState({});
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [showWeightInput, setShowWeightInput] = useState(false);
  const [weightInput, setWeightInput] = useState('');
  const [repsInput, setRepsInput] = useState('');
  const [exerciseHistory, setExerciseHistory] = useState({});

  const exercises = [
    { 
      id: 1, 
      name: 'Barbell Squats', 
      sets: 3, 
      reps: 12, 
      weight: '135 lbs',
      instructions: 'Keep your back straight and feet shoulder-width apart. Drive through your heels.',
      restTime: 90,
      hasIllustration: false
    },
    {
      id: 2,
      name: 'Bench Press',
      sets: 3,
      reps: 10,
      weight: '185 lbs',
      instructions: 'Keep your feet flat, back arched, and grip slightly wider than shoulder width.',
      restTime: 90,
      hasIllustration: false
    },
    {
      id: 3,
      name: 'Deadlifts',
      sets: 3,
      reps: 8,
      weight: '225 lbs',
      instructions: 'Bar over mid-foot, hinge at hips, keep back straight, and chest up.',
      restTime: 120,
      hasIllustration: false
    },
    {
      id: 4,
      name: 'Pull-ups',
      sets: 3,
      reps: 10,
      weight: 'Body weight',
      instructions: 'Full range of motion, engage your lats, and control the descent.',
      restTime: 90,
      hasIllustration: false
    },
    {
      id: 5,
      name: 'Overhead Press',
      sets: 3,
      reps: 8,
      weight: '95 lbs',
      instructions: 'Core tight, straight bar path, and full lockout at the top.',
      restTime: 90,
      hasIllustration: false
    }
  ];

  const handleSetComplete = (exerciseId, setNumber) => {
    setShowWeightInput(true);
    // Rest handled in weight input modal
  };

  const handleWeightSubmit = () => {
    const currentExercise = exercises[currentExerciseIndex];
    
    // Save weight/rep data
    setExerciseHistory(prev => ({
      ...prev,
      [currentExercise.id]: [
        ...(prev[currentExercise.id] || []),
        { weight: weightInput, reps: repsInput, date: new Date() }
      ]
    }));

    // Mark set as complete
    setCompletedSets(prev => ({
      ...prev,
      [currentExercise.id]: [...(prev[currentExercise.id] || []), setNumber]
    }));

    setShowWeightInput(false);
    setWeightInput('');
    setRepsInput('');
    setShowRestTimer(true);
  };

  const handleWorkoutComplete = async () => {
    try {
      const exerciseData = exercises.map(exercise => ({
        id: exercise.id,
        name: exercise.name,
        sets: completedSets[exercise.id] || [],
        weight: exerciseHistory[exercise.id] || []
      }));

      await saveWorkoutProgress(workout.id, exerciseData);
      
      Alert.alert(
        "Workout Complete!",
        "Great job! Your progress has been saved.",
        [
          { 
            text: "Finish", 
            onPress: () => navigation.navigate('Home')
          }
        ]
      );
    } catch (error) {
      console.error('Error completing workout:', error);
      Alert.alert("Error", "Failed to save workout progress");
    }
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    } else {
      handleWorkoutComplete();
    }
  };

  const currentExercise = exercises[currentExerciseIndex];
  const completedSetsForExercise = completedSets[currentExercise.id] || [];

  const handleFormAnalysis = async () => {
    const exerciseDescription = `${currentExercise.name} form check:
      - Weight used: ${weightInput} lbs
      - Reps performed: ${repsInput}
      - Exercise cues: ${currentExercise.instructions}`;

    try {
      const feedback = await analyzeForm(exerciseDescription);
      Alert.alert(
        "Form Analysis",
        feedback,
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error('Form analysis error:', error);
      Alert.alert(
        "Error",
        "Unable to analyze form at this time.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => {
            Alert.alert(
              "End Workout?",
              "Are you sure you want to end this workout?",
              [
                { text: "Cancel", style: "cancel" },
                { text: "End", onPress: () => navigation.goBack() }
              ]
            );
          }}
        >
          <Icon name="close" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{workout.type}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Progress Indicator */}
        <View style={styles.progressIndicator}>
          <Text style={styles.progressText}>
            Exercise {currentExerciseIndex + 1} of {exercises.length}
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${((currentExerciseIndex + 1) / exercises.length) * 100}%` }
              ]} 
            />
          </View>
        </View>

        {/* Current Exercise */}
        <View style={styles.exerciseContainer}>
          <Text style={styles.exerciseName}>{currentExercise.name}</Text>
          
          {/* Exercise Illustration - Only show if available */}
          {currentExercise.hasIllustration && (
            <Image 
              source={currentExercise.illustration}
              style={styles.exerciseImage}
              resizeMode="contain"
            />
          )}

          <Text style={styles.exerciseInstructions}>{currentExercise.instructions}</Text>

          {/* Previous Set History */}
          {exerciseHistory[currentExercise.id]?.length > 0 && (
            <View style={styles.historyContainer}>
              <Text style={styles.historyTitle}>Previous Set:</Text>
              <Text style={styles.historyText}>
                {exerciseHistory[currentExercise.id].slice(-1)[0].weight} lbs × 
                {exerciseHistory[currentExercise.id].slice(-1)[0].reps} reps
              </Text>
            </View>
          )}

          {/* Sets Progress */}
          <View style={styles.setsContainer}>
            {[...Array(currentExercise.sets)].map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.setButton,
                  completedSetsForExercise.includes(index + 1) && styles.setButtonCompleted
                ]}
                onPress={() => handleSetComplete(currentExercise.id, index + 1)}
              >
                <Text style={[
                  styles.setText,
                  completedSetsForExercise.includes(index + 1) && styles.setTextCompleted
                ]}>
                  Set {index + 1}
                </Text>
                <Text style={[
                  styles.setDetails,
                  completedSetsForExercise.includes(index + 1) && styles.setTextCompleted
                ]}>
                  {currentExercise.reps} × {currentExercise.weight}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Weight/Reps Input Modal */}
      <Modal
        visible={showWeightInput}
        transparent
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Set Details</Text>
            
            <View style={styles.inputContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Weight (lbs)</Text>
                <TextInput
                  style={styles.input}
                  value={weightInput}
                  onChangeText={setWeightInput}
                  keyboardType="numeric"
                  placeholder="135"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Reps</Text>
                <TextInput
                  style={styles.input}
                  value={repsInput}
                  onChangeText={setRepsInput}
                  keyboardType="numeric"
                  placeholder="12"
                />
              </View>
            </View>

            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleWeightSubmit}
            >
              <Text style={styles.submitButtonText}>Save Set</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.analyzeButton}
              onPress={handleFormAnalysis}
            >
              <Text style={styles.analyzeButtonText}>Analyze Form</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Rest Timer Modal */}
      <Modal
        visible={showRestTimer}
        transparent
        animationType="fade"
      >
        <View style={styles.timerModalContainer}>
          <RestTimer 
            seconds={currentExercise.restTime}
            onComplete={() => setShowRestTimer(false)}
          />
          <TouchableOpacity 
            style={styles.skipButton}
            onPress={() => setShowRestTimer(false)}
          >
            <Text style={styles.skipButtonText}>Skip Rest</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Bottom Controls */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.nextButton}
          onPress={handleNextExercise}
        >
          <Text style={styles.nextButtonText}>
            {currentExerciseIndex < exercises.length - 1 ? 'Next Exercise' : 'Complete Workout'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  progressIndicator: {
    marginBottom: 20,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#000',
  },
  exerciseContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    padding: 20,
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  exerciseInstructions: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  setsContainer: {
    gap: 10,
  },
  setButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  setButtonCompleted: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  setText: {
    fontSize: 16,
    fontWeight: '600',
  },
  setDetails: {
    color: '#666',
  },
  setTextCompleted: {
    color: '#fff',
  },
  bottomContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  nextButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  exerciseImage: {
    width: '100%',
    height: 200,
    marginVertical: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  historyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  historyTitle: {
    fontWeight: '600',
    marginRight: 10,
  },
  historyText: {
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  inputGroup: {
    flex: 1,
    marginHorizontal: 10,
  },
  inputLabel: {
    marginBottom: 5,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  timerModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  timerContainer: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  timerLabel: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  skipButton: {
    marginTop: 20,
    padding: 10,
  },
  skipButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  analyzeButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  analyzeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WorkoutExercisesScreen; 