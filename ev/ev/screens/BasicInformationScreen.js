import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BasicInformationScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const [ageModalVisible, setAgeModalVisible] = useState(false);
  const [hittingHandModalVisible, setHittingHandModalVisible] = useState(false);
  const [throwingHandModalVisible, setThrowingHandModalVisible] = useState(false);
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [competitionLevel, setCompetitionLevel] = useState('');
  const [hittingHand, setHittingHand] = useState('');
  const [throwingHand, setThrowingHand] = useState('');

  const genders = ['Male', 'Female', 'Other'];
  const ages = Array.from({ length: 36 }, (_, i) => `${5 + i}`);
  const heights = Array.from({ length: 37 }, (_, i) => `${4 + Math.floor(i / 12)}'${i % 12}"`);
  const weights = Array.from({ length: 200 }, (_, i) => `${50 + i} lbs`);
  const competitionLevels = ['Youth League', 'Middle School', 'High School', 'Collegiate', 'Professional'];
  const handOptions = ['Right', 'Left'];

  const handleNextStep = () => {
    if (step === 1) {
      if (!firstName || !lastName || !gender || !age) {
        alert('Please fill out all fields.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!height || !weight) {
        alert('Please provide your height and weight.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!competitionLevel) {
        alert('Please select your competition level.');
        return;
      }
      setStep(4);
    } else if (step === 4) {
      if (!hittingHand || !throwingHand) {
        alert('Please provide your hitting and throwing hand preferences.');
        return;
      }
      handleContinue();
    }
  };

  const handleContinue = async () => {
    try {
      // Save all basic info to AsyncStorage
      await AsyncStorage.setItem('firstName', firstName);
      await AsyncStorage.setItem('lastName', lastName);
      await AsyncStorage.setItem('age', age);
      await AsyncStorage.setItem('height', height);
      await AsyncStorage.setItem('weight', weight);
      await AsyncStorage.setItem('competitionLevel', competitionLevel);
      await AsyncStorage.setItem('hittingHand', hittingHand);
      await AsyncStorage.setItem('throwingHand', throwingHand);
      
      // Log for verification
      console.log('Saved basic info:', { 
        firstName,
        lastName,
        age, 
        height, 
        weight,
        competitionLevel,
        hittingHand,
        throwingHand
      });
      
      navigation.navigate('PositionsScreen');
    } catch (error) {
      console.error('Error saving basic information:', error);
      Alert.alert('Error', 'Failed to save your information. Please try again.');
    }
  };

  const renderFirstQuestion = () => (
    <View>
      <View style={styles.progressBar}>
        <View style={[styles.progress, { width: '25%' }]} />
      </View>
      <Text style={styles.title}>Tell Us a Bit About You</Text>
      <Text style={styles.subtitle}>
        Please answer all questions accurately to ensure the best possible training program.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        placeholderTextColor="#999"
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        placeholderTextColor="#999"
      />
      <TouchableOpacity style={styles.input} onPress={() => setGenderModalVisible(true)}>
        <Text style={[styles.placeholder, gender ? styles.selected : null]}>
          {gender || 'Gender'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.input} onPress={() => setAgeModalVisible(true)}>
        <Text style={[styles.placeholder, age ? styles.selected : null]}>
          {age || 'Age'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.continueButton} onPress={handleNextStep}>
        <Text style={styles.continueButtonText}>Continue →</Text>
      </TouchableOpacity>
      <Modal transparent visible={genderModalVisible} animationType="slide">
        <TouchableWithoutFeedback onPress={() => setGenderModalVisible(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContent}>
          <FlatList
            data={genders}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  setGender(item);
                  setGenderModalVisible(false);
                }}
              >
                <Text style={styles.modalItemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
      <Modal transparent visible={ageModalVisible} animationType="slide">
        <TouchableWithoutFeedback onPress={() => setAgeModalVisible(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContent}>
          <FlatList
            data={ages}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  setAge(item);
                  setAgeModalVisible(false);
                }}
              >
                <Text style={styles.modalItemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );

  const renderHeightWeightQuestion = () => (
    <View>
      <View style={styles.progressBar}>
        <View style={[styles.progress, { width: '50%' }]} />
      </View>
      <Text style={styles.title}>Height & Weight</Text>
      <Text style={styles.subtitle}>
        Please answer all questions accurately to ensure the best possible training program.
      </Text>
      <Picker
        selectedValue={height}
        onValueChange={(itemValue) => setHeight(itemValue)}
        style={styles.input}
      >
        {heights.map((item) => (
          <Picker.Item label={item} value={item} key={item} />
        ))}
      </Picker>
      <Picker
        selectedValue={weight}
        onValueChange={(itemValue) => setWeight(itemValue)}
        style={styles.input}
      >
        {weights.map((item) => (
          <Picker.Item label={item} value={item} key={item} />
        ))}
      </Picker>
      <TouchableOpacity style={styles.continueButton} onPress={handleNextStep}>
        <Text style={styles.continueButtonText}>Continue →</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCompetitionLevelQuestion = () => (
    <View>
      <View style={styles.progressBar}>
        <View style={[styles.progress, { width: '75%' }]} />
      </View>
      <Text style={styles.title}>What Competition Level Are You Currently In?</Text>
      <Text style={styles.subtitle}>
        Please answer all questions accurately to ensure the best possible training program.
      </Text>
      <View style={styles.optionsContainer}>
        {competitionLevels.map((level) => (
          <TouchableOpacity
            key={level}
            style={[
              styles.option,
              competitionLevel === level && styles.selectedOption,
            ]}
            onPress={() => setCompetitionLevel(level)}
          >
            <Text
              style={[
                styles.optionText,
                competitionLevel === level && styles.selectedOptionText,
              ]}
            >
              {level}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.continueButton} onPress={handleNextStep}>
        <Text style={styles.continueButtonText}>Continue →</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHittingThrowingHandQuestion = () => (
    <View>
      <View style={styles.progressBar}>
        <View style={[styles.progress, { width: '100%' }]} />
      </View>
      <Text style={styles.title}>What is Your Hitting and Throwing Hand?</Text>
      <Text style={styles.subtitle}>
        Please answer all questions accurately to ensure the best possible training program.
      </Text>
      <TouchableOpacity style={styles.input} onPress={() => setHittingHandModalVisible(true)}>
        <Text style={[styles.placeholder, hittingHand ? styles.selected : null]}>
          {hittingHand || 'Hitting Hand'}
        </Text>
      </TouchableOpacity>
      <Modal transparent visible={hittingHandModalVisible} animationType="slide">
        <TouchableWithoutFeedback onPress={() => setHittingHandModalVisible(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContent}>
          <FlatList
            data={handOptions}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  setHittingHand(item);
                  setHittingHandModalVisible(false);
                }}
              >
                <Text style={styles.modalItemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
      <TouchableOpacity style={styles.input} onPress={() => setThrowingHandModalVisible(true)}>
        <Text style={[styles.placeholder, throwingHand ? styles.selected : null]}>
          {throwingHand || 'Throwing Hand'}
        </Text>
      </TouchableOpacity>
      <Modal transparent visible={throwingHandModalVisible} animationType="slide">
        <TouchableWithoutFeedback onPress={() => setThrowingHandModalVisible(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContent}>
          <FlatList
            data={handOptions}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  setThrowingHand(item);
                  setThrowingHandModalVisible(false);
                }}
              >
                <Text style={styles.modalItemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
      <TouchableOpacity style={styles.continueButton} onPress={handleNextStep}>
        <Text style={styles.continueButtonText}>Continue →</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {step === 1 && renderFirstQuestion()}
      {step === 2 && renderHeightWeightQuestion()}
      {step === 3 && renderCompetitionLevelQuestion()}
      {step === 4 && renderHittingThrowingHandQuestion()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 70,
  },
  progressBar: {
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 2.5,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progress: {
    height: '100%',
    backgroundColor: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    color: '#000',
  },
  placeholder: {
    color: '#999',
  },
  selected: {
    color: '#000',
  },
  continueButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  option: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  optionText: {
    fontSize: 14,
    color: '#000',
  },
  selectedOptionText: {
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 20,
    maxHeight: '50%',
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalItemText: {
    fontSize: 16,
    color: '#000',
  },
});

export default BasicInformationScreen;
