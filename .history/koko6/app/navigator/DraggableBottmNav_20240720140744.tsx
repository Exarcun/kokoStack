import React, { useImperativeHandle, forwardRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Text } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import NavigatorBackground from './NavigatorBackground';
import PublishIcon from './PublishIcon';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TABBAR_HEIGHT = 80;
const DRAWER_HEIGHT = 500;
const MAX_UPWARD_TRANSLATE_Y = -400;
const LOCK_THRESHOLD = 200;

export interface DraggableBottomNavRef {
  fullyExtend: () => void;
}

const DraggableBottomNav = forwardRef<DraggableBottomNavRef, BottomTabBarProps>(({ 
  state, 
  descriptors, 
  navigation,
}, ref) => {
  const { isLoggedIn } = useAuth();
  const translateY = useSharedValue(0);

  const fullyExtend = () => {
    translateY.value = withSpring(MAX_UPWARD_TRANSLATE_Y, { damping: 50 });
  };

  useImperativeHandle(ref, () => ({
    fullyExtend
  }));

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context: { startY: number }) => {
      context.startY = translateY.value;
    },
    onActive: (event, context) => {
      const newTranslateY = context.startY + event.translationY;
      if (Math.abs(event.translationY) > LOCK_THRESHOLD || Math.abs(translateY.value) > LOCK_THRESHOLD) {
        translateY.value = Math.max(MAX_UPWARD_TRANSLATE_Y, Math.min(0, newTranslateY));
      }
    },
    onEnd: (event) => {
      const shouldSnap = event.velocityY < -500 || (translateY.value < MAX_UPWARD_TRANSLATE_Y / 2 && event.velocityY < 500);
      translateY.value = withSpring(shouldSnap ? MAX_UPWARD_TRANSLATE_Y : 0, { damping: 50 });
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const renderIcon = (routeName: string, isFocused: boolean) => {
    const color = isFocused ? '#FFFFFF' : '#888888';
    const size = 24;

    switch (routeName) {
      case 'Home':
        return <MaterialIcons name="home" size={size} color={color} style={styles.icon} />;
      case 'Search':
        return <MaterialIcons name="search" size={size} color={color} style={styles.icon} />;
      case 'Publish':
        return <PublishIcon size={size} color={color} style={styles.publishIcon}/>;
      case 'Favorites':
        return <MaterialIcons name="favorite" size={size} color={color} style={styles.icon} />;
      case 'Profile':
        return <MaterialIcons name="person" size={size} color={color} style={styles.icon} />;
      default:
        return <MaterialIcons name="circle" size={size} color={color} />;
    }
  };

  const renderCarousel = () => (
    <View style={styles.carouselContainer}>
      <TouchableOpacity 
        style={styles.carouselButton} 
        onPress={() => setCurrentCarouselIndex((prev) => (prev > 0 ? prev - 1 : carouselItems.length - 1))}
      >
        <MaterialIcons name="chevron-left" size={30} color="#FFFFFF" />
      </TouchableOpacity>
      <View style={styles.carouselItem}>
        <Text style={styles.carouselText}>Carousel Item {carouselItems[currentCarouselIndex]}</Text>
      </View>
      <TouchableOpacity 
        style={styles.carouselButton} 
        onPress={() => setCurrentCarouselIndex((prev) => (prev < carouselItems.length - 1 ? prev + 1 : 0))}
      >
        <MaterialIcons name="chevron-right" size={30} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <View style={styles.backgroundContainer}>
          <NavigatorBackground
            width={SCREEN_WIDTH + 30}
            height={TABBAR_HEIGHT + DRAWER_HEIGHT + 70}
            style={styles.background}
          />
        </View>
        <View style={styles.content}>
          <View style={styles.tabBar}>
            {state.routes.map((route, index) => {
              if (route.name === 'Login' || route.name === 'Register' || route.name === 'Post' || route.name === 'UserProfile' || route.name === 'Suggestion' || route.name === 'Cap') {
                return null;
              }

              const { options } = descriptors[route.key];
              const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;

              const isFocused = state.index === index;

              const onPress = () => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  if (isLoggedIn || route.name === 'Home' || route.name === 'Search') {
                    navigation.navigate(route.name);
                  } else {
                    navigation.navigate('Login');
                  }
                }
              };

              return (
                <TouchableOpacity
                  key={index}
                  accessibilityRole="button"
                  accessibilityState={isFocused ? { selected: true } : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  testID={options.tabBarTestID}
                  onPress={onPress}
                  style={styles.tab}
                >
                  {renderIcon(route.name, isFocused)}
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={styles.stickyContent}>
            {renderCarousel()}
          </View>
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: -DRAWER_HEIGHT + TABBAR_HEIGHT - 85,
    left: 0,
    right: 0,
    height: DRAWER_HEIGHT + TABBAR_HEIGHT,
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  background: {
    position: 'absolute',
    bottom: 0,
    left: -15,
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    height: TABBAR_HEIGHT,
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 2,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stickyContent: {
    flex: 1,
    marginTop: -34,
    backgroundColor: '#3C1E1C',
    zIndex: 1,
    justifyContent: 'center',
  },
  icon: {
    top: 12,
  },
  publishIcon: {
    maxWidth: 100,
    top: -5,
    right: 4,
    zIndex: 1,
  },
  carouselContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop:-90,
  },
  carouselButton: {
    padding: 10,
  },
  carouselItem: {
    width: SCREEN_WIDTH - 120,
    height: 150,
    backgroundColor: '#4A2C2A',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DraggableBottomNav;