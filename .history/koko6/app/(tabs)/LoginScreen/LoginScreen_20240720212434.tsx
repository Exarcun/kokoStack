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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { LoginScreenProps } from '../../types';
import { API_BASE_URL, BASE_URL } from '../../../config';

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
      const token = response.data.token;
      login(token);
      Alert.alert('Success', 'Login successful');
      navigation.navigate('Publish');
    } catch (error) {
      Alert.alert('Error', 'Failed to login. Please try again.');
    }
  };

  return (

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.6)']}
          style={styles.overlay}
        >
          <Text style={styles.title}>Welcome Back!</Text>
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
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>Register</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
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
    justifyContent: 'center',
    alignItems: 'center',
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#4A90E2',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
  },
  registerText: {
    color: '#666',
  },
  registerLink: {
    color: '#4A90E2',
    fontWeight: 'bold',
  },
});

export default LoginScreen;