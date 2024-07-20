import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import io from 'socket.io-client';

type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const route = useRoute<ChatScreenRouteProp>();
  const { conversationId, otherUserName } = route.params;
  const { token, userId } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://172.20.0.119:5000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket');
      newSocket.emit('join', userId);
    });

    newSocket.on('newMessage', (message) => {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [message])
      );
    });

    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://172.20.0.119:5000/api/conversations/${conversationId}/messages`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(response.data.map(message => ({
          _id: message.id,
          text: message.content,
          createdAt: new Date(message.created_at),
          user: {
            _id: message.sender_id,
            name: message.sender_id === userId ? 'You' : otherUserName,
          },
        })));
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [conversationId, token, userId, otherUserName]);

  const onSend = useCallback((newMessages = []) => {
    const message = newMessages[0];
    socket.emit('sendMessage', {
      conversationId,
      senderId: userId,
      recipientId: message.user._id,
      content: message.text,
    });

    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );
  }, [conversationId, userId, socket]);

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{ _id: userId }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ChatScreen;