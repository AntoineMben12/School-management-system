import express from "express";
const router = express.Router();
import * as teacherController from "../controllers/teacher.controller.js";
import roleMiddleware from "../middleware/role.middleware.js";

router.use(roleMiddleware(["TEACHER"]));

/**
 * @swagger
 * /teacher/marks:
 *   post:
 *     tags: [Teacher]
 *     summary: Add marks for a student
 *     description: >
 *       Records a mark/score for a student in a given subject, term, and exam.
 *       The authenticated teacher must be assigned to the relevant class or subject.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddMarkRequest'
 *           example:
 *             student_id: 10
 *             subject_id: 2
 *             term_id: 1
 *             exam_id: 5
 *             score: 85.5
 *             max_score: 100
 *             remarks: Excellent performance
 *     responses:
 *       201:
 *         description: Mark recorded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Mark added successfully.
 *                 mark_id:
 *                   type: integer
 *                   example: 88
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post("/marks", teacherController.addMarks);

/**
 * @swagger
 * /teacher/attendance:
 *   post:
 *     tags: [Teacher]
 *     summary: Mark attendance for a class
 *     description: >
 *       Submits attendance records for an entire class on a specific date.
 *       Each student in the `attendance` array must have a `student_id` and a
 *       `status` of `present`, `absent`, or `late`.
 *       Existing records for the same class and date will be updated.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AttendanceRequest'
 *           example:
 *             class_id: 3
 *             date: "2024-03-15"
 *             attendance:
 *               - student_id: 10
 *                 status: present
 *               - student_id: 11
 *                 status: absent
 *               - student_id: 12
 *                 status: late
 *     responses:
 *       201:
 *         description: Attendance recorded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *             example:
 *               message: Attendance marked successfully.
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post("/attendance", teacherController.markAttendance);

/**
 * @swagger
 * /teacher/student:
 *   get:
 *     tags: [Teacher]
 *     summary: Get the teacher's students
 *     description: >
 *       Returns all students assigned to the authenticated teacher's class(es)
 *       or subject(s). Useful for populating mark-entry and attendance forms.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of students retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StudentItem'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/student", teacherController.getMyStudents);

export default router;
