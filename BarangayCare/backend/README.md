# BarangayCare Backend API

Backend API for BarangayCare healthcare management system built with Hono.js, MongoDB, and Firebase Authentication.

## 🚀 Tech Stack

- **Framework**: Hono.js (Fast, lightweight web framework)
- **Database**: MongoDB (NoSQL)
- **Authentication**: Firebase Admin SDK
- **Runtime**: Node.js

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB instance
- Firebase project with Admin SDK credentials

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy `env.example` to `.env`:

```bash
cp env.example .env
```

Update the `.env` file with your credentials (already configured for development).  
Make sure to include:

| Variable | Description |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string |
| `FIREBASE_PROJECT_ID` | Firebase project identifier |
| `GEMINI_API_KEY` | Google Gemini API key used by the chatbot |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed frontend origins |

### 3. Firebase Admin SDK Setup

Download your Firebase Admin SDK private key:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `barangaycare-uphsl`
3. Go to Project Settings > Service Accounts
4. Click "Generate New Private Key"
5. Save the JSON file as `firebase-service-account.json` in the `backend/` directory

⚠️ **IMPORTANT**: The `firebase-service-account.json` file is gitignored and should never be committed to version control.

### 4. Start Development Server

```bash
npm run dev
```

The server will start at `http://localhost:3000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   └── firebase.js          # Firebase Admin initialization
│   ├── middleware/
│   │   └── auth.middleware.js   # JWT verification middleware
│   ├── routes/
│   │   ├── auth.route.js        # Authentication endpoints
│   │   ├── appointments.route.js # Appointment management
│   │   ├── doctors.route.js     # Doctor information
│   │   └── medicine.route.js    # Medicine inventory
│   ├── services/
│   │   ├── appointment.service.js # Appointment business logic
│   │   ├── doctor.service.js     # Doctor availability logic
│   │   └── medicine.service.js   # Medicine request logic
│   └── index.js                  # Application entry point
├── .env                          # Environment variables (not committed)
├── .env.example                  # Environment template
├── .gitignore
├── package.json
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register-patient` - Register patient profile after Firebase auth
- `GET /api/auth/profile` - Get current patient profile
- `PUT /api/auth/profile` - Update patient profile (name, barangay, contact number)

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor details
- `GET /api/doctors/:id/availability/:date` - Check availability for date

### Appointments
- `POST /api/appointments/book` - Book an appointment
- `GET /api/appointments/my-appointments` - Get patient's appointments
- `PATCH /api/appointments/:id/cancel` - Cancel an appointment

### Medicine
- `GET /api/medicine` - Get available medicines
- `POST /api/medicine/request` - Request medicine

All endpoints (except health check) require Firebase authentication token in the Authorization header:
```
Authorization: Bearer <firebase_id_token>
```

## 🎯 Key Features

### Control Flow & Expressions
- **Appointment Booking**: Validates doctor availability and prevents double booking
- **Medicine Request**: Checks prescription requirements and stock levels

### Concurrency Handling
- **Atomic Stock Updates**: Uses MongoDB's `$inc` with conditions to prevent race conditions
- **Safe Double Booking Prevention**: Database-level uniqueness checks

### Modularity
- **Service Layer**: Reusable business logic separated from routes
- **Middleware**: Authentication logic centralized
- **Configuration**: Database and Firebase setup isolated

## 🧪 Testing the API

### Health Check
```bash
curl http://localhost:3000
```

### Register Patient (requires Firebase token)
```bash
curl -X POST http://localhost:3000/api/auth/register-patient \
  -H "Authorization: Bearer <your_firebase_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Dela Cruz",
    "barangay": "Barangay 1",
    "contact": "09171234567"
  }'
```

## 🔒 Security Notes

- All routes (except health check) require Firebase authentication
- Environment variables contain sensitive data and are not committed
- Firebase service account JSON must be kept secure
- CORS is configured to allow only specified origins

## 📝 Development Notes

- Use `npm run dev` for development with auto-reload
- Use `npm start` for production
- MongoDB connection string includes production credentials
- Firebase project: `barangaycare-uphsl`

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify your IP is whitelisted in MongoDB Atlas
- Check connection string format in `.env`

### Firebase Authentication Issues
- Ensure `firebase-service-account.json` exists
- Verify Firebase project ID matches in `.env`

### Port Already in Use
- Change PORT in `.env` file
- Kill process using port 3000: `lsof -ti:3000 | xargs kill`

