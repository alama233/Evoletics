import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CameraCapture from '../components/CameraCapture';
import PoseVisualization from '../components/PoseVisualization';
import { generateWorkout } from '../services/api';

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

  const generatePoseBasedWorkout = useCallback(async () => {
    if (poseData.length === 0) {
      Alert.alert('No Pose Data', 'Please capture a photo first to analyze your form.');
      return;
    }

    setIsGenerating(true);
    try {
      const profile = {
        profile_id: 'user123',
        age: 25,
        position: 'pitcher',
        experience_level: 'intermediate'
      };

      const response = await generateWorkout({
        profile,
        history: [],
        pose: poseData
      });

      setWorkoutPlan(response.plan);
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

  if (showCamera) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setShowCamera(false)} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Capture Your Form</Text>
        </View>
        
        <CameraCapture
          onImageCaptured={handleImageCaptured}
          onPoseAnalyzed={handlePoseAnalyzed}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>AI Workout Generator</Text>
          <Text style={styles.subtitle}>Pose-Enhanced Training</Text>
        </View>

        {/* Camera Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Step 1: Analyze Your Form</Text>
          <TouchableOpacity 
            style={styles.cameraButton} 
            onPress={() => setShowCamera(true)}
          >
            <Text style={styles.cameraButtonText}>
              📸 {capturedImage ? 'Retake Photo' : 'Capture Form'}
            </Text>
          </TouchableOpacity>
          
          {capturedImage && (
            <Text style={styles.successText}>✅ Photo captured successfully!</Text>
          )}
        </View>

        {/* Pose Visualization */}
        {poseData.length > 0 && (
          <PoseVisualization poseData={poseData} />
        )}

        {/* Workout Generation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Step 2: Generate Workout</Text>
          <TouchableOpacity 
            style={[
              styles.generateButton, 
              poseData.length === 0 && styles.disabledButton,
              isGenerating && styles.generatingButton
            ]} 
            onPress={generatePoseBasedWorkout}
            disabled={poseData.length === 0 || isGenerating}
          >
            <Text style={styles.generateButtonText}>
              {isGenerating ? '🔄 Generating...' : '🚀 Generate Pose-Enhanced Workout'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Workout Plan Display */}
        {workoutPlan && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Personalized Workout</Text>
            
            {workoutPlan.warmups && workoutPlan.warmups.length > 0 && (
              <View style={styles.workoutSection}>
                <Text style={styles.workoutSectionTitle}>🔥 Warmups</Text>
                {workoutPlan.warmups.map((warmup: any, index: number) => (
                  <View key={index} style={styles.workoutItem}>
                    <Text style={styles.workoutItemName}>{warmup.name}</Text>
                    <Text style={styles.workoutItemDetails}>{warmup.duration}</Text>
                  </View>
                ))}
              </View>
            )}

            {workoutPlan.drills && workoutPlan.drills.length > 0 && (
              <View style={styles.workoutSection}>
                <Text style={styles.workoutSectionTitle}>⚾ Drills</Text>
                {workoutPlan.drills.map((drill: any, index: number) => (
                  <View key={index} style={styles.workoutItem}>
                    <Text style={styles.workoutItemName}>{drill.name}</Text>
                    <Text style={styles.workoutItemDetails}>
                      {drill.sets} sets × {drill.reps} reps
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {workoutPlan.notes && (
              <View style={styles.notesSection}>
                <Text style={styles.notesTitle}>📝 Notes</Text>
                <Text style={styles.notesText}>{workoutPlan.notes}</Text>
              </View>
            )}
          </View>
        )}

        {/* Reset Button */}
        {(capturedImage || workoutPlan) && (
          <TouchableOpacity style={styles.resetButton} onPress={resetCapture}>
            <Text style={styles.resetButtonText}>🔄 Start Over</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 20,
    padding: 10,
  },
  backButtonText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#CCCCCC',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 15,
  },
  cameraButton: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
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
  generateButton: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#666666',
  },
  generatingButton: {
    backgroundColor: '#FF9999',
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
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