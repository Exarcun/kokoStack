import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { AuthProvider } from './context/AuthContext';
import TabNavigator from './navigator/Navigator';
import PostScreen from './(tabs)/PostScreen/PostScreen';

function App() {
  console.log('TabNavigator:', TabNavigator);
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent={true}
      />
      <AuthProvider>
        <NavigationContainer independent={true}>
          <TabNavigator />
        </NavigationContainer>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

export default App;