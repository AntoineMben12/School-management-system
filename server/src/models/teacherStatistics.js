import db from '../config/database.js';

/**
 * Teacher Statistics Model - Comprehensive CRUD operations
 * Manages teacher performance metrics, evaluation scores, and teaching statistics
 */

export const create = async (statsData) => {
    const { teacher_id, term_id, total_classes, classes_taught, student_avg_score, attendance_rate, evaluation_score } = statsData;
    try {
        const [result] = await db.execute(
            `INSERT INTO teacher_statistics (teacher_id, term_id, total_classes, classes_taught, student_avg_score, attendance_rate, evaluation_score, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [teacher_id, term_id, total_classes || 0, classes_taught || 0, student_avg_score || 0, attendance_rate || 0, evaluation_score || 0]
        );
        return { id: result.insertId, ...statsData };
    } catch (error) {
        throw new Error(`Failed to create teacher statistics: ${error.message}`);
    }
};

export const findById = async (statsId) => {
    try {
        const [rows] = await db.query(
            `SELECT ts.*, t.id as teacher_id, u.first_name, u.last_name,
                    term.name as term_name, ay.name as year_name
             FROM teacher_statistics ts
             JOIN teachers t ON ts.teacher_id = t.id
             JOIN users u ON t.user_id = u.id
             LEFT JOIN academic_terms term ON ts.term_id = term.id
             LEFT JOIN academic_years ay ON term.academic_year_id = ay.id
             WHERE ts.id = ?`,
            [statsId]
        );
        return rows[0] || null;
    } catch (error) {
        throw new Error(`Failed to find teacher statistics: ${error.message}`);
    }
};

export const findByTeacher = async (teacherId, termId = null) => {
    try {
        let query = `SELECT ts.*, term.name as term_name, ay.name as year_name
                     FROM teacher_statistics ts
                     LEFT JOIN academic_terms term ON ts.term_id = term.id
                     LEFT JOIN academic_years ay ON term.academic_year_id = ay.id
                     WHERE ts.teacher_id = ?`;
        const params = [teacherId];

        if (termId) {
            query += ' AND ts.term_id = ?';
            params.push(termId);
        }

        query += ' ORDER BY term.start_date DESC';

        const [rows] = await db.query(query, params);
        return rows;
    } catch (error) {
        throw new Error(`Failed to find teacher statistics: ${error.message}`);
    }
};

export const findByTerm = async (termId) => {
    try {
        const [rows] = await db.query(
            `SELECT ts.*, u.first_name, u.last_name, t.id as teacher_id, t.department
             FROM teacher_statistics ts
             JOIN teachers t ON ts.teacher_id = t.id
             JOIN users u ON t.user_id = u.id
             WHERE ts.term_id = ?
             ORDER BY ts.student_avg_score DESC, ts.evaluation_score DESC`,
            [termId]
        );
        return rows;
    } catch (error) {
        throw new Error(`Failed to find statistics by term: ${error.message}`);
    }
};

export const findByTeacherAndTerm = async (teacherId, termId) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM teacher_statistics WHERE teacher_id = ? AND term_id = ?',
            [teacherId, termId]
        );
        return rows[0] || null;
    } catch (error) {
        throw new Error(`Failed to find teacher statistics by term: ${error.message}`);
    }
};

export const update = async (statsId, updates) => {
    const allowedFields = ['total_classes', 'classes_taught', 'student_avg_score', 'attendance_rate', 'evaluation_score'];
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
    updateValues.push(statsId);

    try {
        const [result] = await db.execute(
            `UPDATE teacher_statistics SET ${updateFields.join(', ')} WHERE id = ?`,
            updateValues
        );
        return result;
    } catch (error) {
        throw new Error(`Failed to update teacher statistics: ${error.message}`);
    }
};

export const deleteStats = async (statsId) => {
    try {
        const [result] = await db.execute(
            'DELETE FROM teacher_statistics WHERE id = ?',
            [statsId]
        );
        return result;
    } catch (error) {
        throw new Error(`Failed to delete teacher statistics: ${error.message}`);
    }
};

export const getTopTeachers = async (termId, limit = 10) => {
    try {
        const [rows] = await db.query(
            `SELECT ts.*, u.first_name, u.last_name, t.id as teacher_id, t.school_id, t.department
             FROM teacher_statistics ts
             JOIN teachers t ON ts.teacher_id = t.id
             JOIN users u ON t.user_id = u.id
             WHERE ts.term_id = ?
             ORDER BY ts.student_avg_score DESC, ts.evaluation_score DESC
             LIMIT ?`,
            [termId, limit]
        );
        return rows;
    } catch (error) {
        throw new Error(`Failed to get top teachers: ${error.message}`);
    }
};

export const getTeacherAverageScore = async (teacherId) => {
    try {
        const [rows] = await db.query(
            `SELECT AVG(student_avg_score) as avg_score, AVG(evaluation_score) as avg_evaluation,
                    AVG(attendance_rate) as avg_attendance
             FROM teacher_statistics
             WHERE teacher_id = ?`,
            [teacherId]
        );
        return rows[0] || null;
    } catch (error) {
        throw new Error(`Failed to calculate average score: ${error.message}`);
    }
};

export const getSchoolStatistics = async (schoolId) => {
    try {
        const [rows] = await db.query(
            `SELECT AVG(ts.student_avg_score) as avg_student_score,
                    AVG(ts.evaluation_score) as avg_evaluation,
                    COUNT(DISTINCT ts.teacher_id) as total_teachers,
                    MAX(ts.student_avg_score) as highest_score,
                    MIN(ts.student_avg_score) as lowest_score
             FROM teacher_statistics ts
             JOIN teachers t ON ts.teacher_id = t.id
             WHERE t.school_id = ?`,
            [schoolId]
        );
        return rows[0] || null;
    } catch (error) {
        throw new Error(`Failed to get school statistics: ${error.message}`);
    }
};

export default {
    create,
    findById,
    findByTeacher,
    findByTerm,
    findByTeacherAndTerm,
    update,
    deleteStats,
    getTopTeachers,
    getTeacherAverageScore,
    getSchoolStatistics
};
