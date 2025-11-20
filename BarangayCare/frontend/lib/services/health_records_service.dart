import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';
import 'api_service.dart';

/// Health Records Service
/// Handles all API calls for health records, vital signs, consultations, and documents
/// Demonstrates: Abstraction, Control Flow, Subprograms
class HealthRecordsService {
  /// Get complete health profile
  /// Abstraction: Abstract interface for health data retrieval
  static Future<Map<String, dynamic>> getHealthProfile(String token) async {
    try {
      final response = await ApiService.get(
        '${ApiConfig.baseUrl}/health-records/profile',
        token: token,
      );

      if (response['success'] == true) {
        return response['data'];
      } else {
        throw Exception(response['error'] ?? 'Failed to fetch health profile');
      }
    } catch (e) {
      throw Exception('Error fetching health profile: $e');
    }
  }

  /// Create or update health profile
  /// Used for new users and existing users without profiles
  static Future<Map<String, dynamic>> createHealthProfile(
    String token,
    Map<String, dynamic> profileData,
  ) async {
    try {
      final response = await ApiService.post(
        '${ApiConfig.baseUrl}/health-records/profile',
        profileData,
        token: token,
      );

      if (response['success'] == true) {
        return response['data'];
      } else {
        throw Exception(response['error'] ?? 'Failed to create health profile');
      }
    } catch (e) {
      throw Exception('Error creating health profile: $e');
    }
  }

  /// Get consultation history
  /// Subprogram: Dedicated function for consultation retrieval
  static Future<List<Map<String, dynamic>>> getConsultationHistory(
    String token, {
    int limit = 50,
  }) async {
    try {
      final response = await ApiService.get(
        '${ApiConfig.baseUrl}/health-records/consultations?limit=$limit',
        token: token,
      );

      if (response['success'] == true) {
        return List<Map<String, dynamic>>.from(response['data']);
      } else {
        throw Exception(
            response['error'] ?? 'Failed to fetch consultation history');
      }
    } catch (e) {
      throw Exception('Error fetching consultations: $e');
    }
  }

  /// Get vital signs history
  /// Subprogram: Retrieve vital signs with optional filtering
  static Future<List<Map<String, dynamic>>> getVitalSignsHistory(
    String token, {
    String? startDate,
    String? endDate,
    int limit = 100,
  }) async {
    try {
      String url = '${ApiConfig.baseUrl}/health-records/vital-signs?limit=$limit';

      // Control Flow: Add optional date filters
      if (startDate != null) {
        url += '&startDate=$startDate';
      }
      if (endDate != null) {
        url += '&endDate=$endDate';
      }

      final response = await ApiService.get(url, token: token);

      if (response['success'] == true) {
        return List<Map<String, dynamic>>.from(response['data']);
      } else {
        throw Exception(
            response['error'] ?? 'Failed to fetch vital signs history');
      }
    } catch (e) {
      throw Exception('Error fetching vital signs: $e');
    }
  }

  /// Add vital signs record
  /// Control Flow: Validation before submission
  static Future<Map<String, dynamic>> addVitalSigns(
    String token,
    Map<String, dynamic> vitalSignsData,
  ) async {
    try {
      // Validate required fields (Control Flow - IF condition)
      if (!vitalSignsData.containsKey('blood_pressure') &&
          !vitalSignsData.containsKey('heart_rate') &&
          !vitalSignsData.containsKey('temperature') &&
          !vitalSignsData.containsKey('weight')) {
        throw Exception('At least one vital sign measurement is required');
      }

      final response = await ApiService.post(
        '${ApiConfig.baseUrl}/health-records/vital-signs',
        vitalSignsData,
        token: token,
      );

      if (response['success'] == true) {
        return response;
      } else {
        throw Exception(response['error'] ?? 'Failed to add vital signs');
      }
    } catch (e) {
      throw Exception('Error adding vital signs: $e');
    }
  }

  /// Get medical documents
  /// Subprogram: Retrieve documents with optional type filtering
  static Future<List<Map<String, dynamic>>> getMedicalDocuments(
    String token, {
    String? documentType,
    int limit = 50,
  }) async {
    try {
      String url =
          '${ApiConfig.baseUrl}/health-records/documents?limit=$limit';

      // Control Flow: Add type filter if specified
      if (documentType != null && documentType.isNotEmpty) {
        url += '&type=$documentType';
      }

      final response = await ApiService.get(url, token: token);

      if (response['success'] == true) {
        return List<Map<String, dynamic>>.from(response['data']);
      } else {
        throw Exception(
            response['error'] ?? 'Failed to fetch medical documents');
      }
    } catch (e) {
      throw Exception('Error fetching medical documents: $e');
    }
  }

