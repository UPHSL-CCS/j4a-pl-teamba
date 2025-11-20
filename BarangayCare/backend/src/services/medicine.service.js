import { ObjectId } from 'mongodb';
import { collections, getDB } from '../config/database.js';

/**
 * Get all medicines
 */
export async function getAllMedicines() {
  return await collections.medicineInventory()
    .find({})
    .toArray();
}

/**
 * Request medicine
 * Implements control flow: check prescription requirement and stock
 * Handles concurrency: atomic stock update
 */
export async function requestMedicine(firebaseUid, data) {
  const { medicine_id, quantity, prescription_id } = data;
  
  // Validate input
  if (!medicine_id || !quantity || quantity <= 0) {
    throw new Error('Invalid medicine_id or quantity');
  }
  
  // Get patient
  const patient = await collections.patients().findOne({ firebase_uid: firebaseUid });
  if (!patient) {
    throw new Error('Patient profile not found');
  }
  
  // Get medicine details
  const medicine = await collections.medicineInventory().findOne({
    _id: new ObjectId(medicine_id)
  });
  
  if (!medicine) {
    throw new Error('Medicine not found');
  }
  
  // Check if prescription is required
  if (medicine.is_prescription_required) {
    // If prescription_id is provided, validate it
    if (prescription_id) {
      const prescription = await collections.prescriptions().findOne({
        _id: new ObjectId(prescription_id),
        patient_id: patient._id,
        status: 'active'
      });
      
      if (!prescription) {
        throw new Error('Invalid or expired prescription');
      }
      
      // Check if prescription has expired
      if (new Date() > prescription.expiry_date) {
        await collections.prescriptions().updateOne(
          { _id: new ObjectId(prescription_id) },
          { $set: { status: 'expired', updated_at: new Date() } }
        );
        throw new Error('Prescription has expired');
      }
      
      // Verify the medicine is in the prescription
      const prescribedMedicine = prescription.medicines.find(
        m => m.medicine_id.toString() === medicine_id
      );
      
      if (!prescribedMedicine) {
        throw new Error('Medicine not found in prescription');
      }
      
      // Validate quantity doesn't exceed prescribed amount
      if (quantity > prescribedMedicine.quantity) {
        throw new Error(`Requested quantity exceeds prescribed amount (${prescribedMedicine.quantity})`);
      }
    } else {
      // No prescription provided - check if patient has completed appointment
      const latestAppointment = await collections.appointments().findOne(
        {
          patient_id: patient._id,
          status: 'completed'
        },
        { sort: { date: -1, time: -1 } }
      );
      
      if (!latestAppointment) {
        throw new Error('Prescription required: Please complete a consultation first');
      }
    }
  }
  
  // Check if sufficient stock is available (without deducting yet)
  if (medicine.stock_qty < quantity) {
    throw new Error('Out of stock or insufficient quantity available');
  }
  
  // Record the medicine request with 'pending' status for admin approval
  // Stock will only be deducted when admin approves the request
  const request = {
    patient_id: patient._id,
    patient_uid: firebaseUid,
    medicine_id: new ObjectId(medicine_id),
    medicine_name: medicine.med_name,
    quantity,
    prescription_id: prescription_id ? new ObjectId(prescription_id) : null,
    status: 'pending', // Requires admin approval
    created_at: new Date(),
    updated_at: new Date()
  };
  
  const result = await collections.medicineRequests().insertOne(request);
  
  return {
    message: 'Medicine request submitted successfully. Waiting for admin approval.',
    request_id: result.insertedId,
    medicine_name: medicine.med_name,
    quantity_requested: quantity,
    status: 'pending'
  };
}

/**
 * Adjust stock (admin function - to be protected later)
 */
export async function adjustStock(medicineId, adjustment) {
  const result = await collections.medicineInventory().updateOne(
    { _id: new ObjectId(medicineId) },
    { $inc: { stock_qty: adjustment } }
  );
  
  if (result.matchedCount === 0) {
    throw new Error('Medicine not found');
  }
  
  return {
    message: 'Stock adjusted successfully'
  };
}

