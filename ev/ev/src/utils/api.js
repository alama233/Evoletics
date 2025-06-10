const API_BASE_URL = 'http://127.0.0.1:8000';

export const generateWorkout = async (profileData) => {
  try {
    console.log('🚀 Sending to backend:', profileData);
    
    const response = await fetch(`${API_BASE_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        profile: profileData,
        readiness: {},
        pose: [],
        history: []
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Backend response:', data);
    
    return data.plan; // Return just the plan part
    
  } catch (error) {
    console.error('❌ API Error:', error);
    throw error;
  }
}; 