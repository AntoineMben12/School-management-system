import db from '../config/database.js';

/**
 * Attendance Model - Handle all attendance database operations
 */

/**
 * Create attendance record
 */
export const create = async (attendanceData) => {
    const { offering_id, student_id, date, status } = attendanceData;
    
    try {
        const [result] = await db.execute(
            `INSERT INTO attendance (offering_id, student_id, date, status)
             VALUES (?, ?, ?, ?)`,
            [offering_id, student_id, date, status]
        );
        return { attendance_id: result.insertId, ...attendanceData };
    } catch (error) {
        throw new Error(`Failed to create attendance record: ${error.message}`);
    }
};

/**
 * Find attendance by ID
 */
export const findById = async (attendance_id) => {
    const [rows] = await db.query(
        `SELECT a.*, s.first_name, s.last_name, s.admission_number
         FROM attendance a
         JOIN students s ON a.student_id = s.student_id
         WHERE a.attendance_id = ?`,
        [attendance_id]
    );
    return rows[0] || null;
};

/**
 * Find attendance for a student in a course
 */
export const findByStudentAndOffering = async (student_id, offering_id) => {
    const [rows] = await db.query(
        `SELECT * FROM attendance
         WHERE student_id = ? AND offering_id = ?
         ORDER BY date DESC`,
        [student_id, offering_id]
    );
    return rows;
};

/**
 * Find attendance for a date in offering
 */
export const findByDate = async (offering_id, date) => {
    const [rows] = await db.query(
        `SELECT a.*, s.first_name, s.last_name, s.admission_number
         FROM attendance a
         JOIN students s ON a.student_id = s.student_id
         WHERE a.offering_id = ? AND a.date = ?
         ORDER BY s.last_name`,
        [offering_id, date]
    );
    return rows;
};

/**
 * Get attendance summary for a student
 */
export const getStudentSummary = async (student_id, offering_id) => {
    const [rows] = await db.query(
        `SELECT 
            COUNT(*) as total_days,
            SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present_count,
            SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absent_count,
            SUM(CASE WHEN status = 'late' THEN 1 ELSE 0 END) as late_count,
            SUM(CASE WHEN status = 'excused' THEN 1 ELSE 0 END) as excused_count,
            ROUND((SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as attendance_percentage
         FROM attendance
         WHERE student_id = ? AND offering_id = ?`,
        [student_id, offering_id]
    );
    return rows[0] || null;
};

/**
 * Get attendance report for a class on a date
 */
export const getClassAttendanceReport = async (offering_id, date) => {
    const [rows] = await db.query(
        `SELECT 
            COUNT(*) as total_students,
            SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present_count,
            SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absent_count
         FROM attendance
         WHERE offering_id = ? AND date = ?`,
        [offering_id, date]
    );
    return rows[0] || null;
};

/**
 * Update attendance
 */
export const update = async (attendance_id, updates) => {
    const allowedFields = ['status'];
    const fields = [];
    const values = [];

    Object.entries(updates).forEach(([key, value]) => {
        if (allowedFields.includes(key)) {
            fields.push(`${key} = ?`);
            values.push(value);
        }
    });

    if (fields.length === 0) return { affectedRows: 0 };

    values.push(attendance_id);
    const [result] = await db.execute(
        `UPDATE attendance SET ${fields.join(', ')} WHERE attendance_id = ?`,
        values
    );
    return result;
};

/**
 * Delete attendance record
 */
export const deleteAttendance = async (attendance_id) => {
    const [result] = await db.execute(
        `DELETE FROM attendance WHERE attendance_id = ?`,
        [attendance_id]
    );
    return result;
};

export default { create, findById, findByStudentAndOffering, findByDate, getStudentSummary, getClassAttendanceReport, update, deleteAttendance };
