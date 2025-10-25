# BarangayCare Development Setup Guide

## Prerequisites
- Node.js (v18+)
- Flutter SDK (latest stable)
- MongoDB Atlas account or local MongoDB
- Firebase account
- Xcode (for iOS development)
- Android Studio (for Android development)

## 🔥 Firebase Setup

### 1. Create Firebase Project
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Create new project or use existing one
firebase projects:create your-barangaycare-project --display-name="BarangayCare"
```

### 2. Configure Flutter App
```bash
cd BarangayCare/frontend

# Install FlutterFire CLI
dart pub global activate flutterfire_cli

# Configure Firebase for Flutter
flutterfire configure --project=your-barangaycare-project
```

### 3. Enable Firebase Authentication
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Authentication > Sign-in method**
4. Enable **Email/Password** provider

## 📱 Frontend Setup

### 1. Install Dependencies
```bash
cd BarangayCare/frontend
flutter pub get
```

### 2. Configuration
```bash
# Copy example config and update with your Firebase project details
cp lib/config/app_config.example.dart lib/config/app_config.dart

# Edit lib/config/app_config.dart with your Firebase keys
```

### 3. Run the App
```bash
# For iOS
flutter run

# For Android  
flutter run

# For specific device
flutter run -d "device-id"
```

## 🚀 Backend Setup

### 1. Install Dependencies
```bash
cd BarangayCare/backend
npm install
```

### 2. Environment Configuration
```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your settings
```

### 3. Firebase Service Account
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Project Settings > Service Accounts  
3. Click "Generate new private key"
4. Save as `firebase-service-account.json` in backend root
5. **Never commit this file** (it's gitignored)

### 4. Run the Backend
```bash
# Development with auto-restart
npm run dev

# Production
npm start
```

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)
1. Create [MongoDB Atlas](https://cloud.mongodb.com) account
2. Create new cluster
3. Get connection string
4. Add to `.env` file

## 🔧 Common Issues

### iOS Build Issues
```bash
cd ios
pod install  
cd ..
flutter clean
flutter run
```

### Firebase Authentication Issues
1. Ensure Firebase project IDs match between frontend and backend
2. Check that Authentication is enabled in Firebase Console
3. Verify service account file exists in backend

## 📞 Support

If you encounter issues:
1. Check this setup guide
2. Review error logs  
3. Ensure all prerequisites are installed
4. Create an issue in the repository

---

**⚠️ IMPORTANT**: Never commit sensitive files:
- `lib/config/app_config.dart` (contains Firebase keys)
- `firebase-service-account.json` (contains private keys)
- `.env` files (contains database credentials)
