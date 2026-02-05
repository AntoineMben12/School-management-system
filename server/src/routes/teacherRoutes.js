import express from 'express';
const router = express.Router();
import * as teacherController from '../controllers/teacher.controller.js'
import roleMiddleware from '../middleware/role.middleware.js'

router.use(roleMiddleware(['TEACHER']))
router.post('/marks', teacherController.addMarks)
router.post('/attendance', teacherController.markAttendance)
router.get('/student', teacherController.getMyStudents)
// router.get('/statistics', teacherController.getStatistics)


export default router;
