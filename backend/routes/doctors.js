const express = require('express');
const router = express.Router();
const {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctorProfile,
  deleteDoctor
} = require('../controllers/doctorController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);

// Protected routes
router.post('/', auth, authorize(['hospital', 'admin']), createDoctor);
router.put('/:id', auth, updateDoctorProfile);
router.delete('/:id', auth, authorize(['hospital', 'admin']), deleteDoctor);

module.exports = router;
