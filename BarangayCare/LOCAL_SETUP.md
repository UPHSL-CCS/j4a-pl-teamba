# 🚀 BarangayCare Local Setup Guide

Complete step-by-step guide to run the BarangayCare system locally on your machine.

## 📋 Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Flutter SDK** (3.0+) - [Download](https://docs.flutter.dev/get-started/install)
- **MongoDB** - Either:
  - MongoDB Atlas account (cloud) - [Sign up](https://www.mongodb.com/cloud/atlas)
  - Local MongoDB installation - [Download](https://www.mongodb.com/try/download/community)
- **Firebase Account** - [Sign up](https://firebase.google.com/)
- **Git** - [Download](https://git-scm.com/)

### Verify Installations

```bash
# Check Node.js version
node --version  # Should be v18+

# Check Flutter installation
flutter doctor

# Check MongoDB (if installed locally)
mongod --version
```

---

## 🔥 Step 1: Firebase Setup

### 1.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select existing project
3. Follow the setup wizard
4. Note your **Project ID** (e.g., `barangaycare-app`)

### 1.2 Enable Authentication

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** provider
3. Click "Save"

### 1.3 Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll to "Your apps" section
3. Click on your app or add a new app
4. Copy the following values:
   - `apiKey`
   - `projectId`
   - `messagingSenderId`
   - `appId`

### 1.4 Download Firebase Admin SDK (for Backend)

1. In Firebase Console, go to **Project Settings** > **Service Accounts**
2. Click **"Generate new private key"**
3. Save the JSON file as `firebase-service-account.json`
4. **Important**: Keep this file secure and never commit it to git

---

## 🗄️ Step 2: MongoDB Setup

### Option A: MongoDB Atlas (Recommended for beginners)

1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user (username/password)
4. Whitelist your IP address (or use `0.0.0.0/0` for development)
5. Get your connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (e.g., `mongodb+srv://username:password@cluster.mongodb.net/barangaycare`)

### Option B: Local MongoDB

1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   
   # Windows
   # Start MongoDB service from Services panel
   ```
3. Connection string: `mongodb://127.0.0.1:27017/barangaycare`

---

## ⚙️ Step 3: Backend Setup

### 3.1 Navigate to Backend Directory

```bash
cd BarangayCare/backend
```

### 3.2 Install Dependencies

```bash
npm install
```

### 3.3 Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` file with your settings:
   ```bash
   # Open in your editor
   nano .env
   # or
   code .env
   ```

3. Update the following values:
   ```env
   PORT=3000
   ALLOWED_ORIGINS=http://localhost:3000,http://10.0.2.2:3000
   
   # MongoDB - Use your connection string from Step 2
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/barangaycare
   # OR for local MongoDB:
   # MONGODB_URI=mongodb://127.0.0.1:27017/barangaycare
   
   # Firebase - Use your Project ID from Step 1.1
   FIREBASE_PROJECT_ID=barangaycare-app
   
   # Google Gemini API (for chatbot feature)
   GEMINI_API_KEY=your-gemini-api-key-here
   ```

### 3.4 Add Firebase Service Account File

1. Place the `firebase-service-account.json` file (from Step 1.4) in the `backend/` directory
2. Ensure it's named exactly: `firebase-service-account.json`

### 3.5 Start Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# OR Production mode
npm start
```

**Expected output:**
```
Server running on http://localhost:3000
MongoDB connected successfully
Firebase initialized
```

### 3.6 Verify Backend is Running

Open your browser and visit: `http://localhost:3000`

You should see:
```json
{
  "message": "BarangayCare API is running",
  "version": "1.0.0",
  "timestamp": "..."
}
```

### 3.7 Seed Sample Data (Optional but Recommended)

In a new terminal, run:

```bash
cd BarangayCare/backend

# Seed medicines
npm run seed:medicines

# Seed doctors
npm run seed:doctors

# Seed FAQ (for chatbot)
npm run seed:faq

# Seed symptoms (for symptom checker)
npm run seed:symptoms

# Seed emergency contacts
npm run seed:emergency-contacts
```

---

## 📱 Step 4: Frontend Setup

### 4.1 Navigate to Frontend Directory

Open a **new terminal** (keep backend running):

```bash
cd BarangayCare/frontend
```

### 4.2 Install Flutter Dependencies

```bash
flutter pub get
```

### 4.3 Configure App Settings

1. Check if `app_config.dart` exists:
   ```bash
   ls lib/config/app_config.dart
   ```

2. If it doesn't exist, copy from example:
   ```bash
   cp lib/config/app_config.example.dart lib/config/app_config.dart
   ```

3. Edit `lib/config/app_config.dart` and update Firebase credentials:
   ```dart
   // Update these values from Step 1.3
   static const String firebaseApiKey = 'YOUR_API_KEY_HERE';
   static const String firebaseProjectId = 'barangaycare-app';
   static const String firebaseMessagingSenderId = 'YOUR_SENDER_ID';
   static const String firebaseAppId = 'YOUR_APP_ID';
   
   // API Configuration
   // For Android Emulator, use: http://10.0.2.2:3000/api
   // For iOS Simulator, use: http://localhost:3000/api
   // For physical device, use: http://YOUR_COMPUTER_IP:3000/api
   static const String apiBaseUrl = 'http://localhost:3000/api';
   ```

### 4.4 Configure Firebase for Mobile Platforms

#### For Android:

1. In Firebase Console, go to **Project Settings** > **Your apps**
2. Click on Android app or add Android app
3. Download `google-services.json`
4. Place it in: `frontend/android/app/google-services.json`

#### For iOS:

1. In Firebase Console, add iOS app (if not already added)
2. Download `GoogleService-Info.plist`
3. Place it in: `frontend/ios/Runner/GoogleService-Info.plist`

### 4.5 Run Flutter App

```bash
# Check available devices
flutter devices

# Run on connected device/emulator
flutter run

# OR run on specific device
flutter run -d <device-id>

# Examples:
flutter run -d chrome          # Web browser
flutter run -d android         # Android emulator
flutter run -d ios             # iOS simulator
```

---

## 🌐 Step 5: Running on Physical Devices

### For Android Physical Device:

1. Connect your Android device via USB
2. Enable USB debugging
3. Find your computer's local IP address:
   ```bash
   # macOS/Linux
   ifconfig | grep "inet " | grep -v 127.0.0.1
   
   # Windows
   ipconfig
   ```
4. Update `app_config.dart`:
   ```dart
   static const String apiBaseUrl = 'http://192.168.1.XXX:3000/api';
   ```
5. Ensure backend is running and accessible on your network
6. Run: `flutter run -d <your-device-id>`

### For iOS Physical Device:

1. Connect your iPhone via USB
2. Trust the computer on your iPhone
3. Update `app_config.dart` with your computer's IP (same as Android)
4. Run: `flutter run -d <your-device-id>`

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Backend server running on `http://localhost:3000`
- [ ] MongoDB connected (check backend logs)
- [ ] Firebase initialized (check backend logs)
- [ ] Frontend app launches successfully
- [ ] Can register a new user account
- [ ] Can login with registered account
- [ ] Can view doctors list
- [ ] Can view medicines list

---

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Failed:**
```bash
# Check MongoDB is running (if local)
mongosh

# Verify connection string in .env
# Check IP whitelist in MongoDB Atlas
```

**Firebase Authentication Error:**
```bash
# Verify firebase-service-account.json exists
ls backend/firebase-service-account.json

# Check FIREBASE_PROJECT_ID in .env matches Firebase Console
```

**Port Already in Use:**
```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
kill -9 $(lsof -ti:3000)

# OR change PORT in .env file
```

### Frontend Issues

**Flutter Dependencies Error:**
```bash
cd frontend
flutter clean
flutter pub get
```

**Firebase Not Initialized:**
- Verify `app_config.dart` has correct Firebase credentials
- Check `google-services.json` (Android) or `GoogleService-Info.plist` (iOS) exists
- Ensure Firebase Authentication is enabled in Firebase Console

**API Connection Failed:**
- Verify backend is running: `curl http://localhost:3000`
- Check `apiBaseUrl` in `app_config.dart`
- For Android emulator, use `10.0.2.2` instead of `localhost`
- For physical device, use your computer's IP address

**iOS Build Issues:**
```bash
cd ios
pod install
cd ..
flutter clean
flutter run
```

**Android Build Issues:**
```bash
cd android
./gradlew clean
cd ..
flutter clean
flutter run
```

---

## 📚 Quick Reference Commands

### Backend
```bash
cd BarangayCare/backend
npm install              # Install dependencies
npm run dev             # Start development server
npm start               # Start production server
npm run seed:medicines  # Seed medicines data
npm run seed:doctors    # Seed doctors data
```

### Frontend
```bash
cd BarangayCare/frontend
flutter pub get         # Install dependencies
flutter run             # Run app
flutter devices         # List available devices
flutter clean           # Clean build cache
```

---

## 🎯 Next Steps

After successful setup:

1. **Create a test account** in the app
2. **Explore features**:
   - Book appointments
   - Request medicines
   - View health records
   - Use chatbot
   - Check emergency contacts
3. **Read documentation**:
   - [Backend README](./backend/README.md)
   - [Frontend README](./frontend/README.md)
   - [Main README](./README.md)

---

## 📞 Need Help?

- Check the main [README.md](./README.md) for project overview
- Review [Backend README](./backend/README.md) for API details
- Review [Frontend README](./frontend/README.md) for app details
- Check Firebase Console for authentication issues
- Verify MongoDB Atlas connection settings

---

**Happy Coding! 🚀**

