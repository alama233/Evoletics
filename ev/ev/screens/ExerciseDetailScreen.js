import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Alert, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getExerciseDetails, saveExerciseSet } from '../services/workoutTracker';

const ExerciseDetailScreen = ({ navigation, route }) => {
  const { exercise, details, history } = route.params;
  const [showSetModal, setShowSetModal] = useState(false);
  const [currentSet, setCurrentSet] = useState(1);
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const totalSets = 3; // or get from workout plan
  const exerciseDetails = getExerciseDetails(exercise);

  const handleSetComplete = async () => {
    if (!weight || !reps) {
      Alert.alert('Input Required', 'Please enter weight and reps');
      return;
    }

    try {
      await saveExerciseSet(exercise, {
        weight: parseFloat(weight),
        reps: parseInt(reps),
        set: currentSet
      });

      if (currentSet < totalSets) {
        setCurrentSet(currentSet + 1);
        setWeight('');
        setReps('');
      } else {
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error saving set:', error);
      Alert.alert('Error', 'Failed to save set');
    }
  };

  const renderFormTips = () => {
    const tips = [
      "Keep proper form throughout the movement",
      "Maintain controlled tempo",
      "Focus on muscle engagement",
      "Breathe steadily and rhythmically",
    ];

    return tips.map((tip, index) => (
      <View key={index} style={styles.tipItem}>
        <Icon name="checkmark-circle-outline" size={20} color="#000" />
        <Text style={styles.tipText}>{tip}</Text>
      </View>
    ));
  };

  const renderHistory = () => {
    return history.map((workout, index) => (
      <View key={index} style={styles.historyItem}>
        <Text style={styles.historyDate}>
          {new Date(workout.date).toLocaleDateString()}
        </Text>
        <Text style={styles.historyWeight}>
          {workout.weight}lbs × {workout.reps}
        </Text>
      </View>
    ));
  };

  const renderSetModal = () => (
    <Modal
      visible={showSetModal}
      transparent
      animationType="slide"
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{exercise} - Set {currentSet}</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Weight (lbs)</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Enter weight"
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
                returnKeyType="done"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Reps</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.targetReps}>Target: {details?.split('x')[1] || '1'}</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter reps"
                keyboardType="numeric"
                value={reps}
                onChangeText={setReps}
                returnKeyType="done"
              />
            </View>
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => setShowSetModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.completeButton}
              onPress={handleSetComplete}
            >
              <Text style={styles.completeButtonText}>Complete Set</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{exercise}</Text>
        <TouchableOpacity>
          <Icon name="information-circle-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Exercise Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          <Text style={styles.detailsText}>{details}</Text>
        </View>

        {/* Form Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Form Tips</Text>
          <View style={styles.tipsContainer}>
            {renderFormTips()}
          </View>
        </View>

        {/* History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>History</Text>
          <View style={styles.historyContainer}>
            {history.length > 0 ? renderHistory() : (
              <Text style={styles.noHistoryText}>
                No previous records for this exercise
              </Text>
            )}
          </View>
        </View>

        <View style={styles.setCard}>
          <Text style={styles.setTitle}>Set {currentSet} of {totalSets}</Text>
          
          {history?.[0] && (
            <View style={styles.lastSetInfo}>
              <Text style={styles.lastSetLabel}>Last workout:</Text>
              <Text style={styles.lastSetText}>
                {history[0].weight}lbs × {history[0].reps} reps
              </Text>
            </View>
          )}

          <View style={styles.setInputs}>
            <TextInput
              style={styles.input}
              placeholder="Weight (lbs)"
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
            />
            <TextInput
              style={styles.input}
              placeholder="Reps"
              keyboardType="numeric"
              value={reps}
              onChangeText={setReps}
            />
          </View>

          <TouchableOpacity 
            style={styles.completeButton}
            onPress={() => setShowSetModal(true)}
          >
            <Text style={styles.completeButtonText}>
              {currentSet === totalSets ? 'Complete Exercise' : 'Complete Set'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {renderSetModal()}
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
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  detailsText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  tipsContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  historyContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  historyDate: {
    color: '#666',
  },
  historyWeight: {
    fontWeight: '500',
  },
  noHistoryText: {
    color: '#666',
    textAlign: 'center',
    padding: 20,
  },
  setCard: {
    backgroundColor: '#f8f8f8',
    padding: 20,
    borderRadius: 15,
  },
  setTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  lastSetInfo: {
    marginBottom: 20,
  },
  lastSetLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  lastSetText: {
    fontSize: 16,
    fontWeight: '500',
  },
  completeButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  setInputs: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  inputWrapper: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 15,
  },
  targetReps: {
    position: 'absolute',
    right: 15,
    top: 15,
    color: '#666',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#000',
  },
});

export default ExerciseDetailScreen; 