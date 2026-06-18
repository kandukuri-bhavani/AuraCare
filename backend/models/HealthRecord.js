const mongoose = require('mongoose');

const HealthRecordSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['report', 'prescription', 'lab_result', 'other'],
    required: true,
    default: 'report'
  },
  fileUrl: {
    type: String, // Can hold path or mock Base64 encoding string
    required: true
  },
  notes: {
    type: String,
    default: ''
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('HealthRecord', HealthRecordSchema);
