import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import HomeScreen from '../(tabs)/HomeScreen/HomeScreen';
import SearchScreen from '../(tabs)/SearchScreen/SearchScreen';
import FavoritesScreen from '../(tabs)/FavoritesScreen/FavoritesScreen';
import ProfileScreen from '../(tabs)/ProfileScreen/ProfileScreen';
import PublishScreen from '../(tabs)/PublishScreen/PublishScreen';
import LoginScreen from '../(tabs)/LoginScreen/LoginScreen';
import RegisterScreen from '../(tabs)/RegisterScreen/RegisterScreen';
import PostScreen from '../(tabs)/PostScreen/PostScreen';
import { RootStackParamList } from '../types';
import DraggableBottomNav from './DraggableBottmNav';
import { useAuth } from '../context/AuthContext';
import UserProfileScreen from '../(tabs)/UserProfileScreen/UserProfileScreen';
import SuggestionScreen from '../(tabs)/SuggestionScreen/SuggestionScreen';
import CapScreen from '../(tabs)/CapScreen/CapScreen';


const Tab = createBottomTabNavigator<RootStackParamList>();

function TabNavigator() {
  const { isLoggedIn } = useAuth();

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        tabBar={(props) => <DraggableBottomNav ref={bottomNavRef} {...props} />}
        screenOptions={{
          headerShown: false,
        }}
>
  <Tab.Screen name="Home" component={HomeScreen} />
  <Tab.Screen name="Search" component={SearchScreen} />
  <Tab.Screen
    name="Publish"
    component={PublishScreen}
    listeners={({ navigation }) => ({
      tabPress: (e) => {
        if (!isLoggedIn) {
          e.preventDefault();
          navigation.navigate('Login');
        }
      },
    })}
  />
  <Tab.Screen
    name="Favorites"
    component={isLoggedIn ? FavoritesScreen : LoginScreen}
    listeners={({ navigation }) => ({
      tabPress: (e) => {
        if (!isLoggedIn) {
          e.preventDefault();
          navigation.navigate('Login');
        }
      },
    })}
  />
  <Tab.Screen
    name="Profile"
    component={ProfileScreen}
    listeners={({ navigation }) => ({
      tabPress: (e) => {
        if (!isLoggedIn) {
          e.preventDefault();
          navigation.navigate('Login');
        }
      },
    })}
  />
  <Tab.Screen
    name="Login"
    component={LoginScreen}
    options={{ tabBarButton: () => null }}
  />
  <Tab.Screen
    name="Register"
    component={RegisterScreen}
    options={{ tabBarButton: () => null }}
  />
  <Tab.Screen
    name="UserProfile"
    component={UserProfileScreen}
    options={{ tabBarButton: () => null }}
  />
  <Tab.Screen
    name="Post"
    component={PostScreen}
    options={{ tabBarButton: () => null }}
  />
  <Tab.Screen
    name="Suggestion"
    component={SuggestionScreen}
    options={{ tabBarButton: () => null }}
  />
   <Tab.Screen
    name="Cap"
    component={CapScreen}
    options={{ tabBarButton: () => null }}
  />
</Tab.Navigator>
    </View>
  );
}

export default TabNavigator;