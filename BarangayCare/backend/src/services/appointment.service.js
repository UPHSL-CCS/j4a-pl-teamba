import { ObjectId } from 'mongodb';
import { collections } from '../config/database.js';
import { checkAvailability } from './doctor.service.js';

/**
 * Book an appointment
 * Implements control flow: check availability before booking
 */
export async function bookAppointment(firebaseUid, data) {
  const { doctor_id, date, time, pre_screening } = data;
  
  // Validate input
  if (!doctor_id || !date || !time) {
    throw new Error('Missing required fields: doctor_id, date, time');
  }
  
  // Get patient
  const patient = await collections.patients().findOne({ firebase_uid: firebaseUid });
  if (!patient) {
    throw new Error('Patient profile not found');
  }
  
  // Check if doctor is available at selected date/time
  const availability = await checkAvailability(doctor_id, date);
  
  if (!availability.available) {
    throw new Error('Doctor not available on this day');
  }
  
  if (!availability.slots.includes(time)) {
    throw new Error('Time slot not available');
  }
  
  // Check for existing appointment (prevent double booking)
  const existingAppointment = await collections.appointments().findOne({
    doctor_id: new ObjectId(doctor_id),
    date: date,
    time: time,
    status: { $in: ['booked', 'confirmed'] }
  });
  
  if (existingAppointment) {
    throw new Error('Time slot already booked');
  }
  
  // Create appointment
  const appointment = {
    patient_id: patient._id,
    doctor_id: new ObjectId(doctor_id),
    date,
    time,
    status: 'pending',  // Requires admin approval
    pre_screening: pre_screening || {},
    created_at: new Date(),
    updated_at: new Date(),
  };
  
  const result = await collections.appointments().insertOne(appointment);
  
  return {
    message: 'Appointment booked successfully',
    appointment_id: result.insertedId,
    appointment
  };
}

/**
 * Get patient's appointments
 */
export async function getPatientAppointments(firebaseUid) {
  const patient = await collections.patients().findOne({ firebase_uid: firebaseUid });
  
  if (!patient) {
    throw new Error('Patient profile not found');
  }
  
  const appointments = await collections.appointments()
    .aggregate([
      { $match: { patient_id: patient._id } },
      {
        $lookup: {
          from: 'doctors',
          localField: 'doctor_id',
          foreignField: '_id',
          as: 'doctor'
        }
      },
      { $unwind: '$doctor' },
      { $sort: { date: -1, time: -1 } }
    ])
    .toArray();
  
  return appointments;
}

/**
 * Cancel an appointment
 */
export async function cancelAppointment(appointmentId, firebaseUid) {
  const patient = await collections.patients().findOne({ firebase_uid: firebaseUid });
  
  if (!patient) {
    throw new Error('Patient profile not found');
  }
  
  const result = await collections.appointments().updateOne(
    {
      _id: new ObjectId(appointmentId),
      patient_id: patient._id,
      status: 'booked'
    },
    {
      $set: {
        status: 'cancelled',
        updated_at: new Date()
      }
    }
  );
  
  if (result.matchedCount === 0) {
    throw new Error('Appointment not found or cannot be cancelled');
  }
  
  return {
    message: 'Appointment cancelled successfully'
  };
}

