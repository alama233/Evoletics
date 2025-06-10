import 'react-native-gesture-handler';
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import * as ExpoSplashScreen from "expo-splash-screen";
import { registerRootComponent } from "expo";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ThemeProvider } from './context/ThemeContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'url-polyfill';

// Import screens
import FreeTrialScreen from './screens/FreeTrialScreen';
import LoadingScreen from './screens/LoadingScreen';
import PlanReadyScreen from './screens/PlanReadyScreen';
import LoginSignUpScreen from './screens/LoginSignUpScreen';
import SubscriptionScreen from './screens/SubscriptionScreen';
import MainTabNavigator from './navigation/MainTabNavigator';
import WorkoutOverviewScreen from './screens/WorkoutOverviewScreen';
import WorkoutSessionScreen from './screens/WorkoutSessionScreen';
import ExerciseDetailScreen from './screens/ExerciseDetailScreen';
import BasicInformationScreen from './screens/BasicInformationScreen';
import PositionsScreen from './screens/PositionsScreen';
import PitcherSpecificQuestions from './screens/PitcherSpecificQuestions';
import CatcherSpecificQuestions from './screens/CatcherSpecificQuestions';
import FirstBaseSpecificQuestions from './screens/1BSpecificQuestions';
import InfieldSpecificQuestions from './screens/InfieldSpecificQuestions';
import OFSpecificQuestions from './screens/OFSpecificQuestions';
import AccessibilityQuestions from './screens/AccessibilityQuestions';
import StrengthQuestions from './screens/StrengthQuestions';
import HealthQuestions from './screens/HealthQuestions';
import GoalQuestions from './screens/GoalQuestions';
import CustomSplashScreen from './screens/SplashScreen';
import DHSpecificQuestions from './screens/DHSpecificQuestions';

const Stack = createStackNavigator();

const App = () => {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await ExpoSplashScreen.preventAutoHideAsync();
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setIsAppReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = async () => {
    if (isAppReady) {
      await ExpoSplashScreen.hideAsync();
    }
  };

  if (!isAppReady) {
    return (
      <View style={styles.container}>
        <View style={styles.placeholder}>
          {/* Removed the Text component that showed "EVOLETICS" */}
        </View>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <NavigationContainer onReady={onLayoutRootView}>
          <Stack.Navigator
            screenOptions={{
              headerShown: false
            }}
            initialRouteName="Splash"
          >
            <Stack.Screen name="Splash" component={CustomSplashScreen} />
            <Stack.Screen name="BasicInformation" component={BasicInformationScreen} />
            <Stack.Screen name="PositionsScreen" component={PositionsScreen} />
            <Stack.Screen name="PitcherSpecificQuestions" component={PitcherSpecificQuestions} />
            <Stack.Screen name="CatcherSpecificQuestions" component={CatcherSpecificQuestions} />
            <Stack.Screen name="FirstBaseSpecificQuestions" component={FirstBaseSpecificQuestions} />
            <Stack.Screen name="InfieldSpecificQuestions" component={InfieldSpecificQuestions} />
            <Stack.Screen name="OFSpecificQuestions" component={OFSpecificQuestions} />
            <Stack.Screen name="DHSpecificQuestions" component={DHSpecificQuestions} />
            <Stack.Screen name="AccessibilityQuestions" component={AccessibilityQuestions} />
            <Stack.Screen name="StrengthQuestions" component={StrengthQuestions} />
            <Stack.Screen name="HealthQuestions" component={HealthQuestions} />
            <Stack.Screen name="GoalQuestions" component={GoalQuestions} />
            <Stack.Screen name="Loading" component={LoadingScreen} />
            <Stack.Screen name="PlanReady" component={PlanReadyScreen} />
            <Stack.Screen name="FreeTrial" component={FreeTrialScreen} />
            <Stack.Screen name="Subscription" component={SubscriptionScreen} />
            <Stack.Screen name="LoginSignUp" component={LoginSignUpScreen} />
            <Stack.Screen name="MainApp" component={MainTabNavigator} />
            <Stack.Screen name="WorkoutOverview" component={WorkoutOverviewScreen} />
            <Stack.Screen name="WorkoutSession" component={WorkoutSessionScreen} />
            <Stack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  placeholder: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center'
  },
  placeholderText: {
    fontSize: 32,
    fontWeight: 'bold'
  }
});

registerRootComponent(App);

export default App;
