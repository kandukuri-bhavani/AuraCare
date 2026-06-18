const HealthRecord = require('../models/HealthRecord');
const Patient = require('../models/Patient');
const { isMock } = require('../config/db');
const { mockStore, mockStoreHelpers } = require('../config/mockStore');

// @desc    Upload a new medical report
// @route   POST /api/health-records
// @access  Private (Patient only)
const uploadHealthRecord = async (req, res) => {
  const { title, type, fileUrl, notes } = req.body;

  try {
    let patientProfile;
    if (isMock()) {
      patientProfile = mockStoreHelpers.findOne('patients', p => p.userId === req.user._id);
    } else {
      patientProfile = await Patient.findOne({ userId: req.user._id });
    }

    if (!patientProfile) {
      return res.status(404).json({ message: 'Patient profile not found. Complete profile details first.' });
    }

    const recordData = {
      patientId: patientProfile._id,
      title,
      type: type || 'report',
      fileUrl: fileUrl || 'data:application/pdf;base64,JVBERi0xLjQKJ...',
      notes: notes || ''
    };

    let newRecord;
    if (isMock()) {
      newRecord = mockStoreHelpers.create('healthRecords', recordData);
    } else {
      newRecord = new HealthRecord(recordData);
      await newRecord.save();
    }

    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all health records for the logged-in Patient
// @route   GET /api/health-records
// @access  Private (Patient only)
const getMyHealthRecords = async (req, res) => {
  try {
    let patientProfile;
    if (isMock()) {
      patientProfile = mockStoreHelpers.findOne('patients', p => p.userId.toString() === req.user._id.toString());
      if (!patientProfile) return res.json([]);
      const records = mockStore.healthRecords.filter(r => r.patientId.toString() === patientProfile._id.toString());
      return res.json(records);
    }

    patientProfile = await Patient.findOne({ userId: req.user._id });
    if (!patientProfile) return res.json([]);

    const records = await HealthRecord.find({ patientId: patientProfile._id }).sort({ uploadedAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get patient records by ID (for Doctor diagnosis verification)
// @route   GET /api/health-records/patient/:patientId
// @access  Private (Doctor or Hospital Admin)
const getPatientHealthRecords = async (req, res) => {
  const { patientId } = req.params;

  try {
    if (isMock()) {
      const records = mockStore.healthRecords.filter(r => r.patientId.toString() === patientId.toString());
      return res.json(records);
    }

    const records = await HealthRecord.find({ patientId }).sort({ uploadedAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadHealthRecord,
  getMyHealthRecords,
  getPatientHealthRecords
};
