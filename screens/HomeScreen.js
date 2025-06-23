import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [categories] = useState([
    { id: 1, name: 'Print & Fotokopi', icon: 'print', basePrice: 5000, color: '#FFB6C1' },
    { id: 2, name: 'Antar Barang', icon: 'delivery-dining', basePrice: 10000, color: '#DDA0DD' },
    { id: 3, name: 'Belanja', icon: 'shopping-bag', basePrice: 15000, color: '#F0E68C' },
    { id: 4, name: 'Bantuan Tugas', icon: 'school', basePrice: 20000, color: '#98FB98' },
    { id: 5, name: 'Bantuan Pindah', icon: 'home', basePrice: 30000, color: '#87CEEB' },
    { id: 6, name: 'Bantuan Teknis', icon: 'build', basePrice: 25000, color: '#DEB887' },
  ]);

  const [recommendations] = useState([
    {
      id: 1,
      title: 'Belikan Kopi & Snack',
      description: 'Berdasarkan jam makan siang',
      price: 15000,
      urgency: 'normal',
    },
    {
      id: 2,
      title: 'Bantuan Belajar',
      description: 'Jadwal ujian minggu depan',
      price: 25000,
      urgency: 'urgent',
    },
  ]);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.log('Failed to load user data:', error);
    }
  };

  const formatPrice = (price) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'urgent': return '#FF6B6B';
      case 'normal': return '#4ECDC4';
      case 'santai': return '#45B7D1';
      default: return '#4ECDC4';
    }
  };

  const handleCreateRequest = () => {
    navigation.navigate('RequestForm');
  };

  const handleCategoryPress = (category) => {
    navigation.navigate('RequestForm', { categoryId: category.id, categoryName: category.name });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Icon name="person" size={24} color="#FFF" />
            </View>
            <View>
              <Text style={styles.greeting}>Halo,</Text>
              <Text style={styles.userName}>{user?.name || 'Kamu'}! 👋</Text>
            </View>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Icon name="notifications" size={24} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Icon name="account-balance-wallet" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.headerTitle}>
          <Text style={styles.mainTitle}>Ada yang bisa dibantu?</Text>
          <Text style={styles.subtitle}>Pilih kategori atau buat request custom</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={[styles.actionCard, styles.createRequestCard]} 
          onPress={handleCreateRequest}
        >
          <View style={styles.actionIcon}>
            <Icon name="add" size={28} color="#FF69B4" />
          </View>
          <Text style={styles.actionTitle}>Lagi Butuh Nih</Text>
          <Text style={styles.actionSubtitle}>Buat request custom</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionCard, styles.historyCard]} 
          onPress={() => navigation.navigate('Requests')}
        >
          <View style={styles.actionIcon}>
            <Icon name="history" size={28} color="#9C27B0" />
          </View>
          <Text style={styles.actionTitle}>Request Saya</Text>
          <Text style={styles.actionSubtitle}>Lihat status</Text>
        </TouchableOpacity>
      </View>

      {/* Service Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kategori Jasa Populer</Text>
        <View style={styles.categoriesGrid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryCard, { backgroundColor: category.color }]}
              onPress={() => handleCategoryPress(category)}
            >
              <Icon name={category.icon} size={32} color="#FFF" />
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryPrice}>Mulai {formatPrice(category.basePrice)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recommendations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rekomendasi Untukmu</Text>
        {recommendations.map((rec) => (
          <TouchableOpacity key={rec.id} style={styles.recommendationCard}>
            <View style={styles.recContent}>
              <View style={[styles.recIcon, { backgroundColor: getUrgencyColor(rec.urgency) }]}>
                <Icon name="lightbulb" size={20} color="#FFF" />
              </View>
              <View style={styles.recInfo}>
                <Text style={styles.recTitle}>{rec.title}</Text>
                <Text style={styles.recDescription}>{rec.description}</Text>
              </View>
              <View style={styles.recPrice}>
                <Text style={styles.recPriceText}>~{formatPrice(rec.price)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
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
    paddingBottom: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  greeting: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
  userName: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  headerTitle: {
    alignItems: 'center',
  },
  mainTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 15,
  },
  actionCard: {
    flex: 1,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  createRequestCard: {
    backgroundColor: '#FFE4E1',
  },
  historyCard: {
    backgroundColor: '#F3E5F5',
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    paddingBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryName: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  categoryPrice: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    marginTop: 4,
  },
  recommendationCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  recContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recInfo: {
    flex: 1,
  },
  recTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  recDescription: {
    fontSize: 12,
    color: '#666',
  },
  recPrice: {
    alignItems: 'flex-end',
  },
  recPriceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF69B4',
  },
});

export default HomeScreen;