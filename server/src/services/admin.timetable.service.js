import db from '../config/database.js';
import * as timetableModel from '../models/timeTable.js';

/**
 * Get current academic term for a school
 */
export const getCurrentTerm = async (schoolId) => {
    try {
        const [rows] = await db.query(
            `SELECT t.term_id, t.name as term_name, t.start_date, t.end_date,
                    ay.year_id, ay.name as year_name, ay.is_current
             FROM terms t
             LEFT JOIN academic_years ay ON t.year_id = ay.year_id
             WHERE ay.school_id = ? AND ay.is_current = TRUE
             ORDER BY t.term_id DESC
             LIMIT 1`,
            [schoolId]
        );
        return rows[0] || null;
    } catch (error) {
        throw new Error(`Failed to get current term: ${error.message}`);
    }
};

/**
 * Get all classes for a school
 */
export const getClassesBySchool = async (schoolId) => {
    try {
        const [rows] = await db.query(
            `SELECT class_id as id, name, grade_level
             FROM classes
             WHERE school_id = ?
             ORDER BY grade_level, name`,
            [schoolId]
        );
        return rows;
    } catch (error) {
        throw new Error(`Failed to get classes: ${error.message}`);
    }
};

/**
 * Get timetable for a class and term
 */
export const getTimetableForClass = async (classId, termId) => {
    try {
        return await timetableModel.findByClass(classId, termId);
    } catch (error) {
        throw new Error(`Failed to get timetable: ${error.message}`);
    }
};

/**
 * Get all timetables for a school and term (for PDF export)
 */
export const getTimetableForSchoolByTerm = async (schoolId, termId) => {
    try {
        return await timetableModel.findByTerm(termId, schoolId);
    } catch (error) {
        throw new Error(`Failed to get timetable by term: ${error.message}`);
    }
};

/**
 * Get teachers with their availability for a school
 */
export const getTeachersWithAvailability = async (schoolId) => {
    try {
        const [teachers] = await db.query(
            `SELECT DISTINCT
                t.teacher_id,
                CONCAT(u.first_name, ' ', u.last_name) as name,
                u.email,
                t.qualification,
                COUNT(DISTINCT COALESCE(tt.class_id, 0)) as assigned_classes
             FROM teachers t
             LEFT JOIN users u ON t.user_id = u.user_id
             LEFT JOIN timetables tt ON t.teacher_id = tt.teacher_id
             WHERE t.school_id = ?
             GROUP BY t.teacher_id, u.first_name, u.last_name, u.email, t.qualification
             ORDER BY name`,
            [schoolId]
        );
        return teachers;
    } catch (error) {
        throw new Error(`Failed to get teachers: ${error.message}`);
    }
};

/**
 * Get all subjects available in a school
 */
export const getSubjectsBySchool = async (schoolId) => {
    try {
        const [subjects] = await db.query(
            `SELECT DISTINCT s.subject_id as id, s.name
             FROM subjects s
             LEFT JOIN course_offerings co ON s.subject_id = co.subject_id
             LEFT JOIN classes c ON co.class_id = c.class_id
             WHERE c.school_id = ? OR s.is_active = TRUE
             ORDER BY s.name`,
            [schoolId]
        );
        return subjects;
    } catch (error) {
        throw new Error(`Failed to get subjects: ${error.message}`);
    }
};

/**
 * Create new timetable entry
 */
export const createTimetableEntry = async (timetableData) => {
    try {
        // Validate conflicts
        if (timetableData.room_number) {
            const roomConflict = await timetableModel.checkRoomConflict(
                timetableData.room_number,
                timetableData.day_of_week,
                timetableData.start_time,
                timetableData.end_time,
                timetableData.term_id
            );

            if (roomConflict) {
                throw new Error('Room conflict: This room is already booked for this time slot');
            }
        }

        if (timetableData.teacher_id) {
            const teacherConflict = await timetableModel.checkTeacherConflict(
                timetableData.teacher_id,
                timetableData.day_of_week,
                timetableData.start_time,
                timetableData.end_time,
                timetableData.term_id
            );

            if (teacherConflict) {
                throw new Error('Teacher conflict: This teacher is already scheduled for this time slot');
            }
        }

        return await timetableModel.create(timetableData);
    } catch (error) {
        throw new Error(`Failed to create timetable entry: ${error.message}`);
    }
};

/**
 * Update timetable entry
 */
export const updateTimetableEntry = async (timetableId, updates) => {
    try {
        return await timetableModel.update(timetableId, updates);
    } catch (error) {
        throw new Error(`Failed to update timetable entry: ${error.message}`);
    }
};

/**
 * Delete timetable entry
 */
export const deleteTimetableEntry = async (timetableId) => {
    try {
        return await timetableModel.deleteTimetable(timetableId);
    } catch (error) {
        throw new Error(`Failed to delete timetable entry: ${error.message}`);
    }
};
