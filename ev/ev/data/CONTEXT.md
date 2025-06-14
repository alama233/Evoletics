# Evoletics – Full App Context & Claude Haiku Transition Guide

## App Overview
Evoletics is an AI-driven sports training app designed specifically for baseball athletes. Its purpose is to help players—from beginners to advanced—unlock their full potential through ultra-personalized daily training programs generated by artificial intelligence. The main selling point of the app is its AI-generated workout plans, crafted uniquely for each user based on in-depth questionnaire data.

## App Flow (UI/UX)

1. **Splash Screen**
   - Displays Evoletics logo/branding for a couple of seconds with a light effect.

2. **Questionnaire Flow**
   - **First Name & Last Name**
   - **Age**
   - **Gender**
   - **Height & Weight**
   - **Pitching/Throwing Hand**
   - **Position Selection**
     - Based on selected position(s), users are asked highly specific questions:
       - **Catcher:** Pop time, home-to-second velocity
       - **Pitcher:** Sitting velo, top velo, pitch types
       - **Outfielder/Infielder:** Arm strength, positional throwing data
   - **Strength Section**
     - Max deadlift, squat, bench, vertical, etc.
   - **Speed Section**
     - 10-yard time, 30-yard time, 60-yard dash
   - **Mobility Section**
     - Joint mobility assessments, movement limitations, flexibility flags
   - **Health Section**
     - Allergies, medical conditions, current pain or injuries
   - **Goal Section**
     - Short-term goals, long-term goals, ideal outcome using Evoletics

3. **Plan Loading Sequence**
   - After submission, the app enters a mock "Loading your program" screen for ~10 seconds.
   - Then transitions to "Congrats, your plan is ready" with a **CTA to get started**.

4. **Onboarding Payment Flow**
   - Popup screen: "Start your Evoletics journey with 30 days free"
   - After accepting:
     - Monthly Plan: $9.99
     - Yearly Plan: ~$99.99 (33% off)
   - Then user must either **create an account** (email + password) or **log in**.

5. **Home Screen**
   - Header: Personalized greeting (e.g., "Good Morning, Alan")
   - Weekly calendar bar with clickable day selectors
   - **Today's Plan**: This section displays the current day's full plan
     - Dynamic + AI-generated
     - Updates daily based on progression, recovery, and goals

