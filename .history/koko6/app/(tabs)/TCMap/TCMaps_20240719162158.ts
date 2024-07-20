import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  map: {
    width: '100%',
    height: '100%',
    aspectRatio: 1, // This ensures the map remains square
  },
  region: {
    // Add any specific styles for regions here if needed
  },
  activeRegion: {
    // Add styles for active regions here if needed
  },
});

export default styles;