import * as quickActionService from '../services/admin.quickaction.service.js';

/**
 * POST /admin/students
 * Add a new student to the school
 */
export const addStudent = async (req, res, next) => {
    try {
        const { school_id } = req.user;
        const result = await quickActionService.addStudent(school_id, req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

/**
 * POST /admin/teachers
 * Add a new teacher to the school
 */
export const addTeacher = async (req, res, next) => {
    try {
        const { school_id } = req.user;
        const result = await quickActionService.addTeacher(school_id, req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

/**
 * POST /admin/announcements
 * Create a new school announcement
 */
export const createAnnouncement = async (req, res, next) => {
    try {
        const { school_id, user_id } = req.user;
        const result = await quickActionService.createAnnouncement(school_id, user_id, req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

/**
 * GET /admin/reports
 * Get reports summary data
 */
export const getReportsSummary = async (req, res, next) => {
    try {
        const { school_id } = req.user;
        const result = await quickActionService.getReportsSummary(school_id);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

/**
 * GET /admin/classes
 * Get list of classes for dropdowns
 */
export const getClassesList = async (req, res, next) => {
    try {
        const { school_id } = req.user;
        const result = await quickActionService.getClassesList(school_id);
        res.json(result);
    } catch (error) {
        next(error);
    }
};
