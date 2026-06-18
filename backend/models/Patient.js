const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  incomeRange: {
    type: String,
    enum: ['low', 'middle', 'high'],
    required: true,
    default: 'middle'
  },
  healthProblem: {
    type: String,
    default: ''
  },
  insuranceDetails: {
    type: String,
    default: ''
  },
  abhaId: {
    type: String,
    default: ''
  },
  governmentSchemesEligible: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Patient', PatientSchema);
