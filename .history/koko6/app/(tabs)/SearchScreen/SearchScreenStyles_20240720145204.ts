import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topContentWrapper: {
    position: 'relative',
    height: 170, // Initial height
    marginBottom: 20,
  },
  topContentBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#3C1E1C',
    opacity: 0.5,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  topContent: {
    flex: 1,
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
    width: 64,  // Match the size of profileCircle
    height: 64, // Match the size of profileCircle
    borderRadius: 32,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  expandButton: {
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 15,
  },
  profileCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4a90e2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 20,
  },
  scrollContent: {
    flex: 1,
    paddingBottom: 20,
  },
  resultBox: {
    padding: 20,
    marginVertical: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  resultText: {
    fontSize: 16,
    color: '#333',
  },
  resultImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  filterContainer: {
    marginTop: 20,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  filterButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 14,
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
    alignItems: 'flex-start',  // Align items to the top
  },
  postContent: {
    flex: 1,  // Take up available space
  },
  favoriteIcon: {
    padding: 10,
    alignSelf: 'flex-start',
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
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
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
  postFooter: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  postAuthor: {
    fontSize: 12,
    color: '#666',
  },
});

export default styles;
