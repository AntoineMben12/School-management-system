import db from '../config/database.js';

/**
 * Timetable Model - Class schedule and time slot management
 * Manages class schedules, time slots, and instructor assignments
 */

export const create = async (timetableData) => {
    const { school_id, class_id, subject_id, teacher_id, day_of_week, start_time, end_time, room_number, term_id } = timetableData;
    try {
        const [result] = await db.execute(
            `INSERT INTO timetables (school_id, class_id, subject_id, teacher_id, day_of_week, start_time, end_time, room_number, term_id, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [school_id, class_id, subject_id, teacher_id || null, day_of_week, start_time, end_time, room_number || null, term_id]
        );
        return { id: result.insertId, ...timetableData };
    } catch (error) {
        throw new Error(`Failed to create timetable: ${error.message}`);
    }
};

export const findById = async (timetableId) => {
    try {
        const [rows] = await db.query(
            `SELECT t.*, c.name as class_name, s.name as subject_name, 
                    CONCAT(u.first_name, ' ', u.last_name) as teacher_name,
                    term.name as term_name
             FROM timetables t
             LEFT JOIN classes c ON t.class_id = c.id
             LEFT JOIN subjects s ON t.subject_id = s.id
             LEFT JOIN teachers te ON t.teacher_id = te.id
             LEFT JOIN users u ON te.user_id = u.id
             LEFT JOIN academic_terms term ON t.term_id = term.id
             WHERE t.id = ?`,
            [timetableId]
        );
        return rows[0] || null;
    } catch (error) {
        throw new Error(`Failed to find timetable: ${error.message}`);
    }
};

export const findByClass = async (classId, termId = null) => {
    try {
        let query = `SELECT t.*, c.name as class_name, s.name as subject_name,
                           CONCAT(u.first_name, ' ', u.last_name) as teacher_name,
                           term.name as term_name
                    FROM timetables t
                    LEFT JOIN classes c ON t.class_id = c.id
                    LEFT JOIN subjects s ON t.subject_id = s.id
                    LEFT JOIN teachers te ON t.teacher_id = te.id
                    LEFT JOIN users u ON te.user_id = u.id
                    LEFT JOIN academic_terms term ON t.term_id = term.id
                    WHERE t.class_id = ?`;
        const params = [classId];

        if (termId) {
            query += ' AND t.term_id = ?';
            params.push(termId);
        }

        query += ' ORDER BY FIELD(t.day_of_week, "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"), t.start_time';

        const [rows] = await db.query(query, params);
        return rows;
    } catch (error) {
        throw new Error(`Failed to find timetable by class: ${error.message}`);
    }
};

export const findByTeacher = async (teacherId, termId = null) => {
    try {
        let query = `SELECT t.*, c.name as class_name, s.name as subject_name,
                           term.name as term_name
                    FROM timetables t
                    LEFT JOIN classes c ON t.class_id = c.id
                    LEFT JOIN subjects s ON t.subject_id = s.id
                    LEFT JOIN academic_terms term ON t.term_id = term.id
                    WHERE t.teacher_id = ?`;
        const params = [teacherId];

        if (termId) {
            query += ' AND t.term_id = ?';
            params.push(termId);
        }

        query += ' ORDER BY FIELD(t.day_of_week, "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"), t.start_time';

        const [rows] = await db.query(query, params);
        return rows;
    } catch (error) {
        throw new Error(`Failed to find timetable by teacher: ${error.message}`);
    }
};

export const findByTerm = async (termId, schoolId) => {
    try {
        const [rows] = await db.query(
            `SELECT t.*, c.name as class_name, s.name as subject_name,
                    CONCAT(u.first_name, ' ', u.last_name) as teacher_name
             FROM timetables t
             LEFT JOIN classes c ON t.class_id = c.id
             LEFT JOIN subjects s ON t.subject_id = s.id
             LEFT JOIN teachers te ON t.teacher_id = te.id
             LEFT JOIN users u ON te.user_id = u.id
             WHERE t.term_id = ? AND t.school_id = ?
             ORDER BY c.name, FIELD(t.day_of_week, "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"), t.start_time`,
            [termId, schoolId]
        );
        return rows;
    } catch (error) {
        throw new Error(`Failed to find timetable by term: ${error.message}`);
    }
};

export const findByDay = async (classId, dayOfWeek, termId = null) => {
    try {
        let query = `SELECT t.*, s.name as subject_name,
                           CONCAT(u.first_name, ' ', u.last_name) as teacher_name
                    FROM timetables t
                    LEFT JOIN subjects s ON t.subject_id = s.id
                    LEFT JOIN teachers te ON t.teacher_id = te.id
                    LEFT JOIN users u ON te.user_id = u.id
                    WHERE t.class_id = ? AND t.day_of_week = ?`;
        const params = [classId, dayOfWeek];

        if (termId) {
            query += ' AND t.term_id = ?';
            params.push(termId);
        }

        query += ' ORDER BY t.start_time';

        const [rows] = await db.query(query, params);
        return rows;
    } catch (error) {
        throw new Error(`Failed to find timetable by day: ${error.message}`);
    }
};

export const checkRoomConflict = async (roomNumber, dayOfWeek, startTime, endTime, termId, excludeId = null) => {
    try {
        let query = `SELECT COUNT(*) as count FROM timetables 
                     WHERE room_number = ? AND day_of_week = ? AND term_id = ?
                     AND NOT (end_time <= ? OR start_time >= ?)`;
        const params = [roomNumber, dayOfWeek, termId, startTime, endTime];

        if (excludeId) {
            query += ' AND id != ?';
            params.push(excludeId);
        }

        const [rows] = await db.query(query, params);
        return rows[0]?.count > 0;
    } catch (error) {
        throw new Error(`Failed to check room conflict: ${error.message}`);
    }
};

export const checkTeacherConflict = async (teacherId, dayOfWeek, startTime, endTime, termId, excludeId = null) => {
    try {
        let query = `SELECT COUNT(*) as count FROM timetables 
                     WHERE teacher_id = ? AND day_of_week = ? AND term_id = ?
                     AND NOT (end_time <= ? OR start_time >= ?)`;
        const params = [teacherId, dayOfWeek, termId, startTime, endTime];

        if (excludeId) {
            query += ' AND id != ?';
            params.push(excludeId);
        }

        const [rows] = await db.query(query, params);
        return rows[0]?.count > 0;
    } catch (error) {
        throw new Error(`Failed to check teacher conflict: ${error.message}`);
    }
};

export const update = async (timetableId, updates) => {
    const allowedFields = ['subject_id', 'teacher_id', 'day_of_week', 'start_time', 'end_time', 'room_number'];
    const updateFields = [];
    const updateValues = [];

    for (const [key, value] of Object.entries(updates)) {
        if (allowedFields.includes(key)) {
            updateFields.push(`${key} = ?`);
            updateValues.push(value);
        }
    }

    if (updateFields.length === 0) return { affectedRows: 0 };

    updateFields.push('updated_at = NOW()');
    updateValues.push(timetableId);

    try {
        const [result] = await db.execute(
            `UPDATE timetables SET ${updateFields.join(', ')} WHERE id = ?`,
            updateValues
        );
        return result;
    } catch (error) {
        throw new Error(`Failed to update timetable: ${error.message}`);
    }
};

export const deleteTimetable = async (timetableId) => {
    try {
        const [result] = await db.execute(
            'DELETE FROM timetables WHERE id = ?',
            [timetableId]
        );
        return result;
    } catch (error) {
        throw new Error(`Failed to delete timetable: ${error.message}`);
    }
};

export const getCountByClass = async (classId) => {
    try {
        const [rows] = await db.query(
            'SELECT COUNT(*) as count FROM timetables WHERE class_id = ?',
            [classId]
        );
        return rows[0]?.count || 0;
    } catch (error) {
        throw new Error(`Failed to count timetables: ${error.message}`);
    }
};

export default {
    create,
    findById,
    findByClass,
    findByTeacher,
    findByTerm,
    findByDay,
    checkRoomConflict,
    checkTeacherConflict,
    update,
    deleteTimetable,
    getCountByClass
};
