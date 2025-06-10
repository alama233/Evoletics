import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Replace localhost with your actual IP address
const API_BASE_URL = 'http://10.0.0.41:8000';  // Your computer's IP

// Or if you're on a physical device, use your computer's IP:
// const API_BASE_URL = 'http://192.168.1.XXX:8000';  // Replace XXX with your IP

// System prompt is now handled on the backend
export const generateWorkoutPlan = async (userProfile) => {
  try {
    console.log('Generating workout plan with new backend API...');
    console.log('Input userProfile:', userProfile);
    
    // DEBUG: Check all AsyncStorage keys
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      console.log('ALL ASYNCSTORAGE KEYS:', allKeys);
      
      // Get all values to see what's actually stored
      const allData = await AsyncStorage.multiGet(allKeys);
      console.log('ALL ASYNCSTORAGE DATA:', allData);
    } catch (debugError) {
      console.error('Debug error:', debugError);
    }
    
    // LOAD DATA USING THE ACTUAL INDIVIDUAL KEYS
    let athleteProfile = {};
    
    try {
      // Load data using the actual individual keys from AsyncStorage
      const age = await AsyncStorage.getItem('age');
      const firstName = await AsyncStorage.getItem('firstName');
      const lastName = await AsyncStorage.getItem('lastName');
      const height = await AsyncStorage.getItem('height');
      const weight = await AsyncStorage.getItem('weight');
      const competitionLevel = await AsyncStorage.getItem('competitionLevel');
      const throwingHand = await AsyncStorage.getItem('throwingHand');
      const hittingHand = await AsyncStorage.getItem('hittingHand');
      
      // Position data
      const positions = await AsyncStorage.getItem('positions');
      
      // Pitcher specific
      const pitchTypes = await AsyncStorage.getItem('pitchTypes');
      const topVelocity = await AsyncStorage.getItem('topVelocity');
      const sittingVelocity = await AsyncStorage.getItem('sittingVelocity');
      const pitchingGoals = await AsyncStorage.getItem('pitchingGoals');
      const rankedAspects = await AsyncStorage.getItem('rankedAspects');
      const rankedPitches = await AsyncStorage.getItem('rankedPitches');
      
      // Strength metrics
      const benchPressMax = await AsyncStorage.getItem('benchPressMax');
      const squatMax = await AsyncStorage.getItem('squatMax');
      const deadliftMax = await AsyncStorage.getItem('deadliftMax');
      const reverseLungeMax = await AsyncStorage.getItem('reverseLungeMax');
      const dashTime = await AsyncStorage.getItem('dashTime');
      const splitTime = await AsyncStorage.getItem('splitTime');
      
      // Health info
      const injuries = await AsyncStorage.getItem('injuries');
      const conditions = await AsyncStorage.getItem('conditions');
      const allergies = await AsyncStorage.getItem('allergies');
      
      // Equipment access
      const hasEquipment = await AsyncStorage.getItem('hasEquipment');
      const equipmentAccess = await AsyncStorage.getItem('equipmentAccess');
      
      // Goals
      const goals = await AsyncStorage.getItem('goals');
      
      console.log('Raw individual AsyncStorage data:');
      console.log('age:', age);
      console.log('firstName:', firstName);
      console.log('topVelocity:', topVelocity);
      console.log('competitionLevel:', competitionLevel);
      console.log('pitchingGoals:', pitchingGoals);
      
      // Parse arrays that are stored as JSON strings
      let parsedPitchTypes = [];
      let parsedPitchingGoals = [];
      let parsedRankedAspects = [];
      let parsedRankedPitches = [];
      
      try {
        if (pitchTypes) {
          // Handle both comma-separated and JSON array formats
          if (pitchTypes.startsWith('[')) {
            parsedPitchTypes = JSON.parse(pitchTypes);
          } else {
            parsedPitchTypes = pitchTypes.split(',');
          }
        }
        if (pitchingGoals) parsedPitchingGoals = JSON.parse(pitchingGoals);
        if (rankedAspects) parsedRankedAspects = JSON.parse(rankedAspects);
        if (rankedPitches) parsedRankedPitches = JSON.parse(rankedPitches);
      } catch (parseError) {
        console.error('Error parsing arrays:', parseError);
      }
      
      // Build the complete athlete profile
      athleteProfile = {
        profile_id: 'athlete123',
        
        // Basic info
        age: parseInt(age) || 25,
        firstName: firstName || '',
        lastName: lastName || '',
        height: height || '',
        weight: weight || '',
        competitionLevel: competitionLevel || '',
        throwingHand: throwingHand || '',
        hittingHand: hittingHand || '',
        
        // Position info
        position: positions || 'pitcher',
        positions: positions ? [positions] : [],
        
        // Pitcher specific
        pitchTypes: parsedPitchTypes,
        topVelocity: parseInt(topVelocity) || 0,
        sittingVelocity: parseInt(sittingVelocity) || 0,
        pitchingGoals: parsedPitchingGoals,
        rankedAspects: parsedRankedAspects,
        rankedPitches: parsedRankedPitches,
        
        // Strength metrics
        benchPressMax: parseInt(benchPressMax) || 0,
        squatMax: parseInt(squatMax) || 0,
        deadliftMax: parseInt(deadliftMax) || 0,
        reverseLungeMax: parseInt(reverseLungeMax) || 0,
        dashTime: parseFloat(dashTime) || 0,
        splitTime: parseFloat(splitTime) || 0,
        
        // Health info
        injuries: injuries || '',
        conditions: conditions || '',
        allergies: allergies || '',
        
        // Equipment access
        hasEquipment: hasEquipment || '',
        equipmentAccess: equipmentAccess || '',
        
        // Goals
        goals: goals || '',
        
        // Set experience level based on competition level
        experience_level: competitionLevel === 'High School' ? 'intermediate' : 
                         competitionLevel === 'Collegiate' ? 'advanced' : 
                         competitionLevel === 'Professional' ? 'elite' :
                         competitionLevel === 'College' ? 'advanced' : 'beginner'
      };
      
      console.log('🎯 COMPLETE ATHLETE PROFILE WITH REAL DATA:', athleteProfile);
      
    } catch (error) {
      console.error('Error loading profile from AsyncStorage:', error);
      // Fallback profile
      athleteProfile = {
        profile_id: 'athlete123',
        age: 25,
        position: 'pitcher',
        experience_level: 'intermediate'
      };
    }

    // Merge with any passed userProfile (but prioritize AsyncStorage data)
    if (userProfile && typeof userProfile === 'object') {
      athleteProfile = { ...userProfile, ...athleteProfile };
    }

    // Call the new backend API with complete profile
    console.log('🚀 SENDING FULL PROFILE TO AI BACKEND:', athleteProfile);
    
    const response = await fetch(`${API_BASE_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        profile: athleteProfile,
        history: [],
        pose: [] // Empty pose data for now
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('🎉 AI-PERSONALIZED WORKOUT RECEIVED:', data);
    return data;
    
  } catch (error) {
    console.error('New backend API failed, falling back to original method:', error);
    
    // Fallback to basic workout structure
    return {
      status: "success",
      plan: {
        warmups: ["Light jog", "Dynamic stretching"],
        drills: ["Basic throwing", "Fielding practice"],
        strength: {
          sets: 3,
          reps: 10,
          percent: 75,
          exercises: ["Push-ups", "Squats", "Lunges"]
        },
        mobility: ["Shoulder circles", "Hip rotations"],
        recovery: {
          details: "Rest and hydrate properly"
        }
      }
    };
  }
};

// The formatProfileForClaude function is no longer needed as formatting happens on the backend

export const generateChatResponse = async (message, userProfile) => {
  try {
    console.log('Sending request to Claude API...');
    
    // Use Claude API for chat responses
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        system: CHAT_SYSTEM_PROMPT, // Correct placement as top-level parameter
        messages: [
          {
            role: 'user',
            content: `The user is asking: ${message}
            
            Provide a helpful, concise response about baseball training, technique, or performance.`
          }
        ]
      })
    });

    const responseText = await response.text();
    console.log('API Response:', responseText);

    if (!response.ok) {
      console.error('Claude API error status:', response.status);
      console.error('Claude API error text:', responseText);
      throw new Error(`Failed to get response from AI coach: ${response.status}`);
    }

    const data = JSON.parse(responseText);
    console.log('Parsed data:', JSON.stringify(data, null, 2));

    // Check the structure of the response
    if (data && data.content && data.content.length > 0 && data.content[0].text) {
      return data.content[0].text;
    } else {
      console.error('Unexpected response structure:', data);
      throw new Error('Unexpected response structure from Claude API');
    }
  } catch (error) {
    console.error('Error generating chat response:', error);
    // Fallback to mock response if API fails
    return "I'm having trouble connecting to my knowledge base right now. Please try again in a moment. Error: " + error.message;
  }
};

export const testClaudeConnection = async () => {
  try {
    // Test the Claude API connection
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 100,
        messages: [
          {
            role: 'user',
            content: 'Hello, this is a test message. Please respond with "Connection successful".'
          }
        ]
      })
    });

    return response.ok;
  } catch (error) {
    console.error('Claude API connection failed:', error);
    return false;
  }
}; 