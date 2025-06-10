import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { generateWorkoutPlan } from '../services/claudeService';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [userProfile, setUserProfile] = useState(null);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [completedSections, setCompletedSections] = useState({ throwing: true }); // Throwing Drills completed
  const [refreshing, setRefreshing] = useState(false);
  const [workoutProgress, setWorkoutProgress] = useState(20);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Demo');

  useEffect(() => {
    loadUserDataAndWorkout();
    loadCompletedSections();
  }, []);

  const loadUserDataAndWorkout = async () => {
    try {
      setLoading(true);
      
      // Get user's first name from questionnaire data
      const basicInfoStr = await AsyncStorage.getItem('basicInfo');
      const basicInfo = basicInfoStr ? JSON.parse(basicInfoStr) : {};
      const firstName = basicInfo.firstName || await AsyncStorage.getItem('firstName') || 'Player';
      setUserName(firstName);

      // Load all questionnaire data from AsyncStorage
      const positionInfoStr = await AsyncStorage.getItem('positionInfo');
      const pitcherInfoStr = await AsyncStorage.getItem('pitcherInfo');
      const accessibilityInfoStr = await AsyncStorage.getItem('accessibilityInfo');
      const strengthInfoStr = await AsyncStorage.getItem('strengthInfo');
      const healthInfoStr = await AsyncStorage.getItem('healthInfo');
      const goalsInfoStr = await AsyncStorage.getItem('goalsInfo');
      
      // Parse all available data
      const positionInfo = positionInfoStr ? JSON.parse(positionInfoStr) : {};
      const pitcherInfo = pitcherInfoStr ? JSON.parse(pitcherInfoStr) : {};
      const accessibilityInfo = accessibilityInfoStr ? JSON.parse(accessibilityInfoStr) : {};
      const strengthInfo = strengthInfoStr ? JSON.parse(strengthInfoStr) : {};
      const healthInfo = healthInfoStr ? JSON.parse(healthInfoStr) : {};
      const goalsInfo = goalsInfoStr ? JSON.parse(goalsInfoStr) : {};
      
      // Combine all data into a complete profile
      const completeProfile = {
        profile_id: 'athlete123',
        ...basicInfo,
        ...positionInfo,
        ...pitcherInfo,
        ...accessibilityInfo,
        ...strengthInfo,
        ...healthInfo,
        ...goalsInfo
      };
      
      setUserProfile(completeProfile);

      // Generate AI workout
      const result = await generateWorkoutPlan(completeProfile);
      setWorkoutPlan(result.plan);
      
    } catch (error) {
      console.error('Error loading workout:', error);
      Alert.alert('Error', 'Failed to load your workout plan');
    } finally {
      setLoading(false);
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

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadUserDataAndWorkout();
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleWorkoutPress = (sectionKey, sectionData, title) => {
    navigation.navigate('WorkoutSession', {
      sectionKey,
      sectionData,
      title,
      onComplete: () => {
        const newCompleted = { ...completedSections, [sectionKey]: true };
        setCompletedSections(newCompleted);
      }
    });
  };

  const getCurrentDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading your workout...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome back, {userName}!</Text>
        <Text style={styles.dateText}>{getCurrentDate()}</Text>
      </View>

      {/* Today's Progress */}
      <View style={styles.progressCard}>
        <Text style={styles.progressTitle}>Today's Progress</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${workoutProgress}%` }]} />
        </View>
        <Text style={styles.progressText}>{workoutProgress}% Complete</Text>
      </View>

      {/* AI Analysis */}
      <View style={styles.aiAnalysisCard}>
        <Text style={styles.aiAnalysisTitle}>🤖 AI Analysis</Text>
        <Text style={styles.aiAnalysisText}>
          {workoutPlan?.analysis || "Based on your 105 mph velocity and Professional level, this program focuses on velocity development and injury prevention."}
        </Text>
      </View>

      {/* Today's Workout */}
      <View style={styles.workoutSection}>
        <Text style={styles.sectionTitle}>Today's Workout</Text>
        
        {/* Pre-Throw Warmup */}
        <TouchableOpacity 
          style={styles.workoutCard}
          onPress={() => handleWorkoutPress('warmups', workoutPlan?.warmups, 'Pre-Throw Warmup')}
        >
          <Text style={styles.sectionIcon}>🔥</Text>
          <View style={styles.sectionInfo}>
            <Text style={styles.sectionTitleText}>Pre-Throw Warmup</Text>
            <Text style={styles.sectionSubtitle}>3 exercises</Text>
          </View>
        </TouchableOpacity>

        {/* Throwing Drills - COMPLETED */}
        <TouchableOpacity 
          style={[styles.workoutCard, completedSections.throwing && styles.completedCard]}
          onPress={() => handleWorkoutPress('drills', workoutPlan?.drills, 'Throwing Drills')}
        >
          <Text style={styles.sectionIcon}>⚾</Text>
          <View style={styles.sectionInfo}>
            <Text style={styles.sectionTitleText}>Throwing Drills</Text>
            <Text style={styles.sectionSubtitle}>3 drills</Text>
          </View>
          {completedSections.throwing && (
            <Text style={styles.checkmark}>✅</Text>
          )}
        </TouchableOpacity>

        {/* Strength & Conditioning */}
        <TouchableOpacity 
          style={styles.workoutCard}
          onPress={() => handleWorkoutPress('strength', workoutPlan?.strength, 'Strength & Conditioning')}
        >
          <Text style={styles.sectionIcon}>💪</Text>
          <View style={styles.sectionInfo}>
            <Text style={styles.sectionTitleText}>Strength & Conditioning</Text>
            <Text style={styles.sectionSubtitle}>3 exercises</Text>
          </View>
        </TouchableOpacity>

        {/* Mobility & Flexibility */}
        <TouchableOpacity 
          style={styles.workoutCard}
          onPress={() => handleWorkoutPress('mobility', workoutPlan?.mobility, 'Mobility & Flexibility')}
        >
          <Text style={styles.sectionIcon}>🧘</Text>
          <View style={styles.sectionInfo}>
            <Text style={styles.sectionTitleText}>Mobility & Flexibility</Text>
            <Text style={styles.sectionSubtitle}>3 exercises</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Coach Message */}
      {workoutPlan?.coaches_message && (
        <View style={styles.coachMessageContainer}>
          <Text style={styles.coachMessageTitle}>Coach's Message</Text>
          <Text style={styles.coachMessageText}>{workoutPlan.coaches_message}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  dateText: {
    fontSize: 16,
    color: '#CCCCCC',
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 10,
    fontSize: 16,
  },
  progressCard: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    backgroundColor: '#1A1A1A',
    borderRadius: 15,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#333333',
    borderRadius: 4,
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'right',
  },
  aiAnalysisCard: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    backgroundColor: '#1A1A1A',
    borderRadius: 15,
  },
  aiAnalysisTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 10,
  },
  aiAnalysisText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  workoutSection: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  workoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
  },
  completedCard: {
    backgroundColor: '#0A2A4A',
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  sectionIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  sectionInfo: {
    flex: 1,
  },
  sectionTitleText: {
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

export default HomeScreen; 