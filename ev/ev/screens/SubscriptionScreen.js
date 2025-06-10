import React from 'react'; // Required import
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SubscriptionScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <Image source={require("../assets/images/frontpage2.png")} style={styles.mainImage} />

        <Text style={styles.disclaimer}>Disclaimer: 94% program to progress accuracy</Text>

        <View style={styles.logoContainer}>
          <Image source={require("../assets/images/evoletics.png")} style={styles.logo} />
          <Text style={styles.appName}>Evoletics</Text>
        </View>

        <Text style={styles.description}>
          Unlimited access to Evoletics including: Personalized and AI-backed programs proven to
          unlock your maximum potential and achieve your biggest athletic dreams.
        </Text>

        {/* Subscription Options */}
        <View style={styles.subscriptionContainer}>
          <TouchableOpacity style={styles.subscriptionOption}>
            <Text style={styles.subscriptionLabel}>Monthly</Text>
            <Text style={styles.subscriptionPrice}>$9.99 /mo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.subscriptionOption, styles.selectedSubscription]}>
            <Text style={styles.saveLabel}>Save 60%</Text>
            <Text style={styles.subscriptionLabel}>Yearly</Text>
            <Text style={styles.subscriptionPrice}>$5.99 /mo</Text>
          </TouchableOpacity>
        </View>

        {/* Start Button */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => {
            console.log('Subscription started');
            navigation.navigate('LoginSignUp'); // Navigate to LoginSignUpScreen
          }}
        >
          <Text style={styles.startButtonText}>START MY JOURNEY</Text>
        </TouchableOpacity>

        {/* Already Purchased */}
        <TouchableOpacity
          onPress={() => {
            console.log('Already purchased');
            navigation.navigate('LoginSignUp'); // Navigate to LoginSignUpScreen
          }}
        >
          <Text style={styles.alreadyPurchasedText}>Already purchased?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // White background
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  mainContent: {
    alignItems: 'center',
  },
  mainImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  disclaimer: {
    fontSize: 12,
    color: '#666', // Dark grey text
    marginBottom: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  appName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000', // Black text
    marginLeft: 10,
  },
  description: {
    fontSize: 14,
    color: '#666', // Dark grey text
    textAlign: 'center',
    marginBottom: 30,
  },
  subscriptionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  subscriptionOption: {
    backgroundColor: '#f0f0f0', // Light grey background for options
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '45%',
  },
  selectedSubscription: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  saveLabel: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subscriptionLabel: {
    color: '#000', // Black text
    fontWeight: 'bold',
    fontSize: 16,
  },
  subscriptionPrice: {
    color: '#000', // Black text
    fontSize: 16,
  },
  startButton: {
    backgroundColor: '#000', // Black button with white text
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  startButtonText: {
    color: '#fff', // White text
    fontWeight: 'bold',
    fontSize: 16,
  },
  alreadyPurchasedText: {
    color: '#000', // Black text
    textDecorationLine: 'underline',
  },
});

export default SubscriptionScreen;
