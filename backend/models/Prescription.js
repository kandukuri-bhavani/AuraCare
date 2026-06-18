const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String, required: true }, // e.g. "500mg"
  frequency: { type: String, required: true }, // e.g. "Once a day", "Twice a day after food"
  duration: { type: String, required: true } // e.g. "5 Days", "1 Month"
});

const PrescriptionSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  medicines: [MedicineSchema],
  advice: {
    type: String,
    default: ''
  }
});

module.exports = mongoose.model('Prescription', PrescriptionSchema);
