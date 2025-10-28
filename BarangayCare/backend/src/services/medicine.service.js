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
  const { medicine_id, quantity } = data;
  
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
    // Check if patient has a completed appointment
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
  
  // Check if sufficient stock is available (without deducting yet)
  if (medicine.stock_qty < quantity) {
    throw new Error('Out of stock or insufficient quantity available');
  }
  
  // Record the medicine request with 'pending' status for admin approval
  // Stock will only be deducted when admin approves the request
  const request = {
    patient_id: patient._id,
    medicine_id: new ObjectId(medicine_id),
    medicine_name: medicine.med_name,
    quantity,
    status: 'pending', // Requires admin approval
    created_at: new Date(),
    updated_at: new Date()
  };
  
  const result = await getDB().collection('medicine_requests').insertOne(request);
  
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

