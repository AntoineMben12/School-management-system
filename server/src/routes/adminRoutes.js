import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import checkRole from '../middleware/role.middleware.js';
import { getDashboardData } from '../controllers/admin.dashboard.controller.js';
import {
    addStudent,
    addTeacher,
    createAnnouncement,
    getReportsSummary,
    getClassesList
} from '../controllers/admin.quickaction.controller.js';

const router = express.Router();

// All admin routes require authentication and school_admin role
router.use(authMiddleware);
router.use(checkRole(['school_admin']));

// Dashboard overview data
router.get('/dashboard', getDashboardData);

// Quick Action routes
router.post('/students', addStudent);
router.post('/teachers', addTeacher);
router.post('/announcements', createAnnouncement);
router.get('/reports', getReportsSummary);
router.get('/classes', getClassesList);

export default router;
