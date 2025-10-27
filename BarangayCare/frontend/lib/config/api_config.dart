import 'app_config.dart';

class ApiConfig {
  static String get baseUrl => AppConfig.apiBaseUrl;

  // Auth endpoints
  static String get registerPatient => '$baseUrl/auth/register-patient';
  static String get profile => '$baseUrl/auth/profile';

  // Doctor endpoints
  static String get doctors => '$baseUrl/doctors';
  static String doctorById(String id) => '$baseUrl/doctors/$id';
  static String doctorAvailability(String id, String date) =>
      '$baseUrl/doctors/$id/availability/$date';

  // Appointment endpoints
  static String get bookAppointment => '$baseUrl/appointments/book';
  static String get myAppointments => '$baseUrl/appointments/my-appointments';
  static String cancelAppointment(String id) =>
      '$baseUrl/appointments/$id/cancel';

  // Medicine endpoints
  static String get medicines => '$baseUrl/medicine';
  static String get requestMedicine => '$baseUrl/medicine/request';
}