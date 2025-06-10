import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

const WorkoutPlanScreen = ({ navigation }) => {
  const [workoutPlan, setWorkoutPlan] = useState(null);

  useEffect(() => {
    loadWorkoutPlan();
  }, []);

  const loadWorkoutPlan = async () => {
    try {
      const planData = await AsyncStorage.getItem('structuredWorkoutPlan');
      if (planData) {
        setWorkoutPlan(JSON.parse(planData));
      }
    } catch (error) {
      console.error('Error loading workout plan:', error);
    }
  };

  if (!workoutPlan) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Workout Plan</Text>
        </View>
        <View style={styles.emptyState}>
          <Icon name="barbell-outline" size={50} color="#666" />
          <Text style={styles.emptyText}>No workout plan available</Text>
          <TouchableOpacity 
            style={styles.generateButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.generateButtonText}>Generate Plan</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Workout Plan</Text>
      </View>
      <ScrollView style={styles.content}>
        {Object.entries(workoutPlan).map(([day, workout]) => (
          <TouchableOpacity 
            key={day}
            style={styles.workoutCard}
            onPress={() => navigation.navigate('WorkoutOverview', { workout, day })}
          >
            <Text style={styles.dayText}>{day}</Text>
            <Text style={styles.workoutType}>{workout.type}</Text>
            <Text style={styles.exerciseCount}>
              {workout.exercises?.length || 0} exercises
            </Text>
          </TouchableOpacity>
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
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  workoutCard: {
    backgroundColor: '#f8f8f8',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
  },
  dayText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  workoutType: {
    fontSize: 16,
    color: '#666',
  },
  exerciseCount: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 20,
    marginBottom: 20,
  },
  generateButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WorkoutPlanScreen; 