6. **Other Core Screens**
   - **Calendar View**: Tap any day to view past/future AI-generated programs (based on user's plan duration)
   - **Workout Detail View**: Interactive daily plan with video, reps, sets, timers, rest
   - **Chat Screen**: Built-in LLM where users can ask baseball or app-related questions. This will now be powered by **Claude 3 Haiku**
   - **Settings**: Plan management, logout, preferences

---

## AI System — The Heart of Evoletics

### Claude 3 Haiku Integration

We are switching from **OpenAI's GPT-3.5/4 Turbo** to **Anthropic's Claude 3 Haiku** for major benefits:
- **Cheaper costs** (estimated $0.07/month per user)
- **Handles 200K tokens** — ideal for reasoning through complex athlete data
- **Smarter formatting + more structured JSON generation**
- More "coach-like" logic and interpretation

---

### AI MUST DO THE FOLLOWING:

1. **Ingest Full Questionnaire Data**  
   The AI receives structured data including:
   - Age, height, weight, throwing hand, position
   - Positional metrics (velo, pop time, etc.)
   - Strength, speed, mobility assessments
   - Health & injury history
   - User-defined goals (short-term and long-term)

2. **Reason Like a Human Coach**
   - The AI is not a "template selector."
   - It must **evaluate** all inputs and **build a program from scratch**, just like a professional coach would.
   - Example: A pitcher with elbow history and great mobility might need prehab + reduced plyos + advanced velocity work.

3. **Daily, Dynamic Program Generation**
   - Each day's program includes:
     - Throwing plan
     - Strength & conditioning
     - Mobility & recovery
     - Optional: speed, weighted balls, arm care
   - Every exercise includes:
     - Name
     - Sets/Reps
     - Rest Time
     - Video URL
     - Notes (if needed)
   - Output must be in structured **JSON format** to plug into the home UI.

4. **Considers Progress Over Time**
   - Next-day workouts should account for previous day's workload
   - Long-term goal programming (e.g., throw 90mph in 4 months) should guide daily tasks

5. **Unlimited Adaptability**
   - Pitchers get different programming from catchers
   - Players with poor mobility are prioritized for corrective work
   - The program adapts as the user interacts with it

---

### Claude Setup Instructions

- Claude API Key must be added to your secure backend
- All **OpenAI folders, keys, and integrations** must be **removed**
- Replace all OpenAI logic with Claude API endpoints (`https://api.anthropic.com/v1/messages`)
- New system prompt and JSON output formatting will be provided
- Use `claude-3-haiku-20240307` model by default

---

### Claude Prompt Example (Simplified):

{
"prompt": "You are a world-class AI baseball coach. Based on the user profile below, generate a full daily training plan in JSON format including throwing, strength, mobility, and arm care. Every plan must be safe, efficient, and tailored toward the user's short- and long-term goals.",
"user_profile": "{insert structured questionnaire JSON here}",
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


### Key Development Notes for Cursor
- OpenAI is deprecated. Remove all related files, prompts, folders, and packages.
- All AI functionality will now run through Claude 3 Haiku.
- Developer must ensure all training plans display correctly in the Home Screen after login.
- Daily plans must change based on Claude's output.
- App must update daily without user prompt unless logic prevents generation (ex: rest days).
- All prompts must be optimized to reduce token usage and encourage structured output.

### Final Message to Cursor
The core of this app is its AI. The workouts must not be cookie-cutter or repetitive. The AI must generate real, intelligent, coaching logic based on real metrics, just like the best MLB coaches do — only better, because it has access to infinite knowledge and historical data. The user needs to feel and see improvement, because this app is designed to change lives and help young athletes become pros. Please implement all transitions to Claude with this mission in mind.

---

## App Folder Structure
```
evoletics/
├── assets/
│   ├── fonts/
│   ├── images/
│   └── animations/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.js
│   │   │   ├── Input.js
│   │   │   └── Loading.js
│   │   ├── workout/
│   │   │   ├── WorkoutPlanScreen.js
│   │   │   ├── ExerciseDetailScreen.js
│   │   │   └── ...
│   │   └── settings/
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginSignUpScreen.js
│   │   │   └── SubscriptionScreen.js
│   │   ├── onboarding/
│   │   │   ├── BasicInformationScreen.js
│   │   │   ├── PositionsScreen.js
│   │   │   └── ...
│   │   └── settings/
│   ├── navigation/
│   │   ├── AppNavigator.js
│   │   └── MainTabNavigator.js
│   ├── services/
│   │   ├── api/
│   │   │   ├── claudeService.js
│   │   │   └── supabaseService.js
│   │   ├── workout/
│   │   │   ├── workoutGenerator.js
│   │   │   └── workoutParser.js
│   │   └── utils/
│   ├── context/
│   │   ├── AuthContext.js
│   │   └── ThemeContext.js
│   ├── hooks/
│   │   ├── useWorkout.js
│   │   └── useAuth.js
│   ├── config/
│   │   ├── theme.js
│   │   └── constants.js
│   └── lib/
│       └── supabase.js
├── docs/
│   ├── CONTEXT.md
│   └── API.md
├── tests/
│   ├── unit/
│   └── integration/
├── app.json
├── App.js
├── babel.config.js
└── package.json
```

### Key Files to Create/Update

1. **services/api/claudeService.js**
   - Replace OpenAI implementation
   - Handle Claude API communication
   - Implement prompt templates

2. **services/workout/workoutGenerator.js**
   - Integrate with Claude
   - Handle workout plan generation
   - Process AI responses

3. **context/WorkoutContext.js**
   - Manage workout state
   - Handle plan updates
   - Cache current workouts

4. **hooks/useWorkout.js**
   - Custom hook for workout operations
   - Handle loading states
   - Manage workout data

5. **services/api/supabaseService.js**
   - Database operations
   - User management
   - Data synchronization

// ... rest of existing content ...