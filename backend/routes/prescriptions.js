const express = require('express');
const router = express.Router();
const {
  createPrescription,
  getPrescriptionByAppointment,
  getMyPrescriptions
} = require('../controllers/prescriptionController');
const { auth } = require('../middleware/auth');

router.post('/', auth, createPrescription);
router.get('/patient', auth, getMyPrescriptions);
router.get('/appointment/:appointmentId', auth, getPrescriptionByAppointment);

module.exports = router;
