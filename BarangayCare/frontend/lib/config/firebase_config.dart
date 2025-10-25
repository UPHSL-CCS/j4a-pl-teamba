import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/foundation.dart';
import 'app_config.dart';

class FirebaseConfig {
  static FirebaseOptions get currentPlatform {
    if (kIsWeb) {
      return web;
    }
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return android;
      case TargetPlatform.iOS:
        return ios;
      default:
        throw UnsupportedError(
          'DefaultFirebaseOptions are not supported for this platform.',
        );
    }
  }

  static FirebaseOptions web = FirebaseOptions(
    apiKey: AppConfig.firebaseApiKey,
    appId: AppConfig.firebaseAppId,
    messagingSenderId: AppConfig.firebaseMessagingSenderId,
    projectId: AppConfig.firebaseProjectId,
    authDomain: '${AppConfig.firebaseProjectId}.firebaseapp.com',
  );

  static FirebaseOptions android = FirebaseOptions(
    apiKey: AppConfig.firebaseApiKey,
    appId: AppConfig.firebaseAppId,
    messagingSenderId: AppConfig.firebaseMessagingSenderId,
    projectId: AppConfig.firebaseProjectId,
  );

  static FirebaseOptions ios = FirebaseOptions(
    apiKey: AppConfig.firebaseApiKey,
    appId: AppConfig.firebaseAppId,
    messagingSenderId: AppConfig.firebaseMessagingSenderId,
    projectId: AppConfig.firebaseProjectId,
    iosBundleId: 'com.uphsl.barangaycare',
  );
}
