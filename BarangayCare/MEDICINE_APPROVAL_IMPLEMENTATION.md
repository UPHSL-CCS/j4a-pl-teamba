# Medicine Request Approval & Active Doctors - Implementation Summary

## Overview
This update implements admin approval workflow for medicine requests and active/inactive doctor management to ensure proper oversight of the BarangayCare system.

## Changes Made

### 1. Medicine Request Approval System

#### Backend Changes

**`src/services/medicine.service.js`**
- Changed medicine request flow from auto-fulfillment to admin approval
- **Before**: Requests were created with `status: 'fulfilled'` and stock was deducted immediately
- **After**: Requests are created with `status: 'pending'` and stock is only deducted upon admin approval
- Prescription requirement check remains intact
- Stock validation happens before creating request (prevents impossible requests)

**`src/routes/admin.js`** - New Endpoints Added:
1. **GET `/admin/medicine-requests`** - List all medicine requests with filters
   - Query params: `status`, `page`, `limit`
   - Returns enriched data with patient info and current stock
   
2. **PATCH `/admin/medicine-requests/:id/approve`** - Approve pending request
   - Validates stock availability
   - Deducts stock atomically (prevents race conditions)
   - Records stock history for audit trail
   - Updates request status to 'approved'
   
3. **PATCH `/admin/medicine-requests/:id/reject`** - Reject pending request
   - Requires rejection reason
   - Updates request status to 'rejected'
   - No stock changes

#### How Medicine Requests Now Work:

