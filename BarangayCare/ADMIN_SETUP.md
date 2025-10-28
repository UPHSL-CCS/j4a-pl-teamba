# Admin Dashboard Setup Guide

## Overview
The BarangayCare admin dashboard allows administrators to:
- Approve/reject appointment bookings
- Manage medicine inventory
- Track stock levels and history
- View system statistics
- Manage patient medicine requests

## Default Admin Account

**Email:** `admin@barangaycare.ph`  
**Password:** `Admin@123456`  
**Role:** `super_admin`

## Setup Instructions

### Step 1: Create Admin in MongoDB (✅ COMPLETED)
The admin record has been created in the `admins` collection.

### Step 2: Create Firebase User

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `barangaycare-app`
3. Go to **Authentication** → **Users**
4. Click **Add User**
5. Enter:
   - Email: `admin@barangaycare.ph`
   - Password: `Admin@123456`
6. Click **Add User**
7. **Copy the User UID** (e.g., `abc123def456...`)

### Step 3: Link Firebase UID to Admin Record

**Option A: Using the update script (Recommended)**
```bash
cd BarangayCare/backend
npm run update:admin-uid
```
Then follow the prompts:
- Email: `admin@barangaycare.ph` (press Enter for default)
- Firebase UID: Paste the UID you copied from Firebase

**Option B: Using MongoDB directly**
```bash
# Connect to MongoDB
mongosh "YOUR_MONGODB_URI"

# Use the database
use barangaycare

# Update the admin record
db.admins.updateOne(
  { email: "admin@barangaycare.ph" },
  { $set: { firebase_uid: "PASTE_YOUR_FIREBASE_UID_HERE" } }
)
```

### Step 4: Verify Admin Access

1. Start the backend server:
```bash
cd BarangayCare/backend
npm run dev
```

2. Test admin login in the app
3. Navigate to admin dashboard (to be implemented in Flutter)

## Admin API Endpoints

All admin endpoints require authentication and admin role.

### Dashboard Statistics
```
GET /api/admin/dashboard/stats
```
Returns:
- Pending appointments count
- Today's appointments
- Pending medicine requests
- Low stock medicines count
- Total patients
- Total active doctors

### Appointment Management
```
GET    /api/admin/appointments?status=pending&page=1&limit=20
PATCH  /api/admin/appointments/:id/approve
PATCH  /api/admin/appointments/:id/reject
```

### Medicine Management
```
GET    /api/admin/medicines/low-stock
POST   /api/admin/medicines                 # Add new medicine
PUT    /api/admin/medicines/:id             # Update medicine
DELETE /api/admin/medicines/:id             # Delete medicine
POST   /api/admin/medicines/:id/adjust      # Adjust stock
```

## Database Collections

### admins
```javascript
{
  _id: ObjectId,
  firebase_uid: String,
  email: String,
  full_name: String,
  role: 'super_admin' | 'admin' | 'staff',
  is_active: Boolean,
  created_at: Date,
  updated_at: Date
}
```

### appointments (Updated Schema)
```javascript
{
  _id: ObjectId,
  patient_id: ObjectId,
  doctor_id: ObjectId,
  date: String,
  time: String,
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled',
  pre_screening: Object,
  admin_notes: String,
  rejection_reason: String,
  approved_by: ObjectId,      // admin._id
  approved_at: Date,
  rejected_by: ObjectId,      // admin._id
  rejected_at: Date,
  created_at: Date,
  updated_at: Date
}
```

### stock_history
```javascript
{
  _id: ObjectId,
  medicine_id: ObjectId,
  change_type: 'restock' | 'dispense' | 'expired' | 'adjustment',
  quantity_change: Number,    // +50 or -10
  previous_stock: Number,
  new_stock: Number,
  reason: String,
  admin_id: ObjectId,
  reference_id: ObjectId,     // Optional: medicine_request_id
  timestamp: Date
}
```

## Workflow

### Appointment Approval Flow
1. Patient books appointment → Status: `pending`
2. Admin reviews appointment details
3. Admin approves → Status: `approved` (patient can attend)
4. Admin rejects → Status: `rejected` (with reason)
5. After consultation → Status: `completed`

### Medicine Stock Adjustment Flow
1. Admin views current stock levels
2. Admin selects "Adjust Stock"
3. Enters:
   - Change type: restock/dispense/expired/adjustment
   - Quantity change: +/- number
   - Reason: explanation
4. System records in `stock_history`
5. Stock updated in `medicine_inventory`

## Security Notes

- ⚠️ Change the default admin password after first login
- 🔒 Admin endpoints protected by Firebase authentication + admin middleware
- 📝 All stock changes are logged with admin ID and timestamp
- ✅ Admin actions are auditable through history collections

## Next Steps

After setup is complete:
1. Implement Flutter admin dashboard screens
2. Add medicine request approval workflow
3. Implement prescription image upload
4. Add low stock email alerts
5. Create admin reports and analytics

## Troubleshooting

**Issue:** Cannot login as admin
- Verify Firebase user exists with correct email
- Check Firebase UID matches the one in MongoDB
- Ensure `is_active: true` in admin record

**Issue:** "Admin access required" error
- Check if Firebase UID is correctly linked
- Verify admin record exists in MongoDB
- Check backend logs for authentication errors

**Issue:** Admin routes not working
- Ensure backend server is running
- Check if admin middleware is properly applied
- Verify authentication token is being sent

## Support

For issues or questions, check:
1. Backend logs: `npm run dev` output
2. MongoDB admin record: `db.admins.find()`
3. Firebase Authentication console
