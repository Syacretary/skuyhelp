import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthScreen = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    phone: '',
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.username || !formData.password) {
      Alert.alert('Error', 'Username dan password wajib diisi');
      return false;
    }
    if (!isLogin && (!formData.name || !formData.phone)) {
      Alert.alert('Error', 'Semua field wajib diisi untuk registrasi');
      return false;
    }
    return true;
  };

  const handleAuth = async () => {
    if (!validateForm()) return;

    try {
      if (isLogin) {
        // Login logic
        const users = await AsyncStorage.getItem('registeredUsers');
        const userList = users ? JSON.parse(users) : [];
        
        const user = userList.find(u => 
          u.username === formData.username && u.password === formData.password
        );

        if (user) {
          const loginData = {
            id: user.id,
            username: user.username,
            name: user.name,
            phone: user.phone,
            token: `token_${user.id}_${Date.now()}`,
          };
          onLogin(loginData);
        } else {
          Alert.alert('Error', 'Username atau password salah');
        }
      } else {
        // Register logic
        const users = await AsyncStorage.getItem('registeredUsers');
        const userList = users ? JSON.parse(users) : [];
        
        // Check if username exists
        if (userList.some(u => u.username === formData.username)) {
          Alert.alert('Error', 'Username sudah terdaftar');
          return;
        }

        const newUser = {
          id: Date.now(),
          username: formData.username,
          password: formData.password,
          name: formData.name,
          phone: formData.phone,
          createdAt: new Date().toISOString(),
        };

        userList.push(newUser);
        await AsyncStorage.setItem('registeredUsers', JSON.stringify(userList));

        Alert.alert('Sukses', 'Registrasi berhasil! Silakan login.', [
          { text: 'OK', onPress: () => setIsLogin(true) }
        ]);
      }
    } catch (error) {
      Alert.alert('Error', 'Terjadi kesalahan, coba lagi');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>ðŸ’–</Text>
          </View>
          <Text style={styles.appName}>Jasa Dadakan</Text>
          <Text style={styles.tagline}>Platform bantuan terpercaya</Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={formData.username}
            onChangeText={(text) => handleInputChange('username', text)}
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={formData.password}
            onChangeText={(text) => handleInputChange('password', text)}
            secureTextEntry
          />

          {!isLogin && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Nama Lengkap"
                value={formData.name}
                onChangeText={(text) => handleInputChange('name', text)}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Nomor WhatsApp"
                value={formData.phone}
                onChangeText={(text) => handleInputChange('phone', text)}
                keyboardType="phone-pad"
              />
            </>
          )}

          <TouchableOpacity style={styles.primaryButton} onPress={handleAuth}>
            <Text style={styles.primaryButtonText}>
              {isLogin ? 'Masuk' : 'Daftar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton} 
            onPress={() => setIsLogin(!isLogin)}
          >
            <Text style={styles.secondaryButtonText}>
              {isLogin ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF0F5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF69B4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: 40,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF1493',
    marginBottom: 5,
  },
  tagline: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#FFB6C1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: '#FF69B4',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#FF1493',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AuthScreen;
