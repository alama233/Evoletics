import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const PlanReadyScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.separator} />
      </View>

      {/* Main Content */}
      <View style={styles.contentContainer}>
        <View style={styles.checkMarkContainer}>
          <Icon name="checkmark-circle" size={64} color="#000" />
        </View>
        <Text style={styles.title}>Congratulations</Text>
        <Text style={styles.subtitle}>Your custom plan is ready!</Text>

        <Text style={styles.highlight}>
          You will increase your pitching velocity by 5 mph in 3 weeks.
        </Text>

        {/* Daily Recommendation */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Daily Recommendation</Text>
          <Text style={styles.cardSubtitle}>You can edit this anytime</Text>
          <View style={styles.metricsContainer}>
            <View style={styles.metricBox}>
              <Text style={styles.metricValue}>✅</Text>
              <Text style={styles.metricLabel}>Strength</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricValue}>✅</Text>
              <Text style={styles.metricLabel}>Throwing</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricValue}>✅</Text>
              <Text style={styles.metricLabel}>Speed</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricValue}>✅</Text>
              <Text style={styles.metricLabel}>Conditioning</Text>
            </View>
          </View>
          <View style={styles.healthScoreContainer}>
            <Text style={styles.healthScoreLabel}>Health Score</Text>
            <View style={styles.healthScoreBar}>
              <View style={styles.healthScoreFill} />
            </View>
            <Text style={styles.healthScoreValue}>7/10</Text>
          </View>
        </View>
      </View>

      {/* Footer Button */}
      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => navigation.navigate('FreeTrial')} // Navigate to FreeTrial screen
      >
        <Text style={styles.nextButtonText}>Let's get started!</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // White background
    paddingHorizontal: 20,
    paddingVertical: 40,
    justifyContent: 'space-between',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc', // Light grey separator line
    marginLeft: 10,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMarkContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000', // Black text
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666', // Dark grey text
    textAlign: 'center',
    marginBottom: 20,
  },
  highlight: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700', // Golden color for the highlight text
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#f9f9f9', // Light grey card background
    borderRadius: 10,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000', // Black text
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666', // Dark grey text
    marginBottom: 20,
    textAlign: 'center',
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  metricBox: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000', // Black text
    marginBottom: 5,
  },
  metricLabel: {
    fontSize: 14,
    color: '#666', // Dark grey text
  },
  healthScoreContainer: {
    alignItems: 'center',
    width: '100%',
  },
  healthScoreLabel: {
    fontSize: 14,
    color: '#666', // Dark grey text
    marginBottom: 5,
  },
  healthScoreBar: {
    height: 10,
    width: '100%',
    backgroundColor: '#e0e0e0', // Light grey bar background
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 5,
  },
  healthScoreFill: {
    height: '100%',
    width: '70%', // 70% fill for 7/10 health score
    backgroundColor: '#0f0', // Green fill
  },
  healthScoreValue: {
    fontSize: 14,
    color: '#000', // Black text
  },
  nextButton: {
    backgroundColor: '#000', // Black button with white text
    paddingVertical: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff', // White text
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PlanReadyScreen;
