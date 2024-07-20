import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topContentWrapper: {
    position: 'relative',
    overflow: 'visible',
  },
  topContentBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 25,
    backgroundColor: '#CB9489',
    opacity: 0.3,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  topContent: {
    backgroundColor: '#3C1E1C',
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  menuIcon: {
    padding: 5,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
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

  expandButton: {
    alignSelf: 'center',
    marginTop: 10,
  },
  expandedContent: {
    marginTop: 20,
  },
  expandedText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  redSquareIcon: {
    width: 60,
    height: 60,
    backgroundColor: 'red',
    borderRadius: 15,
  },
  activeIcon: {
    borderWidth: 2,
    borderColor: '#fff',
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  icon: {
    width: 44,
    height: 44,
    tintColor: '#fff',
  },
  categoriesSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    marginLeft: 30,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItemWrapper: {
    width: '23%',
    aspectRatio: 1,
    marginBottom: 20,
    alignItems: 'center',
  },
  categoryItem: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#B55849',
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categoryItemSelected: {
    backgroundColor: '#CB9489',
  },
  categoryText: {
    marginTop: 5,
    fontSize: 12,
    textAlign: 'center',
  },
  suggestionsSection: {
    marginVertical: 20,
  },
  suggestionsContainer: {
    paddingHorizontal: 15,
  },
  suggestionItem: {
    width: width * 0.6,
    height: width * 0.4,
    marginRight: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  suggestionBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  suggestionOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 10,
  },
  suggestionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  postsSection: {
    padding: 20,
  },
  postBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    flexDirection: 'row',  // Add this to allow the favorite icon to be positioned alongside the content
    alignItems: 'flex-start',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  postContent: {
    fontSize: 14,
    flex: 1,
    marginBottom: 10,
  },
  favoriteIcon: {
    padding: 10,
    alignSelf: 'flex-start',
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  postAuthor: {
    fontSize: 12,
    color: '#666',
  },
  postTimestamp: {
    fontSize: 12,
    color: '#666',
  },
  postHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  postImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  postHeaderText: {
    flex: 1,
    justifyContent: 'center',
  },
  postCategory: {
    fontSize: 14,
    color: '#666',
  },
  postBio: {
    fontSize: 14,
    marginBottom: 10,
  },
  postDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  postCap: {
    fontSize: 14,
    color: '#666',
  },
  postPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  // New styles for loading and error states
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  refreshIcon: {
    marginRight: 10000,
    padding: 5,
  },
  refreshIconText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default styles;
