const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');
const { isMock } = require('../config/db');
const { mockStore, mockStoreHelpers } = require('../config/mockStore');

const mapProblemToDepartment = (problem = '') => {
  const p = problem.toLowerCase();
  if (p.includes('heart') || p.includes('cardiac') || p.includes('chest pain') || p.includes('breath') || p.includes('cardio')) {
    return 'Cardiology';
  }
  if (p.includes('fracture') || p.includes('bone') || p.includes('joint') || p.includes('back pain') || p.includes('knee') || p.includes('ortho') || p.includes('accident')) {
    return 'Orthopedics';
  }
  if (p.includes('child') || p.includes('baby') || p.includes('kid') || p.includes('pediatr') || p.includes('vaccin')) {
    return 'Pediatrics';
  }
  if (p.includes('brain') || p.includes('nerve') || p.includes('stroke') || p.includes('headache') || p.includes('migraine') || p.includes('neuro')) {
    return 'Neurology';
  }
  if (p.includes('skin') || p.includes('rash') || p.includes('acne') || p.includes('allergy') || p.includes('derm')) {
    return 'Dermatology';
  }
  if (p.includes('women') || p.includes('pregnant') || p.includes('delivery') || p.includes('gynae') || p.includes('pregnancy')) {
    return 'Gynaecology';
  }
  return 'General Medicine';
};

