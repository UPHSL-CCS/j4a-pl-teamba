import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';

class ApiService {
  // Static methods that accept token as parameter
  static Map<String, String> _headers(String? token) => {
        'Content-Type': 'application/json',
        if (token != null) 'Authorization': 'Bearer $token',
      };

  // Generic GET request
  static Future<Map<String, dynamic>> get(String url, {String? token}) async {
    try {
      final response = await http.get(
        Uri.parse(url),
        headers: _headers(token),
      ).timeout(
        const Duration(seconds: 10),
        onTimeout: () {
          throw Exception('Request timeout - please check your connection');
        },
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        throw Exception(
            json.decode(response.body)['error'] ?? 'Request failed');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  // Generic POST request
  static Future<Map<String, dynamic>> post(String url, Map<String, dynamic> body,
      {String? token}) async {
    try {
      final response = await http.post(
        Uri.parse(url),
        headers: _headers(token),
        body: json.encode(body),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return json.decode(response.body);
      } else {
        throw Exception(
            json.decode(response.body)['error'] ?? 'Request failed');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  // Generic PATCH request
  static Future<Map<String, dynamic>> patch(String url, Map<String, dynamic> body,
      {String? token}) async {
    try {
      final response = await http.patch(
        Uri.parse(url),
        headers: _headers(token),
        body: json.encode(body),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        throw Exception(
            json.decode(response.body)['error'] ?? 'Request failed');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  // Auth Services
  static Future<Map<String, dynamic>> registerPatient({
    required String name,
    required String barangay,
    required String contact,
    required String token,
  }) async {
    return await post(ApiConfig.registerPatient, {
      'name': name,
      'barangay': barangay,
      'contact': contact,
    }, token: token);
  }

  static Future<Map<String, dynamic>> getProfile(String token) async {
    return await get(ApiConfig.profile, token: token);
  }

  // Doctor Services
  static Future<List<dynamic>> getDoctors({String? token}) async {
    final response = await get(ApiConfig.doctors, token: token);
    return response['doctors'] as List<dynamic>;
  }

  static Future<Map<String, dynamic>> getDoctorById(String id, {String? token}) async {
    return await get(ApiConfig.doctorById(id), token: token);
  }

  static Future<Map<String, dynamic>> checkDoctorAvailability(
    String doctorId,
    String date, {
    String? token,
  }) async {
    return await get(ApiConfig.doctorAvailability(doctorId, date), token: token);
  }

  // Appointment Services
  static Future<Map<String, dynamic>> bookAppointment({
    required String doctorId,
    required String date,
    required String time,
    Map<String, dynamic>? preScreening,
    required String token,
  }) async {
    return await post(ApiConfig.bookAppointment, {
      'doctor_id': doctorId,
      'date': date,
      'time': time,
      'pre_screening': preScreening ?? {},
    }, token: token);
  }

  static Future<List<dynamic>> getMyAppointments(String token) async {
    final response = await get(ApiConfig.myAppointments, token: token);
    return response['appointments'] as List<dynamic>;
  }

  static Future<Map<String, dynamic>> cancelAppointment(String id, String token) async {
    return await patch(ApiConfig.cancelAppointment(id), {}, token: token);
  }

  // Medicine Services
  static Future<List<dynamic>> getMedicines({String? token}) async {
    final response = await get(ApiConfig.medicines, token: token);
    return response['medicines'] as List<dynamic>;
  }

  static Future<Map<String, dynamic>> requestMedicine({
    required String medicineId,
    required int quantity,
    required String token,
  }) async {
    return await post(ApiConfig.requestMedicine, {
      'medicine_id': medicineId,
      'quantity': quantity,
    }, token: token);
  }

  // Admin Services
  static Future<bool> isAdmin(String token) async {
    try {
      print('🔐 Checking admin status...');
      print('📡 URL: ${ApiConfig.adminDashboardStats}');
      
      // Try to access admin dashboard stats endpoint
      // If successful, user is an admin
      final result = await get(ApiConfig.adminDashboardStats, token: token);
      print('✅ Admin check successful: $result');
      return true;
    } catch (e) {
      print('⚠️  Admin check failed: $e');
      // If 403 or any error, user is not an admin
      return false;
    }
  }
}
