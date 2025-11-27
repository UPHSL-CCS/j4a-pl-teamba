# BarangayCare Team Task Assignments
## Quick Reference Guide

---

## 👥 Team Members & Features

### 🚨 Jorome - Emergency Hotlines & Contacts
**Complexity**: Medium  

**What You'll Build:**
- Emergency contact directory
- Quick dial for ambulance, hospital, police, fire
- Location-based nearest hospital finder
- SMS emergency alerts
- Admin panel to manage contacts

**Key Technologies:**
- Backend: Emergency service module, distance calculation
- Frontend: Flutter url_launcher (calls), geolocator (location), Google Maps
- Database: emergency_contacts, emergency_logs collections

**Your Tasks:**
- [x] Week 1: Backend API + seeding sample contacts *(see `backend/src/routes/emergency.route.js`, `scripts/seed-emergency-contacts.js` - 12 contacts with geospatial search)*
- [x] Week 2: Frontend UI + call/SMS integration *(see `frontend/lib/screens/emergency/emergency_contacts_screen.dart`, `lib/services/emergency_service.dart` - quick dial + url_launcher)*
- [x] Week 3: Location services + maps + testing *(geolocator integration, nearest finder with 10km radius, emergency action logging complete)*

---

### 🤖 Anthony - AI Chatbot for Barangay Health
**Complexity**: High  

**What You'll Build:**
- Intelligent health chatbot
- Symptom checker
- Medicine information lookup
- Appointment booking assistant
- Multi-language support (English & Filipino)

**Key Technologies:**
- Backend: NLP (compromise.js), intent classification, FAQ system
- Frontend: Chat UI with bubbles, typing indicators
- Database: chat_messages, faq_database, symptom_database

**Your Tasks:**
- [x] Week 1: Backend chatbot logic + NLP + FAQ database *(see `backend/src/services/chatbotService.js`, `services/nlpService.js`, `services/symptomCheckerService.js`, and `scripts/seed-faq.js`)*
- [x] Week 2: Frontend chat UI + integration *(see `frontend/lib/screens/chatbot/` + `lib/services/chatbot_service.dart`)*
- [x] Week 3: Improve responses + testing + refine *(intent routing, Gemini fallback, bilingual support, and request queueing implemented; continue real-device testing)*

---

### 💊 Larie - Prescription Upload for Medicine Requests
**Complexity**: High  

**What You'll Build:**
- Upload prescription images/PDFs
- Admin approval workflow
- Request status tracking
- Admin dashboard for reviewing prescriptions
- Rejection/approval with comments

**Key Technologies:**
- Backend: Multer (file upload), storage service, approval workflow
- Frontend: image_picker, file_picker, camera integration
- Database: Updated medicine_requests, prescription_files

**Your Tasks:**
- [x] Week 1: Backend file upload + approval logic *(see `backend/src/routes/prescription.route.js`, `middleware/upload.js` - multer with 5MB limit, image validation)*
- [x] Week 2: Frontend upload UI + patient tracking *(see `frontend/lib/screens/prescription/upload_prescription_screen.dart`, `lib/services/prescription_service.dart` - camera/gallery picker)*
- [x] Week 3: Admin dashboard + review system + testing *(admin view integrated in `medicine_request_detail_screen.dart` - prescription viewer with zoom/pan, tested on emulator)*

---

### 📊 Agatha - Health Records & Appointment History
**Complexity**: Medium-High  

**What You'll Build:**
- Complete patient health profile
- Consultation history with doctor notes
- Vital signs tracking (BP, temperature, weight)
- Health trends and analytics
- Downloadable PDF reports
- Document upload (lab results, x-rays)

**Key Technologies:**
- Backend: Health records service, PDF generation (PDFKit)
- Frontend: Charts (fl_chart), PDF viewer, file upload
- Database: consultation_notes, vital_signs, medical_documents, patient_conditions

**Your Tasks:**
- [ ] Week 1: Backend health records API + schemas
- [ ] Week 2: Frontend health records UI + vitals tracking
- [ ] Week 3: PDF reports + charts + analytics + testing

---

## 📋 Weekly Sprint Plan

### Week 1: Backend Development
**All members focus on backend**

| Member | Tasks |
|--------|-------|
| Jorome | Create emergency_contacts collection, implement service, API endpoints, seed data |
| Anthony | Create chatbot collections, NLP service, intent classifier, FAQ database, API endpoints |
| Larie | Update medicine_requests schema, file upload service, approval workflow, API endpoints |
| Agatha | Create health records collections, service module, consultation notes, vitals API |

**Week 1 Deliverables:**
- [x] All database schemas created
- [x] All API endpoints working
- [x] Sample data seeded
- [x] Postman/API testing complete

