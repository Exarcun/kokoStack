import React, { useState } from 'react';
import { View, Image, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native';

// Define the structure of a map zone
interface MapZone {
  id: string;
  image: any; // Use the appropriate type for your image source
  name: string;
}

// Sample data for map zones
const mapZones: MapZone[] = [
  { id: '1', image: require('./TCMap/TCassets/zone1.png'), name: 'Zone 1' },
  { id: '2', image: require('./assets/zone2.png'), name: 'Zone 2' },
  { id: '3', image: require('./assets/zone3.png'), name: 'Zone 3' },
  { id: '4', image: require('./assets/zone4.png'), name: 'Zone 4' },
  { id: '5', image: require('./assets/zone5.png'), name: 'Zone 5' },
];

const { width } = Dimensions.get('window');

const TCMapCarousel = () => {
  const [activeZone, setActiveZone] = useState<string | null>(null);

  const renderItem = ({ item }: { item: MapZone }) => (
    <TouchableOpacity onPress={() => setActiveZone(item.id)}>
      <Image
        source={item.image}
        style={[
          styles.zoneImage,
          activeZone === item.id && styles.activeZoneImage
        ]}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={mapZones}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        snapToInterval={width}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  zoneImage: {
    width: width,
    height: width * 0.75, // Adjust this ratio based on your image dimensions
    resizeMode: 'contain',
  },
  activeZoneImage: {
    // Add styles for the active zone image if needed
    borderWidth: 2,
    borderColor: '#FFD700',
  },
});

export default TCMapCarousel;