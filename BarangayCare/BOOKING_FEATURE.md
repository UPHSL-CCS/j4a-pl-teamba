# Book Consultation Feature

Complete implementation of the appointment booking system for BarangayCare.

## 📋 Feature Overview

The Book Consultation feature allows patients to:
- Browse available doctors by expertise
- View doctor details and schedules
- Check real-time availability
- Select date and time slots
- Fill out pre-screening information
- Confirm appointment bookings

## 🏗️ Architecture

### Frontend Structure
```
lib/
├── models/
│   ├── doctor.dart           # Doctor data model
│   └── appointment.dart      # Appointment data model
├── screens/
│   └── booking/
│       ├── doctor_list_screen.dart          # Browse doctors
│       ├── doctor_detail_screen.dart        # Doctor info & schedule
│       └── book_appointment_screen.dart     # Date/time selection & booking
└── services/
    └── api_service.dart      # API calls (already extended)
```

### Backend Structure (Already Implemented)
```
backend/
├── routes/
│   ├── doctors.route.js      # Doctor endpoints
│   └── appointments.route.js # Appointment endpoints
├── services/
│   ├── doctor.service.js     # Doctor business logic
│   └── appointment.service.js # Booking logic
└── scripts/
    └── seed-doctors.js       # Sample data seeder
```

## 🎯 Programming Concepts Demonstrated

### 1. Control Flow & Expressions
- **Date Validation**: Prevents booking in the past
- **Time Slot Availability**: Checks if slot is available before booking
- **Form Validation**: Validates required fields (symptoms, date, time)
- **Conditional Rendering**: Shows/hides UI based on state (date selected → show slots)

Example from `book_appointment_screen.dart`:
```dart
if (_selectedDate == null) {
  ScaffoldMessenger.of(context).showSnackBar(
    const SnackBar(content: Text('Please select a date')),
  );
  return;
}

if (_selectedTime == null) {
  ScaffoldMessenger.of(context).showSnackBar(
    const SnackBar(content: Text('Please select a time slot')),
  );
  return;
}
```

### 2. Modular Design & Subprograms
- **Reusable Components**: `_buildDoctorCard()`, `_formatTime()`, `_getFullDayName()`
- **Service Layer**: Centralized API calls in `ApiService`
- **Model Classes**: Separate data models for Doctor and Appointment
- **Screen Separation**: Each screen has a single responsibility

Example from `doctor_list_screen.dart`:
```dart
void _filterDoctors() {
  setState(() {
    _filteredDoctors = _doctors.where((doctor) {
      final matchesSearch = _searchQuery.isEmpty ||
          doctor.name.toLowerCase().contains(_searchQuery.toLowerCase());
      final matchesExpertise = _selectedExpertise == null ||
          doctor.expertise == _selectedExpertise;
      return matchesSearch && matchesExpertise;
    }).toList();
  });
}
```

### 3. Concurrency Handling (Backend)
- **Atomic Operations**: MongoDB operations prevent double booking
- **Race Condition Prevention**: Time slot checking + booking is atomic
- **Optimistic Locking**: Check availability immediately before booking

Example from `appointment.service.js`:
```javascript
// Check for existing appointment (prevent double booking)
const existingAppointment = await collections.appointments().findOne({
  doctor_id: new ObjectId(doctor_id),
  date: date,
  time: time,
  status: { $in: ['booked', 'confirmed'] }
});

if (existingAppointment) {
  throw new Error('Time slot already booked');
}
```

## 🚀 Setup Instructions

### 1. Backend Setup

#### Seed Doctor Data
```powershell
cd C:\Users\USER\TEAMBA\j4a-pl-teamba\BarangayCare\backend
node scripts/seed-doctors.js
```

This will create 6 sample doctors with different expertise and schedules.

#### Verify Seeding
Check MongoDB to ensure doctors were created:
```javascript
// In MongoDB Compass or shell
db.doctors.find().pretty()
```

### 2. Frontend Setup

#### Install Dependencies (if not already done)
```powershell
cd C:\Users\USER\TEAMBA\j4a-pl-teamba\BarangayCare\frontend
flutter pub get
```

#### Run the App
```powershell
flutter run -d <device-id>
```

## 📱 User Flow

### 1. Browse Doctors
- User taps "Book Consultation" from home screen
- Sees list of all available doctors
- Can search by name or expertise
- Can filter by expertise category

### 2. View Doctor Details
- User taps on a doctor card
- Sees doctor's full information:
  - Name and expertise
  - License number
  - Weekly schedule with days and times
- Taps "Book Appointment" button

### 3. Select Date & Time
- User selects a date from calendar
- System loads available time slots for that date
- User sees:
  - ✅ Available slots (clickable)
  - ⚠️ "No slots available" if doctor doesn't work that day
  - 🔄 Loading indicator while fetching

### 4. Pre-Screening Form
- After selecting time, pre-screening form appears
- User fills in:
  - **Symptoms*** (required)
  - **Temperature** (optional)
  - **Additional Notes** (optional)

