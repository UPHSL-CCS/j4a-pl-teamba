import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:firebase_auth/firebase_auth.dart';
import '../config/api_config.dart';

class PrescriptionService {
  /// Get auth token from Firebase
  Future<String?> _getAuthToken() async {
    final user = FirebaseAuth.instance.currentUser;
    if (user == null) return null;
    return await user.getIdToken();
  }

  /// Create prescription (Admin only)
  /// Returns the created prescription data
  Future<Map<String, dynamic>> createPrescription({
    required String appointmentId,
    required String patientId,
    required List<Map<String, dynamic>> medicines,
    required String diagnosis,
    String? notes,
    int validDays = 30,
  }) async {
    try {
      final token = await _getAuthToken();
      if (token == null) {
        throw Exception('Not authenticated');
      }

      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/prescriptions/create'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: json.encode({
          'appointment_id': appointmentId,
          'patient_id': patientId,
          'medicines': medicines,
          'diagnosis': diagnosis,
          'notes': notes ?? '',
          'valid_days': validDays,
        }),
      );

      if (response.statusCode == 201) {
        final data = json.decode(response.body);
        return data;
      } else {
        final error = json.decode(response.body);
        throw Exception(error['error'] ?? 'Failed to create prescription');
      }
    } catch (e) {
      throw Exception('Error creating prescription: $e');
    }
  }

  /// Get all prescriptions for a patient
  /// [patientId] - Patient's ID
  /// [status] - Optional filter: active, used, expired, cancelled
  Future<List<Map<String, dynamic>>> getPatientPrescriptions({
    required String patientId,
    String? status,
  }) async {
    try {
      final token = await _getAuthToken();
      if (token == null) {
        throw Exception('Not authenticated');
      }

      String url = '${ApiConfig.baseUrl}/prescriptions/patient/$patientId';
      if (status != null && status.isNotEmpty) {
        url += '?status=$status';
      }

      final response = await http.get(
        Uri.parse(url),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return List<Map<String, dynamic>>.from(data['prescriptions']);
      } else {
        final error = json.decode(response.body);
        throw Exception(error['error'] ?? 'Failed to load prescriptions');
      }
    } catch (e) {
      throw Exception('Error fetching prescriptions: $e');
    }
  }

  /// Get prescription details by ID
  Future<Map<String, dynamic>> getPrescriptionById(String prescriptionId) async {
    try {
      final token = await _getAuthToken();
      if (token == null) {
        throw Exception('Not authenticated');
      }

      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/prescriptions/$prescriptionId'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return data['prescription'];
      } else {
        final error = json.decode(response.body);
        throw Exception(error['error'] ?? 'Failed to load prescription');
      }
    } catch (e) {
      throw Exception('Error fetching prescription: $e');
    }
  }

  /// Get prescription for a specific appointment
  Future<Map<String, dynamic>?> getPrescriptionByAppointment(
      String appointmentId) async {
    try {
      final token = await _getAuthToken();
      if (token == null) {
        throw Exception('Not authenticated');
      }

      final response = await http.get(
        Uri.parse(
            '${ApiConfig.baseUrl}/prescriptions/appointment/$appointmentId'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return data['prescription']; // Can be null if no prescription exists
      } else {
        final error = json.decode(response.body);
        throw Exception(error['error'] ?? 'Failed to load prescription');
      }
    } catch (e) {
      throw Exception('Error fetching prescription: $e');
    }
  }

  /// Update prescription status
  /// [prescriptionId] - Prescription ID
  /// [status] - New status: used, cancelled, expired
  /// [reason] - Optional reason for status change
  Future<void> updatePrescriptionStatus({
    required String prescriptionId,
    required String status,
    String? reason,
  }) async {
    try {
      final token = await _getAuthToken();
      if (token == null) {
        throw Exception('Not authenticated');
      }

      final response = await http.patch(
        Uri.parse('${ApiConfig.baseUrl}/prescriptions/$prescriptionId/status'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: json.encode({
          'status': status,
          if (reason != null) 'reason': reason,
        }),
      );

      if (response.statusCode != 200) {
        final error = json.decode(response.body);
        throw Exception(error['error'] ?? 'Failed to update prescription');
      }
    } catch (e) {
      throw Exception('Error updating prescription: $e');
    }
  }

  /// Get active prescriptions (not expired, used, or cancelled)
  Future<List<Map<String, dynamic>>> getActivePrescriptions(
      String patientId) async {
    return await getPatientPrescriptions(
      patientId: patientId,
      status: 'active',
    );
  }

  /// Check if prescription is still valid
  bool isPrescriptionValid(Map<String, dynamic> prescription) {
    if (prescription['status'] != 'active') return false;
    
    final expiryDate = DateTime.parse(prescription['expiry_date']);
    return DateTime.now().isBefore(expiryDate);
  }

  /// Get days remaining for prescription
  int getDaysRemaining(Map<String, dynamic> prescription) {
    final expiryDate = DateTime.parse(prescription['expiry_date']);
    final now = DateTime.now();
    
    if (now.isAfter(expiryDate)) return 0;
    
    return expiryDate.difference(now).inDays;
  }
}
