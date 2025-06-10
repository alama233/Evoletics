import AsyncStorage from '@react-native-async-storage/async-storage';

// Sample profiles for different positions
const sampleProfiles = {
  pitcher: {
    position: "Pitcher",
    age: 17,
    height: "6'1\"",
    weight: 190,
    arm: "Right-handed",
    trainingExperience: "3 years",
    primaryGoal: "Increase throwing velocity",
    secondaryGoal: "Improve mobility and strength",
    healthNotes: "History of minor shoulder soreness",
    experience: "Intermediate"
  },
  catcher: {
    position: "Catcher",
    age: 19,
    height: "5'11\"",
    weight: 205,
    arm: "Right-handed",
    trainingExperience: "5 years",
    primaryGoal: "Improve lower body strength",
    secondaryGoal: "Increase throwing accuracy",
    healthNotes: "Occasional knee discomfort",
    experience: "Advanced"
  },
  outfielder: {
    position: "Outfielder",
    age: 16,
    height: "5'10\"",
    weight: 175,
    arm: "Left-handed",
    trainingExperience: "2 years",
    primaryGoal: "Increase sprint speed",
    secondaryGoal: "Improve throwing distance",
    healthNotes: "No injuries",
    experience: "Beginner"
  },
  infielder: {
    position: "Shortstop",
    age: 18,
    height: "5'9\"",
    weight: 170,
    arm: "Right-handed",
    trainingExperience: "4 years",
    primaryGoal: "Improve lateral quickness",
    secondaryGoal: "Increase throwing accuracy",
    healthNotes: "Mild ankle sprain 6 months ago",
    experience: "Intermediate"
  }
};

// Save a sample profile to AsyncStorage for testing
export const setSampleProfile = async (position) => {
  try {
    const profile = sampleProfiles[position.toLowerCase()] || sampleProfiles.pitcher;
    await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
    console.log(`Set sample ${position} profile:`, profile);
    return profile;
  } catch (error) {
    console.error('Error setting sample profile:', error);
    throw error;
  }
};

// Get the current user profile
export const getUserProfile = async () => {
  try {
    const profileString = await AsyncStorage.getItem('userProfile');
    if (profileString) {
      return JSON.parse(profileString);
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// Save a user profile
export const saveUserProfile = async (profile) => {
  try {
    await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
    return true;
  } catch (error) {
    console.error('Error saving user profile:', error);
    return false;
  }
};

// Save questionnaire responses
export const saveQuestionnaireResponses = async (responses) => {
  try {
    await AsyncStorage.setItem('questionnaireResponses', JSON.stringify(responses));
    console.log('Saved questionnaire responses:', responses);
    
    // Also update the user profile with key information
    const currentProfile = await getUserProfile() || {};
    
    // Extract key information from questionnaire to update profile
    const profileUpdates = {
      position: responses.position || currentProfile.position,
      age: responses.age || currentProfile.age,
      height: responses.height || currentProfile.height,
      weight: responses.weight || currentProfile.weight,
      arm: responses.throwingArm || currentProfile.arm,
      experience: responses.experience || currentProfile.experience,
      primaryGoal: responses.primaryGoal || currentProfile.primaryGoal,
      healthNotes: responses.injuries || currentProfile.healthNotes
    };
    
    // Update the profile
    const updatedProfile = { ...currentProfile, ...profileUpdates };
    await saveUserProfile(updatedProfile);
    
    return true;
  } catch (error) {
    console.error('Error saving questionnaire responses:', error);
    return false;
  }
};

// Get questionnaire responses
export const getQuestionnaireResponses = async () => {
  try {
    const responsesString = await AsyncStorage.getItem('questionnaireResponses');
    if (responsesString) {
      return JSON.parse(responsesString);
    }
    return null;
  } catch (error) {
    console.error('Error getting questionnaire responses:', error);
    return null;
  }
};

export default {
  setSampleProfile,
  getUserProfile,
  saveUserProfile,
  sampleProfiles
}; 