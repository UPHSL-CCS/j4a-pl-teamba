/// Application configuration EXAMPLE
///
/// INSTRUCTIONS:
/// 1. Copy this file to app_config.dart
/// 2. Replace all placeholder values with your actual credentials
/// 3. NEVER commit app_config.dart to version control
///
/// For production, use environment-specific configurations
class AppConfig {
  // App Info
  static const String appName = 'BarangayCare';
  static const String appVersion = '1.0.0';

  // API Configuration
  // Use 10.0.2.2 for Android Emulator, localhost for iOS Simulator
  static const String apiBaseUrl = 'http://localhost:3000/api';

  // Firebase Configuration
  // Get these from Firebase Console > Project Settings
  static const String firebaseApiKey = 'your_firebase_api_key_here';
  static const String firebaseProjectId = 'your_firebase_project_id';
  static const String firebaseMessagingSenderId = 'your_sender_id';
  static const String firebaseAppId = 'your_firebase_app_id';

  // Feature Flags
  static const bool enableDoctorBooking = true;
  static const bool enableMedicineRequest = true;
  static const bool enableNotifications = false; // Not implemented yet
}
