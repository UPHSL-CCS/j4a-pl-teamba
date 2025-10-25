import { ObjectId } from 'mongodb';
import { collections } from '../config/database.js';

/**
 * Get all doctors
 */
export async function getAllDoctors() {
  return await collections.doctors().find({}).toArray();
}

/**
 * Get doctor by ID
 */
export async function getDoctorById(doctorId) {
  const doctor = await collections.doctors().findOne({ _id: new ObjectId(doctorId) });
  
  if (!doctor) {
    throw new Error('Doctor not found');
  }
  
  return doctor;
}

/**
 * Check doctor availability for a specific date
 * Returns available time slots
 */
export async function checkAvailability(doctorId, dateString) {
  const doctor = await getDoctorById(doctorId);
  
  // Get day of week from date
  const date = new Date(dateString);
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayOfWeek = daysOfWeek[date.getDay()];
  
  // Find doctor's schedule for this day
  const daySchedule = doctor.schedule?.find(s => s.day === dayOfWeek);
  
  if (!daySchedule) {
    return {
      available: false,
      message: 'Doctor not available on this day',
      slots: []
    };
  }
  
  // Get existing appointments for this doctor on this date
  const existingAppointments = await collections.appointments().find({
    doctor_id: new ObjectId(doctorId),
    date: dateString,
    status: { $in: ['booked', 'confirmed'] }
  }).toArray();
  
  const bookedTimes = existingAppointments.map(apt => apt.time);
  
  // Generate available time slots (hourly slots)
  const availableSlots = generateTimeSlots(daySchedule.start, daySchedule.end, bookedTimes);
  
  return {
    available: availableSlots.length > 0,
    day: dayOfWeek,
    schedule: daySchedule,
    slots: availableSlots
  };
}

/**
 * Helper function to generate time slots
 */
function generateTimeSlots(startTime, endTime, bookedTimes) {
  const slots = [];
  const [startHour] = startTime.split(':').map(Number);
  const [endHour] = endTime.split(':').map(Number);
  
  for (let hour = startHour; hour < endHour; hour++) {
    const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
    if (!bookedTimes.includes(timeSlot)) {
      slots.push(timeSlot);
    }
  }
  
  return slots;
}

