class Doctor {
  final String id;
  final String name;
  final String expertise;
  final String licenseNumber;
  final List<Schedule> schedule;

  Doctor({
    required this.id,
    required this.name,
    required this.expertise,
    required this.licenseNumber,
    required this.schedule,
  });

  factory Doctor.fromJson(Map<String, dynamic> json) {
    return Doctor(
      id: json['_id'] ?? '',
      name: json['name'] ?? '',
      expertise: json['expertise'] ?? '',
      licenseNumber: json['license_number'] ?? '',
      schedule: (json['schedule'] as List<dynamic>?)
              ?.map((s) => Schedule.fromJson(s))
              .toList() ??
          [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'name': name,
      'expertise': expertise,
      'license_number': licenseNumber,
      'schedule': schedule.map((s) => s.toJson()).toList(),
    };
  }
}

class Schedule {
  final String day;
  final String start;
  final String end;

  Schedule({
    required this.day,
    required this.start,
    required this.end,
  });

  factory Schedule.fromJson(Map<String, dynamic> json) {
    return Schedule(
      day: json['day'] ?? '',
      start: json['start'] ?? '',
      end: json['end'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'day': day,
      'start': start,
      'end': end,
    };
  }
}
