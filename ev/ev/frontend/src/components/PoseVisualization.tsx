import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';

interface PosePoint {
  x: number;
  y: number;
  z: number;
  visibility: number;
}

interface PoseVisualizationProps {
  poseData: PosePoint[];
  imageUri?: string;
  width?: number;
  height?: number;
}

const { width: screenWidth } = Dimensions.get('window');

export default function PoseVisualization({ 
  poseData, 
  imageUri, 
  width = screenWidth - 40, 
  height = 300 
}: PoseVisualizationProps) {
  
  // Convert normalized coordinates to screen coordinates
  const getScreenCoords = (point: PosePoint) => ({
    x: point.x * width,
    y: point.y * height,
  });

  // Define pose connections (simplified skeleton)
  const connections = [
    [0, 1], // head to neck
    [1, 2], // neck to right shoulder
    [1, 3], // neck to left shoulder
    [2, 4], // right shoulder to right elbow
    [3, 5], // left shoulder to left elbow
    [4, 6], // right elbow to right wrist
    [5, 7], // left elbow to left wrist
  ];

  const getVisibilityColor = (visibility: number) => {
    if (visibility > 0.8) return '#00FF00'; // Green - high confidence
    if (visibility > 0.5) return '#FFFF00'; // Yellow - medium confidence
    return '#FF0000'; // Red - low confidence
  };

  const getFormFeedback = () => {
    if (poseData.length === 0) return "No pose detected";
    
    const avgVisibility = poseData.reduce((sum, point) => sum + point.visibility, 0) / poseData.length;
    
    if (avgVisibility > 0.8) {
      return "Excellent pose detection! Good form visible.";
    } else if (avgVisibility > 0.6) {
      return "Good pose detection. Some adjustments may help.";
    } else {
      return "Pose partially detected. Try better lighting or positioning.";
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pose Analysis</Text>
      
      <View style={styles.visualizationContainer}>
        <Svg width={width} height={height} style={styles.svg}>
          {/* Draw connections */}
          {connections.map(([startIdx, endIdx], index) => {
            if (startIdx < poseData.length && endIdx < poseData.length) {
              const start = getScreenCoords(poseData[startIdx]);
              const end = getScreenCoords(poseData[endIdx]);
              
              return (
                <Line
                  key={`connection-${index}`}
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke="#4A90E2"
                  strokeWidth="2"
                />
              );
            }
            return null;
          })}
          
          {/* Draw pose points */}
          {poseData.map((point, index) => {
            const coords = getScreenCoords(point);
            const color = getVisibilityColor(point.visibility);
            
            return (
              <Circle
                key={`point-${index}`}
                cx={coords.x}
                cy={coords.y}
                r="6"
                fill={color}
                stroke="#FFFFFF"
                strokeWidth="2"
              />
            );
          })}
          
          {/* Add labels for key points */}
          {poseData.slice(0, 8).map((point, index) => {
            const coords = getScreenCoords(point);
            const labels = ['Head', 'Neck', 'R.Shoulder', 'L.Shoulder', 'R.Elbow', 'L.Elbow', 'R.Wrist', 'L.Wrist'];
            
            return (
              <SvgText
                key={`label-${index}`}
                x={coords.x + 10}
                y={coords.y - 10}
                fontSize="10"
                fill="#FFFFFF"
                fontWeight="bold"
              >
                {labels[index] || `P${index}`}
              </SvgText>
            );
          })}
        </Svg>
      </View>
      
      <View style={styles.feedbackContainer}>
        <Text style={styles.feedbackTitle}>Form Analysis:</Text>
        <Text style={styles.feedbackText}>{getFormFeedback()}</Text>
        
        <View style={styles.statsContainer}>
          <Text style={styles.statText}>
            Points Detected: {poseData.length}
          </Text>
          <Text style={styles.statText}>
            Avg Confidence: {poseData.length > 0 ? 
              (poseData.reduce((sum, p) => sum + p.visibility, 0) / poseData.length * 100).toFixed(1) + '%' : 
              '0%'
            }
          </Text>
        </View>
      </View>
      
      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>Confidence Legend:</Text>
        <View style={styles.legendRow}>
          <View style={[styles.legendDot, { backgroundColor: '#00FF00' }]} />
          <Text style={styles.legendText}>High (80%+)</Text>
          <View style={[styles.legendDot, { backgroundColor: '#FFFF00' }]} />
          <Text style={styles.legendText}>Medium (50-80%)</Text>
          <View style={[styles.legendDot, { backgroundColor: '#FF0000' }]} />
          <Text style={styles.legendText}>Low (&lt;50%)</Text>
        </View>
      </View>
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 15,
  },
  visualizationContainer: {
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  svg: {
    backgroundColor: '#2A2A2A',
  },
  feedbackContainer: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#333333',
    borderRadius: 8,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 5,
  },
  feedbackText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  statText: {
    fontSize: 12,
    color: '#CCCCCC',
  },
  legendContainer: {
    marginTop: 10,
    padding: 8,
    backgroundColor: '#2A2A2A',
    borderRadius: 6,
  },
  legendTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
    marginLeft: 10,
  },
  legendText: {
    fontSize: 10,
    color: '#CCCCCC',
    marginRight: 10,
  },
}); 