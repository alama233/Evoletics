import AsyncStorage from '@react-native-async-storage/async-storage';

// Convert AI text response into structured workout data
export const parseWorkoutPlan = (planText) => {
  const workoutDays = {};
  const sections = planText.split('\n\n');

  sections.forEach(section => {
    // Updated to handle any day of the week
    const dayMatch = section.match(/(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\s*-\s*(.*)/);
    if (dayMatch) {
      const [_, dayOfWeek, workoutType] = dayMatch;
      const exerciseLines = section.split('\n').slice(1); // Skip the day/type line

      const exercises = exerciseLines
        .filter(line => line.trim().startsWith('-'))
        .map(line => {
          const exerciseText = line.replace('-', '').trim();
          
          // Updated regex to handle the new format with guidance in parentheses
          const match = exerciseText.match(/(.*?):\s*(\d+)x(\d+)(?:\s*\((.*?)\))?/);
          
          if (!match) return null;
          
          const [_, name, sets, reps, guidance] = match;
          
          return {
            id: `${name}-${Date.now()}-${Math.random()}`,
            name: name.trim(),
            sets: parseInt(sets),
            reps: parseInt(reps),
            guidance: guidance ? guidance.trim() : '',
            weight: 0,
            restTime: 90,
            completed: false,
            notes: guidance || '',
            history: []
          };
        })
        .filter(Boolean); // Remove any null entries

      workoutDays[dayOfWeek] = {
        type: workoutType.trim(),
        exercises: exercises,
        completed: false,
        duration: '45-60 min'
      };
    }
  });

  return workoutDays;
};

const getDefaultWorkout = (position = 'General') => {
  const baseWorkouts = {
    Pitcher: {
      Monday: {
        type: 'Arm Care & Upper Body',
        exercises: [
          {
            id: 'warmup-1',
            name: 'Dynamic Warm-up',
            sets: 1,
            reps: 1,
            guidance: 'Focus on shoulder mobility and arm circles',
            weight: 0,
            restTime: 60,
            completed: false,
            notes: 'Complete full warm-up routine',
            history: []
          },
          {
            id: 'band-1',
            name: 'Band Work Series',
            sets: 3,
            reps: 15,
            guidance: 'Internal/External rotation, Y\'s, T\'s, W\'s',
            weight: 0,
            restTime: 45,
            completed: false,
            notes: 'Light resistance, focus on control',
            history: []
          },
          {
            id: 'plyo-1',
            name: 'Plyometric Throws',
            sets: 3,
            reps: 10,
            guidance: '50% intensity, focus on mechanics',
            weight: 0,
            restTime: 90,
            completed: false,
            notes: 'Use lightweight plyo balls',
            history: []
          }
        ],
        completed: false,
        duration: '45-60 min'
      },
      Wednesday: {
        type: 'Lower Body & Core',
        exercises: [
          {
            id: 'squat-1',
            name: 'Front Squats',
            sets: 4,
            reps: 8,
            guidance: 'Focus on depth and posture',
            weight: 0,
            restTime: 90,
            completed: false,
            notes: 'Keep core engaged throughout',
            history: []
          },
          {
            id: 'core-1',
            name: 'Medicine Ball Rotations',
            sets: 3,
            reps: 12,
            guidance: 'Control the movement, focus on hip rotation',
            weight: 0,
            restTime: 60,
            completed: false,
            notes: 'Simulate throwing motion',
            history: []
          }
        ],
        completed: false,
        duration: '45-60 min'
      },
      Friday: {
        type: 'Recovery & Light Skills',
        exercises: [
          {
            id: 'mobility-1',
            name: 'Mobility Flow',
            sets: 1,
            reps: 1,
            guidance: 'Full body mobility routine',
            weight: 0,
            restTime: 30,
            completed: false,
            notes: '10-15 minutes continuous movement',
            history: []
          },
          {
            id: 'throw-1',
            name: 'Light Throwing',
            sets: 1,
            reps: 1,
            guidance: 'Long toss progression',
            weight: 0,
            restTime: 0,
            completed: false,
            notes: '15-20 minutes, stay below 75% effort',
            history: []
          }
        ],
        completed: false,
        duration: '30-45 min'
      }
    },
    Position: {
      Monday: {
        type: 'Strength & Power',
        exercises: [
          {
            id: 'warmup-1',
            name: 'Dynamic Warm-up',
            sets: 1,
            reps: 1,
            guidance: 'Full body activation',
            weight: 0,
            restTime: 60,
            completed: false,
            notes: 'Include agility ladder work',
            history: []
          },
          {
            id: 'power-1',
            name: 'Box Jumps',
            sets: 4,
            reps: 6,
            guidance: 'Explosive movement, soft landing',
            weight: 0,
            restTime: 90,
            completed: false,
            notes: 'Focus on landing mechanics',
            history: []
          }
        ],
        completed: false,
        duration: '45-60 min'
      }
      // ... similar structure for Wednesday and Friday
    }
  };

  // Return position-specific workout or general position player workout
  return baseWorkouts[position] || baseWorkouts.Position;
};

// Save the structured workout plan
export const saveWorkoutPlan = async (workoutPlan) => {
  try {
    // Parse the workout plan if it's a string
    const parsedPlan = typeof workoutPlan === 'string' 
      ? JSON.parse(workoutPlan) 
      : workoutPlan;

    // Add metadata
    const workoutWithMeta = {
      ...parsedPlan,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      completionStatus: {}, // Will track completed exercises
      progressData: {} // Will store progress metrics
    };

    // Save to AsyncStorage
    await AsyncStorage.setItem('currentWorkoutPlan', JSON.stringify(workoutWithMeta));
    
    // Log for verification
    console.log('Saved workout plan:', workoutWithMeta);
    
    return workoutWithMeta;
  } catch (error) {
    console.error('Error saving workout plan:', error);
    throw error;
  }
};

export const getTodaysWorkout = async () => {
  try {
    const today = new Date().toDateString();
    const workout = await AsyncStorage.getItem(`workout_${today}`);
    return workout ? JSON.parse(workout) : null;
  } catch (error) {
    console.error('Error getting today\'s workout:', error);
    return null;
  }
};

export const getWorkoutForDay = async (dayOfWeek) => {
  try {
    const workoutPlanString = await AsyncStorage.getItem('currentWorkoutPlan');
    if (!workoutPlanString) return null;

    const workoutPlan = JSON.parse(workoutPlanString);
    
    // Find the workout for the specified day
    const dayWorkout = workoutPlan.find(day => 
      day.dayOfWeek.toLowerCase() === dayOfWeek.toLowerCase()
    );

    if (!dayWorkout) return null;

    // Add tracking properties to each exercise
    const workoutWithTracking = {
      ...dayWorkout,
      schedule: dayWorkout.schedule.map(section => ({
        ...section,
        exercises: section.exercises.map(exercise => ({
          ...exercise,
          isCompleted: false,
          setProgress: Array(exercise.sets).fill(false)
        }))
      }))
    };

    return workoutWithTracking;
  } catch (error) {
    console.error('Error getting workout for day:', error);
    throw error;
  }
};

export const updateExerciseProgress = async (dayOfWeek, sectionIndex, exerciseIndex, setIndex) => {
  try {
    const workoutPlanString = await AsyncStorage.getItem('currentWorkoutPlan');
    if (!workoutPlanString) return;

    const workoutPlan = JSON.parse(workoutPlanString);
    const dayIndex = workoutPlan.findIndex(day => 
      day.dayOfWeek.toLowerCase() === dayOfWeek.toLowerCase()
    );

    if (dayIndex === -1) return;

    // Update the specific set's completion status
    const exercise = workoutPlan[dayIndex].schedule[sectionIndex].exercises[exerciseIndex];
    if (!exercise.setProgress) {
      exercise.setProgress = Array(exercise.sets).fill(false);
    }
    exercise.setProgress[setIndex] = !exercise.setProgress[setIndex];

    // Update exercise completion status
    exercise.isCompleted = exercise.setProgress.every(set => set);

    // Save updated plan
    await AsyncStorage.setItem('currentWorkoutPlan', JSON.stringify(workoutPlan));

    return workoutPlan[dayIndex];
  } catch (error) {
    console.error('Error updating exercise progress:', error);
    throw error;
  }
};

export const getWorkoutProgress = async () => {
  try {
    const workoutPlanString = await AsyncStorage.getItem('currentWorkoutPlan');
    if (!workoutPlanString) return null;

    const workoutPlan = JSON.parse(workoutPlanString);
    
    // Calculate overall progress
    const progress = workoutPlan.map(day => {
      const totalExercises = day.schedule.reduce((total, section) => 
        total + section.exercises.length, 0
      );
      
      const completedExercises = day.schedule.reduce((total, section) => 
        total + section.exercises.filter(ex => ex.isCompleted).length, 0
      );

      return {
        dayOfWeek: day.dayOfWeek,
        progress: totalExercises ? (completedExercises / totalExercises) * 100 : 0
      };
    });

    return progress;
  } catch (error) {
    console.error('Error getting workout progress:', error);
    throw error;
  }
};

export const saveWorkoutProgress = async (sectionKey, progress) => {
  try {
    const today = new Date().toDateString();
    const key = `progress_${today}_${sectionKey}`;
    await AsyncStorage.setItem(key, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving workout progress:', error);
  }
};