import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateWorkoutPlan } from '../services/claudeService';

interface PosePoint {
  x: number;
  y: number;
  z: number;
  visibility: number;
}

export default function WorkoutScreen() {
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [poseData, setPoseData] = useState<PosePoint[]>([]);
  const [workoutPlan, setWorkoutPlan] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleImageCaptured = useCallback((imageUri: string) => {
    setCapturedImage(imageUri);
    setShowCamera(false);
  }, []);

  const handlePoseAnalyzed = useCallback((pose: PosePoint[]) => {
    setPoseData(pose);
  }, []);

  const generateWorkoutFromProfile = useCallback(async () => {
    setIsGenerating(true);
    try {
      const result = await generateWorkoutPlan();
      setWorkoutPlan(result.plan);
      Alert.alert('Success', 'AI workout generated from your profile!');
    } catch (error) {
      Alert.alert('Error', 'Failed to generate workout');
      console.error('Workout generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const generatePoseBasedWorkout = useCallback(async () => {
    if (poseData.length === 0) {
      Alert.alert('No Pose Data', 'Please capture a photo first to analyze your form.');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateWorkoutPlan();
      setWorkoutPlan(result.plan);
      Alert.alert('Success', 'Pose-enhanced workout generated!');
    } catch (error) {
      Alert.alert('Error', 'Failed to generate workout');
      console.error('Workout generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [poseData]);

  const resetCapture = useCallback(() => {
    setCapturedImage(null);
    setPoseData([]);
    setWorkoutPlan(null);
    setShowCamera(false);
  }, []);

  const renderWorkoutPlan = () => {
    if (!workoutPlan) return null;

    return (
      <View style={styles.workoutContainer}>
        <Text style={styles.workoutTitle}>🏋️ Your AI-Generated Workout</Text>
        
        {/* Warmups */}
        {workoutPlan.warmups && workoutPlan.warmups.length > 0 && (
          <View style={styles.workoutSection}>
            <Text style={styles.workoutSectionTitle}>🔥 Warmup</Text>
            {workoutPlan.warmups.map((warmup, index) => (
              <View key={index} style={styles.workoutItem}>
                <Text style={styles.workoutItemName}>
                  {typeof warmup === 'string' ? warmup : warmup.name || 'Warmup Exercise'}
                </Text>
                {typeof warmup === 'object' && warmup.duration && (
                  <Text style={styles.workoutItemDetails}>Duration: {warmup.duration}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Drills */}
        {workoutPlan.drills && workoutPlan.drills.length > 0 && (
          <View style={styles.workoutSection}>
            <Text style={styles.workoutSectionTitle}>⚾ Drills</Text>
            {workoutPlan.drills.map((drill, index) => (
              <View key={index} style={styles.workoutItem}>
                <Text style={styles.workoutItemName}>
                  {typeof drill === 'string' ? drill : drill.name || 'Baseball Drill'}
                </Text>
                {typeof drill === 'object' && (
                  <Text style={styles.workoutItemDetails}>
                    {drill.sets && `Sets: ${drill.sets} `}
                    {drill.reps && `Reps: ${drill.reps}`}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Strength */}
        {workoutPlan.strength && (
          <View style={styles.workoutSection}>
            <Text style={styles.workoutSectionTitle}>💪 Strength Training</Text>
            <View style={styles.workoutItem}>
              <Text style={styles.workoutItemName}>Strength Circuit</Text>
              <Text style={styles.workoutItemDetails}>
                Sets: {workoutPlan.strength.sets || 3} | 
                Reps: {workoutPlan.strength.reps || 10} | 
                Intensity: {workoutPlan.strength.percent || 75}%
              </Text>
              {workoutPlan.strength.exercises && workoutPlan.strength.exercises.length > 0 && (
                <View style={styles.exerciseList}>
                  {workoutPlan.strength.exercises.map((exercise, index) => (
                    <Text key={index} style={styles.exerciseItem}>• {exercise}</Text>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}

        {/* Mobility */}
        {workoutPlan.mobility && workoutPlan.mobility.length > 0 && (
          <View style={styles.workoutSection}>
            <Text style={styles.workoutSectionTitle}>🧘 Mobility</Text>
            {workoutPlan.mobility.map((mobility, index) => (
              <View key={index} style={styles.workoutItem}>
                <Text style={styles.workoutItemName}>
                  {typeof mobility === 'string' ? mobility : mobility.name || 'Mobility Exercise'}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Recovery */}
        {workoutPlan.recovery && (
          <View style={styles.notesSection}>
            <Text style={styles.notesTitle}>🛌 Recovery Notes</Text>
            <Text style={styles.notesText}>
              {typeof workoutPlan.recovery === 'string' 
                ? workoutPlan.recovery 
                : workoutPlan.recovery.details || 'Focus on proper rest and hydration.'}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>🏋️ Workout Generator</Text>
          <Text style={styles.subtitle}>Generate personalized workouts with AI</Text>
        </View>

        {/* Main Generation Button */}
        <View style={styles.generationSection}>
          <TouchableOpacity 
            style={[styles.generateButton, isGenerating && styles.generatingButton]} 
            onPress={generateWorkoutFromProfile}
            disabled={isGenerating}
          >
            <Text style={styles.generateButtonText}>
              {isGenerating ? '🤖 AI Generating...' : '🧠 Generate AI Workout from Profile'}
            </Text>
          </TouchableOpacity>
          
          <Text style={styles.helpText}>
            This will use all your questionnaire answers to create a personalized workout
          </Text>
        </View>

        {/* Camera Section */}
        <View style={styles.cameraSection}>
          <Text style={styles.sectionTitle}>📸 Pose Analysis (Optional)</Text>
          <TouchableOpacity 
            style={styles.cameraButton}
            onPress={() => setShowCamera(true)}
          >
            <Text style={styles.cameraButtonText}>📷 Capture Form</Text>
          </TouchableOpacity>
          
          {capturedImage && (
            <Text style={styles.successText}>✅ Photo captured successfully!</Text>
          )}
        </View>

        {/* Display Generated Workout */}
        {renderWorkoutPlan()}

        {/* Reset Button */}
        {(workoutPlan || capturedImage) && (
          <TouchableOpacity style={styles.resetButton} onPress={resetCapture}>
            <Text style={styles.resetButtonText}>🔄 Reset</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
  },
  generationSection: {
    marginBottom: 30,
    alignItems: 'center',
  },
  generateButton: {
    backgroundColor: '#FF6B6B',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  generatingButton: {
    backgroundColor: '#FF9999',
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  helpText: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  cameraSection: {
    marginBottom: 30,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 15,
    textAlign: 'center',
  },
  cameraButton: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  cameraButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successText: {
    color: '#00FF00',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  workoutContainer: {
    marginBottom: 20,
  },
  workoutTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  workoutSection: {
    marginBottom: 20,
    backgroundColor: '#1A1A1A',
    padding: 15,
    borderRadius: 10,
  },
  workoutSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 10,
  },
  workoutItem: {
    backgroundColor: '#2A2A2A',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  workoutItemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  workoutItemDetails: {
    fontSize: 12,
    color: '#CCCCCC',
  },
  exerciseList: {
    marginTop: 8,
  },
  exerciseItem: {
    fontSize: 12,
    color: '#CCCCCC',
    marginBottom: 2,
  },
  notesSection: {
    backgroundColor: '#1A1A1A',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 8,
  },
  notesText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  resetButton: {
    backgroundColor: '#666666',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    margin: 20,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 