  /// Upload medical document
  /// Control Flow: Validation before upload
  static Future<Map<String, dynamic>> uploadMedicalDocument(
    String token,
    Map<String, dynamic> documentData,
  ) async {
    try {
      // Validate required fields
      if (!documentData.containsKey('document_type') ||
          !documentData.containsKey('document_name') ||
          !documentData.containsKey('file_url')) {
        throw Exception(
            'Missing required fields: document_type, document_name, file_url');
      }

      final response = await ApiService.post(
        '${ApiConfig.baseUrl}/health-records/documents',
        documentData,
        token: token,
      );

      if (response['success'] == true) {
        return response;
      } else {
        throw Exception(response['error'] ?? 'Failed to upload document');
      }
    } catch (e) {
      throw Exception('Error uploading document: $e');
    }
  }

  /// Delete medical document
  /// Control Flow: Authorization check before deletion
  static Future<void> deleteMedicalDocument(
      String token, String documentId) async {
    try {
      final response = await http.delete(
        Uri.parse(
            '${ApiConfig.baseUrl}/health-records/documents/$documentId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      final data = json.decode(response.body);

      if (data['success'] != true) {
        throw Exception(data['error'] ?? 'Failed to delete document');
      }
    } catch (e) {
      throw Exception('Error deleting document: $e');
    }
  }

  /// Get patient conditions
  /// Subprogram: Retrieve medical conditions
  static Future<List<Map<String, dynamic>>> getPatientConditions(
      String token) async {
    try {
      final response = await ApiService.get(
        '${ApiConfig.baseUrl}/health-records/conditions',
        token: token,
      );

      if (response['success'] == true) {
        return List<Map<String, dynamic>>.from(response['data']);
      } else {
        throw Exception(
            response['error'] ?? 'Failed to fetch patient conditions');
      }
    } catch (e) {
      throw Exception('Error fetching conditions: $e');
    }
  }

  /// Analyze health trends
  /// Subprogram: Get health analytics
  static Future<Map<String, dynamic>> analyzeHealthTrends(
    String token, {
    int days = 30,
  }) async {
    try {
      final response = await ApiService.get(
        '${ApiConfig.baseUrl}/health-records/trends?days=$days',
        token: token,
      );

      if (response['success'] == true) {
        return response['data'];
      } else {
        throw Exception(response['error'] ?? 'Failed to analyze health trends');
      }
    } catch (e) {
      throw Exception('Error analyzing trends: $e');
    }
  }

  /// Get health records by date range
  /// Subprogram: Date-filtered record retrieval
  static Future<Map<String, dynamic>> getHealthRecordsByDateRange(
    String token,
    String startDate,
    String endDate,
  ) async {
    try {
      final response = await ApiService.get(
        '${ApiConfig.baseUrl}/health-records/date-range?startDate=$startDate&endDate=$endDate',
        token: token,
      );

      if (response['success'] == true) {
        return response['data'];
      } else {
        throw Exception(
            response['error'] ?? 'Failed to fetch health records by date range');
      }
    } catch (e) {
      throw Exception('Error fetching records by date: $e');
    }
  }

  /// Generate comprehensive health report PDF
  /// Abstraction: Abstract PDF generation interface
  static Future<List<int>> generateHealthReport(
    String token, {
    String reportType = 'comprehensive',
    String? startDate,
    String? endDate,
    bool includeTrends = true,
  }) async {
    try {
      final requestBody = {
        'reportType': reportType,
        'includeTrends': includeTrends,
        if (startDate != null) 'startDate': startDate,
        if (endDate != null) 'endDate': endDate,
      };

      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/health-records/reports/generate'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode(requestBody),
      );

      if (response.statusCode == 200) {
        return response.bodyBytes;
      } else {
        final data = json.decode(response.body);
        throw Exception(data['error'] ?? 'Failed to generate report');
      }
    } catch (e) {
      throw Exception('Error generating report: $e');
    }
  }

  /// Generate quick summary PDF
  /// Subprogram: Simplified report generation
  static Future<List<int>> generateQuickSummary(String token) async {
    try {
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/health-records/reports/quick-summary'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        return response.bodyBytes;
      } else {
        final data = json.decode(response.body);
        throw Exception(data['error'] ?? 'Failed to generate quick summary');
      }
    } catch (e) {
      throw Exception('Error generating summary: $e');
    }
  }

