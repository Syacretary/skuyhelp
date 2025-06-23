# Jasa Dadakan - P2P Micro-Task Platform

Platform P2P untuk pekerjaan kecil/harian tanpa perantara dengan AI pricing dan sistem matching real-time.

## Features Lengkap

### 🔐 Authentication System
- Registrasi dan login pengguna
- Penyimpanan data lokal dengan AsyncStorage
- Manajemen session otomatis

### 🏠 Home & Navigation
- Dashboard dengan kategori jasa populer
- "Lagi Butuh Nih" untuk request custom
- Rekomendasi berdasarkan aktivitas
- Bottom navigation mobile-optimized

### 📝 Request Management
- Form request dengan tingkat urgency
- Pilihan jumlah helper yang dibutuhkan
- AI pricing dengan Gemini integration
- Sistem penawaran harga fleksibel (±Rp1.000)

### 🗺️ Map Integration
- Real-time location tracking
- Helper matching dengan jarak
- Progress monitoring untuk requester
- Laporan masalah untuk kedua pihak

### 💬 Chat System
- Real-time messaging antar pengguna
- Chat khusus per task
- Status online/offline
- Riwayat chat tersimpan

### 🔍 Explore & Discovery
- Pencarian request aktif
- Filter berdasarkan urgency, jarak, bayaran
- Rating dan review system
- Helper dapat mengambil request

### ⚙️ Settings & Profile
- Manajemen profil pengguna
- Pengaturan notifikasi dan tema
- Integrasi Gemini API Key
- Statistik dan riwayat aktivitas

## Tech Stack

- **Framework**: React Native + Expo
- **Navigation**: React Navigation v6
- **State Management**: AsyncStorage
- **Maps**: React Native Maps
- **Icons**: MaterialIcons
- **AI Pricing**: Google Gemini API
- **Location**: Expo Location

## Installation & Setup

### Prerequisites
- Node.js 18+
- Expo CLI
- Android Studio (untuk build APK)
- Gemini API Key (opsional, ada fallback)

### Quick Start

1. **Install Dependencies**
```bash
cd app
npm install
```

2. **Start Development Server**
```bash
npm start
# atau
expo start
```

3. **Run on Android**
```bash
npm run android
# atau
expo start --android
```

### Build APK

1. **Using EAS Build (Recommended)**
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Login to Expo
eas login

# Build APK
eas build --platform android --profile preview
```

2. **Local Build**
```bash
# Build untuk production
expo build:android
```

## Configuration

### Gemini API Integration
1. Dapatkan API key dari [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Buka app → Profile → Settings → Gemini API Key
3. Masukkan API key untuk pricing otomatis

### Maps Setup
Untuk production, tambahkan Google Maps API key di `app.json`:
```json
{
  "expo": {
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "YOUR_GOOGLE_MAPS_API_KEY"
        }
      }
    }
  }
}
```

## App Structure

```
app/
├── screens/           # Semua layar aplikasi
│   ├── AuthScreen.js     # Login/Register
│   ├── HomeScreen.js     # Dashboard utama
│   ├── RequestFormScreen.js # Form buat request
│   ├── PricingScreen.js     # AI pricing & nego
│   ├── TaskMapScreen.js     # Map & matching
│   ├── ChatScreen.js        # Real-time chat
│   ├── ExploreScreen.js     # Cari request
│   ├── ProfileScreen.js     # Profil pengguna
│   └── SettingsScreen.js    # Pengaturan
├── navigation/        # Navigasi setup
├── api/              # API integrations
└── assets/           # Gambar, icon, font
```

## Key Features Implementation

### 1. AI Pricing System
- Integrasi dengan Gemini 2.0 Flash
- Fallback pricing logic lokal
- Faktor: urgency, complexity, people needed
- User dapat adjust ±Rp1.000

### 2. Map-based Matching
- Real-time location tracking
- Helper dapat lihat request terdekat
- Progress monitoring dengan status update
- Bottom sheet untuk detail task

### 3. Dual User Interface
- **Requester**: Buat request, monitor progress, lapor masalah
- **Helper**: Cari request, ambil task, update status
- Chat terintegrasi untuk koordinasi

### 4. Reporting System
- Laporan untuk helper tidak datang
- Laporan hasil tidak sesuai
- Laporan masalah pembayaran
- Rating dan review post-completion

## Deployment

### Play Store
1. Build signed APK dengan EAS
2. Upload ke Google Play Console
3. Isi metadata dan screenshot
4. Submit untuk review

### App Store (iOS)
1. Build dengan EAS untuk iOS
2. Upload ke App Store Connect
3. Isi metadata dan screenshot
4. Submit untuk review

## Environment Variables

App ini menggunakan local storage untuk development. Untuk production:

- `GEMINI_API_KEY`: Optional, untuk AI pricing
- `GOOGLE_MAPS_API_KEY`: Untuk maps functionality

## Known Issues & Solutions

1. **Maps tidak load**: Pastikan Google Maps API key valid
2. **AI pricing error**: Fallback ke pricing lokal otomatis
3. **Chat tidak sync**: Refresh chat list manual
4. **Location permission**: Grant permission di settings device

## Contributing

1. Fork repository
2. Create feature branch
3. Implement changes
4. Test thoroughly
5. Submit pull request

## Support

- Email: support@jasadadakan.app
- Documentation: [Wiki](https://github.com/jasadadakan/app/wiki)
- Issues: [GitHub Issues](https://github.com/jasadadakan/app/issues)

## License

MIT License - Lihat file LICENSE untuk detail lengkap.