const express = require('express');
const router = express.Router();
const {
  getAllHospitals,
  getHospitalById,
  getSmartRecommendations,
  updateHospital
} = require('../controllers/hospitalController');
const { auth } = require('../middleware/auth');

router.get('/', getAllHospitals);
router.get('/recommend', getSmartRecommendations);
router.get('/:id', getHospitalById);
router.put('/:id', auth, updateHospital);

module.exports = router;