  /// Calculate BMI
  /// Subprogram: Helper function for BMI calculation
  /// Control Flow: Validation before calculation
  static double? calculateBMI(double? weight, double? height) {
    if (weight == null || height == null || weight <= 0 || height <= 0) {
      return null;
    }

    // Height in cm, convert to meters
    final heightInMeters = height / 100;
    final bmi = weight / (heightInMeters * heightInMeters);
    return double.parse(bmi.toStringAsFixed(1));
  }

  /// Interpret BMI value
  /// Control Flow: Multiple IF-ELSE conditions for classification
  /// Subprogram: BMI interpretation logic
  static String interpretBMI(double? bmi) {
    if (bmi == null) return 'Unknown';

    // Control Flow: BMI classification
    if (bmi < 18.5) {
      return 'Underweight';
    } else if (bmi < 25.0) {
      return 'Normal';
    } else if (bmi < 30.0) {
      return 'Overweight';
    } else {
      return 'Obese';
    }
  }

  /// Get BMI color indicator
  /// Control Flow: Color coding based on BMI category
  /// Subprogram: UI helper function
  static String getBMIColor(double? bmi) {
    if (bmi == null) return 'grey';

    // Control Flow: Color assignment
    if (bmi < 18.5) {
      return 'blue'; // Underweight
    } else if (bmi < 25.0) {
      return 'green'; // Normal
    } else if (bmi < 30.0) {
      return 'orange'; // Overweight
    } else {
      return 'red'; // Obese
    }
  }

  /// Assess blood pressure
  /// Control Flow: Multiple conditions for BP assessment
  /// Subprogram: Health assessment helper
  static Map<String, dynamic> assessBloodPressure(String? bpString) {
    if (bpString == null || bpString.isEmpty) {
      return {'status': 'unknown', 'message': 'No data', 'color': 'grey'};
    }

    try {
      final parts = bpString.split('/');
      if (parts.length != 2) {
        return {'status': 'invalid', 'message': 'Invalid format', 'color': 'grey'};
      }

      final systolic = int.parse(parts[0]);
      final diastolic = int.parse(parts[1]);

      // Control Flow: BP classification (following medical guidelines)
      if (systolic >= 180 || diastolic >= 120) {
        return {
          'status': 'critical',
          'message': 'Hypertensive Crisis',
          'color': 'red'
        };
      } else if (systolic >= 140 || diastolic >= 90) {
        return {
          'status': 'high',
          'message': 'High Blood Pressure',
          'color': 'orange'
        };
      } else if (systolic >= 130 || diastolic >= 80) {
        return {
          'status': 'elevated',
          'message': 'Elevated',
          'color': 'yellow'
        };
      } else if (systolic >= 90 && diastolic >= 60 && systolic < 130 && diastolic < 80) {
        return {'status': 'normal', 'message': 'Normal', 'color': 'green'};
      } else {
        return {'status': 'low', 'message': 'Low Blood Pressure', 'color': 'blue'};
      }
    } catch (e) {
      return {'status': 'error', 'message': 'Error parsing BP', 'color': 'grey'};
    }
  }

  /// Format date for display
  /// Subprogram: Date formatting helper
  static String formatDate(dynamic date) {
    if (date == null) return 'Unknown';

    try {
      DateTime dateTime;
      if (date is String) {
        dateTime = DateTime.parse(date);
      } else if (date is DateTime) {
        dateTime = date;
      } else {
        return 'Invalid date';
      }

      return '${dateTime.day}/${dateTime.month}/${dateTime.year}';
    } catch (e) {
      return 'Invalid date';
    }
  }

  /// Format date and time for display
  /// Subprogram: DateTime formatting helper
  static String formatDateTime(dynamic date) {
    if (date == null) return 'Unknown';

    try {
      DateTime dateTime;
      if (date is String) {
        dateTime = DateTime.parse(date);
      } else if (date is DateTime) {
        dateTime = date;
      } else {
        return 'Invalid date';
      }

      return '${dateTime.day}/${dateTime.month}/${dateTime.year} ${dateTime.hour.toString().padLeft(2, '0')}:${dateTime.minute.toString().padLeft(2, '0')}';
    } catch (e) {
      return 'Invalid date';
    }
  }
}
