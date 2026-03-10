import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import checkRole from "../middleware/role.middleware.js";
import { getDashboardData } from "../controllers/admin.dashboard.controller.js";
import {
  addStudent,
  addTeacher,
  createAnnouncement,
  getReportsSummary,
  getClassesList,
} from "../controllers/admin.quickaction.controller.js";

const router = express.Router();

// All admin routes require authentication and school_admin role
router.use(authMiddleware);
router.use(checkRole(["school_admin"]));

/**
 * @swagger
 * /admin/dashboard:
 *   get:
 *     tags: [Admin]
 *     summary: Get school dashboard data
 *     description: >
 *       Returns aggregated statistics, attendance trends, and recent activity
 *       for the authenticated school admin's school.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardStats'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/dashboard", getDashboardData);

/**
 * @swagger
 * /admin/students:
 *   post:
 *     tags: [Admin]
 *     summary: Add a new student
 *     description: >
 *       Creates a new student user account and enrolls them in the admin's school.
 *       Optionally assigns the student to a class via `class_id`.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddStudentRequest'
 *     responses:
 *       201:
 *         description: Student created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Student added successfully.
 *                 user_id:
 *                   type: integer
 *                   example: 42
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post("/students", addStudent);

/**
 * @swagger
 * /admin/teachers:
 *   post:
 *     tags: [Admin]
 *     summary: Add a new teacher
 *     description: >
 *       Creates a new teacher user account and assigns them to the admin's school.
 *       Optionally links the teacher to a subject via `subject_id`.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddTeacherRequest'
 *     responses:
 *       201:
 *         description: Teacher created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Teacher added successfully.
 *                 user_id:
 *                   type: integer
 *                   example: 55
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post("/teachers", addTeacher);

/**
 * @swagger
 * /admin/announcements:
 *   post:
 *     tags: [Admin]
 *     summary: Create a school announcement
 *     description: >
 *       Publishes a new announcement for the school. The `target_audience` field
 *       controls who can see the announcement (`all`, `students`, `teachers`, or `parents`).
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AnnouncementRequest'
 *           example:
 *             title: Mid-Term Exam Schedule
 *             content: Mid-term exams will be held from March 18 to March 22. Please check your timetable.
 *             target_audience: students
 *     responses:
 *       201:
 *         description: Announcement created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Announcement created successfully.
 *                 announcement_id:
 *                   type: integer
 *                   example: 7
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post("/announcements", createAnnouncement);

/**
 * @swagger
 * /admin/reports:
 *   get:
 *     tags: [Admin]
 *     summary: Get reports summary
 *     description: >
 *       Returns a summary of academic performance for the admin's school,
 *       including pass/fail counts and average scores.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reports summary retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReportsSummary'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/reports", getReportsSummary);

/**
 * @swagger
 * /admin/classes:
 *   get:
 *     tags: [Admin]
 *     summary: Get list of classes
 *     description: >
 *       Returns all classes belonging to the admin's school.
 *       Useful for populating dropdowns when adding students or assignments.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Classes retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ClassItem'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/classes", getClassesList);

export default router;
