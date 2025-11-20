# Admin Dashboard - Technical Implementation Report

**Feature Owner:** [Your Name]  
**Date:** October 29, 2025  
**Topics Covered:** Control-Flow, Subprograms (Modularity & Abstraction), Concurrency

---

## Table of Contents
1. [Feature Overview](#feature-overview)
2. [Control-Flow Implementation](#control-flow-implementation)
3. [Subprograms - Modularity & Abstraction](#subprograms---modularity--abstraction)
4. [Concurrency Implementation](#concurrency-implementation)
5. [Code Examples](#code-examples)
6. [Benefits & Best Practices](#benefits--best-practices)

---

## Feature Overview

The **Admin Dashboard** is a comprehensive management interface that allows administrators to:
- View real-time system statistics (pending appointments, medicine requests, stock levels, user counts)
- Manage appointments (approve/reject patient bookings)
- Handle medicine requests (approve/reject with stock management)
- Monitor inventory (low stock alerts, stock adjustments)
- Access analytics and reports

**Tech Stack:**
- **Backend:** Node.js with Hono.js framework, MongoDB
- **Frontend:** Flutter (Dart)
- **Architecture:** RESTful API with service-oriented architecture

---

## Control-Flow Implementation

### 1. Server Startup Flow

**File:** `backend/src/index.js`

The server initialization follows a **sequential control flow** to ensure proper setup:

```javascript
(async () => {
  try {
    // Step 1: Initialize Firebase Admin (for authentication)
    await initializeFirebase();
    
    // Step 2: Connect to MongoDB
    await connectDB();
    
    // Step 3: Seed initial data (if empty)
    await seedMedicinesIfEmpty();
    await seedDoctorsIfEmpty();
    await seedAdminIfEmpty();
    await seedAppointmentsIfEmpty();
    
    // Step 4: Start HTTP server
    serve({ fetch: app.fetch, port: PORT, hostname: '0.0.0.0' });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();
```

**Why Sequential?**
- Each step depends on the previous one (e.g., can't seed database without connection)
- Clear error handling prevents partial initialization
- Ensures system readiness before accepting requests

### 2. HTTP Request Flow (Middleware Chain)

**File:** `backend/src/index.js`

Incoming requests follow a **middleware pipeline**:

```
Client Request
    ↓
CORS Middleware (allows cross-origin requests)
    ↓
Route Matching (/api/admin/*)
    ↓
Authentication Middleware (verifies Firebase token)
    ↓
Authorization Middleware (checks admin privileges)
    ↓
Route Handler (executes business logic)
    ↓
Response to Client
```

**Code Example:**
```javascript
// Apply authentication + authorization to all admin routes
app.use('/api/admin/*', authenticate, adminOnly);
app.route('/api/admin', adminRoutes);
```

### 3. Frontend State Flow

**File:** `frontend/lib/screens/admin/admin_dashboard_screen.dart`

The UI follows a **reactive state management** pattern:

```
App Launch
    ↓
initState() → _loadStats()
    ↓
Get Firebase Token (from AuthProvider)
    ↓
API Call (ApiService.getAdminDashboardStats)
    ↓
setState() → Update UI
    ↓
Display: Loading / Error / Data
```

**Control Flow States:**
- **Loading:** Shows spinner while fetching data
- **Error:** Shows error message with retry button
- **Success:** Displays statistics cards and quick actions

### 4. Conditional Flow - Medicine Request Approval

**File:** `backend/src/routes/admin.js`

Complex business logic uses **conditional branching**:

```javascript
admin.patch('/medicine-requests/:id/approve', async (c) => {
  // 1. Validation checks
  if (!request) return c.json({ error: 'Not found' }, 404);
  if (request.status !== 'pending') return c.json({ error: 'Invalid status' }, 400);
  
  // 2. Stock availability check
  if (medicine.stock_qty < request.quantity) {
    return c.json({ error: 'Insufficient stock' }, 400);
  }
  
  // 3. Atomic stock deduction (concurrency control)
  const stockUpdate = await collections.medicineInventory().updateOne(
    { _id: medicine._id, stock_qty: { $gte: request.quantity } },
    { $inc: { stock_qty: -request.quantity } }
  );
  
  // 4. Verify success
  if (stockUpdate.matchedCount === 0) {
    return c.json({ error: 'Stock deduction failed' }, 400);
  }
  
  // 5. Record history and update request
  // ... (continues)
});
```

**Demonstrates:**
- Early return pattern (validation gates)
- Conditional execution based on business rules
- Error path vs success path separation

---

## Subprograms - Modularity & Abstraction

### 1. Layered Architecture

The codebase is organized into **distinct functional layers**:

```
┌─────────────────────────────────────┐
│     Frontend (Flutter Screens)      │  ← Presentation Layer
├─────────────────────────────────────┤
│     API Service (HTTP Client)       │  ← Communication Layer
├─────────────────────────────────────┤
│     Backend Routes (Controllers)    │  ← HTTP Handler Layer
├─────────────────────────────────────┤
│   Business Services (Logic Layer)   │  ← Business Logic Layer
├─────────────────────────────────────┤
│  Database Collections (Data Access) │  ← Data Layer
└─────────────────────────────────────┘
```

### 2. Configuration Subprograms

**Purpose:** Encapsulate setup and initialization logic

**File:** `backend/src/config/database.js`
```javascript
// Exported function abstracts MongoDB connection details
export async function connectDB() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  db = client.db('barangaycare');
  return db;
}

// Collection helper abstracts collection access
export const collections = {
  appointments: () => db.collection('appointments'),
  patients: () => db.collection('patients'),
  medicineInventory: () => db.collection('medicine_inventory'),
  // ...
};
```

**Benefits:**
- Single point of configuration
- Easy to mock for testing
- Changes to DB structure isolated

### 3. Service Layer Subprograms (Business Logic)

**Purpose:** Abstract business rules away from HTTP concerns

**File:** `backend/src/services/medicine.service.js`

```javascript
/**
 * Request medicine - encapsulates all business validation
 * @param {string} firebaseUid - Patient's Firebase UID
 * @param {object} data - Request data (medicine_id, quantity)
 */
export async function requestMedicine(firebaseUid, data) {
  const { medicine_id, quantity } = data;
  
  // Validation logic
  if (!medicine_id || !quantity || quantity <= 0) {
    throw new Error('Invalid medicine_id or quantity');
  }
  
  // Get patient profile
  const patient = await collections.patients().findOne({ firebase_uid: firebaseUid });
  if (!patient) throw new Error('Patient profile not found');
  
  // Get medicine details
  const medicine = await collections.medicineInventory().findOne({
    _id: new ObjectId(medicine_id)
  });
  if (!medicine) throw new Error('Medicine not found');
  
  // Business rule: Check prescription requirement
  if (medicine.is_prescription_required) {
    const latestAppointment = await collections.appointments().findOne(
      { patient_id: patient._id, status: 'completed' },
      { sort: { date: -1 } }
    );
    
    if (!latestAppointment) {
      throw new Error('Prescription required: Please complete a consultation first');
    }
  }
  
  // Stock validation
  if (medicine.stock_qty < quantity) {
    throw new Error('Out of stock or insufficient quantity available');
  }
  
  // Create pending request (awaits admin approval)
  const request = {
    patient_id: patient._id,
    medicine_id: new ObjectId(medicine_id),
    quantity,
    status: 'pending',
    created_at: new Date()
  };
  
  const result = await getDB().collection('medicine_requests').insertOne(request);
  
  return {
    message: 'Medicine request submitted successfully. Waiting for admin approval.',
    request_id: result.insertedId,
    status: 'pending'
  };
}
```

**Demonstrates:**
- **Abstraction:** Route handlers don't need to know prescription logic
- **Modularity:** Function can be tested independently
- **Reusability:** Called from multiple routes/contexts

### 4. Middleware Subprograms

**Purpose:** Reusable cross-cutting concerns

**File:** `backend/src/middleware/auth.middleware.js`
```javascript
// Authentication middleware - verifies Firebase token
export async function authMiddleware(c, next) {
  const token = c.req.header('Authorization')?.replace('Bearer ', '');
  const decodedToken = await admin.auth().verifyIdToken(token);
  c.set('user', decodedToken); // Attach user to context
  return next();
}
```

**File:** `backend/src/middleware/admin.js`
```javascript
// Authorization middleware - checks admin privileges
export async function adminOnly(c, next) {
  const user = c.get('user');
  const admin = await collections.admins().findOne({ 
    firebase_uid: user.uid 
  });
  
  if (!admin) {
    return c.json({ error: 'Admin access required' }, 403);
  }
  
  c.set('admin', admin); // Attach admin info to context
  return next();
}
```

**Benefits:**
- **DRY principle:** Authentication logic written once
- **Composable:** Middleware can be chained
- **Testable:** Each middleware isolated

### 5. Utility Scripts as Subprograms

**Purpose:** Reusable database operations

**File:** `backend/scripts/seed-medicines.js`
```javascript
export async function seedMedicinesIfEmpty() {
  const count = await collections.medicineInventory().countDocuments();
  
  if (count === 0) {
    console.log('Seeding medicine inventory...');
    const defaultMedicines = [ /* ... */ ];
    await collections.medicineInventory().insertMany(defaultMedicines);
    console.log('✅ Medicine inventory seeded');
  } else {
    console.log('✅ Medicine inventory already exists');
  }
}
```

**Benefits:**
- **Idempotent:** Safe to run multiple times
- **Standalone:** Can be run independently or on startup
- **Maintainable:** Easy to update seed data

### 6. Frontend Component Modularity

**File:** `frontend/lib/screens/admin/admin_dashboard_screen.dart`

**Extracted Subprograms (Widget Methods):**
```dart
class _AdminDashboardScreenState extends State<AdminDashboardScreen> {
  // Data fetching subprogram
  Future<void> _loadStats() async { /* ... */ }
  
  // UI component subprograms
  Widget _buildStatCard(...) { /* ... */ }
  Widget _buildQuickAction(...) { /* ... */ }
  
  @override
  Widget build(BuildContext context) {
    // Orchestrates subprograms
    return Scaffold(
      body: _loading ? CircularProgressIndicator()
           : _error != null ? _buildErrorView()
           : _buildDashboardContent()
    );
  }
}
```

**Benefits:**
- **Single Responsibility:** Each method does one thing
- **Readability:** Build method stays clean
- **Reusability:** Widgets can be extracted to separate files

---

## Concurrency Implementation

### 1. Parallel Database Queries with Promise.all

**Problem:** Fetching dashboard statistics sequentially would be slow (6 separate DB queries).

**Solution:** Execute queries **concurrently** using `Promise.all`

**File:** `backend/src/routes/admin.js`

```javascript
admin.get('/dashboard/stats', async (c) => {
  // Execute 6 database queries in parallel
  const [
    pendingAppointments,
    todayAppointments,
    pendingMedicineRequests,
    lowStockMedicines,
    totalPatients,
    totalDoctors
  ] = await Promise.all([
    collections.appointments().countDocuments({ status: 'pending' }),
    collections.appointments().countDocuments({ 
      status: { $in: ['pending', 'approved'] },
      date: new Date().toISOString().split('T')[0]
    }),
    collections.medicineRequests().countDocuments({ status: 'pending' }),
    collections.medicineInventory().countDocuments({ 
      $expr: { $lte: ['$stock_qty', '$reorder_level'] }
    }),
    collections.patients().countDocuments(),
    collections.doctors().countDocuments({ is_active: true })
  ]);
  
  return c.json({
    pending_appointments: pendingAppointments,
    today_appointments: todayAppointments,
    pending_medicine_requests: pendingMedicineRequests,
    low_stock_medicines: lowStockMedicines,
    total_patients: totalPatients,
    total_doctors: totalDoctors
  });
});
```

**Performance Comparison:**
- **Sequential:** 6 queries × 20ms = 120ms total
- **Concurrent:** max(20ms queries) = ~20-30ms total
- **Speedup:** ~4x faster response time

### 2. Parallel Data Enrichment

**Problem:** Need to fetch related data (patient, doctor) for each appointment.

**Solution:** Use nested `Promise.all` for per-item parallel lookups

**File:** `backend/src/routes/admin.js`

```javascript
admin.get('/appointments', async (c) => {
  // Fetch appointments and total count in parallel
  const [appointments, total] = await Promise.all([
    collections.appointments().find(filter).toArray(),
    collections.appointments().countDocuments(filter)
  ]);
  
  // For each appointment, fetch related data in parallel
  const enrichedAppointments = await Promise.all(
    appointments.map(async (apt) => {
      // These two lookups run concurrently for each appointment
      const [patient, doctor] = await Promise.all([
        collections.patients().findOne({ _id: new ObjectId(apt.patient_id) }),
        collections.doctors().findOne({ _id: new ObjectId(apt.doctor_id) })
      ]);
      
      return {
        ...apt,
        patient_name: patient?.name || 'Unknown',
        doctor_name: doctor?.name || 'Unknown'
      };
    })
  );
  
  return c.json({ appointments: enrichedAppointments });
});
```

**Efficiency:**
- Each appointment's enrichment runs independently
- Patient and doctor lookups within each appointment run in parallel
- Total time = max(single appointment enrichment) instead of sum

### 3. Race Condition Prevention - Atomic Stock Updates

**Problem:** Multiple admins approving medicine requests simultaneously could cause **overselling** (stock goes negative).

**Example Race Condition:**
```
Time    Admin A                      Admin B                     Stock
────────────────────────────────────────────────────────────────────
T0      Read stock: 5 units                                      5
T1                                   Read stock: 5 units         5
T2      Approve request (3 units)                                2
T3                                   Approve request (3 units)   -1 ❌ (NEGATIVE!)
```

**Solution:** Use **atomic update with guard condition**

**File:** `backend/src/routes/admin.js`

```javascript
admin.patch('/medicine-requests/:id/approve', async (c) => {
  // ... validation code ...
  
  // ATOMIC UPDATE: Check stock and decrement in single operation
  const stockUpdate = await collections.medicineInventory().updateOne(
    {
      _id: new ObjectId(request.medicine_id),
      stock_qty: { $gte: request.quantity }  // ← Guard: only update if enough stock
    },
    {
      $inc: { stock_qty: -request.quantity },  // Atomic decrement
      $set: { updated_at: new Date() }
    }
  );
  
  // Check if update succeeded
  if (stockUpdate.matchedCount === 0) {
    // No document matched = insufficient stock
    return c.json({ error: 'Stock deduction failed' }, 400);
  }
  
  // Record history
  await collections.stockHistory().insertOne({
    medicine_id: request.medicine_id,
    change_type: 'dispense',
    quantity_change: -request.quantity,
    previous_stock: medicine.stock_qty,
    new_stock: medicine.stock_qty - request.quantity,
    reason: `Medicine request approved`,
    timestamp: new Date()
  });
  
  // Update request status
  await collections.medicineRequests().updateOne(
    { _id: new ObjectId(requestId) },
    { $set: { status: 'approved', approved_at: new Date() } }
  );
  
  return c.json({ message: 'Approved successfully' });
});
```

**How It Prevents Race Conditions:**

| Time | Admin A | Admin B | Stock | Result |
|------|---------|---------|-------|--------|
| T0 | Request approval (3 units) | Request approval (3 units) | 5 | - |
| T1 | Atomic update: `{ stock_qty: { $gte: 3 } }` ✅ | Atomic update: `{ stock_qty: { $gte: 3 } }` ✅ | 2 | Admin A succeeds |
| T2 | - | Check `matchedCount` = 0 ❌ | 2 | Admin B blocked |

**MongoDB guarantees:**
- The `$gte` check and `$inc` decrement happen atomically
- Only one update can succeed when stock is insufficient
- No race window between read and write

### 4. Asynchronous Frontend Operations

**File:** `frontend/lib/screens/admin/admin_dashboard_screen.dart`

```dart
Future<void> _loadStats() async {
  setState(() {
    _loading = true;
    _error = null;
  });
  
  try {
    // Get authentication token (async operation)
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final token = await authProvider.user?.getIdToken();
    
    if (token == null) {
      throw Exception('Not authenticated');
    }
    
    // API call (async HTTP request)
    final stats = await ApiService.getAdminDashboardStats(token);
    
    // Update UI (synchronous state update)
    setState(() {
      _stats = stats;
      _loading = false;
    });
  } catch (e) {
    setState(() {
      _error = e.toString();
      _loading = false;
    });
  }
}
```

**Benefits:**
- Non-blocking UI (app remains responsive during network calls)
- Clear loading states inform user
- Error handling prevents crashes

### 5. Opportunity: Parallel Seeding (Future Improvement)

**Current Implementation (Sequential):**
```javascript
await seedMedicinesIfEmpty();
await seedDoctorsIfEmpty();
await seedAdminIfEmpty();
await seedAppointmentsIfEmpty();
```

**Proposed Optimization:**
```javascript
// Phase 1: Independent seeders can run in parallel
await Promise.all([
  seedMedicinesIfEmpty(),
  seedDoctorsIfEmpty(),
  seedAdminIfEmpty()
]);

// Phase 2: Dependent seeder runs after
await seedAppointmentsIfEmpty(); // Needs doctors and patients to exist
```

**Benefit:** Faster server startup (especially with large seed datasets)

---

## Code Examples

### Example 1: Complete Request Flow (Appointment Approval)

**Step 1: Frontend initiates approval**
```dart
// frontend/lib/screens/admin/appointment_detail_screen.dart
Future<void> _approveAppointment() async {
  final token = await authProvider.user?.getIdToken();
  
  await ApiService.approveAppointment(
    token,
    widget.appointment['_id'],
    notes: _notesController.text
  );
  
  Navigator.pop(context); // Return to list
}
```

**Step 2: API service makes HTTP call**
```dart
// frontend/lib/services/api_service.dart
static Future<Map<String, dynamic>> approveAppointment(
  String token,
  String appointmentId,
  {String? notes}
) async {
  return await patch(
    '${ApiConfig.baseUrl}/admin/appointments/$appointmentId/approve',
    {'admin_notes': notes ?? ''},
    token: token
  );
}
```

**Step 3: Backend route handler**
```javascript
// backend/src/routes/admin.js
admin.patch('/appointments/:id/approve', async (c) => {
  const id = c.req.param('id');
  const { admin_notes } = await c.req.json();
  const adminInfo = c.get('admin'); // From middleware
  
  const result = await collections.appointments().updateOne(
    { _id: new ObjectId(id) },
    { 
      $set: { 
        status: 'approved',
        admin_notes: admin_notes || '',
        approved_by: adminInfo._id,
        approved_at: new Date()
      } 
    }
  );
  
  return c.json({ message: 'Appointment approved successfully' });
});
```

### Example 2: Service Layer Abstraction

**Without Service Layer (❌ Poor):**
```javascript
// Route handler contains business logic (hard to test, violates SRP)
admin.post('/medicine-request', async (c) => {
  const { medicine_id, quantity } = await c.req.json();
  const user = c.get('user');
  
  // Business logic mixed with HTTP handling
  const patient = await collections.patients().findOne({ firebase_uid: user.uid });
  const medicine = await collections.medicineInventory().findOne({ _id: new ObjectId(medicine_id) });
  
  if (medicine.is_prescription_required) {
    const apt = await collections.appointments().findOne({ patient_id: patient._id, status: 'completed' });
    if (!apt) return c.json({ error: 'Prescription required' }, 400);
  }
  
  // ... more business logic ...
});
```

**With Service Layer (✅ Good):**
```javascript
// Route handler delegates to service
admin.post('/medicine-request', async (c) => {
  const user = c.get('user');
  const data = await c.req.json();
  
  try {
    const result = await requestMedicine(user.uid, data);
    return c.json(result);
  } catch (error) {
    return c.json({ error: error.message }, 400);
  }
});

// Service contains business logic (testable, reusable)
// backend/src/services/medicine.service.js
export async function requestMedicine(firebaseUid, data) {
  // All business logic here
  // Can be tested without HTTP server
}
```

### Example 3: Concurrent vs Sequential Performance

**Sequential (Slow):**
```javascript
const appointments = await collections.appointments().find().toArray();
const enriched = [];

for (const apt of appointments) {
  const patient = await collections.patients().findOne({ _id: apt.patient_id });
  const doctor = await collections.doctors().findOne({ _id: apt.doctor_id });
  enriched.push({ ...apt, patient_name: patient.name, doctor_name: doctor.name });
}
// Time: N appointments × 2 queries × query_time
```

**Concurrent (Fast):**
```javascript
const appointments = await collections.appointments().find().toArray();

const enriched = await Promise.all(
  appointments.map(async (apt) => {
    const [patient, doctor] = await Promise.all([
      collections.patients().findOne({ _id: apt.patient_id }),
      collections.doctors().findOne({ _id: apt.doctor_id })
    ]);
    return { ...apt, patient_name: patient.name, doctor_name: doctor.name };
  })
);
// Time: max(single appointment enrichment time)
```

---

## Benefits & Best Practices

### Control-Flow Benefits

✅ **Clear Initialization Order**
- Server won't accept requests until fully initialized
- Prevents "database not ready" errors

✅ **Predictable Request Pipeline**
- Middleware chain makes security enforcement consistent
- Easy to add new middleware (logging, rate limiting, etc.)

✅ **Explicit State Management**
- Frontend states (loading/error/success) prevent UI bugs
- User always knows what's happening

### Subprogram Benefits

✅ **Testability**
- Services can be unit tested without HTTP server
- Middleware can be tested in isolation
- Seed scripts can be tested independently

✅ **Maintainability**
- Changes to business logic only affect service layer
- Route handlers stay thin and focused
- Easy to locate and fix bugs

✅ **Reusability**
- Services called from multiple routes
- Middleware composed across endpoints
- Utilities used in multiple contexts

✅ **Separation of Concerns**
- Each layer has single responsibility
- Changes in one layer don't cascade
- Teams can work on different layers independently

### Concurrency Benefits

✅ **Performance**
- Dashboard loads 4x faster with parallel queries
- Enrichment scales with data size
- Server can handle more concurrent users

✅ **Data Consistency**
- Atomic updates prevent race conditions
- No overselling or inventory corruption
- Audit trail remains accurate

✅ **Responsiveness**
- Async operations don't block UI
- Server handles multiple requests simultaneously
- Better user experience

### Best Practices Demonstrated

1. **DRY (Don't Repeat Yourself)**
   - Authentication logic in one middleware
   - Collection access through helper functions
   - Reusable UI components

2. **Single Responsibility Principle**
   - Each function does one thing well
   - Services vs routes vs middleware
   - Clear boundaries between layers

3. **Fail Fast**
   - Early validation in request handlers
   - Clear error messages
   - Graceful error handling

4. **Defensive Programming**
   - Null checks (`patient?.name || 'Unknown'`)
   - Atomic operations for critical sections
   - Input validation at boundaries

5. **Observability**
   - Console logs at key points
   - Error tracking with context
   - Stock history audit trail

---

## Summary

The Admin Dashboard demonstrates all three programming concepts effectively:

### Control-Flow
- Sequential server initialization ensures proper setup
- Middleware pipeline enforces security consistently
- Conditional branching implements complex business rules
- State management provides clear UI feedback

### Subprograms (Modularity & Abstraction)
- Layered architecture separates concerns
- Services abstract business logic from HTTP
- Middleware provides reusable cross-cutting concerns
- Utilities encapsulate common operations
- Frontend components follow single responsibility

### Concurrency
- `Promise.all` enables parallel database queries (4x speedup)
- Atomic updates prevent race conditions in critical sections
- Async/await provides non-blocking operations
- Concurrent enrichment scales with data size

**Key Takeaway:** These concepts work together to create a maintainable, performant, and correct system. Control-flow provides structure, subprograms enable modularity, and concurrency improves performance while maintaining data consistency.

---

## Appendix: File Reference Map

### Backend Structure
```
backend/src/
├── index.js                      # Server initialization (control-flow orchestration)
├── config/
│   ├── database.js              # DB connection (configuration subprogram)
│   └── firebase.js              # Firebase setup (configuration subprogram)
├── middleware/
│   ├── auth.middleware.js       # Authentication (middleware subprogram)
│   └── admin.js                 # Authorization (middleware subprogram)
├── routes/
│   └── admin.js                 # Admin endpoints (route handlers)
├── services/
│   ├── medicine.service.js      # Medicine business logic (service subprogram)
│   ├── doctor.service.js        # Doctor business logic (service subprogram)
│   └── appointment.service.js   # Appointment business logic (service subprogram)
└── scripts/
    ├── seed-medicines.js        # Data seeding (utility subprogram)
    ├── seed-doctors.js          # Data seeding (utility subprogram)
    └── cleanup-patients.js      # Data cleanup (utility subprogram)
```

### Frontend Structure
```
frontend/lib/
├── main.dart                         # App entry point + routing
├── screens/admin/
│   ├── admin_dashboard_screen.dart   # Dashboard UI (main feature)
│   ├── admin_appointments_screen.dart # Appointments list
│   ├── appointment_detail_screen.dart # Appointment detail
│   ├── medicine_inventory_screen.dart # Inventory management
│   ├── medicine_requests_screen.dart  # Medicine requests list
│   ├── medicine_request_detail_screen.dart # Request detail
│   └── admin_reports_screen.dart     # Reports & analytics
├── services/
│   └── api_service.dart             # HTTP client (API abstraction)
└── providers/
    └── auth_provider.dart           # Authentication state management
```

---

**End of Report**
