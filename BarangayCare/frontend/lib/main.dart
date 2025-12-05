import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:provider/provider.dart';

import 'config/app_config.dart';
import 'firebase_options.dart';
import 'providers/auth_provider.dart';
import 'screens/splash_screen.dart';
import 'screens/auth/login_screen.dart';
import 'screens/auth/register_screen.dart';
import 'screens/home/home_screen.dart';
import 'screens/profile/complete_profile_screen.dart';
import 'screens/admin/admin_dashboard_screen.dart';
import 'screens/admin/admin_appointments_screen.dart';
import 'screens/admin/appointment_detail_screen.dart';
import 'screens/admin/medicine_inventory_screen.dart';
import 'screens/admin/medicine_requests_screen.dart';
import 'screens/admin/admin_reports_screen.dart';
import 'screens/chatbot/chatbot_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Firebase with official FlutterFire configuration
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
      ],
      child: MaterialApp(
        title: AppConfig.appName,
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          colorScheme: ColorScheme.fromSeed(
            seedColor: Colors.blue,
            brightness: Brightness.light,
          ),
          useMaterial3: true,
          fontFamily: 'Inter',
        ),
        initialRoute: '/',
        routes: {
          '/': (context) => const SplashScreen(),
          '/login': (context) => const LoginScreen(),
          '/register': (context) => const RegisterScreen(),
          '/complete-profile': (context) => const CompleteProfileScreen(),
          '/home': (context) => const HomeScreen(),
          '/chatbot': (context) => const ChatbotScreen(),
          '/admin/dashboard': (context) => const AdminDashboardScreen(),
          '/admin/appointments': (context) {
            final args = ModalRoute.of(context)?.settings.arguments
                as Map<String, dynamic>?;
            return AdminAppointmentsScreen(
              initialStatus: args?['status'] as String?,
            );
          },
          '/admin/medicines': (context) {
            final args = ModalRoute.of(context)?.settings.arguments
                as Map<String, dynamic>?;
            return MedicineInventoryScreen(
              filter: args?['filter'] as String?,
            );
          },
          '/admin/medicine-requests': (context) =>
              const AdminMedicineRequestsScreen(),
          '/admin/reports': (context) => const AdminReportsScreen(),
        },
        onGenerateRoute: (settings) {
          // Handle appointment detail route with arguments
          if (settings.name == '/admin/appointment-detail') {
            final appointment = settings.arguments as Map<String, dynamic>;
            return MaterialPageRoute(
              builder: (context) =>
                  AppointmentDetailScreen(appointment: appointment),
            );
          }
          return null;
        },
      ),
    );
  }
}
