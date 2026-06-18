const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const { isMock } = require('../config/db');
const { mockStore, mockStoreHelpers } = require('../config/mockStore');

// @desc    Create a new digital prescription
// @route   POST /api/prescriptions
// @access  Private (Doctor only)
const createPrescription = async (req, res) => {
  const { appointmentId, patientId, medicines, advice } = req.body;

  try {
    // 1. Fetch current doctor profile
    let doctorProfile;
    if (isMock()) {
      doctorProfile = mockStoreHelpers.findOne('doctors', d => d.userId.toString() === req.user._id.toString());
    } else {
      doctorProfile = await Doctor.findOne({ userId: req.user._id });
    }

    if (!doctorProfile) {
      return res.status(403).json({ message: 'Only registered doctors can generate digital prescriptions.' });
    }

    const prescriptionData = {
      appointmentId,
      patientId,
      doctorId: doctorProfile._id,
      medicines,
      advice: advice || '',
      date: new Date()
    };

    let newPrescription;
    if (isMock()) {
      newPrescription = mockStoreHelpers.create('prescriptions', prescriptionData);
      
      // Update appointment status to completed
      mockStoreHelpers.findByIdAndUpdate('appointments', appointmentId, { status: 'completed' });
    } else {
      newPrescription = new Prescription(prescriptionData);
      await newPrescription.save();

      // Update appointment status to completed
      await Appointment.findByIdAndUpdate(appointmentId, { status: 'completed' });
    }

    res.status(201).json(newPrescription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get prescription details by Appointment ID
// @route   GET /api/prescriptions/appointment/:appointmentId
// @access  Private (Patient / Doctor / Hospital)
const getPrescriptionByAppointment = async (req, res) => {
  const { appointmentId } = req.params;

  try {
    if (isMock()) {
      const pres = mockStoreHelpers.findOne('prescriptions', p => p.appointmentId.toString() === appointmentId.toString());
      if (!pres) return res.status(404).json({ message: 'Prescription not found' });
      
      const doc = mockStoreHelpers.findById('doctors', pres.doctorId);
      return res.json({
        ...pres,
        doctorId: doc || null
      });
    }

    const pres = await Prescription.findOne({ appointmentId })
      .populate('doctorId', 'name specialization')
      .populate('patientId', 'name age gender');

    if (!pres) return res.status(404).json({ message: 'Prescription not found' });
    res.json(pres);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all prescriptions for the logged-in Patient
// @route   GET /api/prescriptions/patient
// @access  Private (Patient only)
const getMyPrescriptions = async (req, res) => {
  try {
    let patientProfile;
    if (isMock()) {
      patientProfile = mockStoreHelpers.findOne('patients', p => p.userId.toString() === req.user._id.toString());
      if (!patientProfile) return res.json([]);
      
      const prescriptions = mockStore.prescriptions.filter(p => p.patientId.toString() === patientProfile._id.toString());
      const mapped = prescriptions.map(p => {
        const doc = mockStore.doctors.find(d => d._id.toString() === p.doctorId.toString());
        return {
          ...p,
          doctorId: doc || null
        };
      });
      return res.json(mapped);
    }

    patientProfile = await Patient.findOne({ userId: req.user._id });
    if (!patientProfile) return res.json([]);

    const prescriptions = await Prescription.find({ patientId: patientProfile._id })
      .populate('doctorId', 'name specialization')
      .sort({ date: -1 });

    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPrescription,
  getPrescriptionByAppointment,
  getMyPrescriptions
};
