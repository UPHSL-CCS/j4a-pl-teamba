## **1. App Concept**

A mobile app for barangay healthcare where:

-   Patients register & login.

-   Patients book consultation based on *live* doctor availability.

-   Patients answer pre-screening questions before confirming booking.

-   Patients request medicine (no approval required).

-   Stock & availability update automatically.

## **2. Main Features**

  -----------------------------------------------------------------------
  **Feature**                     **Description**
  ------------------------------- ---------------------------------------
  Patient Registration & Login    Basic onboarding with barangay info

  Doctor Schedule Availability    Doctors have repeating weekly schedules

  Automatic Appointment Booking   Slot becomes unavailable once booked

  Pre-Screening Form              Helps doctor prepare for consultation

  Medicine Inventory              Tracks stock levels of medicines

  Automatic Medicine Request      Request reduces stock instantly if
                                  allowed
  -----------------------------------------------------------------------

# **🧱 DATABASE STRUCTURE (MongoDB NoSQL)**

### **patients**

{

\_id,

name,

barangay,

contact,

password_hash

}

### **doctors**

{

\_id,

name,

expertise,

schedule: \[

{ day: \"Mon\", start: \"09:00\", end: \"16:00\" },

{ day: \"Wed\", start: \"13:00\", end: \"17:00\" }

\]

}

### **appointments**

{

\_id,

patient_id,

doctor_id,

date, // YYYY-MM-DD

time, // HH:mm

status: \"booked\" \| \"completed\" \| \"cancelled\",

pre_screening: { symptoms, temperature, notes }

}

### **medicine_inventory**

{

\_id,

med_name,

stock_qty,

is_prescription_required

}

# **🔁 CORE LOGIC (Control Flow & Expressions)**

## **Appointment Booking**

IF doctor is available at selected date/time

AND no existing appointment at date/time

THEN create appointment

ELSE show \"Time slot not available\"

## **Medicine Request**

IF medicine.is_prescription_required == true

IF patient has latest appointment record status == completed

ALLOW request

ELSE

DENY request (\"Prescription required\")

ELSE

ALLOW request

END IF

IF stock_qty \>= requested_qty

stock_qty = stock_qty - requested_qty

ELSE

DENY request (\"Out of stock\")

END IF

This fulfills **Control Flow & Expressions** clearly.

# **🧩 BACKEND MODULARITY STRUCTURE (Subprograms & Modularity)**

/src

/routes

auth.route.js

appointments.route.js

doctors.route.js

medicine.route.js

/services

doctorService.js \<\-- checkAvailability()

appointmentService.js \<\-- bookAppointment(), cancelAppointment()

medicineService.js \<\-- requestMedicine(), adjustStock()

Each **service** contains **reusable functions**, then routes call them
→ **this proves modularity**.

# **⚙️ CONCURRENCY HANDLING (Real Requirement Covered)**

### **1. Prevent double booking:**

Use atomic database check before booking:

db.appointments.findOne({ doctor_id, date, time })

If exists → slot is unavailable.

### **2. Safe stock update under simultaneous requests:**

db.medicine_inventory.updateOne(

{ \_id: med_id, stock_qty: { \$gte: requested_qty } },

{ \$inc: { stock_qty: -requested_qty } }

)

This ensures:

-   Stock won't go negative

-   Multiple users requesting at same time is safe\
    > ✅ **This satisfies concurrency requirement**.

# **📱 FLUTTER FRONTEND SCREENS**

  -----------------------------------------------------------------------
  **Screen**               **Description**
  ------------------------ ----------------------------------------------
  Login & Register         Jwt-based authentication

  Home                     Options (Book Consult / Request Medicine)

  Doctor Selection         Filter by expertise

  Calendar Time Picker     Only shows available slots

  Pre-Screening Form       Required before booking

  Medicine List            Shows available medicine & stocks

  Confirm Request          Updates instantly & shows new stock
  -----------------------------------------------------------------------

# **🗂️ DEVELOPMENT TIMELINE**

  ------------------------------------------------------------------------
  **Week**   **Task**
  ---------- -------------------------------------------------------------
  1          Setup Flutter, Hono.js, MongoDB, Authentication

  2          Doctor Scheduling + Booking Logic

  3          Pre-Screening Form + Appointment History

  4          Medicine Request + Automatic Stock Updating

  5          UI Polish, Testing, Documentation, Demo
  ------------------------------------------------------------------------
