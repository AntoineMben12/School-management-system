import express from 'express';
import * as controller from '../controllers/superadmin.controller.js';
import checkRole from '../middleware/role.middleware.js';
import { authMiddleware } from '../middleware/auth.middleware.js'; // Assuming this is named export

const router = express.Router();

// All routes require Auth + SuperAdmin role
router.use(authMiddleware);
router.use(checkRole(['super_admin']));

router.post('/school', controller.createSchool);
router.put('/license/:schoolId', controller.updateLicense);
router.get('/dashboard', controller.dashboard);

export default router;