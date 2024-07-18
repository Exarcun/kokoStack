import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, SafeAreaView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';
import styles from './FavoritesScreenStyles';
import { useAuth } from '../../context/AuthContext';
import { Post, HomeScreenNavigationProp } from '../../types';

const FavoritesScreen = () => {
  const [favorites, setFavorites] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { token, isLoggedIn } = useAuth();
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const fetchFavorites = async () => {
    if (!isLoggedIn || !token) {
      console.log('User not logged in, cannot fetch favorites');
      return;
    }

    try {
      const response = await axios.get('http://172.20.0.119:5000/api/favorites', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const favoriteIds = response.data;
      
      // Fetch full post data for each favorite
      const favoritePosts = await Promise.all(
        favoriteIds.map((id: number) => 
          axios.get(`http://172.20.0.119:5000/api/posts/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        )
      );

      setFavorites(favoritePosts.map(res => res.data));
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [isLoggedIn, token]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFavorites();
    setRefreshing(false);
  };

  const removeFavorite = async (postId: number) => {
    try {
      await axios.delete(`http://172.20.0.119:5000/api/favorites/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavorites(prevFavorites => prevFavorites.filter(fav => fav.id !== postId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const renderFavoriteItem = ({ item }: { item: Post }) => (
    <TouchableOpacity 
      style={styles.favoriteItem}
      onPress={() => navigation.navigate('Post', { id: item.id.toString() })}
    >
      <Image 
        source={{ uri: `http://172.20.0.119:5000/${item.pic_location.replace(/\\/g, '/')}` }}
        style={styles.favoriteImage}
      />
      <View style={styles.favoriteContent}>
        <Text style={styles.favoriteTitle}>{item.title}</Text>
        <Text style={styles.favoritePrice}>€{item.price}</Text>
        <Text style={styles.favoriteLocation}>{item.cap}</Text>
      </View>
      <TouchableOpacity 
        style={styles.removeFavoriteButton}
        onPress={(e) => {
          e.stopPropagation(); // Prevent triggering the parent TouchableOpacity
          removeFavorite(item.id);
        }}
      >
        <MaterialIcons name="star" size={24} color="#FFD700" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.notLoggedInText}>Please log in to view your favorites.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Favorites</Text>
      </View>
      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          renderItem={renderFavoriteItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <Text style={styles.noFavoritesText}>You haven't added any favorites yet.</Text>
      )}
    </SafeAreaView>
  );
};

export default FavoritesScreen;