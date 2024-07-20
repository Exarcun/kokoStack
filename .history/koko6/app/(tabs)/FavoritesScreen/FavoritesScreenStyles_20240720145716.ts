import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  topContentWrapper: {
    position: 'relative',
    marginBottom: 20,
  },
  topContentBackground: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: '#3C1E1C',
    opacity: 0.5,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  topContent: {
    backgroundColor: '#3C1E1C',
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    zIndex: 1,
    height: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
  },
  menuIcon: {
    padding: 5,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    position: 'absolute',
    bottom: 40,
    left: 60,
  },
  profileIcon: {
    padding: 5,
  },
  profileCircle: {
    width: 32,  // Doubled from 32
    height: 32, // Doubled from 32
    borderRadius: 32,
    backgroundColor: '#4a90e2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileDot: {
    width: 16, // Doubled from 8
    height: 16, // Doubled from 8
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  profileImage: {
    width: 32,  // Match the size of profileCircle
    height: 32, // Match the size of profileCircle
    borderRadius: 32,
  },
  favoritesContainer: {
    flex: 1,
    padding: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  favoriteItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  favoriteImage: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  favoriteContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  favoriteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  favoritePrice: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 4,
  },
  favoriteLocation: {
    fontSize: 12,
    color: '#666',
  },
  removeFavoriteButton: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notLoggedInText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
  },
  noFavoritesText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
  },
});

export default styles;