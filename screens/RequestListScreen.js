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

const RequestListScreen = ({ navigation }) => {
  const [requests, setRequests] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('active'); // active, completed, cancelled

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const savedRequests = await AsyncStorage.getItem('userRequests');
      if (savedRequests) {
        setRequests(JSON.parse(savedRequests));
      }
    } catch (error) {
      console.log('Failed to load requests:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRequests();
    setRefreshing(false);
  };

  const filterRequests = () => {
    switch (activeTab) {
      case 'active':
        return requests.filter(req => ['pending', 'matched', 'in_progress'].includes(req.status));
      case 'completed':
        return requests.filter(req => req.status === 'completed');
      case 'cancelled':
        return requests.filter(req => req.status === 'cancelled');
      default:
        return requests;
    }
  };

  const formatPrice = (price) => {
    return `Rp ${price?.toLocaleString('id-ID') || '0'}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#FFA726';
      case 'matched': return '#42A5F5';
      case 'in_progress': return '#66BB6A';
      case 'completed': return '#4CAF50';
      case 'cancelled': return '#EF5350';
      default: return '#9E9E9E';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Menunggu';
      case 'matched': return 'Ditemukan';
      case 'in_progress': return 'Berlangsung';
      case 'completed': return 'Selesai';
      case 'cancelled': return 'Dibatalkan';
      default: return status;
    }
  };

  const tabs = [
    { id: 'active', label: 'Aktif', icon: 'schedule' },
    { id: 'completed', label: 'Selesai', icon: 'check-circle' },
    { id: 'cancelled', label: 'Dibatalkan', icon: 'cancel' },
  ];

  const filteredRequests = filterRequests();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Request Saya</Text>
        <Text style={styles.headerSubtitle}>Kelola semua request Anda</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.activeTab
            ]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Icon 
              name={tab.icon} 
              size={18} 
              color={activeTab === tab.id ? '#FFF' : '#666'} 
            />
            <Text style={[
              styles.tabText,
              activeTab === tab.id && styles.activeTabText
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Request List */}
      <ScrollView
        style={styles.requestsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {filteredRequests.map((request) => (
          <TouchableOpacity
            key={request.id}
            style={styles.requestCard}
            onPress={() => {
              if (request.status === 'matched' || request.status === 'in_progress') {
                navigation.navigate('TaskMap', { requestData: request, mode: 'requester' });
              }
            }}
          >
            <View style={styles.requestHeader}>
              <View style={styles.requestInfo}>
                <Text style={styles.requestTitle}>{request.title}</Text>
                <Text style={styles.requestDescription} numberOfLines={2}>
                  {request.description}
                </Text>
              </View>
              <View style={styles.requestMeta}>
                <Text style={styles.requestPrice}>{formatPrice(request.finalPrice || 0)}</Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(request.status) }
                ]}>
                  <Text style={styles.statusText}>{getStatusText(request.status)}</Text>
                </View>
              </View>
            </View>

            <View style={styles.requestFooter}>
              <Text style={styles.requestDetails}>
                👥 {request.peopleNeeded} orang • {request.urgency}
              </Text>
              <Text style={styles.requestDate}>
                {new Date(request.createdAt).toLocaleDateString('id-ID')}
              </Text>
            </View>

            {(request.status === 'matched' || request.status === 'in_progress') && (
              <View style={styles.actionContainer}>
                <TouchableOpacity style={styles.actionButton}>
                  <Icon name="chat" size={16} color="#FF69B4" />
                  <Text style={styles.actionText}>Chat Helper</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Icon name="location-on" size={16} color="#FF69B4" />
                  <Text style={styles.actionText}>Lihat Lokasi</Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {filteredRequests.length === 0 && (
          <View style={styles.emptyState}>
            <Icon name="inbox" size={60} color="#CCC" />
            <Text style={styles.emptyTitle}>
              Belum ada request {activeTab === 'active' ? 'aktif' : activeTab}
            </Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'active' 
                ? 'Buat request pertama Anda sekarang'
                : `Belum ada request yang ${activeTab === 'completed' ? 'selesai' : 'dibatalkan'}`
              }
            </Text>
            {activeTab === 'active' && (
              <TouchableOpacity
                style={styles.createButton}
                onPress={() => navigation.navigate('RequestForm')}
              >
                <Text style={styles.createButtonText}>Buat Request</Text>
              </TouchableOpacity>
            )}
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
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 10,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 10,
    borderRadius: 15,
    gap: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activeTab: {
    backgroundColor: '#FF69B4',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#FFF',
  },
  requestsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  requestCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  requestHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  requestInfo: {
    flex: 1,
    marginRight: 10,
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  requestDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  requestMeta: {
    alignItems: 'flex-end',
  },
  requestPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF69B4',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 10,
    color: '#FFF',
    fontWeight: '600',
  },
  requestFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  requestDetails: {
    fontSize: 12,
    color: '#666',
  },
  requestDate: {
    fontSize: 11,
    color: '#999',
  },
  actionContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 5,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF0F5',
    paddingVertical: 8,
    borderRadius: 10,
    gap: 5,
  },
  actionText: {
    fontSize: 12,
    color: '#FF69B4',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
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
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: '#FF69B4',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 20,
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default RequestListScreen;