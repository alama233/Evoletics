import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const CheckboxGroup = ({ options, selectedOptions, onSelectionChange }) => {
  const toggleOption = (option) => {
    const newSelection = selectedOptions.includes(option)
      ? selectedOptions.filter(item => item !== option)
      : [...selectedOptions, option];
    onSelectionChange(newSelection);
  };

  return (
    <View style={styles.container}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={styles.option}
          onPress={() => toggleOption(option)}
        >
          <Icon
            name={selectedOptions.includes(option) ? 'checkbox' : 'square-outline'}
            size={24}
            color={selectedOptions.includes(option) ? '#000' : '#666'}
          />
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default CheckboxGroup; 