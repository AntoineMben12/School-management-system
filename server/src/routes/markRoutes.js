import express from "express";
import { addMark } from "../controllers/mark.controller.js";

const router = express.Router();

/**
 * @swagger
 * /mark/addMark:
 *   post:
 *     tags: [Mark]
 *     summary: Add a mark / grade entry
 *     description: >
 *       Standalone endpoint for recording a mark for a student in a specific
 *       subject and exam. This route is separate from the teacher-scoped
 *       `/teacher/marks` endpoint and does not enforce a role restriction by
 *       default — apply middleware as needed for your deployment.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MarkRequest'
 *           example:
 *             student_id: 10
 *             subject_id: 2
 *             exam_id: 5
 *             marks: 78.5
 *             max_marks: 100
 *             remarks: Good effort
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
 *                   example: 101
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       409:
 *         description: A mark for this student/subject/exam combination already exists.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: Mark already exists for this student and exam.
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post("/addMark", addMark);

export default router;
