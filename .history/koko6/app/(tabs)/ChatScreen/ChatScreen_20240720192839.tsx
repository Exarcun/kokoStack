import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

interface Conversation {
  id: number;
  other_user_email: string;
  last_message: string;
  last_message_time: string;
}

const ChatPreview = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newChatEmail, setNewChatEmail] = useState('');
  const [newChatMessage, setNewChatMessage] = useState('');
  const navigation = useNavigation();
  const { token } = useAuth();

  useEffect(() => {
    fetchConversations();
  }, [token]);

  const fetchConversations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://172.20.0.119:5000/api/conversations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setError('Unable to load conversations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const renderConversation = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => Alert.alert('Chat', `You tapped on chat with ${item.other_user_email}`)}
    >
      <Text style={styles.userName}>{item.other_user_email}</Text>
      <Text style={styles.lastMessage} numberOfLines={1}>{item.last_message}</Text>
      <Text style={styles.timestamp}>{new Date(item.last_message_time).toLocaleDateString()}</Text>
    </TouchableOpacity>
  );

  const startNewConversation = async () => {
    if (!newChatEmail || !newChatMessage) {
      Alert.alert('Error', 'Please enter both email and message');
      return;
    }

    try {
      // Create new conversation
      const conversationResponse = await axios.post('http://172.20.0.119:5000/api/conversations', 
        { otherUserEmail: newChatEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const conversationId = conversationResponse.data.id;

      // Send first message
      await axios.post('http://172.20.0.119:5000/api/messages', 
        { conversationId, content: newChatMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh conversations list
      await fetchConversations();

      setModalVisible(false);
      setNewChatEmail('');
      setNewChatMessage('');

      Alert.alert('Success', 'New conversation started!');
    } catch (error) {
      console.error('Error starting new conversation:', error);
      Alert.alert('Error', 'Unable to start new conversation. Please try again.');
    }
  };

  if (loading) {
    return <View style={styles.container}><Text style={styles.loadingText}>Loading conversations...</Text></View>;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchConversations}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Chats</Text>
      {conversations.length > 0 ? (
        <FlatList
          data={conversations}
          renderItem={renderConversation}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
        />
      ) : (
        <Text style={styles.noConversationsText}>No conversations yet.</Text>
      )}
      <TouchableOpacity style={styles.newChatButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.newChatButtonText}>Start New Chat</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Start New Chat</Text>
          <TextInput
            style={styles.input}
            onChangeText={setNewChatEmail}
            value={newChatEmail}
            placeholder="Enter user email"
            placeholderTextColor="#999"
          />
          <TextInput
            style={[styles.input, styles.messageInput]}
            onChangeText={setNewChatMessage}
            value={newChatMessage}
            placeholder="Enter your message"
            placeholderTextColor="#999"
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={startNewConversation}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  list: {
    flex: 1,
  },
  conversationItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  lastMessage: {
    fontSize: 14,
    color: '#ddd',
  },
  timestamp: {
    fontSize: 12,
    color: '#bbb',
    alignSelf: 'flex-end',
  },
  loadingText: {
    color: '#fff',
    textAlign: 'center',
  },
  errorText: {
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#4ecdc4',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noConversationsText: {
    color: '#ddd',
    textAlign: 'center',
    marginTop: 20,
  },
  newChatButton: {
    backgroundColor: '#4ecdc4',
    padding: 15,
    borderRadius: 5,
    alignSelf: 'stretch',
    marginTop: 20,
  },
  newChatButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#3C1E1C',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  input: {
    height: 40,
    width: '100%',
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderColor: '#4ecdc4',
    borderRadius: 5,
    color: '#fff',
  },
  messageInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: '#4ecdc4',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#ff6b6b',
  },
});

export default ChatPreview;