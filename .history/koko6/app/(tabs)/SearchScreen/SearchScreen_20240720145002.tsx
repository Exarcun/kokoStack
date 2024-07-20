import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Animated,
  FlatList
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';
import styles from './SearchScreenStyles';
import { Post } from '../../types';
import { LogBox } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useBottomNav } from '../../navigator/BottomNavContext';

LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

type SearchScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Search'>;

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandAnim] = useState(new Animated.Value(0));
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const [favoritedPosts, setFavoritedPosts] = useState<Set<number>>(new Set());
  const { token, isLoggedIn } = useAuth();
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const bottomNavRef = useBottomNav();

  useEffect(() => {
    const fetchFavoritesAndProfile = async () => {
      if (!token) {
        console.log('User not logged in, skipping favorites and profile fetch');
        setFavoritedPosts(new Set());
        setProfilePic(null);
        return;
      }

      try {
        const [favoritesResponse, profileResponse] = await Promise.all([
          axios.get('http://172.20.0.119:5000/api/favorites', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://172.20.0.119:5000/api/profile', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        console.log('Fetched favorites:', favoritesResponse.data);
        setFavoritedPosts(new Set(favoritesResponse.data));

        console.log('Fetched profile:', profileResponse.data);
        setProfilePic(profileResponse.data.profilepic);
      } catch (error) {
        console.error('Error fetching favorites and profile:', error);
        // Optionally, you could set an error state here to show to the user
      }
    };

    fetchFavoritesAndProfile();
  }, [token, isLoggedIn]);

  const handleMenuPress = () => {
    bottomNavRef.current?.fullyExtend();
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get<Post[]>(`http://172.20.0.119:5000/api/search-posts?query=${searchQuery}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching posts:', error);
    }
  };

  const toggleExpand = () => {
    const toValue = isExpanded ? 0 : 1;
    Animated.timing(expandAnim, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsExpanded(!isExpanded);
  };

  const expandedHeight = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [170, 380],
  });

  const toggleFavorite = async (postId: number) => {
    if (!token) {
      console.log('User must be logged in to favorite posts');
      // Optionally, you could show a message to the user here
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
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error response:', error.response.data);
      }
      // Optionally, show an error message to the user
    }
  };

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
          color={token 
            ? (favoritedPosts.has(item.id) ? "#FFD700" : "#000") 
            : "#ccc"
          }
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Animated.View style={[styles.topContentWrapper, { height: expandedHeight }]}>
          <View style={styles.topContentBackground} />
          <View style={styles.topContent}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.menuIcon} onPress={handleMenuPress}>
                <MaterialIcons name="menu" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.logo}>Cerca</Text>
              <TouchableOpacity style={styles.profileIcon}>
                {isLoggedIn && profilePic ? (
                  <Image
                    source={{ uri: `http://172.20.0.119:5000/${profilePic}` }}
                    style={styles.profileImage}
                  />
                ) : (
                  <View style={styles.profileCircle}>
                    <View style={styles.profileDot} />
                  </View>
                )}
              </TouchableOpacity>
            </View>
            {isExpanded && (
              <View style={styles.filterContainer}>
                <Text style={styles.filterTitle}>Filters</Text>
                <TouchableOpacity style={styles.filterButton}>
                  <Text style={styles.filterButtonText}>Date</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterButton}>
                  <Text style={styles.filterButtonText}>Category</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterButton}>
                  <Text style={styles.filterButtonText}>CAP</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterButton}>
                  <Text style={styles.filterButtonText}>Price</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </Animated.View>

        <View style={styles.content}>
          <FlatList
            data={searchResults}
            renderItem={renderPostItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.scrollContent}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchScreen;
