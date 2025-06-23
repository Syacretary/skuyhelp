import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  Linking,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Location from 'expo-location';
import Modal from 'react-native-modal';

const { width, height } = Dimensions.get('window');

const TaskMapScreen = ({ navigation, route }) => {
  const { requestData, mode = 'requester' } = route.params;
  const [location, setLocation] = useState(null);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [taskStatus, setTaskStatus] = useState('searching'); // searching, matched, in_progress, completed
  const [helper, setHelper] = useState(null);

  useEffect(() => {
    getLocation();
    simulateMatching();
  }, []);

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Izin lokasi diperlukan untuk menggunakan fitur ini');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } catch (error) {
      Alert.alert('Error', 'Gagal mendapatkan lokasi');
    }
  };

  const simulateMatching = () => {
    setTimeout(() => {
      setHelper({
        id: 1,
        name: 'Ahmad Baik',
        rating: 4.8,
        avatar: '👨',
        phone: '+6281234567890',
        distance: '0.8 km',
      });
      setTaskStatus('matched');
      setShowBottomSheet(true);
    }, 3000);
  };

  const handleCall = () => {
    if (helper?.phone) {
      Linking.openURL(`tel:${helper.phone}`);
    }
  };

  const handleChat = () => {
    navigation.navigate('Chat', { 
      recipientId: helper.id,
      recipientName: helper.name,
      taskId: requestData.id 
    });
  };

  const handleStartTask = () => {
    setTaskStatus('in_progress');
    Alert.alert('Task Dimulai', 'Helper sedang dalam perjalanan menuju lokasi');
  };

  const handleCompleteTask = () => {
    setTaskStatus('completed');
    Alert.alert('Task Selesai', 'Terima kasih! Jangan lupa beri rating untuk helper');
  };

  const handleReport = () => {
    Alert.alert(
      'Laporkan Masalah',
      'Pilih jenis laporan:',
      [
        { text: 'Helper tidak datang', onPress: () => console.log('Report: No show') },
        { text: 'Hasil tidak sesuai', onPress: () => console.log('Report: Poor quality') },
        { text: 'Masalah pembayaran', onPress: () => console.log('Report: Payment issue') },
        { text: 'Lainnya', onPress: () => console.log('Report: Other') },
        { text: 'Batal', style: 'cancel' },
      ]
    );
  };

  const renderBottomSheet = () => {
    if (!showBottomSheet) return null;

    return (
      <Modal
        isVisible={showBottomSheet}
        onBackdropPress={() => setShowBottomSheet(false)}
        style={styles.modal}
        swipeDirection={['down']}
        onSwipeComplete={() => setShowBottomSheet(false)}
      >
        <View style={styles.bottomSheet}>
          <View style={styles.handle} />
          
          {taskStatus === 'matched' && (
            <View style={styles.sheetContent}>
              <Text style={styles.sheetTitle}>Helper Ditemukan! 🎉</Text>
              
              <View style={styles.helperCard}>
                <Text style={styles.helperAvatar}>{helper.avatar}</Text>
                <View style={styles.helperInfo}>
                  <Text style={styles.helperName}>{helper.name}</Text>
                  <Text style={styles.helperRating}>⭐ {helper.rating} • {helper.distance}</Text>
                </View>
              </View>

              <View style={styles.taskDetails}>
                <Text style={styles.taskTitle}>{requestData.title}</Text>
                <Text style={styles.taskPrice}>Harga: Rp {requestData.finalPrice?.toLocaleString('id-ID')}</Text>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.callButton} onPress={handleCall}>
                  <Icon name="phone" size={20} color="#FFF" />
                  <Text style={styles.buttonText}>Telepon</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.chatButton} onPress={handleChat}>
                  <Icon name="chat" size={20} color="#FFF" />
                  <Text style={styles.buttonText}>Chat</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.startButton} onPress={handleStartTask}>
                <Text style={styles.startButtonText}>Mulai Task</Text>
              </TouchableOpacity>
            </View>
          )}

          {taskStatus === 'in_progress' && (
            <View style={styles.sheetContent}>
              <Text style={styles.sheetTitle}>Task Sedang Berlangsung</Text>
              
              <View style={styles.progressCard}>
                <Icon name="access-time" size={24} color="#FF69B4" />
                <Text style={styles.progressText}>Helper sedang mengerjakan task</Text>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.chatButton} onPress={handleChat}>
                  <Icon name="chat" size={20} color="#FFF" />
                  <Text style={styles.buttonText}>Chat</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.reportButton} onPress={handleReport}>
                  <Icon name="report" size={20} color="#FFF" />
                  <Text style={styles.buttonText}>Lapor</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.completeButton} onPress={handleCompleteTask}>
                <Text style={styles.completeButtonText}>Tandai Selesai</Text>
              </TouchableOpacity>
            </View>
          )}

          {taskStatus === 'completed' && (
            <View style={styles.sheetContent}>
              <Text style={styles.sheetTitle}>Task Selesai! ✅</Text>
              
              <View style={styles.completedCard}>
                <Text style={styles.completedText}>
                  Task telah diselesaikan. Terima kasih telah menggunakan Jasa Dadakan!
                </Text>
              </View>

              <TouchableOpacity 
                style={styles.ratingButton}
                onPress={() => navigation.navigate('HomeMain')}
              >
                <Text style={styles.ratingButtonText}>Beri Rating & Kembali</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    );
  };

  if (!location) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Mendapatkan lokasi...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={location}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        <Marker
          coordinate={location}
          title="Lokasi Anda"
          description="Posisi saat ini"
        />
        
        {helper && (
          <Marker
            coordinate={{
              latitude: location.latitude + 0.002,
              longitude: location.longitude + 0.002,
            }}
            title={helper.name}
            description="Helper"
            pinColor="#FF69B4"
          />
        )}
      </MapView>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>
            {taskStatus === 'searching' && 'Mencari Helper...'}
            {taskStatus === 'matched' && 'Helper Ditemukan'}
            {taskStatus === 'in_progress' && 'Task Berlangsung'}
            {taskStatus === 'completed' && 'Task Selesai'}
          </Text>
        </View>
      </View>

      {/* Bottom Sheet Toggle */}
      {taskStatus !== 'searching' && (
        <TouchableOpacity
          style={styles.sheetToggle}
          onPress={() => setShowBottomSheet(true)}
        >
          <Icon name="keyboard-arrow-up" size={24} color="#FFF" />
          <Text style={styles.sheetToggleText}>Detail Task</Text>
        </TouchableOpacity>
      )}

      {renderBottomSheet()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  backButton: {
    marginRight: 15,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  sheetToggle: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
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
  sheetToggleText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  bottomSheet: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 15,
    maxHeight: height * 0.7,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#DDD',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  sheetContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  helperCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  helperAvatar: {
    fontSize: 40,
    marginRight: 15,
  },
  helperInfo: {
    flex: 1,
  },
  helperName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  helperRating: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  taskDetails: {
    backgroundColor: '#FFF0F5',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  taskPrice: {
    fontSize: 14,
    color: '#FF69B4',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  callButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  chatButton: {
    flex: 1,
    backgroundColor: '#2196F3',
    borderRadius: 15,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  reportButton: {
    flex: 1,
    backgroundColor: '#FF9800',
    borderRadius: 15,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  startButton: {
    backgroundColor: '#FF69B4',
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F5',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    gap: 10,
  },
  progressText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  completedCard: {
    backgroundColor: '#E8F5E8',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  completedText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 22,
  },
  ratingButton: {
    backgroundColor: '#FF69B4',
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: 'center',
  },
  ratingButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TaskMapScreen;