class Appointment {
  final String id;
  final String patientId;
  final String doctorId;
  final String date;
  final String time;
  final String status;
  final Map<String, dynamic> preScreening;
  final DateTime createdAt;
  final DateTime updatedAt;
  final Doctor? doctor;

  Appointment({
    required this.id,
    required this.patientId,
    required this.doctorId,
    required this.date,
    required this.time,
    required this.status,
    required this.preScreening,
    required this.createdAt,
    required this.updatedAt,
    this.doctor,
  });

  factory Appointment.fromJson(Map<String, dynamic> json) {
    return Appointment(
      id: json['_id'] ?? '',
      patientId: json['patient_id'] ?? '',
      doctorId: json['doctor_id'] is Map
          ? json['doctor_id']['_id'] ?? ''
          : json['doctor_id'] ?? '',
      date: json['date'] ?? '',
      time: json['time'] ?? '',
      status: json['status'] ?? '',
      preScreening: json['pre_screening'] ?? {},
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'])
          : DateTime.now(),
      updatedAt: json['updated_at'] != null
          ? DateTime.parse(json['updated_at'])
          : DateTime.now(),
      doctor: json['doctor'] != null ? Doctor.fromJson(json['doctor']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'patient_id': patientId,
      'doctor_id': doctorId,
      'date': date,
      'time': time,
      'status': status,
      'pre_screening': preScreening,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
      if (doctor != null) 'doctor': doctor!.toJson(),
    };
  }
}

class Doctor {
  final String id;
  final String name;
  final String expertise;

  Doctor({
    required this.id,
    required this.name,
    required this.expertise,
  });

  factory Doctor.fromJson(Map<String, dynamic> json) {
    return Doctor(
      id: json['_id'] ?? '',
      name: json['name'] ?? '',
      expertise: json['expertise'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'name': name,
      'expertise': expertise,
    };
  }
}
