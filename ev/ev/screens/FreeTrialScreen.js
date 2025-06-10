import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const FreeTrialScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>We want you to try Evoletics free for 30 days.</Text>

      {/* Image */}
      <View style={styles.imageContainer}>
        <Image
          source={require("../assets/images/frontpage2.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* Free Trial Details */}
      <Text style={styles.noPaymentText}>✓ No Payment Due Now</Text>

      {/* Free Trial Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Subscription')} // Navigate to Subscription Screen
      >
        <Text style={styles.buttonText}>Try for FREE</Text>
      </TouchableOpacity>

      {/* Pricing Details */}
      <Text style={styles.pricingText}>Just $9.99 per month</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    width: '100%',
    height: 400,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  noPaymentText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pricingText: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
});

export default FreeTrialScreen;
