import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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
    padding: 10,
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
  newsCarousel: {
    height: 150,
  },
  newsItem: {
    width: SCREEN_WIDTH - 40,
    height: 130,
    marginRight: 10,
    backgroundColor: '#4A2C2A',
    borderRadius: 10,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newsTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export const TABBAR_HEIGHT = 80;
export const DRAWER_HEIGHT = 500;
export const MAX_UPWARD_TRANSLATE_Y = -400;
export const LOCK_THRESHOLD = 200;

export default styles;