import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';

class ApiService {
  final String? _token;

  ApiService(this._token);

  Map<String, String> get _headers => {
        'Content-Type': 'application/json',
        if (_token != null) 'Authorization': 'Bearer $_token',
      };

  // Generic GET request
  Future<Map<String, dynamic>> get(String url) async {
    try {
      final response = await http.get(
        Uri.parse(url),
        headers: _headers,
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
  Future<Map<String, dynamic>> post(
      String url, Map<String, dynamic> body) async {
    try {
      final response = await http.post(
        Uri.parse(url),
        headers: _headers,
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
  Future<Map<String, dynamic>> patch(
      String url, Map<String, dynamic> body) async {
    try {
      final response = await http.patch(
        Uri.parse(url),
        headers: _headers,
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
  Future<Map<String, dynamic>> registerPatient({
    required String name,
    required String barangay,
    required String contact,
  }) async {
    return await post(ApiConfig.registerPatient, {
      'name': name,
      'barangay': barangay,
      'contact': contact,
    });
  }

  Future<Map<String, dynamic>> getProfile() async {
    return await get(ApiConfig.profile);
  }

  // Doctor Services
  Future<List<dynamic>> getDoctors() async {
    final response = await get(ApiConfig.doctors);
    return response['doctors'] as List<dynamic>;
  }

  Future<Map<String, dynamic>> getDoctorById(String id) async {
    return await get(ApiConfig.doctorById(id));
  }

  Future<Map<String, dynamic>> checkDoctorAvailability(
    String doctorId,
    String date,
  ) async {
    return await get(ApiConfig.doctorAvailability(doctorId, date));
  }

  // Appointment Services
  Future<Map<String, dynamic>> bookAppointment({
    required String doctorId,
    required String date,
    required String time,
    Map<String, dynamic>? preScreening,
  }) async {
    return await post(ApiConfig.bookAppointment, {
      'doctor_id': doctorId,
      'date': date,
      'time': time,
      'pre_screening': preScreening ?? {},
    });
  }

  Future<List<dynamic>> getMyAppointments() async {
    final response = await get(ApiConfig.myAppointments);
    return response['appointments'] as List<dynamic>;
  }

  Future<Map<String, dynamic>> cancelAppointment(String id) async {
    return await patch(ApiConfig.cancelAppointment(id), {});
  }

  // Medicine Services
  Future<List<dynamic>> getMedicines() async {
    final response = await get(ApiConfig.medicines);
    return response['medicines'] as List<dynamic>;
  }

  Future<Map<String, dynamic>> requestMedicine({
    required String medicineId,
    required int quantity,
  }) async {
    return await post(ApiConfig.requestMedicine, {
      'medicine_id': medicineId,
      'quantity': quantity,
    });
  }
}
