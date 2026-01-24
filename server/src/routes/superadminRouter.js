const express = require('express');
const router = express.Router();

const controller = require('../controllers/superadmin.controller');
const auth = require('../middleware/auth.middleware');
const superAdimOnly = require('../middleware/superadmin.middleware');

router.post('/school', auth, superAdimOnly, controller.createSchool);
router.post('/license', auth, superAdimOnly, controller.grantLicense);
router.post('/school-admin', auth, superAdimOnly, controller.createSchoolAdmin);
router.put('/school/:id/status', auth, superAdimOnly, controller.updateSchoolStatus);
router.get('/dashboard', auth, superAdimOnly, controller.dashboard)

module.exports = router;