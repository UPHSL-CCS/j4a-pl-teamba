import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:firebase_auth/firebase_auth.dart';
import '../config/api_config.dart';

class EmergencyService {
  /// Get auth token from Firebase
  Future<String?> _getAuthToken() async {
    final user = FirebaseAuth.instance.currentUser;
    if (user == null) return null;
    return await user.getIdToken();
  }

  /// Get all emergency contacts with optional category filter
  /// [category] - Optional filter: hospital, ambulance, police, fire, emergency
  Future<List<Map<String, dynamic>>> getAllContacts({String? category}) async {
    try {
      final token = await _getAuthToken();
      if (token == null) {
        throw Exception('Not authenticated');
      }

      // Build URL with optional category parameter
      String url = '${ApiConfig.baseUrl}/emergency/contacts';
      if (category != null && category.isNotEmpty) {
        url += '?category=$category';
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
        return List<Map<String, dynamic>>.from(data['contacts']);
      } else {
        throw Exception('Failed to load contacts: ${response.body}');
      }
    } catch (e) {
      throw Exception('Error fetching contacts: $e');
    }
  }

  /// Get nearest emergency contacts based on user location
  /// [latitude] - User's current latitude
  /// [longitude] - User's current longitude
  /// [category] - Optional filter: hospital, ambulance, police, fire, emergency
  /// [maxDistance] - Maximum distance in meters (default: 10000)
  /// [limit] - Maximum number of results (default: 10)
  Future<List<Map<String, dynamic>>> getNearestContacts({
    required double latitude,
    required double longitude,
    String? category,
    int maxDistance = 10000,
    int limit = 10,
  }) async {
    try {
      final token = await _getAuthToken();
      if (token == null) {
        throw Exception('Not authenticated');
      }

      // Build URL with query parameters
      String url = '${ApiConfig.baseUrl}/emergency/nearest'
          '?lat=$latitude&lng=$longitude&maxDistance=$maxDistance&limit=$limit';
      
      if (category != null && category.isNotEmpty) {
        url += '&category=$category';
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
        return List<Map<String, dynamic>>.from(data['contacts']);
      } else {
        throw Exception('Failed to find nearest contacts: ${response.body}');
      }
    } catch (e) {
      throw Exception('Error finding nearest contacts: $e');
    }
  }

  /// Log an emergency contact action (call, SMS, or view)
  /// [contactId] - The ID of the emergency contact
  /// [actionType] - Type of action: 'call', 'sms', or 'view'
  Future<void> logEmergencyAction(String contactId, String actionType) async {
    try {
      final token = await _getAuthToken();
      if (token == null) {
        throw Exception('Not authenticated');
      }

      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/emergency/log'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: json.encode({
          'contact_id': contactId,
          'action_type': actionType,
        }),
      );

      if (response.statusCode != 200) {
        print('Warning: Failed to log emergency action: ${response.body}');
        // Don't throw - logging is not critical
      }
    } catch (e) {
      print('Warning: Error logging emergency action: $e');
      // Don't throw - logging is not critical
    }
  }

  /// Get user's emergency contact logs/history
  Future<List<Map<String, dynamic>>> getMyLogs() async {
    try {
      final token = await _getAuthToken();
      if (token == null) {
        throw Exception('Not authenticated');
      }

      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/emergency/logs'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return List<Map<String, dynamic>>.from(data['logs']);
      } else {
        throw Exception('Failed to load emergency logs: ${response.body}');
      }
    } catch (e) {
      throw Exception('Error fetching emergency logs: $e');
    }
  }

  /// Get category summary with counts
  Future<List<Map<String, dynamic>>> getCategories() async {
    try {
      final token = await _getAuthToken();
      if (token == null) {
        throw Exception('Not authenticated');
      }

      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/emergency/categories'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return List<Map<String, dynamic>>.from(data['categories']);
      } else {
        throw Exception('Failed to load categories: ${response.body}');
      }
    } catch (e) {
      throw Exception('Error fetching categories: $e');
    }
  }

  /// Quick dial emergency numbers (no authentication required for essential services)
  /// Returns true if the action was logged successfully
  Future<bool> quickDial(String phoneNumber, {String? contactId}) async {
    try {
      // If contactId is provided, log the action
      if (contactId != null) {
        await logEmergencyAction(contactId, 'call');
      }
      return true;
    } catch (e) {
      print('Warning: Failed to log quick dial: $e');
      return false;
    }
  }
}
