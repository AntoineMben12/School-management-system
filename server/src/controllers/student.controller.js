import StudentService from '../services/student.service.js';

/**
 * Get student profile
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
