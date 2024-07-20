import React, { useState, useRef } from 'react';
import { View, Image, FlatList, Dimensions, TouchableOpacity, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { StyleSheet } from 'react-native';
// Define the structure of a map zone
interface MapZone {
  id: string;
  image: any; // Use the appropriate type for your image source
  name: string;
}

// Sample data for map zones
const mapZones: MapZone[] = [
  { id: '1', image: require('../TCMap/TCassets/zone1.png'), name: 'Zone 1' },
  { id: '2', image: require('../TCMap/TCassets/zone2.png'), name: 'Zone 2' },
  { id: '3', image: require('../TCMap/TCassets/zone3.png'), name: 'Zone 3' },
  { id: '4', image: require('../TCMap/TCassets/zone4.png'), name: 'Zone 4' },
  { id: '5', image: require('../TCMap/TCassets/zone5.png'), name: 'Zone 5' },
];

const { width } = Dimensions.get('window');

const TCMapCarousel = () => {
  const [activeZone, setActiveZone] = useState<string>('1');
  const flatListRef = useRef<FlatList<MapZone>>(null);
  const [isScrolling, setIsScrolling] = useState(false);

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

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!isScrolling) {
      setIsScrolling(true);
    }
  };

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIsScrolling(false);
    const contentOffset = event.nativeEvent.contentOffset;
    const index = Math.round(contentOffset.x / width);
    setActiveZone(mapZones[index].id);
  };

  const getItemLayout = (data: MapZone[] | null | undefined, index: number) => ({
    length: width,
    offset: width * index,
    index,
  });

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={mapZones}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        snapToInterval={width}
        decelerationRate="fast"
        onScroll={handleScroll}
        onMomentumScrollEnd={handleScrollEnd}
        initialScrollIndex={0}
        scrollEventThrottle={16}
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
    height: width * 0.35,
    resizeMode: 'contain',
  },
  activeZoneImage: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
});

export default TCMapCarousel;