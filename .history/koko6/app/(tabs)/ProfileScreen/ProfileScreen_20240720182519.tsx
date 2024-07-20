import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, ImageBackground, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import styles from './ProfileScreenStyles';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import * as ImagePicker from 'expo-image-picker';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

const ProfileScreen = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userBio, setUserBio] = useState<string | null>(null);
  const [userCap, setUserCap] = useState<string | null>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [bannerPic, setBannerPic] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isEditingCap, setIsEditingCap] = useState(false);

  useEffect(() => {
    fetchUserProfile();
    fetchUserPosts();
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('http://172.20.0.119:5000/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserEmail(response.data.email);
      setUserBio(response.data.bio);
      setUserCap(response.data.cap);
      setProfilePic(response.data.profilepic);
      setBannerPic(response.data.bannerpic);
      setUsername(response.data.username);
    } catch (err: any) {
      console.error('Error fetching user profile:', err);
      setError('Failed to load user profile');
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await axios.get('http://172.20.0.119:5000/api/posts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserPosts(response.data);
    } catch (err: any) {
      console.error('Error fetching user posts:', err);
      setError('Failed to load user posts');
    }
  };

  const handlePostPress = (postId: string) => {
    navigation.navigate('Post', { id: postId });
  };

  const handleSave = async (field: 'username' | 'bio' | 'cap') => {
    try {
      const data = { [field]: field === 'username' ? username : field === 'bio' ? userBio : userCap };
      await axios.put(`http://172.20.0.119:5000/api/user/${userEmail}/${field}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert('Success', `${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`);
      setIsEditingUsername(false);
      setIsEditingBio(false);
      setIsEditingCap(false);
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      Alert.alert('Error', `Failed to update ${field}`);
    }
  };

  const pickImage = async (type: 'profile' | 'banner') => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === 'profile' ? [1, 1] : [16, 9],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      const formData = new FormData();
      formData.append(type === 'profile' ? 'profilepic' : 'bannerpic', {
        uri: selectedAsset.uri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });

      try {
        const response = await axios.put(
          `http://172.20.0.119:5000/api/user/${userEmail}/${type === 'profile' ? 'profilepic' : 'bannerpic'}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (type === 'profile') {
          setProfilePic(response.data.profilepic);
        } else {
          setBannerPic(response.data.bannerpic);
        }
        Alert.alert('Success', `${type === 'profile' ? 'Profile' : 'Banner'} picture updated successfully`);
      } catch (error) {
        console.error('Error updating picture:', error);
        Alert.alert('Error', `Failed to update ${type === 'profile' ? 'profile' : 'banner'} picture`);
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <ImageBackground
          source={{ uri: `http://172.20.0.119:5000/${bannerPic}` }}
          style={styles.headerBackground}
        >
          <TouchableOpacity style={styles.editBannerButton} onPress={() => pickImage('banner')}>
            <Ionicons name="camera" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => pickImage('profile')}>
              <Image
                source={{ uri: `http://172.20.0.119:5000/${profilePic}` }}
                style={styles.profileImage}
              />
              <View style={styles.editProfilePicButton}>
                <Ionicons name="camera" size={20} color="#fff" />
              </View>
            </TouchableOpacity>
            <View style={styles.usernameContainer}>
              {isEditingUsername ? (
                <TextInput
                  style={styles.editableText}
                  value={username || ''}
                  onChangeText={setUsername}
                  placeholder="Username"
                />
              ) : (
                <Text style={styles.name}>{username}</Text>
              )}
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => isEditingUsername ? handleSave('username') : setIsEditingUsername(true)}
              >
                <Ionicons name={isEditingUsername ? "checkmark" : "pencil"} size={20} color="#4CAF50" />
              </TouchableOpacity>
            </View>
            {userEmail && <Text style={styles.email}>{userEmail}</Text>}
          </View>
        </ImageBackground>
      </View>

      <View style={styles.bioSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.bioTitle}>About Me</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => isEditingBio ? handleSave('bio') : setIsEditingBio(true)}
          >
            <Ionicons name={isEditingBio ? "checkmark" : "pencil"} size={20} color="#4CAF50" />
          </TouchableOpacity>
        </View>
        {isEditingBio ? (
          <TextInput
            style={styles.editableText}
            value={userBio || ''}
            onChangeText={setUserBio}
            placeholder="Enter your bio"
            multiline
          />
        ) : (
          <Text style={styles.bio}>{userBio || 'No bio available'}</Text>
        )}
      </View>

      <View style={styles.locationSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Location</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => isEditingCap ? handleSave('cap') : setIsEditingCap(true)}
          >
            <Ionicons name={isEditingCap ? "checkmark" : "pencil"} size={20} color="#4CAF50" />
          </TouchableOpacity>
        </View>
        <View style={styles.locationContent}>
          <Ionicons name="location-outline" size={24} color="#8B4513" />
          {isEditingCap ? (
            <TextInput
              style={styles.editableText}
              value={userCap || ''}
              onChangeText={setUserCap}
              placeholder="Enter your location"
            />
          ) : (
            <Text style={styles.locationDescription}>{userCap || 'Location not specified'}</Text>
          )}
        </View>
      </View>

      <View style={styles.productSection}>
        <Text style={styles.sectionTitle}>Miele del Mendrisiotto</Text>
        <View style={styles.postGrid}>
          {userPosts.map((post, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.postContainer}
              onPress={() => handlePostPress(post.id.toString())}
            >
              <ImageBackground
                source={{ uri: `http://172.20.0.119:5000/${post.pic_location.replace(/\\/g, '/')}` }}
                style={styles.postImageBackground}
              >
                <View style={styles.postTitleContainer}>
                  <Text style={styles.postTitle}>{post.title}</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;