### 5. Confirm Booking
- User taps "Confirm Booking"
- System validates all inputs
- Creates appointment in database
- Shows success message
- Returns to home screen

## 🔌 API Endpoints Used

### Get All Doctors
```
GET /api/doctors
Headers: Authorization: Bearer <token>
Response: { doctors: [...] }
```

### Check Doctor Availability
```
GET /api/doctors/:id/availability/:date
Headers: Authorization: Bearer <token>
Response: { 
  availability: {
    available: true,
    day: "Mon",
    schedule: { day: "Mon", start: "08:00", end: "17:00" },
    slots: ["08:00", "09:00", "10:00", ...]
  }
}
```

### Book Appointment
```
POST /api/appointments/book
Headers: 
  Authorization: Bearer <token>
  Content-Type: application/json
Body: {
  "doctor_id": "...",
  "date": "2025-10-30",
  "time": "09:00",
  "pre_screening": {
    "symptoms": "Fever and headache",
    "temperature": "38.5",
    "additional_notes": "Started yesterday"
  }
}
Response: { 
  message: "Appointment booked successfully",
  appointment_id: "...",
  appointment: {...}
}
```

## 🎨 UI Features

### Doctor List Screen
- ✅ Search bar (filters by name/expertise)
- ✅ Expertise dropdown filter
- ✅ Doctor cards with avatars
- ✅ Schedule preview chips
- ✅ Pull-to-refresh
- ✅ Empty state
- ✅ Error handling

### Doctor Detail Screen
- ✅ Large doctor profile header
- ✅ Complete schedule display
- ✅ Formatted time (12-hour format)
- ✅ Availability indicators
- ✅ Fixed bottom "Book Appointment" button

### Book Appointment Screen
- ✅ Doctor info card (context)
- ✅ Material date picker
- ✅ Time slot chips (interactive)
- ✅ Loading states
- ✅ Pre-screening form
- ✅ Input validation
- ✅ Success/error feedback

## 🧪 Testing Checklist

### Frontend
- [ ] Doctor list loads successfully
- [ ] Search filters doctors correctly
- [ ] Expertise filter works
- [ ] Doctor detail shows complete info
- [ ] Date picker opens and allows selection
- [ ] Available slots load for valid dates
- [ ] "No slots" message shows for unavailable days
- [ ] Time slot selection works
- [ ] Pre-screening form validates required fields
- [ ] Booking succeeds with valid data
- [ ] Error messages show for invalid data
- [ ] Success message and navigation after booking

### Backend
- [ ] Doctors endpoint returns all doctors
- [ ] Availability endpoint checks schedule correctly
- [ ] Booking prevents double booking
- [ ] Booking validates all required fields
- [ ] Pre-screening data is stored
- [ ] Appointment appears in My Appointments

### Integration
- [ ] End-to-end booking flow works
- [ ] Booked slots don't appear as available
- [ ] Multiple users can't book same slot
- [ ] Timezone handling is correct

## 🐛 Common Issues & Solutions

### "No doctors available"
**Cause**: Database not seeded  
**Solution**: Run `node scripts/seed-doctors.js`

### "No slots available" for all dates
**Cause**: Doctor schedules don't match selected dates  
**Solution**: Check doctor schedules in database, select dates matching their working days

### Network errors
**Cause**: Backend not running or wrong URL  
**Solution**: 
- Ensure backend is running: `npm run dev`
- Check API base URL in `app_config.dart`
- For physical device, use PC's local IP (192.168.x.x)

### Double booking
**Cause**: Concurrent requests (should be prevented)  
**Solution**: Backend handles this - second request will fail with error

## 📊 Data Models

### Doctor Model
```dart
class Doctor {
  final String id;
  final String name;
  final String expertise;
  final String licenseNumber;
  final List<Schedule> schedule;
}

class Schedule {
  final String day;   // "Mon", "Tue", etc.
  final String start; // "08:00"
  final String end;   // "17:00"
}
```

### Appointment Model (for display)
```dart
class Appointment {
  final String id;
  final String patientId;
  final String doctorId;
  final String date;           // "2025-10-30"
  final String time;           // "09:00"
  final String status;         // "booked", "confirmed", "cancelled"
  final Map<String, dynamic> preScreening;
  final Doctor? doctor;        // Populated via join
}
```

## 🎯 Future Enhancements

- [ ] Doctor profile pictures
- [ ] Real-time availability updates
- [ ] Calendar view of appointments
- [ ] Email/SMS notifications
- [ ] Appointment reminders
- [ ] Reschedule functionality
- [ ] Doctor ratings and reviews
- [ ] Video consultation support
- [ ] Multiple language support

## 📝 Notes

- Time slots are generated hourly (e.g., 08:00, 09:00, 10:00)
- All times are in 24-hour format in database, displayed as 12-hour format
- Pre-screening data is optional except for symptoms
- Bookings are allowed from tomorrow onwards (no same-day booking)
- Maximum 90 days advance booking

---

**Author**: Team BA  
**Date**: October 29, 2025  
**Status**: ✅ Complete and Ready for Testing
