import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveWorkoutProgress = async (workoutId, exerciseData) => {
  try {
    const existingData = await AsyncStorage.getItem('workoutHistory');
    const workoutHistory = existingData ? JSON.parse(existingData) : [];
    
    workoutHistory.push({
      id: workoutId,
      date: new Date().toISOString(),
      exercises: exerciseData,
      completed: true
    });

    await AsyncStorage.setItem('workoutHistory', JSON.stringify(workoutHistory));
    return true;
  } catch (error) {
    console.error('Error saving workout progress:', error);
    return false;
  }
};

export const getWorkoutStats = async () => {
  try {
    const workoutHistory = await AsyncStorage.getItem('workoutHistory');
    if (!workoutHistory) return null;

    const history = JSON.parse(workoutHistory);
    
    return {
      totalWorkouts: history.length,
      thisWeek: history.filter(w => isThisWeek(new Date(w.date))).length,
      thisMonth: history.filter(w => isThisMonth(new Date(w.date))).length,
      streak: calculateStreak(history)
    };
  } catch (error) {
    console.error('Error getting workout stats:', error);
    return null;
  }
};

const isThisWeek = (date) => {
  const now = new Date();
  const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
  return date >= weekStart;
};

const isThisMonth = (date) => {
  const now = new Date();
  return date.getMonth() === now.getMonth() && 
         date.getFullYear() === now.getFullYear();
};

const calculateStreak = (history) => {
  if (!history.length) return 0;
  
  let streak = 0;
  let currentDate = new Date();
  
  for (let i = 0; i < history.length; i++) {
    const workoutDate = new Date(history[i].date);
    if (isSameDay(workoutDate, currentDate)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (!isSameDay(workoutDate, currentDate) && 
               workoutDate < currentDate) {
      break;
    }
  }
  
  return streak;
};

const isSameDay = (date1, date2) => {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
};

export const getPersonalRecords = async () => {
  try {
    const workoutHistory = await AsyncStorage.getItem('workoutHistory');
    if (!workoutHistory) return [];

    const history = JSON.parse(workoutHistory);
    const prs = [];
    const exerciseMaxes = {};

    history.forEach(workout => {
      workout.exercises.forEach(exercise => {
        exercise.weight.forEach(set => {
          const key = `${exercise.name}-${set.reps}`;
          if (!exerciseMaxes[key] || set.weight > exerciseMaxes[key].weight) {
            exerciseMaxes[key] = {
              exercise: exercise.name,
              weight: set.weight,
              reps: set.reps,
              date: set.date
            };
          }
        });
      });
    });

    return Object.values(exerciseMaxes);
  } catch (error) {
    console.error('Error getting personal records:', error);
    return [];
  }
};

export const getExerciseHistory = async (exerciseNames) => {
  try {
    const history = await AsyncStorage.getItem('exerciseHistory');
    const parsedHistory = JSON.parse(history) || {};
    
    // Create an object with exercise histories
    const exerciseHistories = {};
    exerciseNames.forEach(name => {
      exerciseHistories[name] = parsedHistory[name] || [];
    });
    
    return exerciseHistories;
  } catch (error) {
    console.error('Error getting exercise history:', error);
    return {};
  }
};

export const saveExerciseSet = async (exerciseName, setData) => {
  try {
    const history = await AsyncStorage.getItem('exerciseHistory');
    const parsedHistory = JSON.parse(history) || {};
    
    // Add new set to exercise history
    if (!parsedHistory[exerciseName]) {
      parsedHistory[exerciseName] = [];
    }
    
    parsedHistory[exerciseName].unshift({
      ...setData,
      date: new Date().toISOString()
    });

    // Keep only last 10 sets
    parsedHistory[exerciseName] = parsedHistory[exerciseName].slice(0, 10);
    
    await AsyncStorage.setItem('exerciseHistory', JSON.stringify(parsedHistory));
    return true;
  } catch (error) {
    console.error('Error saving exercise set:', error);
    return false;
  }
};

export const getExerciseDetails = (exerciseType) => {
  const exerciseDetails = {
    'Bench Press': {
      sets: 3,
      reps: '8-12',
      rest: '90 seconds',
      tips: [
        'Keep your feet flat on the ground',
        'Maintain a slight arch in your back',
        'Lower the bar to mid-chest',
        'Keep elbows at about 45 degrees'
      ]
    },
    'Squats': {
      sets: 4,
      reps: '6-8',
      rest: '120 seconds',
      tips: [
        'Keep your chest up',
        'Push through your heels',
        'Keep knees in line with toes',
        'Break parallel at the bottom'
      ]
    },
    // Add more exercises as needed
  };

  return exerciseDetails[exerciseType] || {
    sets: 3,
    reps: '10-12',
    rest: '60 seconds',
    tips: [
      'Maintain proper form throughout',
      'Control the movement',
      'Focus on muscle engagement',
      'Breathe steadily'
    ]
  };
}; 