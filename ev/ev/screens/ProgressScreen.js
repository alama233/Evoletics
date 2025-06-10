import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getWorkoutStats, getPersonalRecords } from '../services/workoutTracker';

const ProgressScreen = () => {
  const [stats, setStats] = useState(null);
  const [prs, setPRs] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('week'); // week, month, year

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const workoutStats = await getWorkoutStats();
    const personalRecords = await getPersonalRecords();
    setStats(workoutStats);
    setPRs(personalRecords);
  };

  const renderPeriodSelector = () => (
    <View style={styles.periodSelector}>
      {['week', 'month', 'year'].map(period => (
        <TouchableOpacity
          key={period}
          style={[
            styles.periodButton,
            selectedPeriod === period && styles.periodButtonActive
          ]}
          onPress={() => setSelectedPeriod(period)}
        >
          <Text style={[
            styles.periodButtonText,
            selectedPeriod === period && styles.periodButtonTextActive
          ]}>
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Progress</Text>
      
      {renderPeriodSelector()}

      <ScrollView style={styles.content}>
        {/* Stats Overview */}
        {stats && (
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Icon name="fitness-outline" size={24} color="#000" />
              <Text style={styles.statValue}>{stats.totalWorkouts}</Text>
              <Text style={styles.statLabel}>Total Workouts</Text>
            </View>
            <View style={styles.statCard}>
              <Icon name="flame-outline" size={24} color="#000" />
              <Text style={styles.statValue}>{stats.streak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statCard}>
              <Icon name="trophy-outline" size={24} color="#000" />
              <Text style={styles.statValue}>{prs.length}</Text>
              <Text style={styles.statLabel}>Personal Records</Text>
            </View>
          </View>
        )}

        {/* Personal Records */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Records</Text>
          {prs.map((pr, index) => (
            <View key={index} style={styles.prCard}>
              <View style={styles.prHeader}>
                <Text style={styles.prExercise}>{pr.exercise}</Text>
                <Text style={styles.prDate}>{new Date(pr.date).toLocaleDateString()}</Text>
              </View>
              <View style={styles.prDetails}>
                <Text style={styles.prWeight}>{pr.weight} lbs</Text>
                <Text style={styles.prReps}>{pr.reps} reps</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 20,
  },
  periodSelector: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 5,
  },
  periodButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  periodButtonActive: {
    backgroundColor: '#000',
  },
  periodButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  periodButtonTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
  },
  prCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  prHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  prExercise: {
    fontSize: 16,
    fontWeight: '600',
  },
  prDate: {
    fontSize: 12,
    color: '#666',
  },
  prDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  prWeight: {
    fontSize: 16,
    color: '#000',
  },
  prReps: {
    fontSize: 16,
    color: '#666',
  },
});

export default ProgressScreen; 