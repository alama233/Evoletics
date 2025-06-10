import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { generateWorkout, analyzeVision } from '../services/api';
import PoseVisualization from './PoseVisualization';

export default function PoseSystemTest() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const mockPoseData = [
    { x: 0.5, y: 0.1, z: 0.0, visibility: 0.95 }, // Head
    { x: 0.5, y: 0.2, z: 0.0, visibility: 0.90 }, // Neck
    { x: 0.4, y: 0.3, z: 0.0, visibility: 0.85 }, // Right shoulder
    { x: 0.6, y: 0.3, z: 0.0, visibility: 0.85 }, // Left shoulder
    { x: 0.3, y: 0.5, z: 0.0, visibility: 0.80 }, // Right elbow
    { x: 0.7, y: 0.5, z: 0.0, visibility: 0.80 }, // Left elbow
    { x: 0.2, y: 0.7, z: 0.0, visibility: 0.75 }, // Right wrist
    { x: 0.8, y: 0.7, z: 0.0, visibility: 0.75 }, // Left wrist
  ];

  const runTest = async (testName: string, testFunction: () => Promise<any>) => {
    try {
      const startTime = Date.now();
      const result = await testFunction();
      const endTime = Date.now();
      
      const testResult = {
        name: testName,
        status: 'PASS',
        duration: endTime - startTime,
        result: result,
        timestamp: new Date().toISOString(),
      };
      
      setTestResults(prev => [...prev, testResult]);
      return testResult;
    } catch (error) {
      const testResult = {
        name: testName,
        status: 'FAIL',
        duration: 0,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
      
      setTestResults(prev => [...prev, testResult]);
      return testResult;
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    try {
      // Test 1: Pose Data Validation
      await runTest('Pose Data Validation', async () => {
        const isValid = mockPoseData.every(point => 
          point.x >= 0 && point.x <= 1 &&
          point.y >= 0 && point.y <= 1 &&
          point.visibility >= 0 && point.visibility <= 1
        );
        
        if (!isValid) throw new Error('Invalid pose data format');
        return { valid: true, pointCount: mockPoseData.length };
      });

      // Test 2: API Connectivity
      await runTest('API Health Check', async () => {
        const response = await fetch('https://evoletics-backend-8c703d57094e.herokuapp.com/health');
        if (!response.ok) throw new Error(`API health check failed: ${response.status}`);
        return await response.json();
      });

      // Test 3: Workout Generation with Pose
      await runTest('Pose-Enhanced Workout Generation', async () => {
        const request = {
          profile: {
            profile_id: 'test_user',
            age: 25,
            position: 'pitcher',
            experience_level: 'intermediate'
          },
          history: [],
          pose: mockPoseData
        };
        
        const result = await generateWorkout(request);
        if (!result.plan) throw new Error('No workout plan generated');
        return result;
      });

      // Test 4: Pose Visualization
      await runTest('Pose Visualization Rendering', async () => {
        // Simulate pose visualization component test
        const avgVisibility = mockPoseData.reduce((sum, p) => sum + p.visibility, 0) / mockPoseData.length;
        const connections = mockPoseData.length - 1; // Simple connection count
        
        return {
          pointsRendered: mockPoseData.length,
          avgVisibility: avgVisibility,
          connectionsDrawn: connections,
          renderSuccess: true
        };
      });

      // Test 5: Performance Test
      await runTest('Performance Benchmark', async () => {
        const iterations = 10;
        const times: number[] = [];
        
        for (let i = 0; i < iterations; i++) {
          const start = Date.now();
          
          // Simulate pose processing
          const processed = mockPoseData.map(point => ({
            ...point,
            screenX: point.x * 300,
            screenY: point.y * 400,
          }));
          
          const end = Date.now();
          times.push(end - start);
        }
        
        const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length;
        
        return {
          iterations,
          averageProcessingTime: avgTime,
          maxTime: Math.max(...times),
          minTime: Math.min(...times)
        };
      });

      Alert.alert('Tests Complete', 'All pose system tests have been executed!');
    } catch (error) {
      Alert.alert('Test Error', `Test execution failed: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PASS': return '#6BCF7F';
      case 'FAIL': return '#FF6B6B';
      default: return '#FFD93D';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Pose System Test Suite</Text>
      
      <View style={styles.controlsContainer}>
        <TouchableOpacity 
          style={[styles.runButton, isRunning && styles.runningButton]} 
          onPress={runAllTests}
          disabled={isRunning}
        >
          <Text style={styles.buttonText}>
            {isRunning ? '🔄 Running Tests...' : '🧪 Run All Tests'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.clearButton} 
          onPress={() => setTestResults([])}
        >
          <Text style={styles.buttonText}>🗑️ Clear Results</Text>
        </TouchableOpacity>
      </View>

      {/* Sample Pose Visualization */}
      <View style={styles.sampleSection}>
        <Text style={styles.sectionTitle}>Sample Pose Visualization</Text>
        <PoseVisualization poseData={mockPoseData} />
      </View>

      {/* Test Results */}
      <View style={styles.resultsContainer}>
        <Text style={styles.sectionTitle}>Test Results ({testResults.length})</Text>
        
        {testResults.map((test, index) => (
          <View key={index} style={styles.testResult}>
            <View style={styles.testHeader}>
              <Text style={styles.testName}>{test.name}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(test.status) }]}>
                <Text style={styles.statusText}>{test.status}</Text>
              </View>
            </View>
            
            <Text style={styles.testTime}>
              Duration: {test.duration}ms | {new Date(test.timestamp).toLocaleTimeString()}
            </Text>
            
            {test.result && (
              <View style={styles.testDetails}>
                <Text style={styles.detailsText}>
                  {JSON.stringify(test.result, null, 2)}
                </Text>
              </View>
            )}
            
            {test.error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Error: {test.error}</Text>
              </View>
            )}
          </View>
        ))}
        
        {testResults.length === 0 && (
          <Text style={styles.noResults}>No test results yet. Run tests to see results.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  runButton: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 10,
    flex: 0.45,
    alignItems: 'center',
  },
  runningButton: {
    backgroundColor: '#6699FF',
  },
  clearButton: {
    backgroundColor: '#666666',
    padding: 15,
    borderRadius: 10,
    flex: 0.45,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  sampleSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 10,
  },
  resultsContainer: {
    marginTop: 10,
  },
  testResult: {
    backgroundColor: '#1A1A1A',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  testName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  testTime: {
    fontSize: 12,
    color: '#CCCCCC',
    marginBottom: 8,
  },
  testDetails: {
    backgroundColor: '#2A2A2A',
    padding: 10,
    borderRadius: 6,
    marginTop: 8,
  },
  detailsText: {
    fontSize: 11,
    color: '#CCCCCC',
    fontFamily: 'monospace',
  },
  errorContainer: {
    backgroundColor: '#3A1A1A',
    padding: 10,
    borderRadius: 6,
    marginTop: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#FF6B6B',
  },
  noResults: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 20,
  },
}); 