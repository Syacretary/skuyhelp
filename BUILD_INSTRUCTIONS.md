# Jasa Dadakan - Build Instructions

## One-Click Download & Build Process

### Step 1: Download Project
1. Download entire `/app` folder as ZIP
2. Extract to local directory (e.g., `C:\JasaDadakan\`)

### Step 2: Install Dependencies
```bash
cd JasaDadakan
npm install
```

### Step 3: Development Testing
```bash
# Start development server
npm start

# Test on Android emulator
npm run android

# Test on physical device
# Scan QR code with Expo Go app
```

### Step 4: Build APK (Production)

#### Option A: EAS Build (Recommended)
```bash
# Install EAS CLI globally
npm install -g @expo/eas-cli

# Login to Expo account (create free account if needed)
eas login

# Build APK
eas build --platform android --profile preview

# Download APK from build URL
```

#### Option B: Local Build with Android Studio
```bash
# Generate Android project
expo eject

# Open in Android Studio
# Build → Generate Signed Bundle/APK
```

### Step 5: Install on Device
1. Enable "Unknown Sources" on Android device
2. Transfer APK file to device
3. Install APK
4. Grant location and storage permissions

## Pre-configured Features

- Authentication system with local storage
- AI pricing with Gemini integration (optional)
- Real-time maps and location tracking
- Chat system between users
- Request management and matching
- Profile and settings management

## Required API Keys (Optional)

### Google Maps API (for maps functionality)
1. Get key from Google Cloud Console
2. Add to `app.json` under android.config.googleMaps.apiKey

### Gemini AI API (for pricing automation)
1. Get key from Google AI Studio
2. Enter in app: Profile → Settings → Gemini API Key

## No Additional Configuration Needed

- All dependencies included
- Local storage for data persistence
- Fallback pricing logic included
- Mock data for development testing
- Production-ready build configuration

## File Structure
```
app/
├── screens/              # All app screens
├── navigation/           # Navigation setup
├── api/                  # API integrations
├── package.json          # Dependencies
├── app.json             # App configuration
├── eas.json             # Build configuration
└── README.md            # Complete documentation
```

## Troubleshooting

**Build fails**: Ensure Node.js 18+ and latest Expo CLI
**Maps not working**: Add Google Maps API key
**Location not working**: Grant permissions in device settings
**AI pricing not working**: Enter Gemini API key or use fallback pricing

## Support
All code is production-ready and well-documented. No external services required for basic functionality.