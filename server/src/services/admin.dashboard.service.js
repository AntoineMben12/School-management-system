import db from '../config/database.js';

/**
 * Admin Dashboard Service
 * Provides aggregated data for the admin dashboard
 */

/**
 * Get dashboard stats (student count, teacher count, today's attendance %)
 * @param {number} school_id
 * @returns {Promise<Object>} { totalStudents, totalTeachers, attendancePercentage }
 */
export const getStats = async (school_id) => {
    const [[studentRow]] = await db.query(
        'SELECT COUNT(*) as count FROM students WHERE school_id = ?',
        [school_id]
    );

    const [[teacherRow]] = await db.query(
        'SELECT COUNT(*) as count FROM teachers WHERE school_id = ?',
        [school_id]
    );

    // Today's attendance percentage across all offerings in this school
    const [[attendanceRow]] = await db.query(
        `SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as present_count
         FROM attendance a
         JOIN course_offerings co ON a.offering_id = co.offering_id
         WHERE co.school_id = ? AND a.date = CURDATE()`,
        [school_id]
    );

    const total = attendanceRow?.total || 0;
    const present = attendanceRow?.present_count || 0;
    const attendancePercentage = total > 0 ? Math.round((present / total) * 100) : 0;

    return {
        totalStudents: studentRow?.count || 0,
        totalTeachers: teacherRow?.count || 0,
        attendancePercentage
    };
};

/**
 * Get attendance trends for the last 7 days
 * @param {number} school_id
 * @returns {Promise<Array>} Array of { day, date, students, teachers }
 */
export const getAttendanceTrends = async (school_id) => {
    const [rows] = await db.query(
        `SELECT 
            a.date,
            DAYNAME(a.date) as day_name,
            SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as students_present,
            COUNT(DISTINCT a.student_id) as total_recorded
         FROM attendance a
         JOIN course_offerings co ON a.offering_id = co.offering_id
         WHERE co.school_id = ? AND a.date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
         GROUP BY a.date
         ORDER BY a.date ASC`,
        [school_id]
    );

    // Also get teacher attendance proxy (teachers who had offerings with attendance recorded)
    const [teacherRows] = await db.query(
        `SELECT 
            a.date,
            COUNT(DISTINCT co.teacher_id) as teachers_present
         FROM attendance a
         JOIN course_offerings co ON a.offering_id = co.offering_id
         WHERE co.school_id = ? AND a.date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
         GROUP BY a.date
         ORDER BY a.date ASC`,
        [school_id]
    );

    // Build a map of teacher counts by date
    const teacherMap = {};
    teacherRows.forEach(r => {
        teacherMap[r.date instanceof Date ? r.date.toISOString().split('T')[0] : r.date] = r.teachers_present;
    });

    return rows.map(row => {
        const dateStr = row.date instanceof Date ? row.date.toISOString().split('T')[0] : row.date;
        return {
            day: row.day_name ? row.day_name.substring(0, 3) : '',
            date: dateStr,
            students: Number(row.students_present) || 0,
            teachers: Number(teacherMap[dateStr]) || 0
        };
    });
};

/**
 * Get recent activity (latest student registrations)
 * @param {number} school_id
 * @param {number} limit
 * @returns {Promise<Array>}
 */
export const getRecentActivity = async (school_id, limit = 5) => {
    const [rows] = await db.query(
        `SELECT s.student_id, s.first_name, s.last_name, s.enrollment_date, c.name as class_name
         FROM students s
         LEFT JOIN classes c ON s.current_class_id = c.class_id
         WHERE s.school_id = ?
         ORDER BY s.enrollment_date DESC, s.student_id DESC
         LIMIT ?`,
        [school_id, limit]
    );

    return rows.map(row => ({
        id: row.student_id,
        type: 'student_registered',
        user: `${row.first_name} ${row.last_name}`,
        action: 'New student registered:',
        subject: row.class_name || 'Unassigned',
        time: row.enrollment_date
    }));
};

export default { getStats, getAttendanceTrends, getRecentActivity };
