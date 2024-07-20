import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, SafeAreaView, RefreshControl, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';
import styles from './FavoritesScreenStyles';
import { useAuth } from '../../context/AuthContext';
import { Post, HomeScreenNavigationProp } from '../../types';
import { useBottomNav } from '../../navigator/BottomNavContext';
import { API_BASE_URL, BASE_URL } from '../../../config';

const FavoritesScreen = () => {
  const [favorites, setFavorites] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { token, isLoggedIn } = useAuth();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const bottomNavRef = useBottomNav();

  const fetchFavoritesAndProfile = async () => {
    if (!isLoggedIn || !token) {
      console.log('User not logged in, cannot fetch favorites and profile');
      return;
    }

    try {
      const [favoritesResponse, profileResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/favorites`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_BASE_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      const favoriteIds = favoritesResponse.data;
      
      const favoritePosts = await Promise.all(
        favoriteIds.map((id: number) => 
          axios.get(`${API_BASE_URL}/posts/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        )
      );

      setFavorites(favoritePosts.map(res => res.data));
      setProfilePic(profileResponse.data.profilepic);
    } catch (error) {
      console.error('Error fetching favorites and profile:', error);
    }
  };

  useEffect(() => {
    fetchFavoritesAndProfile();
  }, [isLoggedIn, token]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFavoritesAndProfile();
    setRefreshing(false);
  };

  const handleMenuPress = () => {
    bottomNavRef.current?.fullyExtend();
  };


  const removeFavorite = async (postId: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/favorites/${postId}`, {
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
        source={{ uri: `${BASE_URL}/${item.pic_location.replace(/\\/g, '/')}` }}
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
          e.stopPropagation();
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
      <ScrollView>
        {/* Top Content Zone */}
        <View style={styles.topContentWrapper}>
          <View style={styles.topContentBackground} />
          <View style={styles.topContent}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.menuIcon} onPress={handleMenuPress}>
                <MaterialIcons name="menu" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.logo}>Preferiti</Text>
              <TouchableOpacity style={styles.profileIcon}>
                {isLoggedIn && profilePic ? (
                  <Image
                    source={{ uri: `${BASE_URL}/${profilePic}` }}
                    style={styles.profileImage}
                  />
                ) : (
                  <View style={styles.profileCircle}>
                    <View style={styles.profileDot} />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Favorites List */}
        <View style={styles.favoritesContainer}>
          <FlatList
            data={favorites}
            renderItem={renderFavoriteItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <Text style={styles.noFavoritesText}>You haven't added any favorites yet.</Text>
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FavoritesScreen;