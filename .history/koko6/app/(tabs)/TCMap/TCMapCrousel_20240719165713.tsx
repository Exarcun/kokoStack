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
        getItemLayout={getItemLayout}
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