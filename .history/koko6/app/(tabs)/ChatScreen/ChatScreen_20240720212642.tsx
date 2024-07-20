import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, SafeAreaView, TextInput, Modal, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';
import styles from './ChatScreenStyles';
import { useAuth } from '../../context/AuthContext';
import { useBottomNav } from '../../navigator/BottomNavContext';
import { API_BASE_URL, BASE_URL } from '../../../config';

interface Message {
  id: number;
  sender_id: string;
  content: string;
  created_at: string;
}

interface Conversation {
  id: number;
  other_user_email: string;
  last_message: string;
  last_message_time: string;
  messages: Message[];
}

const ChatScreen = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeChat, setActiveChat] = useState<Conversation | null>(null);
  const [message, setMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [newChatEmail, setNewChatEmail] = useState('');
  const [newChatMessage, setNewChatMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();
  const { token, isLoggedIn } = useAuth();
  const bottomNavRef = useBottomNav();
  const [profilePic, setProfilePic] = useState<string | null>(null);

  useEffect(() => {
    if (isLoggedIn && token) {
      fetchConversations();
      fetchUserProfile();
    }
  }, [isLoggedIn, token]);

  const fetchConversations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/conversations`, {
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

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfilePic(response.data.profilepic);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleMenuPress = () => {
    bottomNavRef.current?.fullyExtend();
  };

  const handleConversationPress = async (conversation: Conversation) => {
    try {
      const response = await axios.get(`${API_BASE_URL}//conversations/${conversation.id}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActiveChat({...conversation, messages: response.data});
    } catch (error) {
      console.error('Error fetching messages:', error);
      Alert.alert('Error', 'Unable to load messages. Please try again.');
    }
  };

  const handleSendMessage = useCallback(async () => {
    if (!activeChat || !message.trim()) return;

    try {
      const response = await axios.post('http://172.20.0.119:5000/api/messages', {
        conversationId: activeChat.id,
        content: message
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setActiveChat(prev => prev ? {
        ...prev,
        messages: [...prev.messages, response.data],
        last_message: response.data.content,
        last_message_time: response.data.created_at
      } : null);

      setMessage('');
      
      // Update the conversations list
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv.id === activeChat.id 
            ? {...conv, last_message: response.data.content, last_message_time: response.data.created_at}
            : conv
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Unable to send message. Please try again.');
    }
  }, [activeChat, message, token]);

  const startNewConversation = async () => {
    if (!newChatEmail || !newChatMessage) {
      Alert.alert('Error', 'Please enter both email and message');
      return;
    }

    try {
      const conversationResponse = await axios.post('http://172.20.0.119:5000/api/conversations', 
        { otherUserEmail: newChatEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const messageResponse = await axios.post('http://172.20.0.119:5000/api/messages', 
        { conversationId: conversationResponse.data.id, content: newChatMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchConversations();

      setModalVisible(false);
      setNewChatEmail('');
      setNewChatMessage('');

      // Open the new conversation
      handleConversationPress({
        id: conversationResponse.data.id,
        other_user_email: newChatEmail,
        last_message: newChatMessage,
        last_message_time: messageResponse.data.created_at,
        messages: [messageResponse.data]
      });

    } catch (error) {
      console.error('Error starting new conversation:', error);
      Alert.alert('Error', 'Unable to start new conversation. Please try again.');
    }
  };

  const renderConversationItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => handleConversationPress(item)}
    >
      <Image
        source={{ uri: 'https://via.placeholder.com/50' }}
        style={styles.avatar}
      />
      <View style={styles.conversationDetails}>
        <Text style={styles.userName}>{item.other_user_email}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>{item.last_message}</Text>
      </View>
      <Text style={styles.timestamp}>{new Date(item.last_message_time).toLocaleDateString()}</Text>
    </TouchableOpacity>
  );

  const ChatView = ({ conversation }: { conversation: Conversation }) => {
    return (
      <View style={styles.chatContainer}>
        <FlatList
          data={conversation.messages}
          renderItem={({ item }) => (
            <View style={[
              styles.messageBubble,
              item.sender_id === conversation.other_user_email ? styles.receivedMessage : styles.sentMessage
            ]}>
              <Text style={styles.messageText}>{item.content}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
          style={styles.messageList}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.chatInput}
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
          />
          <TouchableOpacity style={styles.sendMessageButton} onPress={handleSendMessage}>
            <MaterialIcons name="send" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.notLoggedInText}>Please log in to view your chats.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topContentWrapper}>
        <View style={styles.topContentBackground} />
        <View style={styles.topContent}>
          <View style={styles.header}>
            <Text style={styles.logo}>Messaggi</Text>
          </View>
        </View>
      </View>

      {activeChat ? (
        <ChatView conversation={activeChat} />
      ) : (
        <>
          <FlatList
            data={conversations}
            renderItem={renderConversationItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.chatList}
          />
          <TouchableOpacity style={styles.newChatButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.newChatButtonText}>Start New Chat</Text>
          </TouchableOpacity>
        </>
      )}

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
    </SafeAreaView>
  );
};

export default ChatScreen;