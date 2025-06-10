import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const CalendarScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Training Calendar</Text>
      </View>

      {/* Calendar View - We'll integrate a proper calendar component later */}
      <View style={styles.calendarContainer}>
        <Text style={styles.placeholder}>Calendar View Coming Soon</Text>
        <Text style={styles.subtitle}>Track your workouts and progress</Text>
      </View>

      {/* Upcoming Workouts */}
      <View style={styles.upcomingContainer}>
        <Text style={styles.sectionTitle}>Upcoming Workouts</Text>
        <TouchableOpacity style={styles.workoutItem}>
          <View>
            <Text style={styles.workoutTitle}>Upper Body Strength</Text>
            <Text style={styles.workoutTime}>Tomorrow, 9:00 AM</Text>
          </View>
          <Icon name="chevron-forward" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  calendarContainer: {
    height: 300,
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  placeholder: {
    fontSize: 18,
    fontWeight: '600',
  },
  subtitle: {
    color: '#666',
    marginTop: 5,
  },
  upcomingContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  workoutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 10,
  },
  workoutTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  workoutTime: {
    color: '#666',
    marginTop: 5,
  },
});

export default CalendarScreen; 