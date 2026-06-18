const Doctor = require('../models/Doctor');
const Hospital = require('../models/Hospital');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { isMock } = require('../config/db');
const { mockStore, mockStoreHelpers } = require('../config/mockStore');

// @desc    Get all doctors with filtering
// @route   GET /api/doctors
// @access  Public
const getAllDoctors = async (req, res) => {
  const { hospitalId, specialization, search } = req.query;

  try {
    if (isMock()) {
      let filtered = [...mockStore.doctors];

      if (hospitalId) {
        filtered = filtered.filter(d => d.hospitalId === hospitalId);
      }
      if (specialization) {
        filtered = filtered.filter(d => d.specialization.toLowerCase() === specialization.toLowerCase());
      }
      if (search) {
        const query = search.toLowerCase();
        filtered = filtered.filter(d => 
          d.name.toLowerCase().includes(query) || 
          d.specialization.toLowerCase().includes(query)
        );
      }

      // Map hospital details
      const mapped = filtered.map(d => {
        const hosp = mockStore.hospitals.find(h => h._id === d.hospitalId);
        return {
          ...d,
          hospitalName: hosp ? hosp.name : 'Unknown Hospital'
        };
      });

      return res.json(mapped);
    }

    let query = {};
    if (hospitalId) query.hospitalId = hospitalId;
    if (specialization) query.specialization = new RegExp(`^${specialization}$`, 'i');
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } }
      ];
    }

    const doctors = await Doctor.find(query).populate('hospitalId', 'name address city');
    
    // Format to match mock schema
    const formatted = doctors.map(d => ({
      ...d._doc,
      hospitalName: d.hospitalId ? d.hospitalId.name : 'Unknown Hospital'
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single doctor profile
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = async (req, res) => {
  const { id } = req.params;

  try {
    if (isMock()) {
      const doctor = mockStoreHelpers.findById('doctors', id);
      if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });
      const hospital = mockStoreHelpers.findById('hospitals', doctor.hospitalId);
      return res.json({ doctor, hospitalName: hospital ? hospital.name : 'Unknown Hospital' });
    }

    const doctor = await Doctor.findById(id).populate('hospitalId', 'name address city');
    if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });
    res.json({
      doctor,
      hospitalName: doctor.hospitalId ? doctor.hospitalId.name : 'Unknown Hospital'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create doctor profile (Hospital Admin Dashboard)
// @route   POST /api/doctors
// @access  Private (Hospital role)
const createDoctor = async (req, res) => {
  const { username, email, password, name, photo, specialization, experience, consultationFee, availableDays, availableTimeSlots } = req.body;

  try {
    // Hospital admin ID linked from active user profile
    let hospitalProfile;
    if (isMock()) {
      hospitalProfile = mockStoreHelpers.findOne('hospitals', h => h.userId === req.user._id);
    } else {
      hospitalProfile = await Hospital.findOne({ userId: req.user._id });
    }

    if (!hospitalProfile) {
      return res.status(403).json({ message: 'Only hospital administrators can create doctor profiles.' });
    }

    // 1. Create doctor credential user
    const hashedPassword = await bcrypt.hash(password || 'doctor123', 10);
    let newDocUser;

    if (isMock()) {
      newDocUser = mockStoreHelpers.create('users', {
        username,
        email,
        password: hashedPassword,
        role: 'doctor'
      });
    } else {
      newDocUser = new User({
        username,
        email,
        password: password || 'doctor123',
        role: 'doctor'
      });
      await newDocUser.save();
    }

    // 2. Create doctor profile
    const doctorData = {
      userId: newDocUser._id,
      hospitalId: hospitalProfile._id,
      name,
      photo: photo || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&auto=format&fit=crop',
      specialization,
      experience: parseInt(experience) || 1,
      consultationFee: parseInt(consultationFee) || 200,
      availableDays: availableDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      availableTimeSlots: availableTimeSlots || ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM']
    };

    let newDoctor;
    if (isMock()) {
      newDoctor = mockStoreHelpers.create('doctors', doctorData);
    } else {
      newDoctor = new Doctor(doctorData);
      await newDoctor.save();
    }

    res.status(201).json(newDoctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update doctor profile (e.g. schedules/available slots)
// @route   PUT /api/doctors/:id
// @access  Private (Doctor or Hospital management)
const updateDoctorProfile = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    if (isMock()) {
      const updated = mockStoreHelpers.findByIdAndUpdate('doctors', id, updateData);
      if (!updated) return res.status(404).json({ message: 'Doctor not found' });
      return res.json(updated);
    }

    const updated = await Doctor.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: 'Doctor not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete doctor profile (Hospital Admin Dashboard)
// @route   DELETE /api/doctors/:id
// @access  Private (Hospital role)
const deleteDoctor = async (req, res) => {
  const { id } = req.params;

  try {
    if (isMock()) {
      const removed = mockStoreHelpers.findByIdAndDelete('doctors', id);
      if (!removed) return res.status(404).json({ message: 'Doctor not found' });
      return res.json({ message: 'Doctor removed successfully' });
    }

    const removed = await Doctor.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ message: 'Doctor not found' });
    res.json({ message: 'Doctor removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctorProfile,
  deleteDoctor
};
