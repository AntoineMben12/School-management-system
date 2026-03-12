import ClassService from '../services/class.service.js';

/**
 * GET /admin/classes
 * Get all classes with optional filters
 */
export const getAllClasses = async (req, res, next) => {
    try {
        const { school_id } = req.user;
        const { grade, section, search } = req.query;

        const filters = {};
        if (grade) filters.grade = Number(grade);
        if (section) filters.section = section;
        if (search) filters.search = search;

        const classes = await ClassService.getAllClasses(school_id, filters);
        res.json(classes);
    } catch (error) {
        next(error);
    }
};

/**
 * GET /admin/classes/stats/overview
 * Get class statistics
 */
export const getClassStats = async (req, res, next) => {
    try {
        const { school_id } = req.user;

        const stats = await ClassService.getClassStats(school_id);
        res.json(stats);
    } catch (error) {
        next(error);
    }
};

/**
 * GET /admin/classes/:classId
 * Get a specific class by ID
 */
export const getClassById = async (req, res, next) => {
    try {
        const { school_id } = req.user;
        const { classId } = req.params;

        const cls = await ClassService.getClassById(school_id, classId);
        res.json(cls);
    } catch (error) {
        next(error);
    }
};

/**
 * POST /admin/classes
 * Create a new class
 */
export const createClass = async (req, res, next) => {
    try {
        const { school_id } = req.user;
        const classData = req.body;

        const result = await ClassService.createClass(school_id, classData);
        res.status(201).json({
            message: 'Class created successfully',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

/**
 * PUT /admin/classes/:classId
 * Update a class
 */
export const updateClass = async (req, res, next) => {
    try {
        const { school_id } = req.user;
        const { classId } = req.params;

        const result = await ClassService.updateClass(school_id, classId, req.body);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

/**
 * DELETE /admin/classes/:classId
 * Delete a class
 */
export const deleteClass = async (req, res, next) => {
    try {
        const { school_id } = req.user;
        const { classId } = req.params;

        const result = await ClassService.deleteClass(school_id, classId);
        res.json(result);
    } catch (error) {
        next(error);
    }
};
