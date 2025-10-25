import { ObjectId } from 'mongodb';
import { collections } from '../config/database.js';

/**
 * Get all medicines
 */
export async function getAllMedicines() {
  return await collections.medicineInventory()
    .find({ stock_qty: { $gt: 0 } })
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
  
  // Atomic stock update with concurrency safety
  // This prevents stock from going negative even with simultaneous requests
  const updateResult = await collections.medicineInventory().updateOne(
    {
      _id: new ObjectId(medicine_id),
      stock_qty: { $gte: quantity }
    },
    {
      $inc: { stock_qty: -quantity }
    }
  );
  
  if (updateResult.matchedCount === 0) {
    throw new Error('Out of stock or insufficient quantity available');
  }
  
  // Record the medicine request
  const request = {
    patient_id: patient._id,
    medicine_id: new ObjectId(medicine_id),
    medicine_name: medicine.med_name,
    quantity,
    status: 'fulfilled',
    created_at: new Date()
  };
  
  await collections.medicineInventory().collection('medicine_requests').insertOne(request);
  
  // Get updated stock
  const updatedMedicine = await collections.medicineInventory().findOne({
    _id: new ObjectId(medicine_id)
  });
  
  return {
    message: 'Medicine request successful',
    medicine_name: medicine.med_name,
    quantity_requested: quantity,
    remaining_stock: updatedMedicine.stock_qty
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

