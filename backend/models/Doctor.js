const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  photo: {
    type: String,
    default: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&auto=format&fit=crop'
  },
  specialization: {
    type: String,
    required: true,
    trim: true
  },
  experience: {
    type: Number,
    required: true,
    default: 1
  },
  consultationFee: {
    type: Number,
    required: true,
    default: 200
  },
  availableDays: {
    type: [String],
    default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  },
  availableTimeSlots: {
    type: [String],
    default: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM']
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Doctor', DoctorSchema);
