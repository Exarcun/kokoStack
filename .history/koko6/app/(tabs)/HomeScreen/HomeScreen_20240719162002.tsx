import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, FlatList, RefreshControl, ImageBackground, Animated } from 'react-native';
import axios from 'axios';
import { Category, Post } from '../../types';
import styles from './HomeScreenStyles';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenNavigationProp } from '../../types';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import TCMap from '../TCMap/TCMap';

// Add this new interface for Suggestion
interface Suggestion {
  id: number;
  title: string;
  background_image: string;
  date: string;
}

const HomeScreen = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [favoritedPosts, setFavoritedPosts] = useState<Set<number>>(new Set());
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandAnim] = useState(new Animated.Value(0));
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { token } = useAuth();
  const [activeIcon, setActiveIcon] = useState<number | null>(null);
  

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const categoriesResponse = await axios.get<Category[]>('http://172.20.0.119:5000/api/top-categories');
      setCategories(categoriesResponse.data);
      console.log('Categories fetched:', categoriesResponse.data.length);

      const postsResponse = await axios.get<Post[]>('http://172.20.0.119:5000/api/all-posts');
      setPosts(postsResponse.data.reverse());

      if (token) {
        const favoritesResponse = await axios.get('http://172.20.0.119:5000/api/favorites', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFavoritedPosts(new Set(favoritesResponse.data));
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchSuggestions = useCallback(async () => {
    try {
      const response = await axios.get<Suggestion[]>('http://172.20.0.119:5000/api/suggestions');
      setSuggestions(response.data);
    } catch (err) {
      console.error('Error fetching suggestions:', err);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchSuggestions();
  }, [fetchData, fetchSuggestions]);

  const handleCategoryPress = (categoryName: string) => {
    setSelectedCategory(categoryName === selectedCategory ? null : categoryName);
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    await fetchSuggestions();
    setRefreshing(false);
  }, [fetchData, fetchSuggestions]);

  const toggleFavorite = async (postId: number) => {
    if (!token) {
      console.log('User must be logged in to favorite posts');
      return;
    }

    try {
      if (favoritedPosts.has(postId)) {
        await axios.delete(`http://172.20.0.119:5000/api/favorites/${postId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFavoritedPosts(prevFavorites => {
          const newFavorites = new Set(prevFavorites);
          newFavorites.delete(postId);
          return newFavorites;
        });
      } else {
        await axios.post(`http://172.20.0.119:5000/api/favorites/${postId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFavoritedPosts(prevFavorites => new Set(prevFavorites).add(postId));
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleIconPress = (iconIndex: number) => {
    setActiveIcon(activeIcon === iconIndex ? null : iconIndex);
    // Animate to the new height
    Animated.timing(expandAnim, {
      toValue: activeIcon === iconIndex ? 1 : 2,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const toggleExpand = () => {
    const toValue = isExpanded ? 0 : 1;
    Animated.timing(expandAnim, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setActiveIcon(null);
    }
  };
  const expandedHeight = expandAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [170, 320, 520], // Adjust these values as needed
  });

  

  const renderPostItem = ({ item }: { item: Post }) => (
    <View style={styles.postBox}>
      <TouchableOpacity 
        style={styles.postContent}
        onPress={() => navigation.navigate('Post', { id: item.id.toString() })}
      >
        <View style={styles.postHeader}>
          <Image 
            source={{ uri: `http://172.20.0.119:5000/${item.pic_location.replace(/\\/g, '/')}` }} 
            style={styles.postImage} 
          />
          <View style={styles.postHeaderText}>
            <Text style={styles.postTitle}>{item.title}</Text>
            <Text style={styles.postCategory}>{item.categories}</Text>
          </View>
        </View>
        <Text style={styles.postBio}>{item.bio}</Text>
        <View style={styles.postDetails}>
          <Text style={styles.postCap}>CAP: {item.cap}</Text>
          <Text style={styles.postPrice}>Price: €{item.price}</Text>
        </View>
        <View style={styles.postFooter}>
          <Text style={styles.postAuthor}>Posted by: {item.postcreator}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.favoriteIcon}
        onPress={() => toggleFavorite(item.id)}
        disabled={!token}
      >
        <MaterialIcons 
          name={favoritedPosts.has(item.id) ? "star" : "star-border"} 
          size={24} 
          color={token ? (favoritedPosts.has(item.id) ? "#FFD700" : "#000") : "#ccc"}
        />
      </TouchableOpacity>
    </View>
  );

  if (loading && !refreshing) {
    return <View style={styles.loadingContainer}><Text>Loading...</Text></View>;
  }

  if (error && !refreshing) {
    return <View style={styles.errorContainer}><Text style={styles.errorText}>{error}</Text></View>;
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Top Content Zone */}
      <Animated.View style={[styles.topContentWrapper, { height: expandedHeight }]}>
        <View style={styles.topContentBackground} />
        <View style={styles.topContent}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.menuIcon}>
              <MaterialIcons name="menu" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.logo}>Benvenuto</Text>
            <TouchableOpacity style={styles.profileIcon}>
              <View style={styles.profileCircle}>
                <View style={styles.profileDot} />
              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={toggleExpand} style={styles.expandButton}>
            <MaterialIcons 
              name={isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
              size={24} 
              color="#fff" 
            />
          </TouchableOpacity>
          {isExpanded && (
            <View style={styles.expandedContent}>
              <Text style={styles.expandedText}>Expanded Content</Text>
              <View style={styles.iconContainer}>
                {[0, 1, 2].map((index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.redSquareIcon,
                      activeIcon === index && styles.activeIcon
                    ]}
                    onPress={() => handleIconPress(index)}
                  />
                ))}
              </View>
              {activeIcon !== null && (
                <View style={styles.mapPlaceholder}>
                  <TCMap />
                </View>
              )}
            </View>
          )}
        </View>
      </Animated.View>

      {/* Categories Zone */}
      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Categorie popolari</Text>
        <View style={styles.categoriesContainer}>
          
          {categories.map((category, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.categoryItemWrapper}
              onPress={() => handleCategoryPress(category.name)}
            >
              <View style={[
                styles.categoryItem, 
                selectedCategory === category.name && styles.categoryItemSelected
              ]} />
              <Text style={styles.categoryText}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Suggestions Zone */}
      <View style={styles.suggestionsSection}>
        <Text style={styles.sectionTitle}>Suggerimenti</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionsContainer}>
          {suggestions.map((suggestion) => (
            <View key={suggestion.id} style={styles.suggestionItem}>
              <ImageBackground 
                source={{ uri: `http://172.20.0.119:5000/uploads/suggestion/${suggestion.background_image}` }}
                style={styles.suggestionBackground}
                resizeMode="cover"
              >
                <View style={styles.suggestionOverlay}>
                  <Text style={styles.suggestionText}>{suggestion.title}</Text>
                </View>
              </ImageBackground>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Posts Section */}
      <View style={styles.postsSection}>
        <Text style={styles.sectionTitle}>Posts</Text>
        <FlatList
          data={posts}
          renderItem={renderPostItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false} // Disable scrolling within FlatList
        />
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
