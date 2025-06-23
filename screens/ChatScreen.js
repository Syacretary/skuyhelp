import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatScreen = ({ navigation, route }) => {
  const { recipientId, recipientName, taskId } = route.params;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadCurrentUser();
    loadMessages();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      setCurrentUser(JSON.parse(userData));
    } catch (error) {
      console.log('Failed to load user data:', error);
    }
  };

  const loadMessages = async () => {
    try {
      const chatKey = `chat_${Math.min(recipientId, currentUser?.id || 1)}_${Math.max(recipientId, currentUser?.id || 1)}_${taskId}`;
      const savedMessages = await AsyncStorage.getItem(chatKey);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        // Initialize with welcome message
        const welcomeMessage = {
          id: Date.now(),
          text: `Halo! Chat ini terkait dengan task "${route.params.taskTitle || 'Task Anda'}". Silakan koordinasi dengan baik ya! 😊`,
          sender: 'system',
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.log('Failed to load messages:', error);
    }
  };

  const saveMessages = async (newMessages) => {
    try {
      const chatKey = `chat_${Math.min(recipientId, currentUser?.id || 1)}_${Math.max(recipientId, currentUser?.id || 1)}_${taskId}`;
      await AsyncStorage.setItem(chatKey, JSON.stringify(newMessages));
    } catch (error) {
      console.log('Failed to save messages:', error);
    }
  };

  const sendMessage = () => {
    if (!inputText.trim() || !currentUser) return;

    const newMessage = {
      id: Date.now(),
      text: inputText.trim(),
      sender: currentUser.id,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    saveMessages(updatedMessages);
    setInputText('');

    // Simulate auto-reply (for demo purposes)
    setTimeout(() => {
      const autoReply = {
        id: Date.now() + 1,
        text: getAutoReply(inputText),
        sender: recipientId,
        timestamp: new Date(),
      };
      const finalMessages = [...updatedMessages, autoReply];
      setMessages(finalMessages);
      saveMessages(finalMessages);
    }, 1000);
  };

  const getAutoReply = (userMessage) => {
    const replies = [
      'Oke, siap!',
      'Baik, saya mengerti',
      'Terima kasih infonya',
      'Saya sedang dalam perjalanan',
      'Sampai di lokasi sekitar 15 menit lagi',
      'Mohon tunggu sebentar ya',
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  };

  const renderMessage = ({ item }) => {
    const isCurrentUser = item.sender === currentUser?.id;
    const isSystem = item.sender === 'system';

    if (isSystem) {
      return (
        <View style={styles.systemMessage}>
          <Text style={styles.systemMessageText}>{item.text}</Text>
        </View>
      );
    }

    return (
      <View style={[
        styles.messageContainer,
        isCurrentUser ? styles.sentMessage : styles.receivedMessage
      ]}>
        <View style={[
          styles.messageBubble,
          isCurrentUser ? styles.sentBubble : styles.receivedBubble
        ]}>
          <Text style={[
            styles.messageText,
            isCurrentUser ? styles.sentText : styles.receivedText
          ]}>
            {item.text}
          </Text>
          <Text style={[
            styles.timestamp,
            isCurrentUser ? styles.sentTimestamp : styles.receivedTimestamp
          ]}>
            {new Date(item.timestamp).toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{recipientName}</Text>
          <Text style={styles.headerStatus}>Online</Text>
        </View>
        <TouchableOpacity>
          <Icon name="phone" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Ketik pesan..."
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity 
          style={styles.sendButton}
          onPress={sendMessage}
          disabled={!inputText.trim()}
        >
          <Icon 
            name="send" 
            size={24} 
            color={inputText.trim() ? "#FFF" : "#999"} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#FF69B4',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 15,
  },
  headerName: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerStatus: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 20,
  },
  systemMessage: {
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  systemMessageText: {
    backgroundColor: '#E3F2FD',
    color: '#1976D2',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    fontSize: 14,
    textAlign: 'center',
  },
  messageContainer: {
    paddingHorizontal: 20,
    marginVertical: 5,
  },
  sentMessage: {
    alignItems: 'flex-end',
  },
  receivedMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sentBubble: {
    backgroundColor: '#FF69B4',
    borderBottomRightRadius: 5,
  },
  receivedBubble: {
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  sentText: {
    color: '#FFF',
  },
  receivedText: {
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    marginTop: 5,
  },
  sentTimestamp: {
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'right',
  },
  receivedTimestamp: {
    color: '#999',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E1E1E1',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 10,
  },
  sendButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#FF69B4',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatScreen;