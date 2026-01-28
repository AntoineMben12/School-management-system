import db from '../config/database.js';

/**
 * Teacher Statistics Model
 * Handles database operations for teacher_statistics table
 */

/**
 * Create teacher statistics record
 * @param {Object} statsData - Statistics data
 * @returns {Promise} Database result
 */
export const create = async (statsData) => {
    const { teacher_id, term_id, total_classes, classes_taught, student_avg_score, attendance_rate } = statsData;
    const [result] = await db.execute(
        `INSERT INTO teacher_statistics 
         (teacher_id, term_id, total_classes, classes_taught, student_avg_score, attendance_rate) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [teacher_id, term_id, total_classes || 0, classes_taught || 0, student_avg_score || 0, attendance_rate || 0]
    );
    return { stat_id: result.insertId, ...statsData };
};

/**
 * Update teacher statistics
 * @param {number} stat_id - Statistics ID
 * @param {Object} updateData - Data to update
 * @returns {Promise} Database result
 */
export const update = async (stat_id, updateData) => {
    const { total_classes, classes_taught, student_avg_score, attendance_rate } = updateData;
    const [result] = await db.execute(
        `UPDATE teacher_statistics 
         SET total_classes = ?, classes_taught = ?, student_avg_score = ?, attendance_rate = ? 
         WHERE stat_id = ?`,
        [total_classes, classes_taught, student_avg_score, attendance_rate, stat_id]
    );
    return result;
};

/**
 * Find statistics by teacher
 * @param {number} teacher_id - Teacher ID
 * @param {number} term_id - Optional term ID filter
 * @returns {Promise} Array of statistics
 */
export const findByTeacher = async (teacher_id, term_id = null) => {
    let query = `
        SELECT ts.*, t.name as term_name, ay.name as year_name
        FROM teacher_statistics ts
        INNER JOIN terms t ON ts.term_id = t.term_id
        INNER JOIN academic_years ay ON t.year_id = ay.year_id
        WHERE ts.teacher_id = ?`;

    const params = [teacher_id];

    if (term_id) {
        query += ' AND ts.term_id = ?';
        params.push(term_id);
    }

    query += ' ORDER BY t.start_date DESC';

    const [rows] = await db.query(query, params);
    return rows;
};

/**
 * Find statistics by term
 * @param {number} term_id - Term ID
 * @returns {Promise} Array of statistics
 */
export const findByTerm = async (term_id) => {
    const [rows] = await db.query(
        `SELECT ts.*, 
                CONCAT(t.first_name, ' ', t.last_name) as teacher_name
         FROM teacher_statistics ts
         INNER JOIN teachers t ON ts.teacher_id = t.teacher_id
         WHERE ts.term_id = ?
         ORDER BY ts.student_avg_score DESC`,
        [term_id]
    );
    return rows;
};

/**
 * Get statistics for a specific teacher and term
 * @param {number} teacher_id - Teacher ID
 * @param {number} term_id - Term ID
 * @returns {Promise} Statistics record or null
 */
export const findByTeacherAndTerm = async (teacher_id, term_id) => {
    const [rows] = await db.query(
        'SELECT * FROM teacher_statistics WHERE teacher_id = ? AND term_id = ?',
        [teacher_id, term_id]
    );
    return rows[0] || null;
};

/**
 * Delete statistics record
 * @param {number} stat_id - Statistics ID
 * @returns {Promise} Database result
 */
export const deleteStats = async (stat_id) => {
    const [result] = await db.execute(
        'DELETE FROM teacher_statistics WHERE stat_id = ?',
        [stat_id]
    );
    return result;
};

/**
 * Get top performing teachers by term
 * @param {number} term_id - Term ID
 * @param {number} limit - Number of teachers to return
 * @returns {Promise} Array of top teachers
 */
export const getTopTeachers = async (term_id, limit = 10) => {
    const [rows] = await db.query(
        `SELECT ts.*, 
                CONCAT(t.first_name, ' ', t.last_name) as teacher_name,
                t.school_id
         FROM teacher_statistics ts
         INNER JOIN teachers t ON ts.teacher_id = t.teacher_id
         WHERE ts.term_id = ?
         ORDER BY ts.student_avg_score DESC, ts.attendance_rate DESC
         LIMIT ?`,
        [term_id, limit]
    );
    return rows;
};
