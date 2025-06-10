import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';

export const collectQuestionnaireAnswers = async () => {
  try {
    // Collect all answers from AsyncStorage
    const answers = {
      // Basic Information
      age: await AsyncStorage.getItem('age'),
      height: await AsyncStorage.getItem('height'),
      weight: await AsyncStorage.getItem('weight'),
      
      // Position Information
      positions: await AsyncStorage.getItem('positions'),
      exitVelocity: await AsyncStorage.getItem('exitVelocity'),
      throwingVelocity: await AsyncStorage.getItem('throwingVelocity'),
      
      // Strength Information
      gymAccess: await AsyncStorage.getItem('gymAccess'),
      deadliftMax: await AsyncStorage.getItem('deadliftMax'),
      squatMax: await AsyncStorage.getItem('squatMax'),
      reverseLungeMax: await AsyncStorage.getItem('reverseLungeMax'),
      benchPressMax: await AsyncStorage.getItem('benchPressMax'),
      dashTime: await AsyncStorage.getItem('dashTime'),
      splitTime: await AsyncStorage.getItem('splitTime'),

      // Health Information
      injuries: await AsyncStorage.getItem('injuries'),
      conditions: await AsyncStorage.getItem('conditions'),
      allergies: await AsyncStorage.getItem('allergies'),

      // Goals
      baseballGoals: await AsyncStorage.getItem('goals'),
    };

    // Log the collected answers for debugging
    console.log('Collected questionnaire answers:', answers);

    // Verify we have all required answers
    const hasAllAnswers = Object.values(answers).every(value => value !== null);
    if (!hasAllAnswers) {
      console.error('Missing some questionnaire answers:', 
        Object.entries(answers)
          .filter(([key, value]) => value === null)
          .map(([key]) => key)
      );
      throw new Error('Missing required questionnaire answers');
    }

    // Try to store in Supabase if available
    if (supabase) {
      const { error } = await supabase
        .from('user_assessments')
        .insert([
          {
            user_id: userId,
            assessment_data: answers,
            created_at: new Date()
          }
        ]);

      if (error) {
        console.warn('Supabase storage error:', error);
      }
    }

    return answers;
  } catch (error) {
    console.error('Error collecting questionnaire answers:', error);
    throw error;
  }
}; 