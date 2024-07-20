import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, SafeAreaView, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';

type SuggestionScreenRouteProp = RouteProp<RootStackParamList, 'Suggestion'>;

const SuggestionScreen = () => {
  const route = useRoute<SuggestionScreenRouteProp>();
  const { title, background_image, date } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image 
          source={{ uri: `http://172.20.0.119:5000/uploads/suggestion/${background_image}` }}
          style={styles.image}
        />
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.date}>{new Date(date).toLocaleDateString()}</Text>
          {/* Add more content here as needed */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
});

export default SuggestionScreen;