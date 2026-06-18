const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Hospital = require('../models/Hospital');
const { isMock } = require('../config/db');
const { mockStore, mockStoreHelpers } = require('../config/mockStore');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretjwtkeyforbookadoctorapplication2026', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user (Patient, Doctor, or Hospital)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const {
    username,
    email,
    password,
    role,
    // Patient details
    name, age, gender, phone, location, incomeRange, healthProblem, insuranceDetails, abhaId,
    // Hospital details
    address, city, departments, minPrice, maxPrice, governmentSchemes, emergencyService, ambulanceContact,
    // Doctor details
    hospitalId, specialization, experience, consultationFee, availableDays, availableTimeSlots
  } = req.body;

  try {
    // 1. Check if user already exists
    if (isMock()) {
      const existingUser = mockStoreHelpers.findOne('users', u => u.email === email || u.username === username);
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email or username already exists' });
      }
    } else {
      const userExists = await User.findOne({ $or: [{ email }, { username }] });
      if (userExists) {
        return res.status(400).json({ message: 'User with this email or username already exists' });
      }
    }

    // 2. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser;
    let profileData = null;

    // 3. Create User in Database
    if (isMock()) {
      newUser = mockStoreHelpers.create('users', {
        username,
        email,
        password: hashedPassword,
        role
      });
    } else {
      newUser = new User({
        username,
        email,
        password: password, // Schema hashes before save
        role
      });
      await newUser.save();
    }

    // 4. Create Profile according to Role
    if (role === 'patient') {
      const eligibleSchemes = [];
      if (incomeRange === 'low') {
        eligibleSchemes.push('Ayushman Bharat PM-JAY', 'State Low-Income Health Plan');
      } else if (incomeRange === 'middle') {
        eligibleSchemes.push('CGHS');
      }

      const pData = {
        userId: newUser._id,
        name: name || username,
        age: age || 30,
        gender: gender || 'Male',
        phone: phone || '9999999999',
        location: location || 'Mumbai',
        incomeRange: incomeRange || 'middle',
        healthProblem: healthProblem || '',
        insuranceDetails: insuranceDetails || '',
        abhaId: abhaId || '',
        governmentSchemesEligible: eligibleSchemes
      };

      if (isMock()) {
        profileData = mockStoreHelpers.create('patients', pData);
      } else {
        const patient = new Patient(pData);
        profileData = await patient.save();
      }
    } else if (role === 'hospital') {
      const hData = {
        userId: newUser._id,
        name: name || username,
        image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=600&auto=format&fit=crop',
        address: address || '101 Medical Road',
        city: city || 'Mumbai',
        coordinates: { lat: 19.076, lng: 72.877 },
        departments: departments || ['General Medicine'],
        minPrice: minPrice || 100,
        maxPrice: maxPrice || 1000,
        governmentSchemes: governmentSchemes || ['Ayushman Bharat PM-JAY'],
        emergencyService: emergencyService === undefined ? true : emergencyService,
        icuAvailable: true,
        bloodAvailable: true,
        ambulanceContact: ambulanceContact || '102',
        rating: 4.0,
        reviews: []
      };

      if (isMock()) {
        profileData = mockStoreHelpers.create('hospitals', hData);
      } else {
        const hospital = new Hospital(hData);
        profileData = await hospital.save();
      }
    } else if (role === 'doctor') {
      const dData = {
        userId: newUser._id,
        hospitalId: hospitalId || 'hosp1', // Assign to default hospital if none given
        name: name || username,
        photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&auto=format&fit=crop',
        specialization: specialization || 'General Physician',
        experience: experience || 5,
        consultationFee: consultationFee || 250,
        availableDays: availableDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        availableTimeSlots: availableTimeSlots || ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'],
        rating: 4.5
      };

      if (isMock()) {
        profileData = mockStoreHelpers.create('doctors', dData);
      } else {
        const doctor = new Doctor(dData);
        profileData = await doctor.save();
      }
    }

    const token = generateToken(newUser._id);

    res.status(201).json({
      token,
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      },
      profile: profileData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user;
    if (isMock()) {
      user = mockStoreHelpers.findOne('users', u => u.email === email);
    } else {
      user = await User.findOne({ email });
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    let isMatch = false;
    if (isMock()) {
      isMatch = bcrypt.compareSync(password, user.password);
    } else {
      isMatch = await user.comparePassword(password);
    }

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Fetch related profile details
    let profile = null;
    if (user.role === 'patient') {
      profile = isMock()
        ? mockStoreHelpers.findOne('patients', p => p.userId === user._id)
        : await Patient.findOne({ userId: user._id });
    } else if (user.role === 'doctor') {
      profile = isMock()
        ? mockStoreHelpers.findOne('doctors', d => d.userId === user._id)
        : await Doctor.findOne({ userId: user._id });
    } else if (user.role === 'hospital') {
      profile = isMock()
        ? mockStoreHelpers.findOne('hospitals', h => h.userId === user._id)
        : await Hospital.findOne({ userId: user._id });
    }

    res.json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      profile
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = req.user;
    let profile = null;

    if (user.role === 'patient') {
      profile = isMock()
        ? mockStoreHelpers.findOne('patients', p => p.userId.toString() === user._id.toString())
        : await Patient.findOne({ userId: user._id });
    } else if (user.role === 'doctor') {
      profile = isMock()
        ? mockStoreHelpers.findOne('doctors', d => d.userId.toString() === user._id.toString())
        : await Doctor.findOne({ userId: user._id });
    } else if (user.role === 'hospital') {
      profile = isMock()
        ? mockStoreHelpers.findOne('hospitals', h => h.userId.toString() === user._id.toString())
        : await Hospital.findOne({ userId: user._id });
    }

    res.json({ user, profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getMe };
