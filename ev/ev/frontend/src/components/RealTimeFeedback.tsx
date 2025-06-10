import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Accelerometer } from 'expo-sensors';

interface RealTimeFeedbackProps {
  isActive: boolean;
  onFeedback: (feedback: string) => void;
  exerciseType: 'pitching' | 'batting' | 'fielding';
}

export default function RealTimeFeedback({ 
  isActive, 
  onFeedback, 
  exerciseType 
}: RealTimeFeedbackProps) {
  const [motionData, setMotionData] = useState({ x: 0, y: 0, z: 0 });
  const [isTracking, setIsTracking] = useState(false);
  const [feedback, setFeedback] = useState<string>('');
  const [repCount, setRepCount] = useState(0);

  useEffect(() => {
    let subscription: any;

    if (isActive && isTracking) {
      subscription = Accelerometer.addListener(accelerometerData => {
        setMotionData(accelerometerData);
        analyzeMotion(accelerometerData);
      });
      
      Accelerometer.setUpdateInterval(100); // 10Hz
    }

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [isActive, isTracking]);

  const analyzeMotion = useCallback((data: { x: number; y: number; z: number }) => {
    const magnitude = Math.sqrt(data.x * data.x + data.y * data.y + data.z * data.z);
    
    // Simple motion analysis based on exercise type
    let currentFeedback = '';
    
    if (exerciseType === 'pitching') {
      if (magnitude > 1.5) {
        currentFeedback = '🔥 Good arm speed! Keep that momentum.';
        setRepCount(prev => prev + 1);
      } else if (magnitude < 0.5) {
        currentFeedback = '⚠️ Increase your arm speed for better velocity.';
      } else {
        currentFeedback = '✅ Good form! Maintain this rhythm.';
      }
    } else if (exerciseType === 'batting') {
      if (magnitude > 2.0) {
        currentFeedback = '💪 Powerful swing! Great bat speed.';
        setRepCount(prev => prev + 1);
      } else if (magnitude < 0.8) {
        currentFeedback = '📈 Try to generate more bat speed.';
      } else {
        currentFeedback = '👍 Smooth swing mechanics.';
      }
    } else if (exerciseType === 'fielding') {
      if (magnitude > 1.2) {
        currentFeedback = '⚡ Quick reaction! Good fielding motion.';
        setRepCount(prev => prev + 1);
      } else {
        currentFeedback = '🎯 Stay ready for the next play.';
      }
    }

    setFeedback(currentFeedback);
    onFeedback(currentFeedback);
  }, [exerciseType, onFeedback]);

  const startTracking = useCallback(async () => {
    const { status } = await Accelerometer.requestPermissionsAsync();
    if (status === 'granted') {
      setIsTracking(true);
      setRepCount(0);
      setFeedback('🎯 Tracking started! Begin your exercise.');
    } else {
      Alert.alert('Permission Required', 'Motion tracking requires sensor access.');
    }
  }, []);

  const stopTracking = useCallback(() => {
    setIsTracking(false);
    setFeedback(`✅ Session complete! ${repCount} reps detected.`);
  }, [repCount]);

  const getMotionIntensity = () => {
    const magnitude = Math.sqrt(motionData.x ** 2 + motionData.y ** 2 + motionData.z ** 2);
    if (magnitude > 2.0) return 'High';
    if (magnitude > 1.0) return 'Medium';
    return 'Low';
  };

  const getIntensityColor = () => {
    const intensity = getMotionIntensity();
    switch (intensity) {
      case 'High': return '#FF6B6B';
      case 'Medium': return '#FFD93D';
      default: return '#6BCF7F';
    }
  };

  if (!isActive) {
    return (
      <View style={styles.inactiveContainer}>
        <Text style={styles.inactiveText}>Real-time feedback available during workouts</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Real-Time Form Analysis</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.exerciseType}>Exercise: {exerciseType.toUpperCase()}</Text>
        <Text style={styles.repCount}>Reps: {repCount}</Text>
      </View>

      <View style={styles.motionContainer}>
        <Text style={styles.motionTitle}>Motion Intensity</Text>
        <View style={[styles.intensityBar, { backgroundColor: getIntensityColor() }]}>
          <Text style={styles.intensityText}>{getMotionIntensity()}</Text>
        </View>
      </View>

      <View style={styles.feedbackContainer}>
        <Text style={styles.feedbackTitle}>Live Feedback:</Text>
        <Text style={styles.feedbackText}>{feedback || 'Waiting for motion...'}</Text>
      </View>

      <View style={styles.controlsContainer}>
        {!isTracking ? (
          <TouchableOpacity style={styles.startButton} onPress={startTracking}>
            <Text style={styles.buttonText}>🎯 Start Tracking</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.stopButton} onPress={stopTracking}>
            <Text style={styles.buttonText}>⏹️ Stop Tracking</Text>
          </TouchableOpacity>
        )}
      </View>

      {isTracking && (
        <View style={styles.dataContainer}>
          <Text style={styles.dataTitle}>Motion Data:</Text>
          <Text style={styles.dataText}>
            X: {motionData.x.toFixed(2)} | Y: {motionData.y.toFixed(2)} | Z: {motionData.z.toFixed(2)}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    padding: 15,
    margin: 10,
  },
  inactiveContainer: {
    backgroundColor: '#2A2A2A',
    borderRadius: 10,
    padding: 20,
    margin: 10,
    alignItems: 'center',
  },
  inactiveText: {
    color: '#CCCCCC',
    fontSize: 14,
    textAlign: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 15,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
  },
  exerciseType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  repCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6BCF7F',
  },
  motionContainer: {
    marginBottom: 15,
  },
  motionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  intensityBar: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  intensityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  feedbackContainer: {
    backgroundColor: '#333333',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  feedbackTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 8,
  },
  feedbackText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  controlsContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  startButton: {
    backgroundColor: '#6BCF7F',
    padding: 15,
    borderRadius: 10,
    minWidth: 150,
    alignItems: 'center',
  },
  stopButton: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 10,
    minWidth: 150,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dataContainer: {
    backgroundColor: '#2A2A2A',
    padding: 10,
    borderRadius: 8,
  },
  dataTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#CCCCCC',
    marginBottom: 5,
  },
  dataText: {
    fontSize: 11,
    color: '#CCCCCC',
    fontFamily: 'monospace',
  },
}); 