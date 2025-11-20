# BarangayCare

A mobile healthcare application for barangay communities, enabling patients to book consultations with doctors and request medicines from the barangay health center.

## 📋 Project Overview

BarangayCare is a full-stack healthcare management system designed for barangay (neighborhood) communities in the Philippines. It streamlines the process of accessing healthcare services through:

- **Patient Registration & Authentication** via Firebase
- **Doctor Consultation Booking** with real-time availability
- **Pre-Screening Forms** before consultations
- **Medicine Request System** with automatic inventory management
- **Appointment Management** for patients

## 🏗️ Architecture

### Frontend
- **Framework**: Flutter
- **State Management**: Provider
- **Authentication**: Firebase Auth
- **Platforms**: Android, iOS, Web

### Backend
- **Framework**: Hono.js (Node.js)
- **Database**: MongoDB (NoSQL)
- **Authentication**: Firebase Admin SDK
- **API Style**: RESTful

## 🚀 Project Structure

```
BarangayCare/
├── frontend/           # Flutter mobile application
│   ├── lib/
│   │   ├── config/    # App & Firebase configuration
│   │   ├── providers/ # State management
│   │   ├── services/  # API services
│   │   └── screens/   # UI screens
│   └── README.md
│
├── backend/           # Hono.js API server
│   ├── src/
│   │   ├── config/   # Database & Firebase setup
│   │   ├── routes/   # API endpoints
│   │   ├── services/ # Business logic
│   │   └── middleware/ # Auth middleware
│   └── README.md
│
└── README.md         # This file (Phase 1 overview)
```

## 🔑 Key Features

### 1. Authentication & Authorization
- Firebase-based email/password authentication
- Secure token-based API access
- Patient profile management

### 2. Doctor Consultation Booking
- View doctor schedules and availability
- Book appointments at available time slots
- Prevents double-booking (concurrency handling)
- Pre-screening form submission

### 3. Medicine Request System
- Browse available medicines with stock levels
- Request medicines with automatic stock deduction
- Prescription validation for controlled medicines
- Atomic updates for concurrency safety

### 4. Appointment Management
- View upcoming and past appointments
- Cancel appointments
- See doctor details and consultation notes

## 🛠️ Technology Stack

| Component | Technology |
|-----------|------------|
| Frontend | Flutter 3.0+ |
| Backend | Hono.js (Node.js) |
| Database | MongoDB Atlas |
| Authentication | Firebase (Email/Password) |
| State Management | Provider |
| HTTP Client | http package |
| API Design | RESTful |

## 📚 Programming Language Concepts Demonstrated

### 1. Control Flow & Expressions
- **Appointment Booking Logic**: Validates doctor availability AND checks for conflicts
- **Medicine Request Logic**: Checks prescription requirements AND stock levels
- **Conditional rendering** in Flutter UI

### 2. Subprograms & Modularity
- **Backend Services**: Reusable functions (checkAvailability, bookAppointment, requestMedicine)
- **Flutter Services**: Separated API logic from UI
- **Middleware**: Authentication logic centralized

### 3. Concurrency Handling
- **Atomic Stock Updates**: MongoDB `$inc` with conditions prevents race conditions
- **Double Booking Prevention**: Database-level checks ensure slot uniqueness
- **Safe multi-user operations**: Prevents negative stock or double bookings

## 🚦 Getting Started

### Prerequisites

#### Backend
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)
- Firebase project with Admin SDK

#### Frontend
- Flutter SDK (3.0+)
- Dart SDK
- Android Studio / Xcode (for mobile)
- Firebase project configured

### Quick Start

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd j4a-pl-teamba/BarangayCare
```

#### 2. Setup Backend
```bash
cd backend
npm install

# Configure .env file (already set up for development)
# Add firebase-service-account.json from Firebase Console

npm run dev
```

Backend will start at `http://localhost:3000`

**For physical device testing:**
- Update `API_BASE_URL` in `frontend/lib/config/app_config.dart` to your PC's local IP (e.g., `http://192.168.254.192:3000`)
- Ensure backend is running with `0.0.0.0` binding (configured in server)

#### 3. Seed Sample Data
```bash
cd backend
node scripts/seed-medicines.js
```

This will populate the database with 10 sample medicines.

#### 4. Setup Frontend
```bash
cd frontend
flutter pub get

# Update Firebase App ID in lib/config/app_config.dart if needed
# Add google-services.json (Android) and GoogleService-Info.plist (iOS)

flutter run -d <device-id>
```

See detailed setup instructions in:
- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)

## 📋 Feature Checklist

Use the sprint tracker in [TEAM_TASK_ASSIGNMENTS.md](./TEAM_TASK_ASSIGNMENTS.md) for the current breakdown of deliverables per member.

## 🔐 Configuration

### Backend Environment Variables
Located in `backend/.env`:
- `MONGODB_URI`: MongoDB connection string
- `FIREBASE_PROJECT_ID`: Firebase project ID
- `PORT`: Server port (default: 3000)

⚠️ **Security Note**: The `.env` file contains credentials and should not be committed to version control.

### Frontend Configuration
Located in `frontend/lib/config/app_config.dart`:
- Firebase credentials
- API base URL
- Feature flags

⚠️ **Note**: Update `firebaseAppId` in `app_config.dart` with your actual Firebase app ID.

## 🗄️ Database Schema

### Collections

