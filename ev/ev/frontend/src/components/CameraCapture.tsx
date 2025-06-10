import React, { useRef, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

interface CameraCaptureProps {
  onImageCaptured: (imageUri: string) => void;
  onPoseAnalyzed?: (poseData: any) => void;
}

export default function CameraCapture({ onImageCaptured, onPoseAnalyzed }: CameraCaptureProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [type, setType] = useState(CameraType.back);
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<Camera>(null);

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = useCallback(async () => {
    if (cameraRef.current && !isCapturing) {
      setIsCapturing(true);
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        
        onImageCaptured(photo.uri);
        
        // Analyze pose (placeholder for now)
        if (onPoseAnalyzed) {
          const mockPoseData = [
            { x: 0.5, y: 0.3, z: 0.0, visibility: 0.9 },
            { x: 0.4, y: 0.4, z: 0.0, visibility: 0.8 },
            { x: 0.6, y: 0.4, z: 0.0, visibility: 0.8 },
          ];
          onPoseAnalyzed(mockPoseData);
        }
        
        Alert.alert('Success', 'Photo captured and pose analyzed!');
      } catch (error) {
        Alert.alert('Error', 'Failed to capture photo');
        console.error('Camera error:', error);
      } finally {
        setIsCapturing(false);
      }
    }
  }, [isCapturing, onImageCaptured, onPoseAnalyzed]);

  const pickImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onImageCaptured(result.assets[0].uri);
      
      // Mock pose analysis for uploaded image
      if (onPoseAnalyzed) {
        const mockPoseData = [
          { x: 0.5, y: 0.3, z: 0.0, visibility: 0.9 },
          { x: 0.4, y: 0.4, z: 0.0, visibility: 0.8 },
          { x: 0.6, y: 0.4, z: 0.0, visibility: 0.8 },
        ];
        onPoseAnalyzed(mockPoseData);
      }
      
      Alert.alert('Success', 'Image uploaded and pose analyzed!');
    }
  }, [onImageCaptured, onPoseAnalyzed]);

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No access to camera</Text>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Choose from Gallery</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setType(
                type === CameraType.back ? CameraType.front : CameraType.back
              );
            }}
          >
            <Text style={styles.buttonText}>Flip Camera</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.captureButton, isCapturing && styles.capturingButton]}
            onPress={takePicture}
            disabled={isCapturing}
          >
            <Text style={styles.buttonText}>
              {isCapturing ? 'Capturing...' : 'Capture'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>Gallery</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
    alignItems: 'flex-end',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 15,
    borderRadius: 10,
  },
  captureButton: {
    backgroundColor: '#FF6B6B',
    padding: 20,
    borderRadius: 50,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  capturingButton: {
    backgroundColor: '#FF9999',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
}); 