class Doctor {
  final String id;
  final String name;
  final String expertise;
  final String licenseNumber;
  final String? image; // Optional image path
  final List<Schedule> schedule;

  Doctor({
    required this.id,
    required this.name,
    required this.expertise,
    required this.licenseNumber,
    this.image,
    required this.schedule,
  });

  factory Doctor.fromJson(Map<String, dynamic> json) {
    return Doctor(
      id: json['_id'] ?? '',
      name: json['name'] ?? '',
      expertise: json['expertise'] ?? '',
      licenseNumber: json['license_number'] ?? '',
      image: json['image'],
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
      if (image != null) 'image': image,
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
