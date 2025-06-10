import AsyncStorage from '@react-native-async-storage/async-storage';

export const generateBaseballProgram = async () => {
  try {
    // Create a mock weekly program
    const mockProgram = {
      weeklyPlan: [
        {
          day: "Monday",
          type: "Strength & Throwing",
          duration: 75,
          schedule: [
            {
              section: "Warmup",
              exercises: [
                { name: "Dynamic Stretching", sets: 1, reps: 1, intensity: "Light" }
              ]
            },
            {
              section: "Throwing",
              exercises: [
                { name: "Long Toss", sets: 1, reps: 25, intensity: "Moderate" }
              ]
            },
            {
              section: "Strength",
              exercises: [
                { name: "Squats", sets: 3, reps: 10, intensity: "Moderate" },
                { name: "Bench Press", sets: 3, reps: 8, intensity: "Heavy" }
              ]
            }
          ]
        },
        {
          day: "Tuesday",
          type: "Mobility & Recovery",
          duration: 45,
          schedule: [
            {
              section: "Mobility",
              exercises: [
                { name: "Shoulder Mobility", sets: 3, reps: 10 },
                { name: "Hip Mobility", sets: 3, reps: 10 }
              ]
            },
            {
              section: "Recovery",
              exercises: [
                { name: "Foam Rolling", sets: 1, reps: 1, duration: "10 min" }
              ]
            }
          ]
        }
        // Add more days as needed
      ]
    };

    // Store the mock program
    await AsyncStorage.setItem('workoutProgram', JSON.stringify(mockProgram));
    return mockProgram;
  } catch (error) {
    console.error('Error generating baseball program:', error);
    return null;
  }
};

export const getTodaysWorkout = async () => {
  try {
    // Get the current day of the week
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    
    // Get the stored program
    const programData = await AsyncStorage.getItem('workoutProgram');
    if (!programData) {
      return null;
    }
    
    const program = JSON.parse(programData);
    
    // Find today's workout
    const todaysWorkout = program.weeklyPlan.find(day => day.day === today);
    return todaysWorkout || program.weeklyPlan[0]; // Return first workout if none for today
  } catch (error) {
    console.error('Error getting today\'s workout:', error);
    return null;
  }
}; 