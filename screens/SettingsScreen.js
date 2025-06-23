import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setGeminiApiKey, getGeminiApiKey } from '../api/GeminiPricing';

const SettingsScreen = ({ navigation }) => {
  const [settings, setSettings] = useState({
    notifications: true,
    pushNotifications: true,
    emailNotifications: false,
    darkMode: false,
    soundEnabled: true,
    vibrationEnabled: true,
    autoAcceptRequests: false,
    showOnlineStatus: true,
  });
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  useEffect(() => {
    loadSettings();
    loadApiKey();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('appSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.log('Failed to load settings:', error);
    }
  };

  const loadApiKey = async () => {
    try {
      const savedApiKey = await getGeminiApiKey();
      if (savedApiKey) {
        setApiKey(savedApiKey);
      }
    } catch (error) {
      console.log('Failed to load API key:', error);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      await AsyncStorage.setItem('appSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.log('Failed to save settings:', error);
    }
  };

  const toggleSetting = (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    saveSettings(newSettings);
  };

  const handleSaveApiKey = async () => {
    try {
      await setGeminiApiKey(apiKey);
      setShowApiKeyInput(false);
      Alert.alert('Berhasil', 'API Key Gemini berhasil disimpan');
    } catch (error) {
      Alert.alert('Error', 'Gagal menyimpan API Key');
    }
  };

  const clearData = () => {
    Alert.alert(
      'Hapus Data',
      'Apakah Anda yakin ingin menghapus semua data aplikasi? Tindakan ini tidak dapat dibatalkan.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert('Berhasil', 'Semua data telah dihapus');
              navigation.reset({
                index: 0,
                routes: [{ name: 'Auth' }],
              });
            } catch (error) {
              Alert.alert('Error', 'Gagal menghapus data');
            }
          },
        },
      ]
    );
  };

  const settingSections = [
    {
      title: 'Notifikasi',
      items: [
        {
          key: 'notifications',
          title: 'Notifikasi',
          subtitle: 'Terima notifikasi dari aplikasi',
          type: 'switch',
        },
        {
          key: 'pushNotifications',
          title: 'Push Notifications',
          subtitle: 'Notifikasi langsung ke perangkat',
          type: 'switch',
        },
        {
          key: 'emailNotifications',
          title: 'Email Notifications',
          subtitle: 'Terima notifikasi via email',
          type: 'switch',
        },
      ],
    },
    {
      title: 'Tampilan & Suara',
      items: [
        {
          key: 'darkMode',
          title: 'Mode Gelap',
          subtitle: 'Menggunakan tema gelap',
          type: 'switch',
        },
        {
          key: 'soundEnabled',
          title: 'Suara',
          subtitle: 'Efek suara aplikasi',
          type: 'switch',
        },
        {
          key: 'vibrationEnabled',
          title: 'Getaran',
          subtitle: 'Feedback getaran',
          type: 'switch',
        },
      ],
    },
    {
      title: 'Preferensi Helper',
      items: [
        {
          key: 'autoAcceptRequests',
          title: 'Auto Accept',
          subtitle: 'Otomatis terima request yang sesuai',
          type: 'switch',
        },
        {
          key: 'showOnlineStatus',
          title: 'Status Online',
          subtitle: 'Tampilkan status online ke pengguna lain',
          type: 'switch',
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pengaturan</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* API Key Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Integrasi AI</Text>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setShowApiKeyInput(!showApiKeyInput)}
          >
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Gemini API Key</Text>
              <Text style={styles.settingSubtitle}>
                {apiKey ? 'API Key tersimpan' : 'Belum diatur'}
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color="#CCC" />
          </TouchableOpacity>
          
          {showApiKeyInput && (
            <View style={styles.apiKeyInput}>
              <TextInput
                style={styles.textInput}
                placeholder="Masukkan Gemini API Key"
                value={apiKey}
                onChangeText={setApiKey}
                secureTextEntry
              />
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveApiKey}>
                <Text style={styles.saveButtonText}>Simpan</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Settings Sections */}
        {settingSections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items.map((item) => (
              <View key={item.key} style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>{item.title}</Text>
                  <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                </View>
                {item.type === 'switch' && (
                  <Switch
                    value={settings[item.key]}
                    onValueChange={() => toggleSetting(item.key)}
                    thumbColor={settings[item.key] ? '#FF69B4' : '#CCC'}
                    trackColor={{ false: '#E1E1E1', true: '#FFB6C1' }}
                  />
                )}
              </View>
            ))}
          </View>
        ))}

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Zona Berbahaya</Text>
          <TouchableOpacity style={styles.dangerItem} onPress={clearData}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: '#FF6B6B' }]}>
                Hapus Semua Data
              </Text>
              <Text style={styles.settingSubtitle}>
                Menghapus akun, riwayat, dan semua data
              </Text>
            </View>
            <Icon name="warning" size={24} color="#FF6B6B" />
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>Jasa Dadakan</Text>
          <Text style={styles.aboutVersion}>Versi 1.0.0</Text>
          <Text style={styles.aboutDescription}>
            Platform P2P untuk bantuan mikro-task sehari-hari
          </Text>
        </View>
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
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    marginLeft: 5,
  },
  settingItem: {
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
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  apiKeyInput: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: '#FF69B4',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dangerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#FFE1E1',
  },
  aboutSection: {
    alignItems: 'center',
    paddingVertical: 30,
    marginBottom: 20,
  },
  aboutTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  aboutVersion: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  aboutDescription: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default SettingsScreen;