#### patients
```javascript
{
  _id: ObjectId,
  firebase_uid: String,
  email: String,
  name: String,
  barangay: String,
  contact: String,
  created_at: Date,
  updated_at: Date
}
```

#### doctors
```javascript
{
  _id: ObjectId,
  name: String,
  expertise: String,
  schedule: [
    { day: String, start: String, end: String }
  ]
}
```

#### appointments
```javascript
{
  _id: ObjectId,
  patient_id: ObjectId,
  doctor_id: ObjectId,
  date: String,  // YYYY-MM-DD
  time: String,  // HH:mm
  status: String,  // "booked" | "completed" | "cancelled"
  pre_screening: Object,
  created_at: Date,
  updated_at: Date
}
```

#### medicine_inventory
```javascript
{
  _id: ObjectId,
  med_name: String,
  description: String,
  stock_qty: Number,
  is_prescription_required: Boolean,
  created_at: Date,
  updated_at: Date
}
```

#### medicine_requests
```javascript
{
  _id: ObjectId,
  patient_id: ObjectId,
  medicine_id: ObjectId,
  medicine_name: String,
  quantity: Number,
  status: String,  // "fulfilled"
  created_at: Date
}
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register-patient` - Register patient profile
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/profile` - Update patient profile (name, barangay, contact)

### Doctors
- `GET /api/doctors` - List all doctors
- `GET /api/doctors/:id` - Get doctor details
- `GET /api/doctors/:id/availability/:date` - Check availability

### Appointments
- `POST /api/appointments/book` - Book appointment
- `GET /api/appointments/my-appointments` - Get patient's appointments
- `PATCH /api/appointments/:id/cancel` - Cancel appointment

### Medicine
- `GET /api/medicine` - List available medicines
- `POST /api/medicine/request` - Request medicine

All endpoints (except health check) require Firebase authentication token:
```
Authorization: Bearer <firebase_id_token>
```

## 📅 Development Timeline

This project is designed to be completed in **3 days**:

### Day 1: Foundation & Authentication ✅
- [x] Project structure setup
- [x] Firebase authentication (updated to v5.7.0)
- [x] Basic UI screens
- [x] Backend API setup
- [x] Database connection

### Day 2: Core Features 🔄
- [x] Medicine inventory system
- [x] Medicine request feature with UI
- [x] Data seeding for medicines
- [x] Prescription validation
- [ ] Doctor scheduling system
- [ ] Appointment booking logic

### Day 3: Polish & Testing 🔄
- [x] UI improvements for medicine feature
- [x] Error handling for medicine requests
- [x] Stock management and concurrency
- [x] Documentation updates
- [ ] Complete appointment booking
- [ ] Comprehensive testing
- [ ] Demo preparation

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
flutter test
```

## 🐛 Known Issues & Limitations

### Resolved Issues ✅
- ✅ Firebase Auth type casting error (fixed by updating to v5.7.0)
- ✅ Backend connectivity on physical devices (configured for LAN access)
- ✅ Medicine field name mismatches (standardized naming)

### Current Limitations ⚠️
- Firebase App ID configuration required for new deployments
- Desktop platform not configured (mobile-focused)
- Push notifications not implemented
- Admin dashboard not included
- Payment integration not included
- Book Consultation UI in progress (assigned to teammates)

### Future Enhancements 🚀 → NOW IN DEVELOPMENT!
**Phase 2 Enhancement** - NEW features being developed by the team:
- 🚨 **Emergency Hotlines & Contacts** (Jorome)
- 🤖 **AI Chatbot Assistant** (Anthony)
- 💊 **Prescription Upload System** (Larie)
- 📊 **Health Records & Analytics** (Agatha)

See [Enhancement Documentation](#phase-2-enhancements) below for details.

## 📖 Documentation

### Core System Documentation
- [Backend API Documentation](./backend/README.md)
- [Frontend App Documentation](./frontend/README.md)

### Phase 2 Enhancements (NEW!)
- [📋 NEW Features Enhancement Plan](./NEW_FEATURES_ENHANCEMENT.md) - Complete technical specification
- [👥 Team Task Assignments](./TEAM_TASK_ASSIGNMENTS.md) - Task breakdown per team member
- [🗺️ Features Roadmap](./FEATURES_ROADMAP.md) - Visual overview & implementation guide

## 👥 Team

**Project**: Programming Languages Class Project  
**Institution**: UPHSL (University of Perpetual Help System Laguna)  
**Course**: Programming Languages (PL)  
**Team**: Team BA

### Phase 2 Development Team
- **Jorome** - Emergency Hotlines & Contacts System
- **Anthony** - AI Chatbot Assistant
- **Larie** - Prescription Upload & Approval System
- **Agatha** - Health Records & Analytics

## 📝 License

This is an academic project created for educational purposes.

## 🤝 Contributing

This is a class project, but suggestions and feedback are welcome:

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For questions or issues:
- Check the documentation in each folder's README
- Review the latest progress in [TEAM_TASK_ASSIGNMENTS.md](./TEAM_TASK_ASSIGNMENTS.md)
- Consult [NEW_FEATURES_ENHANCEMENT.md](./NEW_FEATURES_ENHANCEMENT.md) for scope details

---

**Note**: This project demonstrates key programming language concepts including control flow, expressions, subprograms, modularity, and concurrency handling in a real-world healthcare application context.

