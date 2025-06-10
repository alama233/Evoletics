export const generateWorkoutPlan = async (userProfile) => {
    try {
      const response = await axios.post('/api/generate-plan', {
        profile: userProfile,
        goals: userProfile.goals,
        experience: userProfile.experience
      });
  
      return response.data.workoutPlan;
    } catch (error) {
      console.error('Workout planning error:', error);
      return null;
    }
  }; 