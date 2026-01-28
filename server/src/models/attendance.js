import db from '../config/database.js';

/**
 * Attendance Model
 * Handles database operations for attendance table
 */

/**
 * Create attendance record
 * @param {Object} attendanceData - Attendance data
 * @returns {Promise} Database result
 */
export const create = async (attendanceData) => {
    const { offering_id, student_id, date, status } = attendanceData;
    const [result] = await db.execute(
        'INSERT INTO attendance (offering_id, student_id, date, status) VALUES (?, ?, ?, ?)',
        [offering_id, student_id, date, status]
    );
    return { attendance_id: result.insertId, ...attendanceData };
};

/**
 * Update attendance status
 * @param {number} attendance_id - Attendance ID
 * @param {string} status - New status (present, absent, late, excused)
 * @returns {Promise} Database result
 */
export const update = async (attendance_id, status) => {
    const [result] = await db.execute(
        'UPDATE attendance SET status = ? WHERE attendance_id = ?',
        [status, attendance_id]
    );
    return result;
};

/**
 * Find attendance records by student
 * @param {number} student_id - Student ID
 * @param {number} offering_id - Optional course offering ID filter
 * @returns {Promise} Array of attendance records
 */
export const findByStudent = async (student_id, offering_id = null) => {
    let query = 'SELECT * FROM attendance WHERE student_id = ?';
    const params = [student_id];

    if (offering_id) {
        query += ' AND offering_id = ?';
        params.push(offering_id);
    }

    query += ' ORDER BY date DESC';

    const [rows] = await db.query(query, params);
    return rows;
};

/**
 * Find attendance records by course offering
 * @param {number} offering_id - Course offering ID
 * @param {string} date - Optional date filter
 * @returns {Promise} Array of attendance records
 */
export const findByOffering = async (offering_id, date = null) => {
    let query = 'SELECT * FROM attendance WHERE offering_id = ?';
    const params = [offering_id];

    if (date) {
        query += ' AND date = ?';
        params.push(date);
    }

    query += ' ORDER BY date DESC, student_id';

    const [rows] = await db.query(query, params);
    return rows;
};

/**
 * Find attendance record by student, offering, and date
 * @param {number} student_id - Student ID
 * @param {number} offering_id - Course offering ID
 * @param {string} date - Date
 * @returns {Promise} Attendance record or null
 */
export const findByStudentOfferingDate = async (student_id, offering_id, date) => {
    const [rows] = await db.query(
        'SELECT * FROM attendance WHERE student_id = ? AND offering_id = ? AND date = ?',
        [student_id, offering_id, date]
    );
    return rows[0] || null;
};

/**
 * Get attendance statistics for a student
 * @param {number} student_id - Student ID
 * @param {number} offering_id - Optional course offering ID filter
 * @returns {Promise} Attendance statistics
 */
export const getStudentStats = async (student_id, offering_id = null) => {
    let query = `
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present,
            SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absent,
            SUM(CASE WHEN status = 'late' THEN 1 ELSE 0 END) as late,
            SUM(CASE WHEN status = 'excused' THEN 1 ELSE 0 END) as excused
        FROM attendance 
        WHERE student_id = ?`;

    const params = [student_id];

    if (offering_id) {
        query += ' AND offering_id = ?';
        params.push(offering_id);
    }

    const [rows] = await db.query(query, params);
    return rows[0];
};

/**
 * Delete attendance record
 * @param {number} attendance_id - Attendance ID
 * @returns {Promise} Database result
 */
export const deleteRecord = async (attendance_id) => {
    const [result] = await db.execute(
        'DELETE FROM attendance WHERE attendance_id = ?',
        [attendance_id]
    );
    return result;
};
