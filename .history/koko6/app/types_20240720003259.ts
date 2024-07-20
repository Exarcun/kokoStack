import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
  Search: undefined;
  Publish: undefined;
  Profile: undefined;
  Login: undefined;
  Register: undefined;
  Favorites: undefined;
  Post: { id: string }; // Keep this as string
  UserProfile: { email: string };
  Suggestion: { title: string; background_image: string; date: string };
};

export type LoginScreenNavigationProp = BottomTabNavigationProp<RootStackParamList, 'Login'>;
export type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>;
export type LoginScreenProps = {
  navigation: LoginScreenNavigationProp;
  route: LoginScreenRouteProp;
};

export type RegisterScreenNavigationProp = BottomTabNavigationProp<RootStackParamList, 'Register'>;
export type RegisterScreenRouteProp = RouteProp<RootStackParamList, 'Register'>;
export type RegisterScreenProps = {
  navigation: RegisterScreenNavigationProp;
  route: RegisterScreenRouteProp;
};

export type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootStackParamList, 'Home'>,
  BottomTabNavigationProp<RootStackParamList>
>;

export type PostScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootStackParamList, 'Post'>,
  BottomTabNavigationProp<RootStackParamList>
>;
export type PostScreenRouteProp = RouteProp<RootStackParamList, 'Post'>;

export interface Post {
  id: number; // This remains as number for database consistency
  pic_location: string;
  title: string;
  categories: string;
  cap: string;
  price: string;
  bio: string;
  postcreator: string;
}

export interface Category {
  name: string;
  post_count: number;
}