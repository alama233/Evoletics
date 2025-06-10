const API_BASE_URL = 'https://evoletics-backend-8c703d57094e.herokuapp.com';

interface PosePoint {
  x: number;
  y: number;
  z: number;
  visibility: number;
}

interface WorkoutRequest {
  profile: {
    profile_id: string;
    age: number;
    position?: string;
    experience_level?: string;
  };
  history: any[];
  pose: PosePoint[];
}

export const generateWorkout = async (request: WorkoutRequest) => {
  try {
    const response = await fetch(`${API_BASE_URL}/generate/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const analyzeVision = async (imageUri: string) => {
  try {
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'pose_image.jpg',
    } as any);

    const response = await fetch(`${API_BASE_URL}/vision/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Vision API Error:', error);
    throw error;
  }
};

// ... existing API functions 