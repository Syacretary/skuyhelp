import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RequestFormScreen = ({ navigation, route }) => {
  const { categoryId, categoryName } = route.params || {};
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    urgency: 'normal',
    peopleNeeded: 1,
    categoryId: categoryId || null,
  });

  const urgencyOptions = [
    { value: 'santai', label: 'Santai', emoji: '😊', color: '#4ECDC4' },
    { value: 'normal', label: 'Normal', emoji: '🙂', color: '#45B7D1' },
    { value: 'urgent', label: 'Urgent', emoji: '😰', color: '#FF6B6B' },
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const adjustPeopleCount = (delta) => {
    const newCount = Math.max(1, Math.min(10, formData.peopleNeeded + delta));
    handleInputChange('peopleNeeded', newCount);
  };

  const validateForm = () => {
    if (!formData.title.trim() || formData.title.length < 5) {
      Alert.alert('Error', 'Judul minimal 5 karakter');
      return false;
    }
    if (!formData.description.trim() || formData.description.length < 10) {
      Alert.alert('Error', 'Deskripsi minimal 10 karakter');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const userData = await AsyncStorage.getItem('userData');
      const user = JSON.parse(userData);

      const requestData = {
        ...formData,
        id: Date.now(),
        userId: user.id,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      // Save to local storage
      const existingRequests = await AsyncStorage.getItem('userRequests');
      const requests = existingRequests ? JSON.parse(existingRequests) : [];
      requests.push(requestData);
      await AsyncStorage.setItem('userRequests', JSON.stringify(requests));

      navigation.navigate('Pricing', { requestData });
    } catch (error) {
      Alert.alert('Error', 'Gagal membuat request');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.headerTitleText}>Buat Request Custom</Text>
          <Text style={styles.headerSubtitle}>
            {categoryName ? `Kategori: ${categoryName}` : 'Ceritakan apa yang kamu butuhkan'}
          </Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Apa yang kamu butuhkan?</Text>
          <TextInput
            style={styles.input}
            placeholder="Contoh: Belikan makan siang di warteg..."
            value={formData.title}
            onChangeText={(text) => handleInputChange('title', text)}
            maxLength={100}
          />
          <Text style={styles.charCount}>{formData.title.length}/100</Text>
        </View>

        {/* Description Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Detail lengkap</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Jelaskan lebih detail apa yang kamu butuhkan..."
            value={formData.description}
            onChangeText={(text) => handleInputChange('description', text)}
            multiline
            numberOfLines={4}
            maxLength={500}
          />
          <Text style={styles.charCount}>{formData.description.length}/500</Text>
        </View>

        {/* Urgency Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tingkat kebutuhan</Text>
          <View style={styles.urgencyContainer}>
            {urgencyOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.urgencyOption,
                  { backgroundColor: formData.urgency === option.value ? option.color : '#F5F5F5' }
                ]}
                onPress={() => handleInputChange('urgency', option.value)}
              >
                <Text style={styles.urgencyEmoji}>{option.emoji}</Text>
                <Text style={[
                  styles.urgencyLabel,
                  { color: formData.urgency === option.value ? '#FFF' : '#333' }
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* People Count */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Butuh berapa orang?</Text>
          <View style={styles.counterContainer}>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => adjustPeopleCount(-1)}
            >
              <Icon name="remove" size={24} color="#666" />
            </TouchableOpacity>
            
            <View style={styles.counterDisplay}>
              <Text style={styles.counterNumber}>{formData.peopleNeeded}</Text>
              <Text style={styles.counterLabel}>orang</Text>
            </View>
            
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => adjustPeopleCount(1)}
            >
              <Icon name="add" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Lanjut ke Penawaran Harga</Text>
        </TouchableOpacity>
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
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E1E1E1',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  urgencyContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  urgencyOption: {
    flex: 1,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  urgencyEmoji: {
    fontSize: 24,
    marginBottom: 5,
  },
  urgencyLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  counterButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E1E1E1',
  },
  counterDisplay: {
    alignItems: 'center',
    minWidth: 80,
  },
  counterNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  counterLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  submitButton: {
    backgroundColor: '#FF69B4',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RequestFormScreen;