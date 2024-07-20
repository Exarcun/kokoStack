import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Text, ScrollView } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import NavigatorBackground from './NavigatorBackground';
import PublishIcon from './PublishIcon';
import styles, { TABBAR_HEIGHT, DRAWER_HEIGHT, MAX_UPWARD_TRANSLATE_Y, LOCK_THRESHOLD } from './DraggableBottmNavStyles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DraggableBottomNav: React.FC<BottomTabBarProps> = ({ 
  state, 
  descriptors, 
  navigation,
}) => {
  const { isLoggedIn } = useAuth();
  const translateY = useSharedValue(0);

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

  const renderNewsCarousel = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.newsCarousel}
    >
      {[1, 2, 3, 4, 5].map((item) => (
        <View key={item} style={styles.newsItem}>
          <Text style={styles.newsTitle}>News Item {item}</Text>
        </View>
      ))}
    </ScrollView>
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
            {renderNewsCarousel()}
          </View>
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
};

export default DraggableBottomNav;