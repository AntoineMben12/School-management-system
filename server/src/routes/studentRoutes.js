import express from 'express';
import * as studentController from '../controllers/student.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import roleMiddleware from '../middleware/role.middleware.js';

const router = express.Router();

// All student routes require authentication and student role
router.use(authMiddleware);
router.use(roleMiddleware(['student']));

// Profile routes
router.get('/profile', studentController.getProfile);
router.put('/profile', studentController.updateProfile);

// Academic routes
router.get('/marks', studentController.getMyMarks);
router.get('/attendance', studentController.getMyAttendance);
router.get('/report-card', studentController.getMyReportCard);

// Finance routes
router.get('/invoices', studentController.getMyInvoices);

export default router;
