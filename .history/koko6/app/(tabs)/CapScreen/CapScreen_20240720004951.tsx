import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import { LinearGradient } from 'expo-linear-gradient';

type CapScreenRouteProp = RouteProp<RootStackParamList, 'Cap'>;

const { width } = Dimensions.get('window');

const CapScreen = () => {
  const route = useRoute<CapScreenRouteProp>();
  const { cap } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <LinearGradient
            colors={['rgba(0,0,0,0.6)', 'transparent']}
            style={styles.gradient}
          />
          <Text style={styles.title}>CAP {cap}</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.card}>
            <Image
              source={{ uri: 'https://via.placeholder.com/150' }}
              style={styles.cardImage}
            />
            <Text style={styles.cardTitle}>Local Attractions</Text>
            <Text style={styles.cardDescription}>Discover interesting places in this area.</Text>
          </View>
          <View style={styles.card}>
            <Image
              source={{ uri: 'https://via.placeholder.com/150' }}
              style={styles.cardImage}
            />
            <Text style={styles.cardTitle}>Demographics</Text>
            <Text style={styles.cardDescription}>Population and statistical data for this CAP.</Text>
          </View>
          <View style={styles.card}>
            <Image
              source={{ uri: 'https://via.placeholder.com/150' }}
              style={styles.cardImage}
            />
            <Text style={styles.cardTitle}>Services</Text>
            <Text style={styles.cardDescription}>Available services and amenities in the area.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3498db',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default CapScreen;