import * as timetableService from '../services/admin.timetable.service.js';

/**
 * GET /admin/timetable/current-term
 * Get the current academic term
 */
export const getCurrentTerm = async (req, res, next) => {
    try {
        const { school_id } = req.user;
        const term = await timetableService.getCurrentTerm(school_id);

        if (!term) {
            return res.status(404).json({
                error: 'No active term found for this school'
            });
        }

        res.json(term);
    } catch (error) {
        next(error);
    }
};

/**
 * GET /admin/timetable/classes
 * Get all classes for the school
 */
export const getSchoolClasses = async (req, res, next) => {
    try {
        const { school_id } = req.user;
        const classes = await timetableService.getClassesBySchool(school_id);
        res.json(classes);
    } catch (error) {
        next(error);
    }
};

/**
 * GET /admin/timetable/:classId/:termId
 * Get timetable for a specific class and term
 */
export const getTimetable = async (req, res, next) => {
    try {
        const { classId, termId } = req.params;
        const timetable = await timetableService.getTimetableForClass(classId, termId);
        res.json(timetable);
    } catch (error) {
        next(error);
    }
};

/**
 * GET /admin/timetable/export/all
 * Get all timetables for all classes in a term (for PDF export)
 */
export const getTimetableForExport = async (req, res, next) => {
    try {
        const { school_id } = req.user;
        const { termId } = req.query;

        if (!termId) {
            return res.status(400).json({
                error: 'termId is required'
            });
        }

        const timetables = await timetableService.getTimetableForSchoolByTerm(school_id, termId);
        res.json(timetables);
    } catch (error) {
        next(error);
    }
};

/**
 * GET /admin/timetable/teachers
 * Get all teachers with their availability
 */
export const getTeachers = async (req, res, next) => {
    try {
        const { school_id } = req.user;
        const teachers = await timetableService.getTeachersWithAvailability(school_id);
        res.json(teachers);
    } catch (error) {
        next(error);
    }
};

/**
 * GET /admin/timetable/subjects
 * Get all subjects available in the school
 */
export const getSubjects = async (req, res, next) => {
    try {
        const { school_id } = req.user;
        const subjects = await timetableService.getSubjectsBySchool(school_id);
        res.json(subjects);
    } catch (error) {
        next(error);
    }
};

/**
 * POST /admin/timetable
 * Create a new timetable entry (schedule a subject)
 */
export const createTimetableEntry = async (req, res, next) => {
    try {
        const { school_id } = req.user;
        const {
            class_id,
            subject_id,
            teacher_id,
            day_of_week,
            start_time,
            end_time,
            room_number,
            term_id
        } = req.body;

        // Validate required fields
        if (!class_id || !subject_id || !day_of_week || !start_time || !end_time || !term_id) {
            return res.status(400).json({
                error: 'Missing required fields: class_id, subject_id, day_of_week, start_time, end_time, term_id'
            });
        }

        const timetableData = {
            school_id,
            class_id,
            subject_id,
            teacher_id: teacher_id || null,
            day_of_week,
            start_time,
            end_time,
            room_number: room_number || null,
            term_id
        };

        const newEntry = await timetableService.createTimetableEntry(timetableData);
        res.status(201).json({
            message: 'Timetable entry created successfully',
            data: newEntry
        });
    } catch (error) {
        next(error);
    }
};

/**
 * PUT /admin/timetable/:timetableId
 * Update a timetable entry
 */
export const updateTimetableEntry = async (req, res, next) => {
    try {
        const { timetableId } = req.params;
        const result = await timetableService.updateTimetableEntry(timetableId, req.body);

        res.json({
            message: 'Timetable entry updated successfully',
            affectedRows: result.affectedRows
        });
    } catch (error) {
        next(error);
    }
};

/**
 * DELETE /admin/timetable/:timetableId
 * Delete a timetable entry
 */
export const deleteTimetableEntry = async (req, res, next) => {
    try {
        const { timetableId } = req.params;
        const result = await timetableService.deleteTimetableEntry(timetableId);

        res.json({
            message: 'Timetable entry deleted successfully',
            affectedRows: result.affectedRows
        });
    } catch (error) {
        next(error);
    }
};
