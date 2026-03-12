import StudentService from '../services/student.service.js';

// ====== STUDENT PROFILE (Student Self) ======

/**
 * GET /student/profile
 * Get authenticated student's profile
 */
export const getProfile = async (req, res, next) => {
    try {
        const result = await StudentService.getProfile(req.user);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

/**
 * PUT /student/profile
 * Update student profile
 */
export const updateProfile = async (req, res, next) => {
    try {
        const result = await StudentService.updateProfile(req.user, req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

/**
 * GET /student/marks
 * Get student's marks
 */
export const getMyMarks = async (req, res, next) => {
    try {
        const { term_id } = req.query;
        const result = await StudentService.getMyMarks(req.user, term_id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

/**
 * GET /student/attendance
 * Get student's attendance
 */
export const getMyAttendance = async (req, res, next) => {
    try {
        const { term_id } = req.query;
        const result = await StudentService.getMyAttendance(req.user, term_id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

/**
 * GET /student/report-card
 * Get student's report card
 */
export const getMyReportCard = async (req, res, next) => {
    try {
        const { term_id } = req.query;
        const result = await StudentService.getMyReportCard(req.user, term_id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

/**
 * GET /student/invoices
 * Get student's invoices
 */
export const getMyInvoices = async (req, res, next) => {
    try {
        const { status } = req.query;
        const result = await StudentService.getMyInvoices(req.user, status);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// ====== ADMIN STUDENT REGISTRY ======

/**
 * GET /admin/students
 * Get all students with optional filters
 */
export const getAllStudents = async (req, res, next) => {
    try {
        const { school_id } = req.user;
        const { grade, section, status, feeStatus, search } = req.query;

        const filters = {};
        if (grade) filters.grade = Number(grade);
        if (section) filters.section = section;
        if (status) filters.status = status;
        if (feeStatus) filters.feeStatus = feeStatus;
        if (search) filters.search = search;

        const students = await StudentService.getAllStudents(school_id, filters);
        res.json(students);
    } catch (error) {
        next(error);
    }
};

/**
 * GET /admin/students/filter/grades-sections
 * Get available grades and sections for filtering
 */
export const getGradesAndSections = async (req, res, next) => {
    try {
        const { school_id } = req.user;

        const data = await StudentService.getGradesAndSections(school_id);
        res.json(data);
    } catch (error) {
        next(error);
    }
};

/**
 * GET /admin/students/stats/overview
 * Get student statistics
 */
export const getStudentStats = async (req, res, next) => {
    try {
        const { school_id } = req.user;

        const stats = await StudentService.getStudentStats(school_id);
        res.json(stats);
    } catch (error) {
        next(error);
    }
};

/**
 * GET /admin/students/:studentId
 * Get a specific student with full details
 */
export const getStudentById = async (req, res, next) => {
    try {
        const { school_id } = req.user;
        const { studentId } = req.params;

        const student = await StudentService.getStudentById(school_id, studentId);
        res.json(student);
    } catch (error) {
        next(error);
    }
};

/**
 * POST /admin/students
 * Create a new student
 */
export const createStudent = async (req, res, next) => {
    try {
        const { school_id } = req.user;
        const studentData = req.body;

        const result = await StudentService.createStudent(school_id, studentData);
        res.status(201).json({
            message: 'Student created successfully',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

/**
 * PUT /admin/students/:studentId
 * Update a student
 */
export const updateStudent = async (req, res, next) => {
    try {
        const { school_id } = req.user;
        const { studentId } = req.params;

        const result = await StudentService.updateStudent(school_id, studentId, req.body);
        res.json({
            message: 'Student updated successfully',
            affectedRows: result.affectedRows
        });
    } catch (error) {
        next(error);
    }
};

/**
 * DELETE /admin/students/:studentId
 * Delete a student
 */
export const deleteStudent = async (req, res, next) => {
    try {
        const { school_id } = req.user;
        const { studentId } = req.params;

        const result = await StudentService.deleteStudent(school_id, studentId);
        res.json({
            message: 'Student deleted successfully',
            affectedRows: result.affectedRows
        });
    } catch (error) {
        next(error);
    }
};
