import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ExploreScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRequests, setActiveRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'Semua', icon: 'apps' },
    { id: 'urgent', label: 'Urgent', icon: 'warning' },
    { id: 'nearby', label: 'Terdekat', icon: 'near-me' },
    { id: 'high-pay', label: 'Bayaran Tinggi', icon: 'attach-money' },
  ];

  useEffect(() => {
    loadActiveRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [searchQuery, selectedFilter, activeRequests]);

  const loadActiveRequests = async () => {
    try {
      // Simulate loading requests from various users
      const mockRequests = [
        {
          id: 1,
          title: 'Belikan makan siang dari warteg',
          description: 'Mau nasi gudeg + es teh manis, lokasi warteg dekat kampus',
          price: 25000,
          urgency: 'normal',
          peopleNeeded: 1,
          location: 'Kampus UI, Depok',
          distance: '1.2 km',
          timePosted: '15 menit lalu',
          requesterName: 'Siti',
          requesterRating: 4.5,
        },
        {
          id: 2,
          title: 'Bantuan pindah kamar kos',
          description: 'Butuh bantuan pindah barang dari kamar lama ke kamar baru, barang tidak terlalu banyak',
          price: 75000,
          urgency: 'urgent',
          peopleNeeded: 2,
          location: 'Margonda, Depok',
          distance: '2.8 km',
          timePosted: '32 menit lalu',
          requesterName: 'Ahmad',
          requesterRating: 4.8,
        },
        {
          id: 3,
          title: 'Print dan fotokopi dokumen',
          description: 'Print skripsi 120 halaman + fotokopi KTP dan KK',
          price: 15000,
          urgency: 'santai',
          peopleNeeded: 1,
          location: 'Fakultas Teknik UI',
          distance: '0.8 km',
          timePosted: '1 jam lalu',
          requesterName: 'Maya',
          requesterRating: 4.2,
        },
        {
          id: 4,
          title: 'Belanja groceries mingguan',
          description: 'Belanja kebutuhan sehari-hari di supermarket, ada list yang sudah disiapkan',
          price: 45000,
          urgency: 'normal',
          peopleNeeded: 1,
          location: 'Lotte Mart Kuningan',
          distance: '5.2 km',
          timePosted: '2 jam lalu',
          requesterName: 'Budi',
          requesterRating: 4.7,
        },
      ];

      setActiveRequests(mockRequests);
    } catch (error) {
      console.log('Failed to load requests:', error);
    }
  };

  const filterRequests = () => {
    let filtered = activeRequests;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(request =>
        request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    switch (selectedFilter) {
      case 'urgent':
        filtered = filtered.filter(request => request.urgency === 'urgent');
        break;
      case 'nearby':
        filtered = filtered.filter(request => parseFloat(request.distance) <= 2.0);
        break;
      case 'high-pay':
        filtered = filtered.filter(request => request.price >= 50000);
        break;
      default:
        break;
    }

    setFilteredRequests(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadActiveRequests();
    setRefreshing(false);
  };

  const handleTakeRequest = (request) => {
    navigation.navigate('TaskMap', {
      requestData: request,
      mode: 'helper'
    });
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

  const getUrgencyEmoji = (urgency) => {
    switch (urgency) {
      case 'urgent': return '😰';
      case 'normal': return '🙂';
      case 'santai': return '😊';
      default: return '🙂';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Jelajahi Request</Text>
        <Text style={styles.headerSubtitle}>Cari kesempatan membantu orang lain</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Icon name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari request..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Filters */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterButton,
              selectedFilter === filter.id && styles.filterButtonActive
            ]}
            onPress={() => setSelectedFilter(filter.id)}
          >
            <Icon 
              name={filter.icon} 
              size={18} 
              color={selectedFilter === filter.id ? '#FFF' : '#666'} 
            />
            <Text style={[
              styles.filterText,
              selectedFilter === filter.id && styles.filterTextActive
            ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Request List */}
      <ScrollView
        style={styles.requestsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredRequests.map((request) => (
          <TouchableOpacity
            key={request.id}
            style={styles.requestCard}
            onPress={() => handleTakeRequest(request)}
          >
            <View style={styles.requestHeader}>
              <View style={styles.requestInfo}>
                <Text style={styles.requestTitle}>{request.title}</Text>
                <Text style={styles.requestLocation}>📍 {request.location}</Text>
              </View>
              <View style={styles.requestMeta}>
                <Text style={styles.requestPrice}>{formatPrice(request.price)}</Text>
                <View style={[styles.urgencyBadge, { backgroundColor: getUrgencyColor(request.urgency) }]}>
                  <Text style={styles.urgencyText}>
                    {getUrgencyEmoji(request.urgency)} {request.urgency}
                  </Text>
                </View>
              </View>
            </View>

            <Text style={styles.requestDescription} numberOfLines={2}>
              {request.description}
            </Text>

            <View style={styles.requestFooter}>
              <View style={styles.requestDetails}>
                <Text style={styles.requestDetail}>
                  👥 {request.peopleNeeded} orang • 📏 {request.distance}
                </Text>
                <Text style={styles.requestTime}>{request.timePosted}</Text>
              </View>
              
              <View style={styles.requesterInfo}>
                <Text style={styles.requesterName}>{request.requesterName}</Text>
                <Text style={styles.requesterRating}>⭐ {request.requesterRating}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.takeButton}>
              <Text style={styles.takeButtonText}>Ambil Request</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        {filteredRequests.length === 0 && (
          <View style={styles.emptyState}>
            <Icon name="search-off" size={60} color="#CCC" />
            <Text style={styles.emptyTitle}>Tidak ada request ditemukan</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery ? 'Coba kata kunci lain' : 'Belum ada request yang tersedia'}
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
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  filtersContainer: {
    paddingLeft: 20,
    marginBottom: 15,
  },
  filtersContent: {
    paddingRight: 20,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  filterButtonActive: {
    backgroundColor: '#FF69B4',
  },
  filterText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  filterTextActive: {
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  requestLocation: {
    fontSize: 12,
    color: '#666',
  },
  requestMeta: {
    alignItems: 'flex-end',
  },
  requestPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF69B4',
    marginBottom: 5,
  },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  urgencyText: {
    fontSize: 10,
    color: '#FFF',
    fontWeight: '600',
  },
  requestDescription: {
    fontSize: 14,
    color: '#555',
    lineHeight: 18,
    marginBottom: 12,
  },
  requestFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  requestDetails: {
    flex: 1,
  },
  requestDetail: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  requestTime: {
    fontSize: 11,
    color: '#999',
  },
  requesterInfo: {
    alignItems: 'flex-end',
  },
  requesterName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  requesterRating: {
    fontSize: 11,
    color: '#666',
  },
  takeButton: {
    backgroundColor: '#FF69B4',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  takeButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
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
  },
});

export default ExploreScreen;