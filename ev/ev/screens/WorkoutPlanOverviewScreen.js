import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { parseWorkoutPlan } from '../services/workoutParser';

const WorkoutPlanOverviewScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [currentDay, setCurrentDay] = useState(new Date().toLocaleDateString('en-US', { weekday: 'long' }));

  useEffect(() => {
    loadWorkoutPlan();
  }, []);

  const loadWorkoutPlan = async () => {
    try {
      const plan = await generateWorkoutPlan();
      const structuredPlan = parseWorkoutPlan(plan);
      setWorkoutPlan(structuredPlan);
    } catch (error) {
      console.error('Error loading workout plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderWorkoutDay = (day, workout) => (
    <TouchableOpacity 
      style={[
        styles.workoutCard,
        day === currentDay && styles.todayCard
      ]}
      onPress={() => navigation.navigate('WorkoutSession', { workout })}
    >
      <View style={styles.workoutHeader}>
        <Text style={styles.dayText}>{day}</Text>
        {day === currentDay && (
          <View style={styles.todayBadge}>
            <Text style={styles.todayText}>Today</Text>
          </View>
        )}
      </View>

      <Text style={styles.workoutType}>{workout.type}</Text>
      <Text style={styles.workoutDuration}>{workout.duration}</Text>

      <View style={styles.exerciseList}>
        {workout.exercises.map((exercise, index) => (
          <Text key={index} style={styles.exerciseItem}>
            • {exercise.name}
          </Text>
        ))}
      </View>

      {day === currentDay && (
        <TouchableOpacity 
          style={styles.startButton}
          onPress={() => navigation.navigate('WorkoutSession', { workout })}
        >
          <Text style={styles.startButtonText}>Start Workout</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Generating your personalized plan...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Weekly Plan</Text>
        <TouchableOpacity onPress={loadWorkoutPlan}>
          <Icon name="refresh" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {workoutPlan && Object.entries(workoutPlan).map(([day, workout]) => (
          renderWorkoutDay(day, workout)
        ))}
      </ScrollView>
    </View>
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
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  workoutCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  todayCard: {
    backgroundColor: '#f0f8ff',
    borderWidth: 1,
    borderColor: '#000',
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dayText: {
    fontSize: 18,
    fontWeight: '600',
  },
  todayBadge: {
    backgroundColor: '#000',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  todayText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  workoutType: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  workoutDuration: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  exerciseList: {
    marginBottom: 20,
  },
  exerciseItem: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  startButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});

export default WorkoutPlanOverviewScreen; 