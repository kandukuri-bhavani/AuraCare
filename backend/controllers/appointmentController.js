const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Hospital = require('../models/Hospital');
const { isMock } = require('../config/db');
const { mockStore, mockStoreHelpers } = require('../config/mockStore');

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private (Patient only)
const bookAppointment = async (req, res) => {
  const { doctorId, hospitalId, date, timeSlot, reason, notes, consultationType } = req.body;

  try {
    // 1. Fetch current patient profile
    let patientProfile;
    if (isMock()) {
      patientProfile = mockStoreHelpers.findOne('patients', p => p.userId === req.user._id);
    } else {
      patientProfile = await Patient.findOne({ userId: req.user._id });
    }

    if (!patientProfile) {
      return res.status(404).json({ message: 'Patient profile not found. Please complete profile details first.' });
    }

    // 2. Generate unique booking reference
    const apptRef = `BAD-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const appointmentData = {
      appointmentId: apptRef,
      patientId: patientProfile._id,
      doctorId,
      hospitalId,
      date: new Date(date),
      timeSlot,
      reason,
      status: 'pending',
      notes: notes || '',
      consultationType: consultationType || 'in-person'
    };

    let newAppointment;
    if (isMock()) {
      newAppointment = mockStoreHelpers.create('appointments', appointmentData);
    } else {
      newAppointment = new Appointment(appointmentData);
      await newAppointment.save();
    }

    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get appointments for the logged-in Patient
// @route   GET /api/appointments/patient
// @access  Private (Patient role)
const getPatientAppointments = async (req, res) => {
  try {
    let patientProfile;
    if (isMock()) {
      patientProfile = mockStoreHelpers.findOne('patients', p => p.userId.toString() === req.user._id.toString());
      if (!patientProfile) return res.json([]);

      const appts = mockStore.appointments.filter(a => a.patientId.toString() === patientProfile._id.toString());
      const mapped = appts.map(a => {
        const doc = mockStore.doctors.find(d => d._id.toString() === a.doctorId.toString());
        const hosp = mockStore.hospitals.find(h => h._id.toString() === a.hospitalId.toString());
        return {
          ...a,
          doctorId: doc || null,
          hospitalId: hosp || null
        };
      });
      return res.json(mapped);
    }

    patientProfile = await Patient.findOne({ userId: req.user._id });
    if (!patientProfile) return res.json([]);

    const appointments = await Appointment.find({ patientId: patientProfile._id })
      .populate('doctorId', 'name specialization photo consultationFee')
      .populate('hospitalId', 'name address city image phone')
      .sort({ date: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get appointments for the logged-in Doctor
// @route   GET /api/appointments/doctor
// @access  Private (Doctor role)
const getDoctorAppointments = async (req, res) => {
  try {
    let doctorProfile;
    if (isMock()) {
      doctorProfile = mockStoreHelpers.findOne('doctors', d => d.userId.toString() === req.user._id.toString());
      if (!doctorProfile) return res.json([]);

      const appts = mockStore.appointments.filter(a => a.doctorId.toString() === doctorProfile._id.toString());
      const mapped = appts.map(a => {
        const pat = mockStore.patients.find(p => p._id.toString() === a.patientId.toString());
        const hosp = mockStore.hospitals.find(h => h._id.toString() === a.hospitalId.toString());
        return {
          ...a,
          patientId: pat || null,
          hospitalId: hosp || null
        };
      });
      return res.json(mapped);
    }

    doctorProfile = await Doctor.findOne({ userId: req.user._id });
    if (!doctorProfile) return res.json([]);

    const appointments = await Appointment.find({ doctorId: doctorProfile._id })
      .populate('patientId', 'name age gender phone healthProblem incomeRange abhaId')
      .populate('hospitalId', 'name address city')
      .sort({ date: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all appointments for the logged-in Hospital Admin
// @route   GET /api/appointments/hospital
// @access  Private (Hospital role)
const getHospitalAppointments = async (req, res) => {
  try {
    let hospitalProfile;
    if (isMock()) {
      hospitalProfile = mockStoreHelpers.findOne('hospitals', h => h.userId.toString() === req.user._id.toString());
      if (!hospitalProfile) return res.json([]);

      const appts = mockStore.appointments.filter(a => a.hospitalId.toString() === hospitalProfile._id.toString());
      const mapped = appts.map(a => {
        const pat = mockStore.patients.find(p => p._id.toString() === a.patientId.toString());
        const doc = mockStore.doctors.find(d => d._id.toString() === a.doctorId.toString());
        return {
          ...a,
          patientId: pat || null,
          doctorId: doc || null
        };
      });
      return res.json(mapped);
    }

    hospitalProfile = await Hospital.findOne({ userId: req.user._id });
    if (!hospitalProfile) return res.json([]);

    const appointments = await Appointment.find({ hospitalId: hospitalProfile._id })
      .populate('patientId', 'name age gender phone healthProblem')
      .populate('doctorId', 'name specialization')
      .sort({ date: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update appointment status/notes (Doctor / Hospital Admin)
// @route   PUT /api/appointments/:id
// @access  Private (Doctor / Hospital / Admin)
const updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  try {
    if (isMock()) {
      const updated = mockStoreHelpers.findByIdAndUpdate('appointments', id, { status, notes });
      if (!updated) return res.status(404).json({ message: 'Appointment booking not found' });
      return res.json(updated);
    }

    const updated = await Appointment.findByIdAndUpdate(id, { status, notes }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Appointment booking not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  getHospitalAppointments,
  updateAppointmentStatus
};