**Patient Flow:**
1. Patient requests medicine from medicine list
2. System checks:
   - If prescription required → Must have completed appointment
   - Stock availability (doesn't deduct yet)
3. Request created with `status: 'pending'`
4. Patient sees "Waiting for admin approval" message

**Admin Flow:**
1. Admin sees pending requests in dashboard stats
2. Admin navigates to medicine requests screen
3. Reviews request details (patient, medicine, quantity, current stock)
4. Approves or rejects:
   - **Approve**: Stock deducted, request marked approved, stock history recorded
   - **Reject**: Request marked rejected with reason, no stock change

#### Prescription Medicine Logic:
- Prescription-required medicines still check for `completed` appointments
- Patient MUST have at least one completed consultation before requesting Rx medicines
- This check happens BEFORE creating the pending request
- Admin approval is still required even if patient has prescription

### 2. Active/Inactive Doctor Management

#### Backend Changes

**`src/services/doctor.service.js`**
- `getAllDoctors()` now filters for `is_active: true` only
- Inactive doctors won't appear in patient's doctor list
- Admins can still access all doctors through admin endpoints

**`scripts/seed-doctors.js`**
- All seed doctors now include `is_active: true` field
- New doctors seeded in future will be active by default

**Database Migration:**
- Script `scripts/update-doctors-active.js` added existing doctors with `is_active: true`
- All 6 existing doctors updated successfully

#### How Active Doctors Work:

**Patient Dashboard:**
- Only shows doctors with `is_active: true`
- Inactive doctors hidden from booking
- Ensures patients only book with current active staff

**Admin Future Enhancement:**
- Can add admin endpoint to toggle doctor active status
- Useful for doctors on leave, retired, or temporarily unavailable
- Endpoint would be: `PATCH /admin/doctors/:id/toggle-active`

## Database Schema Updates

### medicine_requests Collection:
```javascript
{
  _id: ObjectId,
  patient_id: ObjectId,
  medicine_id: ObjectId,
  medicine_name: String,
  quantity: Number,
  status: 'pending' | 'approved' | 'rejected',  // Changed from 'fulfilled'
  admin_notes: String (optional),
  rejection_reason: String (optional),
  approved_at: Date (optional),
  rejected_at: Date (optional),
  created_at: Date,
  updated_at: Date
}
```

### doctors Collection:
```javascript
{
  _id: ObjectId,
  name: String,
  expertise: String,
  license_number: String,
  is_active: Boolean,  // NEW FIELD
  schedule: Array,
  created_at: Date,
  updated_at: Date
}
```

### stock_history Collection (used by approval):
```javascript
{
  medicine_id: ObjectId,
  change_type: 'dispense' | 'restock' | 'expired' | 'adjustment',
  quantity_change: Number,
  previous_stock: Number,
  new_stock: Number,
  reason: String,
  request_id: ObjectId (optional),
  admin_id: ObjectId (optional),
  timestamp: Date
}
```

## Current Database State

### Medicine Requests:
- **11 total requests** - all have `status: 'fulfilled'` (legacy, before this update)
- New requests going forward will have `status: 'pending'`

### Appointments:
- **6 total appointments**
- **3 pending** - waiting for admin approval
- **3 cancelled** - by patients

### Doctors:
- **6 total doctors** - all `is_active: true`
- Patients can book with all 6 doctors

### Medicine Inventory:
- Paracetamol: 84 units (reduced from 500 by patient requests)
- Other medicines at various stock levels
- Admin can adjust stock and see low stock alerts

## API Endpoints Summary

### New Medicine Request Endpoints:
```
GET  /admin/medicine-requests?status={pending|approved|rejected|all}&page={1}&limit={20}
PATCH /admin/medicine-requests/:id/approve
PATCH /admin/medicine-requests/:id/reject
```

### Existing Appointment Endpoints:
```
GET  /admin/appointments?status={pending|approved|rejected|completed|all}
PATCH /admin/appointments/:id/approve
PATCH /admin/appointments/:id/reject
```

### Medicine Inventory Endpoints:
```
GET  /admin/medicines/low-stock
POST /admin/medicines/:id/adjust-stock
```

## Frontend Updates Needed

**New screens to build:**
1. **Admin Medicine Requests Screen** (like AppointmentsScreen)
   - FilterChips: All, Pending, Approved, Rejected
   - List of requests with patient name, medicine, quantity
   - Navigate to detail screen

2. **Medicine Request Detail Screen** (like AppointmentDetailScreen)
   - Show patient info, medicine details, quantity
   - Show current stock availability
   - Approve button (with optional notes)
   - Reject button (with required reason)

3. **Update Admin Dashboard**
   - Add "Medicine Requests" card
   - Shows count of pending requests
   - Navigates to medicine requests screen

## Testing Recommendations

1. **Test Medicine Request Flow:**
   - Login as patient
   - Request non-Rx medicine → Should create pending request
   - Request Rx medicine without completed appointment → Should be rejected
   - Complete an appointment
   - Request Rx medicine → Should create pending request
   - Login as admin
   - Approve request → Check stock deducted
   - Check stock history recorded

2. **Test Doctor Filtering:**
   - Set one doctor to `is_active: false`
   - Login as patient
   - Check doctors list → Should only show active doctors
   - Try booking inactive doctor → Should not be possible

3. **Test Admin Rejection:**
   - Create medicine request as patient
   - Login as admin
   - Reject with reason
   - Check request status is 'rejected'
   - Check stock NOT deducted

## Migration Notes

- Existing `fulfilled` medicine requests are legacy data
- They don't need migration as they're already completed
- New requests will use pending/approved/rejected flow
- Stock levels are correct (already deducted for fulfilled requests)

## Files Modified

1. `backend/src/services/medicine.service.js`
2. `backend/src/routes/admin.js`
3. `backend/src/services/doctor.service.js`
4. `backend/scripts/seed-doctors.js`
5. `backend/scripts/update-doctors-active.js` (NEW)

## Next Steps

1. Build Flutter admin medicine requests screens
2. Update admin dashboard to show medicine request count
3. Test complete flow end-to-end
4. Optional: Add admin endpoint to toggle doctor active status
5. Optional: Add pagination and search to medicine requests
6. Optional: Add email/SMS notifications for approved/rejected requests
