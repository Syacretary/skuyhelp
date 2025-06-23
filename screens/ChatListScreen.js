import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatListScreen = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      // Mock chat list data
      const mockChats = [
        {
          id: 1,
          recipientName: 'Ahmad Baik',
          recipientAvatar: '👨',
          lastMessage: 'Terima kasih sudah membantu!',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          unreadCount: 0,
          taskTitle: 'Belikan makan siang',
          isActive: false,
        },
        {
          id: 2,
          recipientName: 'Siti Helper',
          recipientAvatar: '👩',
          lastMessage: 'Saya sudah sampai di lokasi',
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          unreadCount: 2,
          taskTitle: 'Bantuan pindah barang',
          isActive: true,
        },
        {
          id: 3,
          recipientName: 'Budi Cepat',
          recipientAvatar: '👨',
          lastMessage: 'Oke, tunggu 10 menit ya',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          unreadCount: 0,
          taskTitle: 'Print dokumen',
          isActive: false,
        },
      ];
      setChats(mockChats);
    } catch (error) {
      console.log('Failed to load chats:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadChats();
    setRefreshing(false);
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Baru saja';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}j`;
    return `${days}h`;
  };

  const handleChatPress = (chat) => {
    navigation.navigate('Chat', {
      recipientId: chat.id,
      recipientName: chat.recipientName,
      taskId: chat.id,
      taskTitle: chat.taskTitle,
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat</Text>
        <Text style={styles.headerSubtitle}>Koordinasi dengan helper</Text>
      </View>

      {/* Chat List */}
      <ScrollView
        style={styles.chatList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {chats.map((chat) => (
          <TouchableOpacity
            key={chat.id}
            style={styles.chatItem}
            onPress={() => handleChatPress(chat)}
          >
            <View style={styles.avatarContainer}>
              <Text style={styles.avatar}>{chat.recipientAvatar}</Text>
              {chat.isActive && <View style={styles.onlineIndicator} />}
            </View>

            <View style={styles.chatContent}>
              <View style={styles.chatHeader}>
                <Text style={styles.recipientName}>{chat.recipientName}</Text>
                <Text style={styles.timestamp}>{formatTime(chat.timestamp)}</Text>
              </View>
              
              <Text style={styles.taskTitle} numberOfLines={1}>
                📋 {chat.taskTitle}
              </Text>
              
              <Text 
                style={[
                  styles.lastMessage,
                  chat.unreadCount > 0 && styles.unreadMessage
                ]} 
                numberOfLines={1}
              >
                {chat.lastMessage}
              </Text>
            </View>

            {chat.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>{chat.unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {chats.length === 0 && (
          <View style={styles.emptyState}>
            <Icon name="chat-bubble-outline" size={60} color="#CCC" />
            <Text style={styles.emptyTitle}>Belum ada chat</Text>
            <Text style={styles.emptySubtitle}>
              Chat akan muncul ketika ada helper yang mengambil request Anda
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
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
    paddingBottom: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
  },
  chatList: {
    flex: 1,
    paddingTop: 10,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFE4E1',
    textAlign: 'center',
    lineHeight: 50,
    fontSize: 24,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  recipientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  taskTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
  unreadMessage: {
    fontWeight: '600',
    color: '#333',
  },
  unreadBadge: {
    backgroundColor: '#FF69B4',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  unreadCount: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 15,
    marginBottom: 5,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default ChatListScreen;