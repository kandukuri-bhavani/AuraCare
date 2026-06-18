const express = require('express');
const router = express.Router();
const {
  uploadHealthRecord,
  getMyHealthRecords,
  getPatientHealthRecords
} = require('../controllers/healthRecordController');
const { auth } = require('../middleware/auth');

router.post('/', auth, uploadHealthRecord);
router.get('/', auth, getMyHealthRecords);
router.get('/patient/:patientId', auth, getPatientHealthRecords);

module.exports = router;
