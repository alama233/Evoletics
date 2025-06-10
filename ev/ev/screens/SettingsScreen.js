import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { themes } from '../context/ThemeContext';

const SettingsScreen = () => {
  const { theme, changeTheme } = useTheme();
  const [showThemeModal, setShowThemeModal] = useState(false);

  const handleLogout = () => {
    // Add logout logic here
  };

  const ThemeOption = ({ themeName, currentTheme, onSelect }) => (
    <TouchableOpacity 
      style={[
        styles.themeOption,
        { backgroundColor: themes[themeName].backgroundColor }
      ]}
      onPress={() => onSelect(themeName)}
    >
      <Text style={[
        styles.themeText,
        { color: themes[themeName].textColor }
      ]}>
        {themes[themeName].name}
      </Text>
      {currentTheme.label === themes[themeName].label && (
        <Icon 
          name="checkmark-circle" 
          size={24} 
          color={themes[themeName].tintColor} 
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>Settings</Text>
      </View>

      <ScrollView>
        {/* Theme Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.mutedForegroundColor }]}>Appearance</Text>
          <TouchableOpacity 
            style={[styles.settingItem, { borderBottomColor: theme.borderColor }]}
            onPress={() => setShowThemeModal(true)}
          >
            <View style={styles.settingLeft}>
              <Icon name="color-palette-outline" size={24} color={theme.textColor} />
              <Text style={[styles.settingText, { color: theme.textColor }]}>Theme</Text>
            </View>
            <Text style={[styles.settingValue, { color: theme.mutedForegroundColor }]}>
              {theme.name}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="person-outline" size={24} color="#000" />
              <Text style={styles.settingText}>Profile</Text>
            </View>
            <Icon name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="card-outline" size={24} color="#000" />
              <Text style={styles.settingText}>Subscription</Text>
            </View>
            <Icon name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="notifications-outline" size={24} color="#000" />
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <Icon name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="help-circle-outline" size={24} color="#000" />
              <Text style={styles.settingText}>Help Center</Text>
            </View>
            <Icon name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="document-text-outline" size={24} color="#000" />
              <Text style={styles.settingText}>Terms & Privacy</Text>
            </View>
            <Icon name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        {/* Theme Selection Modal */}
        <Modal
          visible={showThemeModal}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, { backgroundColor: theme.backgroundColor }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: theme.textColor }]}>Select Theme</Text>
                <TouchableOpacity onPress={() => setShowThemeModal(false)}>
                  <Icon name="close" size={24} color={theme.textColor} />
                </TouchableOpacity>
              </View>
              
              {Object.keys(themes).map((themeName) => (
                <ThemeOption 
                  key={themeName}
                  themeName={themeName}
                  currentTheme={theme}
                  onSelect={(selected) => {
                    changeTheme(selected);
                    setShowThemeModal(false);
                  }}
                />
              ))}
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
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
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 15,
  },
  logoutButton: {
    margin: 20,
    padding: 15,
    backgroundColor: '#ff3b30',
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  themeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  themeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingValue: {
    fontSize: 16,
  },
});

export default SettingsScreen; 