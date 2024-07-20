import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import styles from './UserProfileScreenStyles';
import { MaterialIcons } from '@expo/vector-icons';

type UserProfileScreenRouteProp = RouteProp<RootStackParamList, 'UserProfile'>;

const UserProfileScreen = () => {
  const route = useRoute<UserProfileScreenRouteProp>();
  const navigation = useNavigation();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const [profileResponse, postsResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/user/${route.params.email}`),
          axios.get(`${API_BASE_URL}/user/${route.params.email}/posts`)
        ]);
        setUserProfile(profileResponse.data);
        setUserPosts(postsResponse.data);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [route.params.email]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B4513" />
      </View>
    );
  }

  if (error || !userProfile) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'User profile not found'}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.profileHeader}>
          <Image
            source={
              userProfile.profilepic
                ? { uri: `${API_BASE_URL}/${userProfile.profilepic}` }
                : require('../../../assets/images/splash.png') // Make sure to have a default image
            }
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>{userProfile.email}</Text>
          <Text style={styles.profileBio}>{userProfile.bio || 'No bio available'}</Text>
          <TouchableOpacity 
            style={styles.locationContainer}
            onPress={() => userProfile.cap && navigation.navigate('Cap', { cap: userProfile.cap })}
          >
            <MaterialIcons name="location-on" size={18} color="#666" />
            <Text style={styles.location}>{userProfile.cap || 'Location not specified'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.postsSection}>
          <Text style={styles.sectionTitle}>User's Posts</Text>
          {userPosts.map((post) => (
            <TouchableOpacity
              key={post.id}
              style={styles.postItem}
              onPress={() => navigation.navigate('Post', { id: post.id.toString() })}
            >
              <Image
                source={{ uri: `${BASE_URL}/${post.pic_location.replace(/\\/g, '/')}` }}
                style={styles.postImage}
              />
              <View style={styles.postDetails}>
                <Text style={styles.postTitle}>{post.title}</Text>
                <Text style={styles.postCategory}>{post.categories}</Text>
                <Text style={styles.postPrice}>€{post.price}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserProfileScreen;