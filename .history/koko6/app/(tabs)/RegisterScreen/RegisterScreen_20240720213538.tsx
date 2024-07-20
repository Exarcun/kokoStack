import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { RegisterScreenNavigationProp } from '../../types';
import { API_BASE_URL, BASE_URL } from '../../../config';

type Props = {
  navigation: RegisterScreenNavigationProp;
};

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/register`, { email, password });
      const { token } = response.data;
      Alert.alert('Success', 'Registration successful!', [
        { text: 'OK', onPress: () => navigation.navigate('Home') }
      ]);
    } catch (error) {
      const message = error.response?.data?.message || 'An error occurred during registration.';
      Alert.alert('Registration failed', message);
    }
  };

  return (

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <LinearGradient
            colors={['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.6)']}
            style={styles.overlay}
          >
            <Text style={styles.title}>Create Account</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={24} color="#4A90E2" style={styles.icon} />
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                placeholderTextColor="#999"
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={24} color="#4A90E2" style={styles.icon} />
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={styles.input}
                placeholderTextColor="#999"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={24} color="#4A90E2" />
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={24} color="#4A90E2" style={styles.icon} />
              <TextInput
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                style={styles.input}
                placeholderTextColor="#999"
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                <Ionicons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={24} color="#4A90E2" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.registerButtonText}>Create Account</Text>
            </TouchableOpacity>
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </ScrollView>
      </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  overlay: {
    width: '90%',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#4A90E2',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#333',
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
  },
  registerButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginBottom: 20,
  },
  registerButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
  },
  loginText: {
    color: '#666',
  },
  loginLink: {
    color: '#4A90E2',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;