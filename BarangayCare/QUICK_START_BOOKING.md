# Book Consultation - Quick Start Guide

## 🚀 Quick Setup (5 Minutes)

### Step 1: Seed Doctor Data
Open PowerShell and run:
```powershell
cd C:\Users\USER\TEAMBA\j4a-pl-teamba\BarangayCare\backend
node scripts/seed-doctors.js
```

You should see:
```
🌱 Starting doctor seeding...
🗑️  Deleted X existing doctors
✅ Successfully seeded 6 doctors
👨‍⚕️ Seeded Doctors:
1. Dr. Maria Santos - General Practice
   License: PRC-GP-2015-001234
   Schedule: Mon, Wed, Fri
...
✨ Seeding completed successfully!
```

### Step 2: Start Backend (if not running)
```powershell
cd C:\Users\USER\TEAMBA\j4a-pl-teamba\BarangayCare\backend
npm run dev
```

### Step 3: Run Flutter App
```powershell
cd C:\Users\USER\TEAMBA\j4a-pl-teamba\BarangayCare\frontend
flutter run -d <your-device-id>
```

## 📱 Testing the Feature

### Test Flow 1: Browse Doctors
1. Open the app and login
2. Tap **"Book Consultation"** from home screen
3. ✅ You should see 6 doctors listed
4. Try the **search bar** - type "Maria"
5. Try the **expertise filter** - select "Pediatrics"
6. ✅ Filtering should work correctly

### Test Flow 2: View Doctor Details
1. Tap on **"Dr. Maria Santos"**
2. ✅ You should see:
   - Doctor name and expertise
   - License number
   - Weekly schedule (Mon, Wed, Fri: 8:00 AM - 5:00 PM)
   - "Book Appointment" button at bottom

### Test Flow 3: Book an Appointment
1. Tap **"Book Appointment"**
2. Tap on the **date field**
3. Select **tomorrow's date** (or any Monday, Wednesday, or Friday)
4. ✅ Available time slots should appear (08:00, 09:00, 10:00, etc.)
5. Select a time slot (e.g., **09:00**)
6. ✅ Pre-screening form should appear
7. Fill in:
   - **Symptoms**: "Fever and headache"
   - **Temperature**: "38.5"
   - **Notes**: "Started yesterday"
8. Tap **"Confirm Booking"**
9. ✅ Should show success message
10. ✅ Should navigate back to home

### Test Flow 4: View Your Appointment
1. From home screen, tap **"My Appointments"**
2. ✅ Your new appointment should appear at the top
3. ✅ Should show:
   - Doctor name
   - Date and time
   - Status: "booked"
   - Pre-screening data

### Test Flow 5: Test Unavailable Day
1. Tap **"Book Consultation"**
2. Select **"Dr. Juan Dela Cruz"** (works Tue, Thu, Sat)
3. Tap **"Book Appointment"**
4. Select a **Monday** (not in his schedule)
5. ✅ Should show "Doctor not available on this day"

### Test Flow 6: Test Double Booking Prevention
1. Book an appointment (e.g., Dr. Maria Santos, tomorrow 09:00)
2. Try to book the **same doctor, date, and time** again
3. ✅ Should show "Time slot already booked"

## 🐛 Troubleshooting

### No doctors showing up
**Problem**: Doctor list is empty  
**Solution**: Run the seed script again
```powershell
cd C:\Users\USER\TEAMBA\j4a-pl-teamba\BarangayCare\backend
node scripts/seed-doctors.js
```

### "Network error" when loading doctors
**Problem**: Backend not running or wrong URL  
**Solution**: 
1. Check backend is running: `npm run dev`
2. Check API base URL in `frontend/lib/config/app_config.dart`
3. For physical device, use your PC's local IP (e.g., 192.168.68.100)

### No time slots available
**Problem**: Selected date doesn't match doctor's schedule  
**Solution**: 
- Dr. Maria Santos works: Mon, Wed, Fri
- Dr. Juan Dela Cruz works: Tue, Thu, Sat
- Select dates matching their schedules

### App crashes or shows error
**Problem**: Flutter dependencies or compilation issue  
**Solution**:
```powershell
cd C:\Users\USER\TEAMBA\j4a-pl-teamba\BarangayCare\frontend
flutter clean
flutter pub get
flutter run
```

## 📋 Sample Test Data

### Available Doctors (After Seeding)

| Doctor Name | Expertise | Schedule |
|------------|-----------|----------|
| Dr. Maria Santos | General Practice | Mon, Wed, Fri (8AM-5PM) |
| Dr. Juan Dela Cruz | Pediatrics | Tue, Thu, Sat (9AM-4PM) |
| Dr. Ana Reyes | Internal Medicine | Mon, Tue, Thu (10AM-6PM) |
| Dr. Roberto Garcia | Family Medicine | Mon, Wed, Fri, Sat (8AM-4PM) |
| Dr. Carmen Lopez | OB-GYN | Tue, Thu, Fri (1PM-7PM) |
| Dr. Pedro Martinez | Cardiology | Wed, Fri (2PM-6PM) |

### Test Scenarios

#### ✅ Scenario 1: Normal Booking
- Doctor: Maria Santos
- Date: Next Monday
- Time: 09:00
- Symptoms: "Cough and cold"
- Expected: Success

#### ✅ Scenario 2: Evening Appointment
- Doctor: Carmen Lopez
- Date: Next Tuesday
- Time: 14:00 (2 PM)
- Symptoms: "Regular checkup"
- Expected: Success

#### ❌ Scenario 3: Unavailable Day
- Doctor: Maria Santos
- Date: Next Tuesday
- Expected: "Doctor not available on this day"

#### ❌ Scenario 4: Missing Symptoms
- Doctor: Any
- Date: Any valid date
- Time: Any slot
- Symptoms: (leave empty)
- Expected: "Please describe your symptoms"

## 🎯 Success Criteria

After completing all tests, you should have:
- ✅ Successfully browsed and filtered doctors
- ✅ Viewed doctor details and schedules
- ✅ Booked at least one appointment
- ✅ Seen the appointment in "My Appointments"
- ✅ Verified double booking prevention
- ✅ Tested unavailable day handling
- ✅ Tested form validation

## 📸 Expected Screenshots

### 1. Doctor List
- Grid of doctor cards
- Search bar at top
- Expertise filter dropdown

### 2. Doctor Details
- Large profile section
- Complete schedule list
- "Book Appointment" button

### 3. Booking Screen
- Date selector
- Time slot chips
- Pre-screening form
- "Confirm Booking" button

### 4. My Appointments
- List of booked appointments
- Doctor info and date/time
- "Cancel" button

## 🎉 What's Next?

After successful testing:
1. Commit and push changes to repository
2. Update team on completion
3. Prepare demo for presentation
4. Consider additional features:
   - Appointment notifications
   - Reschedule functionality
   - Doctor ratings
   - Video consultation

---

**Need Help?**
Check `BOOKING_FEATURE.md` for detailed documentation.

**Ready to Ship!** ✨
All core features are now complete and tested.
