# BarangayCare Mobile App

Mobile healthcare application for barangay communities built with Flutter and Firebase.

## 🚀 Tech Stack

- **Framework**: Flutter
- **State Management**: Provider
- **Authentication**: Firebase Authentication
- **Backend API**: Hono.js (see backend folder)
- **HTTP Client**: http package

## 📋 Prerequisites

- Flutter SDK (3.0.0 or higher)
- Dart SDK
- Android Studio / Xcode (for mobile development)
- Firebase project configured

## 🛠️ Setup Instructions

### 1. Install Flutter

Follow the official Flutter installation guide:
- [Flutter Installation](https://docs.flutter.dev/get-started/install)

Verify installation:
```bash
flutter doctor
```

### 2. Install Dependencies

Navigate to the frontend directory and install packages:

```bash
cd frontend
flutter pub get
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

The `.env` file is already configured for development, but you may need to update:
- `FIREBASE_APP_ID`: Get this from Firebase Console

### 4. Firebase Configuration

#### For Android:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `barangaycare-uphsl`
3. Add Android app
4. Download `google-services.json`
5. Place it in `android/app/` directory

#### For iOS:
1. In Firebase Console, add iOS app
2. Download `GoogleService-Info.plist`
3. Place it in `ios/Runner/` directory

#### For Web:
The configuration is handled via `.env` file and `firebase_config.dart`.

### 5. Run the App

```bash
# Check connected devices
flutter devices

# Run on connected device/emulator
flutter run

# Run on specific platform
flutter run -d chrome      # Web
flutter run -d android     # Android
flutter run -d ios         # iOS
```

## 📁 Project Structure

```
frontend/
├── lib/
│   ├── config/
│   │   ├── firebase_config.dart    # Firebase initialization
│   │   └── api_config.dart         # API endpoint configuration
│   ├── providers/
│   │   └── auth_provider.dart      # Authentication state management
│   ├── services/
│   │   └── api_service.dart        # HTTP API service
│   ├── screens/
│   │   ├── splash_screen.dart      # Initial loading screen
│   │   ├── auth/
│   │   │   ├── login_screen.dart   # Login UI
│   │   │   └── register_screen.dart # Registration UI
│   │   └── home/
│   │       └── home_screen.dart    # Main dashboard
│   └── main.dart                   # App entry point
├── assets/
│   ├── images/                     # Image assets
│   └── icons/                      # Icon assets
├── .env                            # Environment variables (not committed)
├── .env.example                    # Environment template
├── .gitignore
├── pubspec.yaml                    # Dependencies
└── README.md
```

## 🔑 Features

### Current Features
- **Firebase Authentication**: Email/password login and registration
- **Patient Registration**: Create patient profile after signup
- **Home Dashboard**: Feature navigation cards

### Upcoming Features (To be implemented)
- Doctor Schedule Viewing
- Appointment Booking with Pre-screening
- Medicine Request from Inventory
- Appointment History
- Profile Management

## 🎯 Core Functionality

### Authentication Flow
1. User signs up with email/password (Firebase)
2. User profile registered in backend MongoDB
3. Firebase token used for subsequent API calls
4. Auto-login on app restart if session active

### State Management
- Provider pattern for state management
- `AuthProvider`: Manages authentication state
- Real-time Firebase auth state listening

### API Integration
- All API calls require Firebase authentication token
- Token automatically attached to requests via `ApiService`
- Endpoints configured in `api_config.dart`

## 🧪 Testing

```bash
# Run all tests
flutter test

# Run specific test file
flutter test test/widget_test.dart
```

## 🔒 Security Notes

- `.env` file contains sensitive configuration and is gitignored
- Firebase credentials should never be committed
- API tokens are managed securely via Firebase
- All backend API calls require authentication

## 📱 Platform Support

- ✅ Android
- ✅ iOS  
- ✅ Web
- ⚠️ Desktop (not configured yet)

## 🐛 Troubleshooting

### Firebase Not Initialized
- Ensure `.env` file exists with correct values
- Check `google-services.json` (Android) or `GoogleService-Info.plist` (iOS) is in correct location

### API Connection Failed
- Verify backend is running on `http://localhost:3000`
- Check `API_BASE_URL` in `.env` file
- For Android emulator, use `10.0.2.2` instead of `localhost`
- For iOS simulator, use `localhost` or your machine's IP

### Dependencies Issues
```bash
flutter clean
flutter pub get
```

### Build Errors
```bash
# Android
cd android && ./gradlew clean && cd ..
flutter build apk

# iOS
cd ios && pod install && cd ..
flutter build ios
```

## 📚 Documentation

- [Flutter Documentation](https://docs.flutter.dev/)
- [Firebase for Flutter](https://firebase.flutter.dev/)
- [Provider Package](https://pub.dev/packages/provider)

## 🔄 Development Workflow

1. Make changes to code
2. Hot reload: Press `r` in terminal or save file
3. Hot restart: Press `R` in terminal
4. Test on multiple devices/emulators

## 📝 Notes

- Default API endpoint: `http://localhost:3000/api`
- Firebase project: `barangaycare-uphsl`
- Package manager: Pub
- Minimum Android API: 21 (Android 5.0)
- Minimum iOS version: 12.0

