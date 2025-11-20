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
      final response = await http
          .get(
        Uri.parse(url),
        headers: _headers(token),
      )
          .timeout(
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
  static Future<Map<String, dynamic>> post(
      String url, Map<String, dynamic> body,
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
  static Future<Map<String, dynamic>> patch(
      String url, Map<String, dynamic> body,
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

  // Generic DELETE request
  static Future<Map<String, dynamic>> delete(String url,
      {String? token}) async {
    try {
      final response = await http.delete(
        Uri.parse(url),
        headers: _headers(token),
      );

      if (response.statusCode == 200 || response.statusCode == 204) {
        if (response.body.isEmpty) {
          return {'success': true};
        }
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
    return await post(
        ApiConfig.registerPatient,
        {
          'name': name,
          'barangay': barangay,
          'contact': contact,
        },
        token: token);
  }

  static Future<Map<String, dynamic>> getProfile(String token) async {
    return await get(ApiConfig.profile, token: token);
  }

  static Future<Map<String, dynamic>> updateProfile({
    required String name,
    required String barangay,
    required String contact,
    required String token,
  }) async {
    try {
      final response = await http.put(
        Uri.parse(ApiConfig.profile),
        headers: _headers(token),
        body: json.encode({
          'name': name,
          'barangay': barangay,
          'contact': contact,
        }),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        throw Exception(
            json.decode(response.body)['error'] ?? 'Failed to update profile');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  // Doctor Services
  static Future<List<dynamic>> getDoctors({String? token}) async {
    final response = await get(ApiConfig.doctors, token: token);
    return response['doctors'] as List<dynamic>;
  }

  static Future<Map<String, dynamic>> getDoctorById(String id,
      {String? token}) async {
    return await get(ApiConfig.doctorById(id), token: token);
  }

  static Future<Map<String, dynamic>> checkDoctorAvailability(
    String doctorId,
    String date, {
    String? token,
  }) async {
    return await get(ApiConfig.doctorAvailability(doctorId, date),
        token: token);
  }

  // Appointment Services
  static Future<Map<String, dynamic>> bookAppointment({
    required String doctorId,
    required String date,
    required String time,
    Map<String, dynamic>? preScreening,
    required String token,
  }) async {
    return await post(
        ApiConfig.bookAppointment,
        {
          'doctor_id': doctorId,
          'date': date,
          'time': time,
          'pre_screening': preScreening ?? {},
        },
        token: token);
  }

  static Future<List<dynamic>> getMyAppointments(String token) async {
    final response = await get(ApiConfig.myAppointments, token: token);
    return response['appointments'] as List<dynamic>;
  }

  static Future<Map<String, dynamic>> cancelAppointment(
      String id, String token) async {
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
    String? prescriptionId,
  }) async {
    final body = {
      'medicine_id': medicineId,
      'quantity': quantity,
    };
    
    if (prescriptionId != null) {
      body['prescription_id'] = prescriptionId;
    }
    
    return await post(
        ApiConfig.requestMedicine,
        body,
        token: token);
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

  static Future<Map<String, dynamic>> getAdminDashboardStats(
      String token) async {
    return await get(ApiConfig.adminDashboardStats, token: token);
  }

  static Future<List<dynamic>> getAdminAppointments(
    String token, {
    String? status,
    int page = 1,
    int limit = 20,
  }) async {
    String url =
        '${ApiConfig.baseUrl}/admin/appointments?page=$page&limit=$limit';
    if (status != null) {
      url += '&status=$status';
    }
    final response = await get(url, token: token);
    return response['appointments'] as List<dynamic>;
  }

  static Future<Map<String, dynamic>> approveAppointment(
    String token,
    String appointmentId, {
    String? notes,
  }) async {
    return await ApiService.patch(
      '${ApiConfig.baseUrl}/admin/appointments/$appointmentId/approve',
      {'admin_notes': notes ?? ''},
      token: token,
    );
  }

  static Future<Map<String, dynamic>> rejectAppointment(
    String token,
    String appointmentId, {
    required String reason,
    String? notes,
  }) async {
    return await ApiService.patch(
      '${ApiConfig.baseUrl}/admin/appointments/$appointmentId/reject',
      {
        'reason': reason,
        'admin_notes': notes ?? reason,
      },
      token: token,
    );
  }

  static Future<Map<String, dynamic>> completeAppointment(
    String token,
    String appointmentId, {
    String? notes,
  }) async {
    return await ApiService.patch(
      '${ApiConfig.baseUrl}/admin/appointments/$appointmentId/complete',
      {'admin_notes': notes ?? ''},
      token: token,
    );
  }

  static Future<List<dynamic>> getLowStockMedicines(String token) async {
    final response = await get('${ApiConfig.baseUrl}/admin/medicines/low-stock',
        token: token);
    return response['medicines'] as List<dynamic>;
  }

  static Future<Map<String, dynamic>> adjustMedicineStock(
    String token,
    String medicineId, {
    required int quantityChange,
    required String changeType,
    required String reason,
  }) async {
    return await post(
      '${ApiConfig.baseUrl}/admin/medicines/$medicineId/adjust',
      {
        'quantity_change': quantityChange,
        'change_type': changeType,
        'reason': reason,
      },
      token: token,
    );
  }

  // Medicine Request Services
  static Future<Map<String, dynamic>> getMedicineRequests({
    String status = 'all',
    String? token,
  }) async {
    return await get(
      '${ApiConfig.baseUrl}/admin/medicine-requests?status=$status',
      token: token,
    );
  }

  static Future<Map<String, dynamic>> getMedicineRequestDetail(
    String requestId, {
    String? token,
  }) async {
    return await get(
      '${ApiConfig.baseUrl}/admin/medicine-requests/$requestId',
      token: token,
    );
  }

  static Future<Map<String, dynamic>> approveMedicineRequest(
    String requestId, {
    String? notes,
    String? token,
  }) async {
    return await patch(
      '${ApiConfig.baseUrl}/admin/medicine-requests/$requestId/approve',
      {
        if (notes != null && notes.isNotEmpty) 'admin_notes': notes,
      },
      token: token,
    );
  }

  static Future<Map<String, dynamic>> rejectMedicineRequest(
    String requestId, {
    required String reason,
    String? token,
  }) async {
    return await patch(
      '${ApiConfig.baseUrl}/admin/medicine-requests/$requestId/reject',
      {
        'rejection_reason': reason,
      },
      token: token,
    );
  }
}
