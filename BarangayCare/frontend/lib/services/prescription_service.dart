import 'dart:io';
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

  /// Upload a prescription image for a medicine request
  /// [requestId] - The ID of the medicine request
  /// [imageFile] - The prescription image file to upload
  /// Returns the prescription URL on success
  Future<String> uploadPrescription(String requestId, File imageFile) async {
    try {
      // Get auth token
      final token = await _getAuthToken();
      if (token == null) {
        throw Exception('Not authenticated');
      }

      // Prepare multipart request
      final uri = Uri.parse('${ApiConfig.baseUrl}/prescriptions/upload/$requestId');
      final request = http.MultipartRequest('POST', uri);
      
      // Add authorization header
      request.headers['Authorization'] = 'Bearer $token';
      
      // Add file to request
      final fileName = imageFile.path.split('/').last;
      request.files.add(
        await http.MultipartFile.fromPath(
          'prescription',
          imageFile.path,
          filename: fileName,
        ),
      );

      // Send request
      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return data['prescription_url'] as String;
      } else {
        final errorData = json.decode(response.body);
        throw Exception(errorData['error'] ?? 'Failed to upload prescription');
      }
    } catch (e) {
      print('Error uploading prescription: $e');
      throw Exception('Failed to upload prescription: ${e.toString()}');
    }
  }

  /// Get prescription URL for a medicine request
  /// [requestId] - The ID of the medicine request
  /// Returns the prescription URL if exists
  Future<Map<String, dynamic>> getPrescriptionUrl(String requestId) async {
    try {
      // Get auth token
      final token = await _getAuthToken();
      if (token == null) {
        throw Exception('Not authenticated');
      }

      // Make GET request
      final uri = Uri.parse('${ApiConfig.baseUrl}/prescriptions/$requestId');
      final response = await http.get(
        uri,
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        return json.decode(response.body) as Map<String, dynamic>;
      } else if (response.statusCode == 404) {
        // No prescription uploaded yet
        return {};
      } else {
        final errorData = json.decode(response.body);
        throw Exception(errorData['error'] ?? 'Failed to get prescription');
      }
    } catch (e) {
      print('Error getting prescription: $e');
      throw Exception('Failed to get prescription: ${e.toString()}');
    }
  }

  /// Get full prescription image URL
  /// [prescriptionUrl] - The relative prescription URL from the database
  /// Returns the full URL to access the image
  String getFullPrescriptionUrl(String prescriptionUrl) {
    return '${ApiConfig.baseUrl}$prescriptionUrl';
  }
}