---

### Week 2: Frontend Development
**All members focus on UI**

| Member | Tasks |
|--------|-------|
| Jorome | Emergency contacts screen, quick dial buttons, category filters, search |
| Anthony | Chatbot screen, chat bubbles, message input, conversation history |
| Larie | Prescription upload UI, camera/gallery picker, request status tracking |
| Agatha | Health records screen, consultation history, vital signs input form |

**Week 2 Deliverables:**
- [x] All screens designed and functional
- [x] API integration complete
- [x] Basic error handling
- [x] Navigation working

---

### Week 3: Advanced Features & Integration
**Polish and complete features**

| Member | Tasks |
|--------|-------|
| Jorome | Location services, nearest hospital finder, Google Maps integration, testing |
| Anthony | Improve chatbot responses, test various queries, language support |
| Larie | Admin dashboard for prescription approval, review UI, testing |
| Agatha | Health trends charts, PDF report generation, analytics dashboard |

**Week 3 Deliverables:**
- [x] Advanced features complete (Jorome & Larie)
- [x] Admin features working (Larie's prescription review)
- [ ] Charts and visualizations (Agatha pending)
- [ ] PDF generation (Agatha pending)

---

### Week 4: Testing & Documentation
**All members collaborate**

**Shared Tasks:**
- [ ] End-to-end testing
- [ ] Bug fixes
- [ ] Performance optimization
- [ ] User documentation
- [ ] Code review
- [ ] Demo preparation
- [ ] Final polish

---

## 🔧 Setup Instructions

### 1. Create Your Feature Branch
```bash
# Jorome
git checkout -b feature/emergency-contacts

# Anthony
git checkout -b feature/chatbot

# Larie
git checkout -b feature/prescription-upload

# Agatha
git checkout -b feature/health-records
```

### 2. Install Dependencies

**Backend (all members):**
```bash
cd backend
npm install multer pdfkit node-cron compromise geolib
```

**Frontend (all members):**
Add to `pubspec.yaml`:
```yaml
dependencies:
  image_picker: ^1.0.4
  file_picker: ^5.5.0
  url_launcher: ^6.1.14
  geolocator: ^10.1.0
  google_maps_flutter: ^2.5.0
  fl_chart: ^0.64.0
  pdf: ^3.10.6
  path_provider: ^2.1.1
```

Then run:
```bash
cd frontend
flutter pub get
```

---

## 📁 File Structure You'll Create

### Jorome - Emergency Contacts
```
backend/src/
├── services/emergencyService.js       (NEW)
├── routes/emergency.route.js          (NEW)
└── scripts/seed-emergency-contacts.js (NEW)

frontend/lib/
├── screens/emergency/
│   ├── emergency_contacts_screen.dart (NEW)
│   └── emergency_detail_screen.dart   (NEW)
└── services/emergency_service.dart    (NEW)
```

### Anthony - Chatbot
```
backend/src/
├── services/chatbotService.js         (NEW)
├── services/nlpService.js             (NEW)
├── services/symptomCheckerService.js  (NEW)
├── routes/chatbot.route.js            (NEW)
└── scripts/seed-faq.js                (NEW)

frontend/lib/
├── screens/chatbot/
│   ├── chatbot_screen.dart            (NEW)
│   └── widgets/
│       ├── chat_bubble.dart           (NEW)
│       └── quick_actions.dart         (NEW)
└── services/chatbot_service.dart      (NEW)
```

### Larie - Prescription Upload
```
backend/src/
├── services/prescriptionService.js    (NEW)
├── services/storageService.js         (NEW)
├── routes/prescription.route.js       (NEW)
└── middleware/upload.js               (NEW)

frontend/lib/
├── screens/prescription/
│   ├── prescription_upload_screen.dart     (NEW)
│   ├── prescription_requests_screen.dart   (NEW)
│   └── admin/
│       ├── prescription_approval_screen.dart (NEW)
│       └── prescription_review_screen.dart   (NEW)
└── services/prescription_service.dart (NEW)
```

### Agatha - Health Records
```
backend/src/
├── services/healthRecordsService.js   (NEW)
├── services/reportService.js          (NEW)
├── routes/healthRecords.route.js      (NEW)
└── scripts/seed-sample-records.js     (NEW)

frontend/lib/
├── screens/health_records/
│   ├── health_records_screen.dart     (NEW)
│   ├── consultation_history_screen.dart (NEW)
│   ├── vital_signs_screen.dart        (NEW)
│   ├── add_vitals_screen.dart         (NEW)
│   └── health_report_screen.dart      (NEW)
└── services/health_records_service.dart (NEW)
```

---

## 🎯 Programming Concepts Checklist

### Control Flow - All Members Must Demonstrate
- [ ] **Jorome**: Category filtering (IF-ELSE), distance sorting
- [ ] **Anthony**: Intent classification (nested IF), response logic
- [ ] **Larie**: Approval workflow (IF-ELSE), file validation
- [ ] **Agatha**: Access control (IF-ELSE), trend analysis

### Subprograms - All Members Must Demonstrate
- [ ] **Jorome**: Emergency service functions (getAllContacts, filterByCategory, calculateDistance)
- [ ] **Anthony**: NLP functions (classifyIntent, extractKeywords, generateResponse)
- [ ] **Larie**: Upload functions (validateFile, uploadPrescription, reviewRequest)
- [ ] **Agatha**: Health record functions (getHealthRecords, analyzeHealthTrends, generateReport)

### Abstraction - All Members Must Demonstrate
- [ ] **Jorome**: Abstract EmergencyService interface
- [ ] **Anthony**: Abstract ChatbotService and NLPProcessor interfaces
- [ ] **Larie**: Abstract PrescriptionService and FilePickerService interfaces
- [ ] **Agatha**: Abstract HealthRecordsService interface

### Concurrency - All Members Must Demonstrate
- [ ] **Jorome**: Caching for high-traffic emergency lookups
- [ ] **Anthony**: Message queue for rate limiting chatbot requests
- [ ] **Larie**: Optimistic locking for concurrent prescription approvals
- [ ] **Agatha**: Document versioning for concurrent health record updates

---

## 📞 Communication & Collaboration

### Daily Standup (15 min)
**Time**: Every morning before coding  
**Format**:
1. What I completed yesterday
2. What I'm working on today
3. Any blockers/issues

### Code Review Process
1. Complete your task
2. Test thoroughly
3. Create pull request
4. Tag 1-2 team members for review
5. Address feedback
6. Merge to main

### Shared Resources
- **Documentation**: This document + main NEW_FEATURES_ENHANCEMENT.md
- **API Testing**: Share Postman collection
- **Database**: Connect to same MongoDB instance
- **Firebase**: Use same Firebase project

---

## 🚨 Important Notes

### API Integration
All features must integrate with existing authentication:
```javascript
// All endpoints require Firebase auth token
Authorization: Bearer <firebase_id_token>
```

### Database Naming Convention
- Collections: `snake_case` (e.g., `emergency_contacts`)
- Fields: `snake_case` (e.g., `phone_number`)
- Keep consistent with existing collections

### Error Handling
Every API endpoint must return proper errors:
```javascript
// Success
{ success: true, data: {...} }

// Error
{ success: false, error: "Error message" }
```

### Git Commit Messages
Use clear, descriptive messages:
```bash
✅ Good:
git commit -m "Add emergency contact API endpoints"
git commit -m "Implement chatbot intent classification"

❌ Bad:
git commit -m "update"
git commit -m "fix bug"
```

---

## 🎯 Success Criteria

### Your feature is COMPLETE when:
- [ ] All backend API endpoints work
- [ ] Frontend UI is complete and functional
- [ ] Integrated with existing auth system
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Tested on physical device
- [ ] Code reviewed and merged
- [ ] Documentation updated
- [ ] Demo-ready

---

## 🆘 Getting Help

### When You're Stuck:
1. Check the main documentation (NEW_FEATURES_ENHANCEMENT.md)
2. Review existing similar code in the project
3. Ask team members in group chat
4. Google/Stack Overflow for technical issues
5. Team code review session if needed

### Common Issues:
- **API not connecting**: Check if backend is running on correct IP
- **File upload failing**: Check file size limits and CORS settings
- **Database errors**: Verify collection names and field names
- **Flutter build errors**: Run `flutter clean` then `flutter pub get`

---

## 📈 Progress Tracking

### Weekly Team Meeting
**Review together:**
- [ ] Features completed
- [ ] Blockers encountered
- [ ] Next week's priorities
- [ ] Integration points

### Individual Progress
**Track your own progress:**
- [ ] Backend API: __%
- [ ] Frontend UI: __%
- [ ] Integration: __%
- [ ] Testing: __%
- [ ] Documentation: __%

---

## 🚀 Let's Build Something Amazing!

Remember:
- **Communication is key** - Ask questions early
- **Test frequently** - Don't wait until the end
- **Commit often** - Small, frequent commits are better
- **Help each other** - We succeed together as a team
- **Have fun** - Enjoy the learning process!

---

**Good luck, Team! You got this! 💪**

---

**Document Created**: November 18, 2025  
**Team**: Larie, Jorome, Agatha, Anthony  
**Project**: BarangayCare Enhancement

