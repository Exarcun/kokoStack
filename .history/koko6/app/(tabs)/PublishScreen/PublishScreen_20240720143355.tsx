import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Image, Platform, TextInput, ScrollView, SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';
import styles from './PublishScreenStyles';
import { useBottomNav } from '../../navigator/BottomNavContext';

const PublishScreen = () => {
  const { token, isLoggedIn } = useAuth();
  const [photo, setPhoto] = useState<{ uri: string; fileName: string; type: string } | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [postcreator, setPostcreator] = useState('');
  const [profilePic, setProfilePic] = useState<string | null>(null);

  const bottomNavRef = useBottomNav();

  useEffect(() => {
    if (isLoggedIn && token) {
      fetchUserProfile();
    }
  }, [isLoggedIn, token]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('http://172.20.0.119:5000/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfilePic(response.data.profilepic);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleMenuPress = () => {
    bottomNavRef.current?.fullyExtend();
  };

  const requestStoragePermission = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      return status === 'granted';
    }
    return true;
  };

  const handleImagePicker = async () => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Storage permission is required to upload photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const uri = asset.uri;
      const fileName = uri.split('/').pop() || '';
      setPhoto({
        uri: uri,
        fileName: fileName,
        type: asset.type || 'image/jpeg',
      });
    }
  };

  const handlePublish = async () => {
    if (!photo) {
      Alert.alert('No photo selected.');
      return;
    }

    try {
      const formData = new FormData();

      // Fetch the file from the local URI and convert to Blob
      const response = await fetch(photo.uri);
      const blob = await response.blob();

      // Append the image file as a Blob to the FormData
      formData.append('image', {
        uri: photo.uri,
        name: photo.fileName,
        type: photo.mimeType || 'image/jpeg',
      });

      // Append text fields to the FormData
      formData.append('title', title);
      formData.append('category', category);
      formData.append('location', location);
      formData.append('price', price);
      formData.append('description', description);
      formData.append('postcreator', postcreator); // Append post creator

      const result = await axios.post('http://172.20.0.119:5000/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` // Include JWT token in headers
        },
        timeout: 10000, // Set a timeout for the request
      });

      if (result.status === 201) {
        Alert.alert('Post published successfully');
        setPhoto(null); // Reset photo after successful upload
        setTitle(''); // Reset title
        setCategory(''); // Reset category
        setLocation(''); // Reset location
        setPrice(''); // Reset price
        setDescription(''); // Reset description
        setPostcreator(''); // Reset post creator
      } else {
        Alert.alert('Failed to publish post');
      }
    } catch (error) {
      console.error('Upload error:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
      } else if (error.request) {
        console.error('Error request data:', error.request);
      }
      Alert.alert('Error publishing post', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.topContentWrapper}>
          <View style={styles.topContentBackground} />
          <View style={styles.topContent}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.menuIcon} onPress={handleMenuPress}>
                <MaterialIcons name="menu" size={24} color="#fff" />
              </TouchableOpacity>
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
            <Text style={styles.logo}>Pubblica</Text>
          </View>
        </View>

        {/* Publish Content */}
        <View style={styles.publishContent}>
          <TouchableOpacity style={styles.uploadButton} onPress={handleImagePicker}>
            {photo ? (
              <Image source={{ uri: photo.uri }} style={styles.imagePreview} />
            ) : (
              <>
                <Text style={styles.uploadButtonText}>+</Text>
                <Text style={styles.uploadButtonLabel}>Aggiungere Foto</Text>
              </>
            )}
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Aggiungere titolo dell’articolo"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Selezione una o più categorie"
            value={category}
            onChangeText={setCategory}
          />
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.inputHalf]}
              placeholder="CAP & Località"
              value={location}
              onChangeText={setLocation}
            />
            <TextInput
              style={[styles.input, styles.inputHalf]}
              placeholder="Prezzo"
              value={price}
              onChangeText={setPrice}
            />
          </View>
          <TextInput
            style={[styles.input, styles.description]}
            placeholder="Inserire descrizione"
            value={description}
            onChangeText={setDescription}
            multiline
          />
          <TouchableOpacity style={styles.publishButton} onPress={handlePublish}>
            <Text style={styles.publishButtonText}>PUBLISH</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default PublishScreen;
