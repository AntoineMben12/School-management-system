import express from "express";
import * as studentController from "../controllers/student.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

// All student routes require authentication and student role
router.use(authMiddleware);
router.use(roleMiddleware(["student"]));

/**
 * @swagger
 * /student/profile:
 *   get:
 *     tags: [Student]
 *     summary: Get the student's own profile
 *     description: >
 *       Returns the full profile of the currently authenticated student,
 *       including personal details, class assignment, and school information.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Student profile retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudentProfile'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/profile", studentController.getProfile);

/**
 * @swagger
 * /student/profile:
 *   put:
 *     tags: [Student]
 *     summary: Update the student's own profile
 *     description: >
 *       Allows the authenticated student to update their own editable profile
 *       fields such as `first_name`, `last_name`, `phone`, and `address`.
 *       Fields not included in the request body are left unchanged.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudentProfileUpdateRequest'
 *           example:
 *             first_name: Jane
 *             last_name: Smith
 *             phone: "+1234567890"
 *             address: 123 Main Street, Springfield
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *             example:
 *               message: Profile updated successfully.
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put("/profile", studentController.updateProfile);

/**
 * @swagger
 * /student/marks:
 *   get:
 *     tags: [Student]
 *     summary: Get the student's marks
 *     description: >
 *       Returns all recorded marks for the authenticated student.
 *       Optionally filtered by academic term using the `term_id` query parameter.
 *       Each entry includes the subject name, exam name, score, grade, and remarks.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/termIdParam'
 *     responses:
 *       200:
 *         description: Marks retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MarkItem'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/marks", studentController.getMyMarks);

/**
 * @swagger
 * /student/attendance:
 *   get:
 *     tags: [Student]
 *     summary: Get the student's attendance records
 *     description: >
 *       Returns the attendance history for the authenticated student.
 *       Optionally filtered by academic term using the `term_id` query parameter.
 *       Each entry includes the date, status (`present`, `absent`, or `late`),
 *       class name, and optional subject name.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/termIdParam'
 *     responses:
 *       200:
 *         description: Attendance records retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AttendanceItem'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/attendance", studentController.getMyAttendance);

/**
 * @swagger
 * /student/report-card:
 *   get:
 *     tags: [Student]
 *     summary: Get the student's report card
 *     description: >
 *       Generates and returns the report card for the authenticated student.
 *       Optionally filtered by academic term using the `term_id` query parameter.
 *       The report card aggregates all subject marks, final grades, and teacher
 *       remarks for the specified term.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/termIdParam'
 *     responses:
 *       200:
 *         description: Report card data retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 student:
 *                   $ref: '#/components/schemas/StudentProfile'
 *                 term:
 *                   type: object
 *                   properties:
 *                     term_id:
 *                       type: integer
 *                       example: 1
 *                     term_name:
 *                       type: string
 *                       example: Term 1
 *                     academic_year:
 *                       type: string
 *                       example: "2023/2024"
 *                 marks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MarkItem'
 *                 overall_average:
 *                   type: number
 *                   example: 78.4
 *                 overall_grade:
 *                   type: string
 *                   example: B+
 *                 class_rank:
 *                   type: integer
 *                   example: 5
 *                   nullable: true
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         description: No report card found for the specified term.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: No report card found for term 1.
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/report-card", studentController.getMyReportCard);

/**
 * @swagger
 * /student/invoices:
 *   get:
 *     tags: [Student]
 *     summary: Get the student's invoices
 *     description: >
 *       Returns all fee invoices for the authenticated student.
 *       Optionally filtered by payment status using the `status` query parameter
 *       (`paid`, `pending`, or `overdue`).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: status
 *         in: query
 *         description: Filter invoices by payment status.
 *         schema:
 *           type: string
 *           enum: [paid, pending, overdue]
 *           example: pending
 *     responses:
 *       200:
 *         description: Invoices retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/InvoiceItem'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/invoices", studentController.getMyInvoices);

export default router;
