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
import {
  getCurrentTerm,
  getSchoolClasses,
  getTimetable,
  getTimetableForExport,
  getTeachers,
  getSubjects,
  createTimetableEntry,
  updateTimetableEntry,
  deleteTimetableEntry,
} from "../controllers/admin.timetable.controller.js";
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getGradesAndSections,
  getStudentStats,
} from "../controllers/student.controller.js";
import {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  getClassStats,
} from "../controllers/class.controller.js";

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

/**
 * @swagger
 * /admin/timetable/current-term:
 *   get:
 *     tags: [Admin]
 *     summary: Get current academic term
 *     description: >
 *       Returns the current active academic term for the school.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current term retrieved successfully.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         description: No active term found
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/timetable/current-term", getCurrentTerm);

/**
 * @swagger
 * /admin/timetable/classes:
 *   get:
 *     tags: [Admin]
 *     summary: Get all classes for timetable
 *     description: >
 *       Returns all classes in the school for timetable configuration.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Classes retrieved successfully.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/timetable/classes", getSchoolClasses);

/**
 * @swagger
 * /admin/timetable/teachers:
 *   get:
 *     tags: [Admin]
 *     summary: Get teachers with availability
 *     description: >
 *       Returns all teachers with their availability and assigned classes.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Teachers retrieved successfully.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/timetable/teachers", getTeachers);

/**
 * @swagger
 * /admin/timetable/subjects:
 *   get:
 *     tags: [Admin]
 *     summary: Get all available subjects
 *     description: >
 *       Returns all subjects available for scheduling in the school.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subjects retrieved successfully.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/timetable/subjects", getSubjects);

/**
 * @swagger
 * /admin/timetable/export/all:
 *   get:
 *     tags: [Admin]
 *     summary: Get all timetables for export
 *     description: >
 *       Returns timetables for all classes in a term for PDF export.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: termId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The academic term ID
 *     responses:
 *       200:
 *         description: Timetables retrieved successfully.
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/timetable/export/all", getTimetableForExport);

/**
 * @swagger
 * /admin/timetable/{classId}/{termId}:
 *   get:
 *     tags: [Admin]
 *     summary: Get timetable for a class
 *     description: >
 *       Returns the timetable for a specific class in a given term.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The class ID
 *       - in: path
 *         name: termId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The academic term ID
 *     responses:
 *       200:
 *         description: Timetable retrieved successfully.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/timetable/:classId/:termId", getTimetable);

/**
 * @swagger
 * /admin/timetable:
 *   post:
 *     tags: [Admin]
 *     summary: Create a new timetable entry
 *     description: >
 *       Adds a new scheduled subject to the timetable. Validates for room and teacher conflicts.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - class_id
 *               - subject_id
 *               - day_of_week
 *               - start_time
 *               - end_time
 *               - term_id
 *             properties:
 *               class_id:
 *                 type: integer
 *               subject_id:
 *                 type: integer
 *               teacher_id:
 *                 type: integer
 *               day_of_week:
 *                 type: string
 *                 enum: [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday]
 *               start_time:
 *                 type: string
 *                 format: time
 *               end_time:
 *                 type: string
 *                 format: time
 *               room_number:
 *                 type: string
 *               term_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Timetable entry created successfully.
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post("/timetable", createTimetableEntry);

/**
 * @swagger
 * /admin/timetable/{timetableId}:
 *   put:
 *     tags: [Admin]
 *     summary: Update a timetable entry
 *     description: >
 *       Updates an existing timetable entry (schedule adjustment).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: timetableId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The timetable entry ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject_id:
 *                 type: integer
 *               teacher_id:
 *                 type: integer
 *               day_of_week:
 *                 type: string
 *               start_time:
 *                 type: string
 *                 format: time
 *               end_time:
 *                 type: string
 *                 format: time
 *               room_number:
 *                 type: string
 *     responses:
 *       200:
 *         description: Timetable entry updated successfully.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put("/timetable/:timetableId", updateTimetableEntry);

/**
 * @swagger
 * /admin/timetable/{timetableId}:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete a timetable entry
 *     description: >
 *       Removes a scheduled subject from the timetable.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: timetableId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The timetable entry ID
 *     responses:
 *       200:
 *         description: Timetable entry deleted successfully.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete("/timetable/:timetableId", deleteTimetableEntry);

/**
 * @swagger
 * /admin/students/stats/overview:
 *   get:
 *     tags: [Admin]
 *     summary: Get student statistics
 *     description: >
 *       Returns aggregated student stats for the school.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/students/stats/overview", getStudentStats);

/**
 * @swagger
 * /admin/students/filter/grades-sections:
 *   get:
 *     tags: [Admin]
 *     summary: Get grades and sections
 *     description: >
 *       Returns all available grades and sections for filtering.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Grades and sections retrieved successfully.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/students/filter/grades-sections", getGradesAndSections);

/**
 * @swagger
 * /admin/students:
 *   get:
 *     tags: [Admin]
 *     summary: Get all students
 *     description: >
 *       Returns all students for the school with optional filters.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: grade
 *         schema:
 *           type: integer
 *       - in: query
 *         name: section
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: feeStatus
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Students retrieved successfully.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/students", getAllStudents);

/**
 * @swagger
 * /admin/students:
 *   post:
 *     tags: [Admin]
 *     summary: Create a new student
 *     description: >
 *       Adds a new student to the school.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fn
 *               - ln
 *               - grade
 *               - sec
 *             properties:
 *               fn:
 *                 type: string
 *               ln:
 *                 type: string
 *               dob:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *               blood:
 *                 type: string
 *               addr:
 *                 type: string
 *               grade:
 *                 type: integer
 *               sec:
 *                 type: string
 *               enr:
 *                 type: string
 *                 format: date
 *               parent:
 *                 type: string
 *               pPhone:
 *                 type: string
 *               pEmail:
 *                 type: string
 *     responses:
 *       201:
 *         description: Student created successfully.
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post("/students", createStudent);

/**
 * @swagger
 * /admin/students/{studentId}:
 *   get:
 *     tags: [Admin]
 *     summary: Get student by ID
 *     description: >
 *       Returns detailed information for a specific student.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Student retrieved successfully.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         description: Student not found
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/students/:studentId", getStudentById);

/**
 * @swagger
 * /admin/students/{studentId}:
 *   put:
 *     tags: [Admin]
 *     summary: Update a student
 *     description: >
 *       Updates student information.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Student updated successfully.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put("/students/:studentId", updateStudent);

/**
 * @swagger
 * /admin/students/{studentId}:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete a student
 *     description: >
 *       Removes a student from the system.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Student deleted successfully.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete("/students/:studentId", deleteStudent);

/**
 * @swagger
 * /admin/classes/stats/overview:
 *   get:
 *     tags: [Admin]
 *     summary: Get class statistics
 *     description: >
 *       Returns aggregated class stats for the school.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/classes/stats/overview", getClassStats);

/**
 * @swagger
 * /admin/classes:
 *   get:
 *     tags: [Admin]
 *     summary: Get all classes
 *     description: >
 *       Returns all classes for the school with optional filters.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: grade
 *         schema:
 *           type: integer
 *       - in: query
 *         name: section
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Classes retrieved successfully.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/classes", getAllClasses);

/**
 * @swagger
 * /admin/classes:
 *   post:
 *     tags: [Admin]
 *     summary: Create a new class
 *     description: >
 *       Adds a new class to the school.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - grade
 *             properties:
 *               name:
 *                 type: string
 *               grade:
 *                 type: integer
 *               section:
 *                 type: string
 *               class_teacher_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Class created successfully.
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post("/classes", createClass);

/**
 * @swagger
 * /admin/classes/{classId}:
 *   get:
 *     tags: [Admin]
 *     summary: Get class by ID
 *     description: >
 *       Returns detailed information for a specific class.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Class retrieved successfully.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         description: Class not found
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/classes/:classId", getClassById);

/**
 * @swagger
 * /admin/classes/{classId}:
 *   put:
 *     tags: [Admin]
 *     summary: Update a class
 *     description: >
 *       Updates class information.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Class updated successfully.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put("/classes/:classId", updateClass);

/**
 * @swagger
 * /admin/classes/{classId}:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete a class
 *     description: >
 *       Removes a class from the system.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Class deleted successfully.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete("/classes/:classId", deleteClass);

export default router;
