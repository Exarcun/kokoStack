import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { PostScreenRouteProp, PostScreenNavigationProp, Post } from '../../types';
import styles from './PostScreenStyles';
import { MaterialIcons } from '@expo/vector-icons';
import { API_BASE_URL, BASE_URL } from '../../../config';

const PostScreen = () => {
  const route = useRoute<PostScreenRouteProp>();
  const navigation = useNavigation<PostScreenNavigationProp>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/posts/${route.params.id}`);
        setPost(response.data);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [route.params.id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B4513" />
      </View>
    );
  }

  if (error || !post) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Post not found'}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: `${BASE_URL}/${post.pic_location.replace(/\\/g, '/')}` }} 
            style={styles.image}
          />
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{post.title}</Text>
          <View style={styles.categoryPriceContainer}>
            <Text style={styles.category}>{post.categories}</Text>
            <Text style={styles.price}>€{post.price}</Text>
          </View>
          <TouchableOpacity 
            style={styles.locationContainer}
            onPress={() => navigation.navigate('Cap', { cap: post.cap })}
          >
            <MaterialIcons name="location-on" size={18} color="#666" />
            <Text style={styles.location}>{post.cap}</Text>
          </TouchableOpacity>
          <Text style={styles.bioTitle}>Description</Text>
          <Text style={styles.bio}>{post.bio}</Text>
          <TouchableOpacity 
            style={styles.authorContainer}
            onPress={() => navigation.navigate('UserProfile', { email: post.postcreator })}
          >
            <Image
              source={{ uri: 'https://via.placeholder.com/40' }}
              style={styles.authorAvatar}
            />
            <Text style={styles.authorName}>Posted by: {post.postcreator}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PostScreen;