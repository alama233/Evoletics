# Evoletics - Baseball Training App

## Overview

Evoletics is an AI-powered sports training platform that delivers personalized daily training programs for baseball athletes. The app uses Claude 3 Haiku to create custom training plans based on comprehensive athlete assessments and adapts intelligently over time.

## Current Development Status

- All source code is contained within the `EV/` directory
- Successfully migrated to Expo SDK 53
- Transitioned from OpenAI to Claude 3 Haiku for training logic
- **Current focus**: Claude service creation and integration

## User Experience Flow

### 1. Onboarding
- **Splash Screen**: Branded intro with logo and animation
- **Comprehensive Questionnaire**:
  - Basic demographics (name, age, gender, height, weight)
  - Baseball specifics (throwing hand, position)
  - Position-specific metrics:
    - **Catchers**: Pop time, throwing velocity
    - **Pitchers**: Sitting velocity, top velocity, pitch arsenal
    - **Fielders**: Arm strength, defensive throws
  - Performance metrics (strength, speed, mobility)
  - Health history and limitations
  - Short and long-term goals

### 2. Plan Generation
- Animated loading screen (10 seconds)
- "Your Plan is Ready" confirmation with CTA

### 3. Account Creation
- Free 30-day trial offer
- Subscription options:
  - Monthly: $9.99
  - Yearly: $99.99
- Email/password registration or login

### 4. Main Application
- **Home Screen**:
  - Personalized greeting
  - Weekly calendar navigation
  - Today's training plan with sections:
    - Throwing
    - Strength
    - Mobility
    - Arm Care
  - Each exercise includes name, sets/reps, rest periods, video links, and notes
- **Additional Views**:
  - Calendar for historical/future workouts
  - Detailed exercise information
  - Settings and preferences
  - Claude-powered chat assistant

## Claude 3 Haiku Integration

The app now leverages Claude 3 Haiku for all training logic, offering:
- Cost efficiency (~$0.07/user/month)
- 200K token context window
- Superior structure and JSON formatting
- Enhanced reasoning capabilities

## AI Training Logic Requirements

The Claude integration must:

1. **Process Athlete Data**
   - Interpret all questionnaire responses and metrics

2. **Apply Expert Coaching Logic**
   - Generate truly custom plans, not templates
   - Provide reasoning similar to elite human coaches

3. **Create Comprehensive Daily Programs**
   - Structure programs with appropriate sections:
     - Warm-up
     - Throwing
     - Strength
     - Mobility
     - Arm Care
     - Optional: Speed work, Recovery
   - Include complete exercise details

4. **Implement Progressive Training**
   - Incorporate appropriate rest days
   - Gradually increase intensity
   - Adjust based on previous workouts

5. **Personalize for Individual Needs**
   - Accommodate injuries and limitations
   - Prioritize areas needing improvement
   - Align with athlete's specific goals

## Claude Prompt Structure
{
"prompt": "You are a world-class AI baseball coach. Based on the user profile below, generate a full daily training plan in JSON format including throwing, strength, mobility, and arm care. Every plan must be safe, efficient, and tailored toward the user's short- and long-term goals.",
"user_profile": { structured_questionnaire_data },
"output_format": {
"day": "Mobility + Strength",
"sections": [
{
"type": "Warmup",
"exercises": [...]
},
{
"type": "Throwing",
"exercises": [...]
},
{
"type": "Mobility",
"exercises": [...]
},
{
"type": "Strength",
"exercises": [...]
}
]
}
}


## Project Structure
EV/
├── app.js
├── app.json
├── package.json
├── babel.config.js
├── .env
├── assets/
├── components/
├── config/
├── context/
├── docs/
│ └── CONTEXT.md
├── lib/
├── navigation/
├── screens/
├── services/


## Key Files for Development

- **`services/api/claudeService.js`** ✅ NEXT PRIORITY
  - Handles Claude API communication
  - Manages prompt submission and response parsing

- **`services/workout/workoutGenerator.js`**
  - Formats questionnaire data for Claude
  - Implements day-to-day planning logic

- **`screens/ChatScreen.js`**
  - Implements Claude-powered chat interface

- **`context/WorkoutContext.js`**
  - Manages workout state and logic

- **`hooks/useWorkout.js`**
  - Custom hook for workout data and loading states

- **`config/theme.js`**
  - Theme configuration for light/dark modes

## Development Philosophy

Claude is the core intelligence of Evoletics. The app must deliver elite-level coaching that feels personalized, intelligent, and adaptive. Each training plan should reflect professional-grade coaching expertise while being tailored to the individual athlete's needs, goals, and limitations.

---

**Next Development Task:** Implement the Claude API service in `services/api/claudeService.js` using the `claude-3-haiku-20240307` model with the endpoint `https://api.anthropic.com/v1/messages` to generate daily training plans in JSON format.