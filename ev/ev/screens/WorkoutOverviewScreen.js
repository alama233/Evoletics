import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateWorkoutPlan } from '../services/claudeService';

export default function WorkoutOverviewScreen({ navigation }) {
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [completedSections, setCompletedSections] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [athleteName, setAthleteName] = useState('Athlete');

  useEffect(() => {
    loadWorkoutData();
    loadCompletedSections();
  }, []);

  const loadWorkoutData = async () => {
    try {
      setIsLoading(true);
      
      // Get athlete name
      const firstName = await AsyncStorage.getItem('firstName');
      if (firstName) setAthleteName(firstName);

      // Generate AI workout
      const result = await generateWorkoutPlan();
      setWorkoutPlan(result.plan);
    } catch (error) {
      console.error('Error loading workout:', error);
      Alert.alert('Error', 'Failed to load your workout plan');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCompletedSections = async () => {
    try {
      const today = new Date().toDateString();
      const completed = await AsyncStorage.getItem(`completed_${today}`);
      if (completed) {
        setCompletedSections(JSON.parse(completed));
      }
    } catch (error) {
      console.error('Error loading completed sections:', error);
    }
  };

  const saveCompletedSections = async (newCompleted) => {
    try {
      const today = new Date().toDateString();
      await AsyncStorage.setItem(`completed_${today}`, JSON.stringify(newCompleted));
      setCompletedSections(newCompleted);
    } catch (error) {
      console.error('Error saving completed sections:', error);
    }
  };

  const handleSectionComplete = (sectionKey) => {
    const newCompleted = { ...completedSections, [sectionKey]: true };
    saveCompletedSections(newCompleted);
  };

  const navigateToSection = (sectionKey, sectionData, title) => {
    navigation.navigate('WorkoutSession', {
      sectionKey,
      sectionData,
      title,
      onComplete: () => handleSectionComplete(sectionKey)
    });
  };

  const getCompletionPercentage = () => {
    if (!workoutPlan) return 0;
    const totalSections = 5; // warmups, drills, strength, mobility, recovery
    const completedCount = Object.keys(completedSections).length;
    return Math.round((completedCount / totalSections) * 100);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Generating your AI workout...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!workoutPlan) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load workout plan</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadWorkoutData}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome back, {athleteName}!</Text>
          <Text style={styles.dateText}>{new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</Text>
        </View>

        {/* Progress Overview */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressTitle}>Today's Progress</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${getCompletionPercentage()}%` }]} />
          </View>
          <Text style={styles.progressText}>{getCompletionPercentage()}% Complete</Text>
        </View>

        {/* AI Analysis */}
        {workoutPlan.analysis && (
          <View style={styles.analysisContainer}>
            <Text style={styles.analysisTitle}>🤖 AI Analysis</Text>
            <Text style={styles.analysisText}>{workoutPlan.analysis}</Text>
          </View>
        )}

        {/* Workout Sections */}
        <View style={styles.sectionsContainer}>
          <Text style={styles.sectionsTitle}>Today's Workout</Text>

          {/* Pre-Throw / Warmup */}
          <TouchableOpacity
            style={[
              styles.sectionCard,
              completedSections.warmups && styles.completedCard
            ]}
            onPress={() => navigateToSection('warmups', workoutPlan.warmups, 'Pre-Throw Warmup')}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>🔥</Text>
              <View style={styles.sectionInfo}>
                <Text style={styles.sectionTitle}>Pre-Throw Warmup</Text>
                <Text style={styles.sectionSubtitle}>
                  {workoutPlan.warmups?.length || 0} exercises
                </Text>
              </View>
              {completedSections.warmups && (
                <Text style={styles.checkmark}>✅</Text>
              )}
            </View>
          </TouchableOpacity>

          {/* Throwing Drills */}
          <TouchableOpacity
            style={[
              styles.sectionCard,
              completedSections.drills && styles.completedCard
            ]}
            onPress={() => navigateToSection('drills', workoutPlan.drills, 'Throwing Drills')}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>⚾</Text>
              <View style={styles.sectionInfo}>
                <Text style={styles.sectionTitle}>Throwing Drills</Text>
                <Text style={styles.sectionSubtitle}>
                  {workoutPlan.drills?.length || 0} drills
                </Text>
              </View>
              {completedSections.drills && (
                <Text style={styles.checkmark}>✅</Text>
              )}
            </View>
          </TouchableOpacity>

          {/* Strength & Conditioning */}
          <TouchableOpacity
            style={[
              styles.sectionCard,
              completedSections.strength && styles.completedCard
            ]}
            onPress={() => navigateToSection('strength', workoutPlan.strength, 'Strength & Conditioning')}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>💪</Text>
              <View style={styles.sectionInfo}>
                <Text style={styles.sectionTitle}>Strength & Conditioning</Text>
                <Text style={styles.sectionSubtitle}>
                  {workoutPlan.strength?.exercises?.length || 0} exercises
                </Text>
              </View>
              {completedSections.strength && (
                <Text style={styles.checkmark}>✅</Text>
              )}
            </View>
          </TouchableOpacity>

          {/* Mobility & Flexibility */}
          <TouchableOpacity
            style={[
              styles.sectionCard,
              completedSections.mobility && styles.completedCard
            ]}
            onPress={() => navigateToSection('mobility', workoutPlan.mobility, 'Mobility & Flexibility')}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>🧘</Text>
              <View style={styles.sectionInfo}>
                <Text style={styles.sectionTitle}>Mobility & Flexibility</Text>
                <Text style={styles.sectionSubtitle}>
                  {workoutPlan.mobility?.length || 0} exercises
                </Text>
              </View>
              {completedSections.mobility && (
                <Text style={styles.checkmark}>✅</Text>
              )}
            </View>
          </TouchableOpacity>

          {/* Recovery */}
          <TouchableOpacity
            style={[
              styles.sectionCard,
              completedSections.recovery && styles.completedCard
            ]}
            onPress={() => navigateToSection('recovery', workoutPlan.recovery, 'Recovery & Cool Down')}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>🧊</Text>
              <View style={styles.sectionInfo}>
                <Text style={styles.sectionTitle}>Recovery & Cool Down</Text>
                <Text style={styles.sectionSubtitle}>
                  {workoutPlan.recovery?.details?.length || 0} activities
                </Text>
              </View>
              {completedSections.recovery && (
                <Text style={styles.checkmark}>✅</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Coach's Message */}
        {workoutPlan.recovery?.coaches_message && (
          <View style={styles.coachMessageContainer}>
            <Text style={styles.coachMessageTitle}>💬 Coach's Message</Text>
            <Text style={styles.coachMessageText}>
              {workoutPlan.recovery.coaches_message}
            </Text>
          </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  dateText: {
    fontSize: 16,
    color: '#CCCCCC',
  },
  progressContainer: {
    margin: 20,
    marginTop: 10,
    padding: 20,
    backgroundColor: '#1A1A1A',
    borderRadius: 15,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#333333',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
  },
  analysisContainer: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    backgroundColor: '#1A1A1A',
    borderRadius: 15,
  },
  analysisTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 10,
  },
  analysisText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  sectionsContainer: {
    padding: 20,
    paddingTop: 0,
  },
  sectionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  sectionCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  completedCard: {
    borderColor: '#4A90E2',
    backgroundColor: '#1A2A3A',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  sectionInfo: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  checkmark: {
    fontSize: 20,
  },
  coachMessageContainer: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    backgroundColor: '#1A1A1A',
    borderRadius: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
  },
  coachMessageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 10,
  },
  coachMessageText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
    fontStyle: 'italic',
  },
});