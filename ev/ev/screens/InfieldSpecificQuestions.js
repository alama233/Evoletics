import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';

const InfieldSpecificQuestions = () => {
  const navigation = useNavigation();
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [velocity, setVelocity] = useState('');
  const [gloveRating, setGloveRating] = useState('');
  const [rangeRating, setRangeRating] = useState('');
  const [infieldSkills] = useState([
    { key: 'Throwing Accuracy', label: 'Throwing Accuracy' },
    { key: 'Throwing Strength', label: 'Throwing Strength' },
    { key: 'Glove Work', label: 'Glove Work' },
    { key: 'Range', label: 'Range' },
    { key: 'Reaction Time', label: 'Reaction Time' }
  ]);
  const [rankedSkills, setRankedSkills] = useState([]);
  const [defensiveImprovement, setDefensiveImprovement] = useState('');
  const [exitVelocity, setExitVelocity] = useState('');
  const [hittingRating, setHittingRating] = useState('');
  const [hittingAspects] = useState([
    { key: 'Contact Ability', label: 'Contact Ability' },
    { key: 'Power Hitting', label: 'Power Hitting' },
    { key: 'Plate Discipline', label: 'Plate Discipline' },
    { key: 'Bat Speed', label: 'Bat Speed' }
  ]);
  const [rankedHittingAspects, setRankedHittingAspects] = useState([]);
  const [hittingImprovement, setHittingImprovement] = useState('');

  // Generate velocity options from 60 to 95 mph
  const velocityOptions = Array.from({ length: 36 }, (_, i) => (i + 60).toString());

  // Generate exit velocity options from 70 to 120 mph
  const exitVelocityOptions = Array.from({ length: 51 }, (_, i) => (i + 70).toString());

  const handleContinue = () => {
    if (currentQuestion === 1) {
      setCurrentQuestion(2);
    } else if (currentQuestion === 2) {
      setCurrentQuestion(3);
    } else if (currentQuestion === 3) {
      setRankedSkills(infieldSkills);
      setCurrentQuestion(4);
    } else if (currentQuestion === 4) {
      setCurrentQuestion(5);
    } else if (currentQuestion === 5) {
      setCurrentQuestion(6);
    } else if (currentQuestion === 6) {
      setCurrentQuestion(7);
    } else if (currentQuestion === 7) {
      setRankedHittingAspects(hittingAspects);
      setCurrentQuestion(8);
    } else if (currentQuestion === 8) {
      setCurrentQuestion(9);
    } else {
      navigation.navigate('AccessibilityQuestions');
    }
  };

  const renderDraggableItem = ({ item, drag, isActive }) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity
          onLongPress={drag}
          disabled={isActive}
          style={[
            styles.dragItem,
            { backgroundColor: isActive ? '#E0E0E0' : '#f5f5f5' }
          ]}
        >
          <Text style={styles.dragItemLabel}>{item.label}</Text>
          <Text style={styles.dragHandle}>⋮⋮</Text>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  const renderQuestion = () => {
    switch (currentQuestion) {
      case 1:
        return (
          <>
            <Text style={styles.title}>What Is Your Throwing Velocity Across The Infield?</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={velocity}
                onValueChange={(itemValue) => setVelocity(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select Velocity" value="" />
                {velocityOptions.map((speed) => (
                  <Picker.Item 
                    key={speed} 
                    label={`${speed} mph`} 
                    value={speed} 
                  />
                ))}
              </Picker>
            </View>
          </>
        );
      case 2:
        return (
          <>
            <Text style={styles.title}>How Would You Rate Your Glove Work?</Text>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((rating) => (
                <TouchableOpacity
                  key={rating}
                  style={[
                    styles.ratingButton,
                    gloveRating === rating.toString() && styles.selectedRating
                  ]}
                  onPress={() => setGloveRating(rating.toString())}
                >
                  <Text
                    style={[
                      styles.ratingNumber,
                      gloveRating === rating.toString() && styles.selectedRatingText
                    ]}
                  >
                    {rating}
                  </Text>
                  <Text
                    style={[
                      styles.ratingLabel,
                      gloveRating === rating.toString() && styles.selectedRatingText
                    ]}
                  >
                    {rating === 1 ? 'Weak' : rating === 5 ? 'Excellent' : ''}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        );
      case 3:
        return (
          <>
            <Text style={styles.title}>How Would You Rate Your Range?</Text>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((rating) => (
                <TouchableOpacity
                  key={rating}
                  style={[
                    styles.ratingButton,
                    rangeRating === rating.toString() && styles.selectedRating
                  ]}
                  onPress={() => setRangeRating(rating.toString())}
                >
                  <Text
                    style={[
                      styles.ratingNumber,
                      rangeRating === rating.toString() && styles.selectedRatingText
                    ]}
                  >
                    {rating}
                  </Text>
                  <Text
                    style={[
                      styles.ratingLabel,
                      rangeRating === rating.toString() && styles.selectedRatingText
                    ]}
                  >
                    {rating === 1 ? 'Weak' : rating === 5 ? 'Excellent' : ''}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        );
      case 4:
        return (
          <>
            <Text style={styles.title}>Rank These Infield Skills From Weakest To Strongest</Text>
            <Text style={styles.dragInstructions}>Press and hold to drag skills into order</Text>
            <DraggableFlatList
              data={rankedSkills}
              onDragEnd={({ data }) => setRankedSkills(data)}
              keyExtractor={(item) => item.key}
              renderItem={renderDraggableItem}
              style={styles.dragList}
            />
          </>
        );
      case 5:
        return (
          <>
            <Text style={styles.title}>What Is The Main Aspect Of Your Defensive Game That You Want To Improve Using Evoletics?</Text>
            <TextInput
              style={styles.textInput}
              value={defensiveImprovement}
              onChangeText={setDefensiveImprovement}
              placeholder="Describe your defensive improvement goals..."
              multiline
              textAlignVertical="top"
              numberOfLines={4}
            />
          </>
        );
      case 6:
        return (
          <>
            <Text style={styles.title}>What Is Your Top Exit Velocity?</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={exitVelocity}
                onValueChange={(itemValue) => setExitVelocity(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select Exit Velocity" value="" />
                {exitVelocityOptions.map((speed) => (
                  <Picker.Item 
                    key={speed} 
                    label={`${speed} mph`} 
                    value={speed} 
                  />
                ))}
              </Picker>
            </View>
          </>
        );
      case 7:
        return (
          <>
            <Text style={styles.title}>How Would You Rate Your Hitting Ability?</Text>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((rating) => (
                <TouchableOpacity
                  key={rating}
                  style={[
                    styles.ratingButton,
                    hittingRating === rating.toString() && styles.selectedRating
                  ]}
                  onPress={() => setHittingRating(rating.toString())}
                >
                  <Text
                    style={[
                      styles.ratingNumber,
                      hittingRating === rating.toString() && styles.selectedRatingText
                    ]}
                  >
                    {rating}
                  </Text>
                  <Text
                    style={[
                      styles.ratingLabel,
                      hittingRating === rating.toString() && styles.selectedRatingText
                    ]}
                  >
                    {rating === 1 ? 'Weak' : rating === 5 ? 'Excellent' : ''}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        );
      case 8:
        return (
          <>
            <Text style={styles.title}>Rank These Hitting Aspects From Weakest To Strongest</Text>
            <Text style={styles.dragInstructions}>Press and hold to drag aspects into order</Text>
            <DraggableFlatList
              data={rankedHittingAspects}
              onDragEnd={({ data }) => setRankedHittingAspects(data)}
              keyExtractor={(item) => item.key}
              renderItem={renderDraggableItem}
              style={styles.dragList}
            />
          </>
        );
      case 9:
        return (
          <>
            <Text style={styles.title}>What Is The Main Aspect Of Your Hitting Game That You Want To Improve Using Evoletics?</Text>
            <TextInput
              style={styles.textInput}
              value={hittingImprovement}
              onChangeText={setHittingImprovement}
              placeholder="Describe your hitting improvement goals..."
              multiline
              textAlignVertical="top"
              numberOfLines={4}
            />
          </>
        );
    }
  };

  return (
    <View style={styles.container}>
      {renderQuestion()}
      
      <Text style={styles.subtitle}>
        Please answer all questions accurately to ensure the best possible training program.
      </Text>

      <TouchableOpacity 
        style={styles.continueButton} 
        onPress={handleContinue}
      >
        <Text style={styles.continueButtonText}>Continue →</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  pickerContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  continueButton: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  ratingButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
    margin: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedRating: {
    backgroundColor: '#000',
  },
  ratingNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  ratingLabel: {
    fontSize: 12,
    color: '#666',
  },
  selectedRatingText: {
    color: '#fff',
  },
  dragInstructions: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  dragList: {
    flex: 1,
  },
  dragItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    padding: 16,
    marginVertical: 4,
    borderRadius: 8,
  },
  dragItemLabel: {
    fontSize: 16,
  },
  dragHandle: {
    fontSize: 20,
    color: '#666',
  },
  textInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    minHeight: 120,
    fontSize: 16,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
});

export default InfieldSpecificQuestions; 