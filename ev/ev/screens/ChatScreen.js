import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateChatResponse } from '../services/claudeService';

const ChatScreen = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const profileString = await AsyncStorage.getItem('userProfile');
      if (profileString) {
        const profile = JSON.parse(profileString);
        setUserProfile(profile);
        
        // Add personalized welcome message
        setMessages([
          {
            id: 1,
            text: "Hi! I'm Evo, your elite baseball performance AI. I'm here to help you reach your maximum potential. How can I help you today?",
            isUser: false
          }
        ]);
      } else {
        // Default welcome message if no profile exists
        setMessages([
          {
            id: 1,
            text: "Hi! I'm Evo, your elite baseball performance AI. I'm here to help you reach your maximum potential. How can I help you today?",
            isUser: false
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const handleSend = async () => {
    if (message.trim()) {
      const userMessage = { id: Date.now(), text: message, isUser: true };
      setMessages(prev => [...prev, userMessage]);
      setMessage('');
      setIsLoading(true);

      try {
        // Pass the user profile if available, otherwise just pass the message
        const reply = await generateChatResponse(message, userProfile || {});
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: reply,
          isUser: false
        }]);
      } catch (error) {
        console.error('Chat error:', error);
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: "I'm having trouble connecting right now. Please try again.",
          isUser: false
        }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageBubble, 
      item.isUser ? styles.userMessage : styles.aiMessage
    ]}>
      {!item.isUser && (
        <View style={styles.avatarContainer}>
          <Icon name="baseball-outline" size={20} color="#000" />
        </View>
      )}
      <Text style={[
        styles.messageText,
        item.isUser ? styles.userMessageText : styles.aiMessageText
      ]}>
        {item.text}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Baseball Training Assistant</Text>
        <Text style={styles.headerSubtitle}>Ask me anything about baseball training</Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={item => item.id.toString()}
        style={styles.messageList}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageContainer}
      />

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#000" />
          <Text style={styles.loadingText}>Thinking...</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Ask about pitching, batting, training..."
          multiline
          placeholderTextColor="#666"
        />
        <TouchableOpacity 
          style={[styles.sendButton, (!message.trim() || isLoading) && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!message.trim() || isLoading}
        >
          <Icon name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    marginTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  messageList: {
    flex: 1,
  },
  messageContainer: {
    padding: 20,
  },
  messageBubble: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 15,
    borderRadius: 20,
    marginBottom: 10,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#000',
    alignSelf: 'flex-end',
  },
  aiMessage: {
    backgroundColor: '#f5f5f5',
    alignSelf: 'flex-start',
  },
  avatarContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#fff',
  },
  aiMessageText: {
    color: '#000',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  loadingText: {
    marginLeft: 10,
    color: '#666',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    padding: 15,
    marginRight: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#000',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
});

export default ChatScreen; 