// @desc    Get all hospitals with query filters
// @route   GET /api/hospitals
// @access  Public
const getAllHospitals = async (req, res) => {
  const { city, department, minPrice, maxPrice, scheme, emergencyOnly, search } = req.query;

  try {
    if (isMock()) {
      let filtered = [...mockStore.hospitals];

      if (city) {
        filtered = filtered.filter(h => h.city.toLowerCase() === city.toLowerCase());
      }
      if (department) {
        filtered = filtered.filter(h => h.departments.some(d => d.toLowerCase() === department.toLowerCase()));
      }
      if (minPrice) {
        filtered = filtered.filter(h => h.minPrice <= parseInt(maxPrice || 10000) && h.maxPrice >= parseInt(minPrice));
      }
      if (scheme) {
        filtered = filtered.filter(h => h.governmentSchemes.some(s => s.toLowerCase().includes(scheme.toLowerCase())));
      }
      if (emergencyOnly === 'true') {
        filtered = filtered.filter(h => h.emergencyService === true);
      }
      if (search) {
        const query = search.toLowerCase();
        filtered = filtered.filter(h => 
          h.name.toLowerCase().includes(query) || 
          h.address.toLowerCase().includes(query) ||
          h.departments.some(d => d.toLowerCase().includes(query))
        );
      }

      return res.json(filtered);
    }

    // MongoDB query construction
    let query = {};

    if (city) query.city = new RegExp(`^${city}$`, 'i');
    if (department) query.departments = { $in: [new RegExp(`^${department}$`, 'i')] };
    if (scheme) query.governmentSchemes = { $in: [new RegExp(scheme, 'i')] };
    if (emergencyOnly === 'true') query.emergencyService = true;
    if (minPrice || maxPrice) {
      query.minPrice = { $lte: parseInt(maxPrice) || 10000 };
      query.maxPrice = { $gte: parseInt(minPrice) || 0 };
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { departments: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const hospitals = await Hospital.find(query);
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get hospital details by ID along with its doctors
// @route   GET /api/hospitals/:id
// @access  Public
const getHospitalById = async (req, res) => {
  const { id } = req.params;

  try {
    if (isMock()) {
      const hospital = mockStoreHelpers.findById('hospitals', id);
      if (!hospital) {
        return res.status(404).json({ message: 'Hospital not found' });
      }

      // Load associated doctors
      const doctors = mockStore.doctors.filter(d => d.hospitalId === id);
      return res.json({ hospital, doctors });
    }

    const hospital = await Hospital.findById(id);
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    const doctors = await Doctor.find({ hospitalId: id });
    res.json({ hospital, doctors });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get smart recommendations based on user profiling
// @route   GET /api/hospitals/recommend
// @access  Public
const getSmartRecommendations = async (req, res) => {
  const { city, healthProblem, incomeRange, selectedScheme } = req.query;

  try {
    const hasProblem = healthProblem && healthProblem.trim().length > 0;
    const targetDept = hasProblem ? mapProblemToDepartment(healthProblem) : 'General Medicine';
    let hospitalsList = [];

    if (isMock()) {
      hospitalsList = [...mockStore.hospitals];
    } else {
      hospitalsList = await Hospital.find({});
    }

    // Filter by city if specified
    if (city) {
      hospitalsList = hospitalsList.filter(h => h.city.toLowerCase() === city.toLowerCase());
    }

    // Recommendation Scorer
    const scoredHospitals = await Promise.all(hospitalsList.map(async (hospital) => {
      let score = 30; // Base score baseline
      let matchReasons = [];

      // 1. Specialty / Department Match (Crucial)
      if (hasProblem) {
        const hasDept = hospital.departments.some(d => d.toLowerCase() === targetDept.toLowerCase());
        if (hasDept) {
          score += 50;
          matchReasons.push(`Provides Specialized ${targetDept} Department`);
        } else {
          // Partial department match or general medicine fallback
          const hasGeneral = hospital.departments.some(d => d.toLowerCase() === 'general medicine');
          if (hasGeneral) {
            score += 20;
            matchReasons.push('General Medicine coverage for primary diagnosis');
          }
        }
      } else {
        // No health problem specified: default general match
        score += 40;
        matchReasons.push('Empanelled Facility with General Medicine Support');
      }

      // 2. Affordability Matching
      if (incomeRange === 'low') {
        // Prioritize low minimum consultation cost
        if (hospital.minPrice <= 250) {
          score += 30;
          matchReasons.push('Highly Affordable Consultation Fees');
        }
        // Schemes are highly weighted for low income
        const acceptsGovScheme = hospital.governmentSchemes.length > 0;
        if (acceptsGovScheme) {
          score += 40;
          matchReasons.push('Accepts Government Healthcare Cards');
        }
      } else if (incomeRange === 'middle') {
        if (hospital.minPrice <= 500) {
          score += 20;
          matchReasons.push('Moderate Consultation Pricing');
        }
      } else {
        // High income: prioritize complete emergency setup and high ratings
        score += (hospital.rating * 5);
      }

      // 3. Scheme specific matching
      if (selectedScheme) {
        const acceptsSelected = hospital.governmentSchemes.some(s => s.toLowerCase() === selectedScheme.toLowerCase());
        if (acceptsSelected) {
          score += 50;
          matchReasons.push(`100% Eligible for ${selectedScheme} Scheme`);
        }
      }

      // 4. ICU / Emergency matching
      if (hospital.emergencyService) {
        score += 15;
        if (hasProblem && (healthProblem.toLowerCase().includes('emergency') || healthProblem.toLowerCase().includes('heart') || healthProblem.toLowerCase().includes('stroke') || healthProblem.toLowerCase().includes('accident'))) {
          score += 30;
          matchReasons.push('24/7 ICU & Emergency Support Ready');
        }
      }

      // 5. Rating weight
      score += (hospital.rating * 4);

      // Find best matched doctor
      let hospitalDoctors = [];
      if (isMock()) {
        hospitalDoctors = mockStore.doctors.filter(d => d.hospitalId.toString() === hospital._id.toString());
      } else {
        hospitalDoctors = await Doctor.find({ hospitalId: hospital._id });
      }

      // 1. Try to find a doctor with matching department
      // 2. Try to find a general medicine doctor
      // 3. Fall back to any doctor
      let matchedDoctor = hospitalDoctors.find(d => d.specialization.toLowerCase() === targetDept.toLowerCase())
        || hospitalDoctors.find(d => d.specialization.toLowerCase().includes('general') || d.specialization.toLowerCase().includes('medicine'))
        || hospitalDoctors[0]
        || null;

      return {
        hospital,
        score,
        targetDept: hasProblem ? targetDept : 'General Medicine',
        matchReasons: matchReasons.slice(0, 3), // Return top 3 reasons
        bestDoctor: matchedDoctor
      };
    }));

    // Sort by descending score
    scoredHospitals.sort((a, b) => b.score - a.score);

    res.json(scoredHospitals); // Return all matching hospitals sorted by score
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update hospital info (Hospital Dashboard)
// @route   PUT /api/hospitals/:id
// @access  Private (Hospital Admin only)
const updateHospital = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    if (isMock()) {
      const updated = mockStoreHelpers.findByIdAndUpdate('hospitals', id, updateData);
      if (!updated) return res.status(404).json({ message: 'Hospital not found' });
      return res.json(updated);
    }

    const updated = await Hospital.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: 'Hospital not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllHospitals,
  getHospitalById,
  getSmartRecommendations,
  updateHospital
};
