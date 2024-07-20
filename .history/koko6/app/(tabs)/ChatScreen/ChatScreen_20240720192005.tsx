import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

interface Conversation {
  id: number;
  other_user_name: string;
  last_message: string;
  updated_at: string;
}

const ChatPreview = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const navigation = useNavigation();
  const { token } = useAuth();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get('http://172.20.0.119:5000/api/conversations', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setConversations(response.data);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    fetchConversations();
  }, [token]);

  const renderConversation = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => navigation.navigate('Chat', { conversationId: item.id, otherUserName: item.other_user_name })}
    >
      <Text style={styles.userName}>{item.other_user_name}</Text>
      <Text style={styles.lastMessage} numberOfLines={1}>{item.last_message}</Text>
      <Text style={styles.timestamp}>{new Date(item.updated_at).toLocaleDateString()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Chats</Text>
      <FlatList
        data={conversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
      />
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
});

export default ChatPreview;