import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator,
  TextInput,
  Modal 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getTodaysWorkout, saveWorkoutProgress } from '../services/workoutParser';
import { SafeAreaView } from 'react-native-safe-area-context';

const SetInputModal = ({ visible, exercise, setIndex, onComplete, onCancel }) => {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');

  const handleComplete = () => {
    if (!weight || !reps) {
      Alert.alert('Please enter both weight and reps');
      return;
    }
    onComplete(parseFloat(weight), parseInt(reps));
    setWeight('');
    setReps('');
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{exercise?.name} - Set {setIndex + 1}</Text>
          
          <View style={styles.inputContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Weight (lbs)</Text>
              <TextInput 
                style={styles.input}
                keyboardType="numeric"
                placeholder="Enter weight"
                value={weight}
                onChangeText={setWeight}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Reps</Text>
              <TextInput 
                style={styles.input}
                keyboardType="numeric"
                placeholder={`Target: ${exercise?.reps}`}
                value={reps}
                onChangeText={setReps}
              />
            </View>
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={() => {
                onCancel();
                setWeight('');
                setReps('');
              }}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.modalButtonPrimary]}
              onPress={handleComplete}
            >
              <Text style={styles.modalButtonTextPrimary}>Complete Set</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const RestTimer = ({ seconds, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (timeLeft === 0) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  return (
    <View style={styles.timerContainer}>
      <Text style={styles.timerText}>{timeLeft}s</Text>
      <Text style={styles.timerLabel}>Rest Time</Text>
      <TouchableOpacity 
        style={styles.skipButton}
        onPress={onComplete}
      >
        <Text style={styles.skipButtonText}>Skip Rest</Text>
      </TouchableOpacity>
    </View>
  );
};

const WorkoutSessionScreen = ({ route, navigation }) => {
  const { sectionKey, sectionData, title, onComplete } = route.params;
  const [completedExercises, setCompletedExercises] = useState({});
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const exercises = formatExercises(sectionData, sectionKey);

  function formatExercises(data, key) {
    if (!data) return [];

    switch (key) {
      case 'warmups':
      case 'drills':
      case 'mobility':
        return Array.isArray(data) ? data.map((item, index) => ({
          id: index,
          name: item,
          type: 'simple',
          completed: false
        })) : [];

      case 'strength':
        if (data.exercises) {
          return data.exercises.map((exercise, index) => ({
            id: index,
            name: exercise,
            type: 'strength',
            sets: data.sets || 3,
            reps: data.reps || 10,
            percent: data.percent || 75,
            completed: false
          }));
        }
        return [];

      case 'recovery':
        if (data.details) {
          return Array.isArray(data.details) ? data.details.map((item, index) => ({
            id: index,
            name: item,
            type: 'recovery',
            completed: false
          })) : [{
            id: 0,
            name: data.details,
            type: 'recovery',
            completed: false
          }];
        }
        return [];

      default:
        return [];
    }
  }

  const toggleExerciseComplete = (exerciseId) => {
    setCompletedExercises(prev => ({
      ...prev,
      [exerciseId]: !prev[exerciseId]
    }));
  };

  const getCompletionPercentage = () => {
    const totalExercises = exercises.length;
    const completedCount = Object.values(completedExercises).filter(Boolean).length;
    return totalExercises > 0 ? Math.round((completedCount / totalExercises) * 100) : 0;
  };

  const handleCompleteWorkout = () => {
    const completionPercentage = getCompletionPercentage();
    
    if (completionPercentage < 80) {
      Alert.alert(
        'Incomplete Workout',
        `You've only completed ${completionPercentage}% of the exercises. Are you sure you want to finish?`,
        [
          { text: 'Continue Working', style: 'cancel' },
          { text: 'Finish Anyway', onPress: () => setShowCompleteModal(true) }
        ]
      );
    } else {
      setShowCompleteModal(true);
    }
  };

  const confirmComplete = () => {
    setShowCompleteModal(false);
    onComplete();
    navigation.goBack();
  };

  const renderExercise = (exercise) => {
    const isCompleted = completedExercises[exercise.id];

    return (
      <TouchableOpacity
        key={exercise.id}
        style={[styles.exerciseCard, isCompleted && styles.completedExercise]}
        onPress={() => toggleExerciseComplete(exercise.id)}
      >
        <View style={styles.exerciseHeader}>
          <View style={styles.exerciseInfo}>
            <Text style={[styles.exerciseName, isCompleted && styles.completedText]}>
              {exercise.name}
            </Text>
            
            {exercise.type === 'strength' && (
              <Text style={[styles.exerciseDetails, isCompleted && styles.completedText]}>
                {exercise.sets} sets × {exercise.reps} reps @ {exercise.percent}%
              </Text>
            )}
          </View>
          
          <View style={[styles.checkbox, isCompleted && styles.checkedBox]}>
            {isCompleted && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{title}</Text>
          <Text style={styles.headerSubtitle}>
            {Object.values(completedExercises).filter(Boolean).length} of {exercises.length} completed
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${getCompletionPercentage()}%` }]} />
        </View>
        <Text style={styles.progressText}>{getCompletionPercentage()}% Complete</Text>
      </View>

      {/* Exercises List */}
      <ScrollView style={styles.exercisesList}>
        {exercises.map(renderExercise)}
      </ScrollView>

      {/* Complete Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.completeButton,
            getCompletionPercentage() === 100 && styles.completeButtonActive
          ]}
          onPress={handleCompleteWorkout}
        >
          <Text style={styles.completeButtonText}>
            Complete {title}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Completion Modal */}
      <Modal
        visible={showCompleteModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🎉 Great Work!</Text>
            <Text style={styles.modalText}>
              You've completed {title}! Keep up the excellent training.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={confirmComplete}
            >
              <Text style={styles.modalButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '600',
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#333333',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#CCCCCC',
    textAlign: 'center',
  },
  exercisesList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  exerciseCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  completedExercise: {
    backgroundColor: '#1A2A1A',
    borderColor: '#4A90E2',
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  exerciseDetails: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#666666',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedBox: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomContainer: {
    padding: 20,
    paddingTop: 10,
  },
  completeButton: {
    backgroundColor: '#333333',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  completeButtonActive: {
    backgroundColor: '#4A90E2',
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginHorizontal: 40,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 25,
  },
  modalButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WorkoutSessionScreen; 