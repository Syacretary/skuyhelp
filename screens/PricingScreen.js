import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { generatePriceRecommendation } from '../api/GeminiPricing';

const PricingScreen = ({ navigation, route }) => {
  const { requestData } = route.params;
  const [currentPrice, setCurrentPrice] = useState(22000);
  const [recommendedPrice, setRecommendedPrice] = useState(22000);
  const [priceBreakdown, setPriceBreakdown] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    generatePricing();
  }, []);

  const generatePricing = async () => {
    try {
      setIsLoading(true);
      const pricing = await generatePriceRecommendation(requestData);
      setRecommendedPrice(pricing.totalPrice);
      setCurrentPrice(pricing.totalPrice);
      setPriceBreakdown(pricing.breakdown);
    } catch (error) {
      console.log('Pricing generation failed:', error);
      // Fallback pricing logic
      const fallbackPrice = calculateFallbackPrice();
      setRecommendedPrice(fallbackPrice);
      setCurrentPrice(fallbackPrice);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateFallbackPrice = () => {
    let basePrice = 15000;
    let servicePrice = 7000;

    // Adjust based on urgency
    if (requestData.urgency === 'urgent') {
      servicePrice *= 1.5;
    } else if (requestData.urgency === 'santai') {
      servicePrice *= 0.8;
    }

    // Adjust for multiple people
    if (requestData.peopleNeeded > 1) {
      servicePrice *= requestData.peopleNeeded;
    }

    // Adjust based on description complexity
    if (requestData.description?.length > 100) {
      servicePrice *= 1.2;
    }

    return Math.round(basePrice + servicePrice);
  };

  const formatPrice = (price) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  const adjustPrice = (delta) => {
    setCurrentPrice(prev => Math.max(1000, prev + delta));
  };

  const handleFindHelper = async () => {
    setIsSearching(true);
    
    // Simulate finding helpers
    setTimeout(() => {
      setIsSearching(false);
      navigation.navigate('TaskMap', { 
        requestData: { ...requestData, finalPrice: currentPrice },
        mode: 'requester'
      });
    }, 3000);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF69B4" />
        <Text style={styles.loadingText}>AI sedang menghitung harga terbaik...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.headerTitleText}>Penawaran Harga</Text>
          <Text style={styles.headerSubtitle}>AI merekomendasikan harga terbaik</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {/* Request Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Request kamu:</Text>
          <Text style={styles.summaryTitle}>{requestData.title}</Text>
          <Text style={styles.summaryDescription}>{requestData.description}</Text>
          <View style={styles.summaryDetails}>
            <Text style={styles.summaryDetail}>
              👥 {requestData.peopleNeeded} orang • {requestData.urgency}
            </Text>
          </View>
        </View>

        {/* Price Adjustment */}
        <View style={styles.pricingSection}>
          <Text style={styles.pricingLabel}>Harga rekomendasi AI:</Text>
          <View style={styles.priceContainer}>
            <TouchableOpacity
              style={styles.priceButton}
              onPress={() => adjustPrice(-1000)}
            >
              <Icon name="remove" size={24} color="#FF6B6B" />
            </TouchableOpacity>
            
            <View style={styles.priceDisplay}>
              <Text style={styles.priceText}>{formatPrice(currentPrice)}</Text>
            </View>
            
            <TouchableOpacity
              style={styles.priceButton}
              onPress={() => adjustPrice(1000)}
            >
              <Icon name="add" size={24} color="#4CAF50" />
            </TouchableOpacity>
          </View>
          <Text style={styles.priceNote}>Tekan - atau + untuk menyesuaikan (Rp1.000)</Text>
        </View>

        {/* Price Breakdown */}
        {priceBreakdown && (
          <View style={styles.breakdownCard}>
            <Text style={styles.breakdownTitle}>Rincian Harga:</Text>
            {priceBreakdown.items?.map((item, index) => (
              <View key={index} style={styles.breakdownRow}>
                <Text style={styles.breakdownItem}>{item.name}</Text>
                <Text style={styles.breakdownAmount}>{formatPrice(item.amount)}</Text>
              </View>
            ))}
            <View style={[styles.breakdownRow, styles.breakdownTotal]}>
              <Text style={styles.breakdownTotalText}>Total</Text>
              <Text style={styles.breakdownTotalAmount}>{formatPrice(currentPrice)}</Text>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.findButton}
            onPress={handleFindHelper}
            disabled={isSearching}
          >
            {isSearching ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Icon name="search" size={24} color="#FFF" />
            )}
            <Text style={styles.findButtonText}>
              {isSearching ? 'Mencari...' : 'Cari Orang Baik'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.laterButton}
            onPress={() => navigation.navigate('HomeMain')}
          >
            <Text style={styles.laterButtonText}>Nanti Aja</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Searching Modal */}
      {isSearching && (
        <View style={styles.searchingOverlay}>
          <View style={styles.searchingModal}>
            <View style={styles.searchingIcon}>
              <Icon name="search" size={40} color="#FF69B4" />
            </View>
            <Text style={styles.searchingTitle}>Mencari Orang Baik...</Text>
            <Text style={styles.searchingText}>
              Tunggu sebentar ya, kami sedang carikan helper terbaik untuk kamu!
            </Text>
            <ActivityIndicator size="large" color="#FF69B4" style={{ marginTop: 20 }} />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#FF69B4',
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#FF69B4',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTitle: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitleText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    marginTop: 2,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  summaryCard: {
    backgroundColor: '#FFE4E1',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  summaryDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  summaryDetails: {
    flexDirection: 'row',
  },
  summaryDetail: {
    fontSize: 12,
    color: '#666',
  },
  pricingSection: {
    alignItems: 'center',
    marginBottom: 25,
  },
  pricingLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 10,
  },
  priceButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  priceDisplay: {
    backgroundColor: '#FF69B4',
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 20,
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  priceText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  priceNote: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  breakdownCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 25,
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  breakdownItem: {
    fontSize: 14,
    color: '#666',
  },
  breakdownAmount: {
    fontSize: 14,
    color: '#333',
  },
  breakdownTotal: {
    borderTopWidth: 1,
    borderTopColor: '#E1E1E1',
    marginTop: 10,
    paddingTop: 10,
  },
  breakdownTotalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  breakdownTotalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF69B4',
  },
  actionContainer: {
    gap: 15,
  },
  findButton: {
    backgroundColor: '#FF69B4',
    borderRadius: 25,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  findButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  laterButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
  },
  laterButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  searchingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchingModal: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginHorizontal: 40,
  },
  searchingIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF0F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  searchingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  searchingText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default PricingScreen;