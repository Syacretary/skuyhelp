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
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation, user, onLogout }) => {
  const [userStats, setUserStats] = useState({
    completedTasks: 0,
    helpedPeople: 0,
    totalEarnings: 0,
    rating: 0,
  });

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      const stats = await AsyncStorage.getItem('userStats');
      if (stats) {
        setUserStats(JSON.parse(stats));
      } else {
        // Initialize with mock stats
        const initialStats = {
          completedTasks: 12,
          helpedPeople: 8,
          totalEarnings: 450000,
          rating: 4.6,
        };
        setUserStats(initialStats);
        await AsyncStorage.setItem('userStats', JSON.stringify(initialStats));
      }
    } catch (error) {
      console.log('Failed to load user stats:', error);
    }
  };

  const formatPrice = (price) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  const handleLogout = () => {
    Alert.alert(
      'Keluar',
      'Apakah Anda yakin ingin keluar?',
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Keluar', 
          style: 'destructive',
          onPress: onLogout 
        },
      ]
    );
  };

  const menuItems = [
    {
      id: 'settings',
      title: 'Pengaturan',
      subtitle: 'Tema, notifikasi, privasi',
      icon: 'settings',
      onPress: () => navigation.navigate('Settings'),
    },
    {
      id: 'history',
      title: 'Riwayat Transaksi',
      subtitle: 'Lihat semua aktivitas',
      icon: 'history',
      onPress: () => console.log('History'),
    },
    {
      id: 'wallet',
      title: 'Dompet Digital',
      subtitle: 'Kelola saldo dan pembayaran',
      icon: 'account-balance-wallet',
      onPress: () => console.log('Wallet'),
    },
    {
      id: 'help',
      title: 'Bantuan & FAQ',
      subtitle: 'Pusat bantuan pengguna',
      icon: 'help',
      onPress: () => console.log('Help'),
    },
    {
      id: 'about',
      title: 'Tentang Aplikasi',
      subtitle: 'Versi 1.0.0',
      icon: 'info',
      onPress: () => console.log('About'),
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Icon name="person" size={40} color="#FFF" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'Pengguna'}</Text>
            <Text style={styles.userPhone}>{user?.phone || 'Belum diatur'}</Text>
            <View style={styles.ratingContainer}>
              <Icon name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{userStats.rating} Rating</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Icon name="edit" size={20} color="#FF69B4" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{userStats.completedTasks}</Text>
          <Text style={styles.statLabel}>Task Selesai</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{userStats.helpedPeople}</Text>
          <Text style={styles.statLabel}>Orang Dibantu</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{formatPrice(userStats.totalEarnings)}</Text>
          <Text style={styles.statLabel}>Total Pendapatan</Text>
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <View style={styles.menuIcon}>
              <Icon name={item.icon} size={24} color="#FF69B4" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#CCC" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="logout" size={24} color="#FF6B6B" />
        <Text style={styles.logoutText}>Keluar</Text>
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Jasa Dadakan v1.0.0</Text>
        <Text style={styles.footerSubtext}>Platform bantuan terpercaya</Text>
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
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userPhone: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF69B4',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  menuContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF0F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B6B',
    marginLeft: 10,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  footerSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
});

export default ProfileScreen;