const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  comment: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now }
});

const HospitalSchema = new mongoose.Schema({
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
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=600&auto=format&fit=crop'
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true,
    index: true
  },
  coordinates: {
    lat: { type: Number, default: 19.0760 }, // Default near Mumbai
    lng: { type: Number, default: 72.8777 }
  },
  departments: {
    type: [String],
    default: []
  },
  minPrice: {
    type: Number,
    required: true,
    default: 100
  },
  maxPrice: {
    type: Number,
    required: true,
    default: 1000
  },
  governmentSchemes: {
    type: [String],
    default: []
  },
  emergencyService: {
    type: Boolean,
    default: false
  },
  icuAvailable: {
    type: Boolean,
    default: false
  },
  bloodAvailable: {
    type: Boolean,
    default: false
  },
  ambulanceContact: {
    type: String,
    default: '102'
  },
  rating: {
    type: Number,
    default: 4.0,
    min: 0,
    max: 5
  },
  reviews: [ReviewSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Hospital', HospitalSchema);
