/// Application configuration EXAMPLE
///
/// Copy this file to app_config.dart and update with your Firebase project settings
///
/// Steps to set up:
/// 1. Copy this file: cp app_config.example.dart app_config.dart
/// 2. Run: flutterfire configure --project=your-firebase-project
/// 3. Update API base URL if needed
class AppConfig {
  // App Info
  static const String appName = 'BarangayCare';
  static const String appVersion = '1.0.0';

  // API Configuration
  // Use 10.0.2.2 for Android Emulator, localhost for iOS Simulator
  static const String apiBaseUrl = 'http://localhost:3000/api';

  // Firebase Configuration - REPLACE WITH YOUR PROJECT SETTINGS
  static const String firebaseApiKey = 'YOUR_FIREBASE_API_KEY';
  static const String firebaseProjectId = 'your-firebase-project-id';
  static const String firebaseMessagingSenderId = 'YOUR_MESSAGING_SENDER_ID';
  static const String firebaseAppId = 'YOUR_FIREBASE_APP_ID';

  // Feature Flags
  static const bool enableDoctorBooking = true;
  static const bool enableMedicineRequest = true;
  static const bool enableNotifications = false; // Not implemented yet
}
