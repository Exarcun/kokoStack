import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    height: 100, // Adjust this value as needed
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  menuIcon: {
    padding: 5,
  },
  profileCircle: {
    width: 64,  // Doubled from 32
    height: 64, // Doubled from 32
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
  publishContent: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  uploadButton: {
    width: '100%',
    height: 200,
    backgroundColor: '#d3d3d3',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadButtonText: {
    fontSize: 40,
    color: '#8B4513',
  },
  uploadButtonLabel: {
    fontSize: 16,
    color: '#8B4513',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 15,
    borderColor: '#8B4513',
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputHalf: {
    width: '48%',
  },
  description: {
    height: 100,
    textAlignVertical: 'top',
  },
  publishButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#8B4513',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  publishButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  bottomSpacer: {
     height: 120, // Adjust the height as needed
   },
 
});

export default styles;
