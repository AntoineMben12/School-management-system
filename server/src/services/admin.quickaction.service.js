import bcrypt from 'bcrypt';
import db from '../config/database.js';

/**
 * Admin Quick Action Service
 * Handles Add Student, Add Teacher, Create Announcement, and Reports Summary
 */

/**
 * Add a new student (creates user + student profile in a transaction)
 * @param {number} school_id - Admin's school ID
 * @param {Object} data - { first_name, last_name, email, admission_number, class_id, dob, gender }
 * @returns {Promise<Object>} Created student data
 */
export const addStudent = async (school_id, data) => {
    const { first_name, last_name, email, admission_number, class_id, dob, gender } = data;

    if (!first_name || !last_name || !email || !admission_number) {
        const err = new Error('Missing required fields: first_name, last_name, email, admission_number');
        err.status = 400;
        throw err;
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Check duplicate email
        const [existing] = await connection.query(
            'SELECT user_id FROM users WHERE school_id = ? AND email = ?',
            [school_id, email]
        );
        if (existing.length > 0) {
            const err = new Error('Email already registered for this school');
            err.status = 409;
            throw err;
        }

        // Check duplicate admission number
        const [existingAdm] = await connection.query(
            'SELECT student_id FROM students WHERE school_id = ? AND admission_number = ?',
            [school_id, admission_number]
        );
        if (existingAdm.length > 0) {
            const err = new Error('Admission number already exists for this school');
            err.status = 409;
            throw err;
        }

        // Create user with default password
        const defaultPassword = 'Student@123';
        const password_hash = await bcrypt.hash(defaultPassword, 10);
        const username = `${first_name} ${last_name}`;

        const [userResult] = await connection.execute(
            `INSERT INTO users (school_id, username, email, password_hash, role, is_active)
             VALUES (?, ?, ?, ?, 'student', TRUE)`,
            [school_id, username, email, password_hash]
        );
        const userId = userResult.insertId;

        // Create student profile
        const [studentResult] = await connection.execute(
            `INSERT INTO students (user_id, school_id, current_class_id, admission_number, first_name, last_name, dob, gender, enrollment_date)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURDATE())`,
            [userId, school_id, class_id || null, admission_number, first_name, last_name, dob || null, gender || null]
        );

        await connection.commit();

        return {
            message: 'Student added successfully',
            student: {
                student_id: studentResult.insertId,
                user_id: userId,
                first_name,
                last_name,
                email,
                admission_number,
                class_id: class_id || null
            }
        };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

/**
 * Add a new teacher (creates user + teacher profile in a transaction)
 * @param {number} school_id - Admin's school ID
 * @param {Object} data - { first_name, last_name, email, department, qualification, phone }
 * @returns {Promise<Object>} Created teacher data
 */
export const addTeacher = async (school_id, data) => {
    const { first_name, last_name, email, department, qualification, phone } = data;

    if (!first_name || !last_name || !email) {
        const err = new Error('Missing required fields: first_name, last_name, email');
        err.status = 400;
        throw err;
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Check duplicate email
        const [existing] = await connection.query(
            'SELECT user_id FROM users WHERE school_id = ? AND email = ?',
            [school_id, email]
        );
        if (existing.length > 0) {
            const err = new Error('Email already registered for this school');
            err.status = 409;
            throw err;
        }

        // Create user with default password
        const defaultPassword = 'Teacher@123';
        const password_hash = await bcrypt.hash(defaultPassword, 10);
        const username = `${first_name} ${last_name}`;

        const [userResult] = await connection.execute(
            `INSERT INTO users (school_id, username, email, password_hash, role, is_active)
             VALUES (?, ?, ?, ?, 'teacher', TRUE)`,
            [school_id, username, email, password_hash]
        );
        const userId = userResult.insertId;

        // Create teacher profile
        const [teacherResult] = await connection.execute(
            `INSERT INTO teachers (user_id, school_id, first_name, last_name, qualification, phone)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [userId, school_id, first_name, last_name, qualification || null, phone || null]
        );

        await connection.commit();

        return {
            message: 'Teacher added successfully',
            teacher: {
                teacher_id: teacherResult.insertId,
                user_id: userId,
                first_name,
                last_name,
                email,
                department: department || null,
                qualification: qualification || null
            }
        };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

/**
 * Create a school announcement
 * @param {number} school_id - Admin's school ID
 * @param {number} user_id - Admin's user ID (creator)
 * @param {Object} data - { title, content, audience }
 * @returns {Promise<Object>} Created announcement
 */
export const createAnnouncement = async (school_id, user_id, data) => {
    const { title, content, audience } = data;

    if (!title || !content) {
        const err = new Error('Missing required fields: title, content');
        err.status = 400;
        throw err;
    }

    const validAudiences = ['all', 'students', 'teachers', 'parents'];
    const selectedAudience = validAudiences.includes(audience) ? audience : 'all';

    const [result] = await db.execute(
        `INSERT INTO announcements (school_id, title, content, audience, created_by)
         VALUES (?, ?, ?, ?, ?)`,
        [school_id, title, content, selectedAudience, user_id]
    );

    return {
        message: 'Announcement created successfully',
        announcement: {
            announcement_id: result.insertId,
            title,
            content,
            audience: selectedAudience,
            created_at: new Date().toISOString()
        }
    };
};

/**
 * Get reports summary for the admin dashboard
 * @param {number} school_id - Admin's school ID
 * @returns {Promise<Object>} Reports summary
 */
export const getReportsSummary = async (school_id) => {
    const [[studentCount]] = await db.query(
        'SELECT COUNT(*) as count FROM students WHERE school_id = ?',
        [school_id]
    );

    const [[teacherCount]] = await db.query(
        'SELECT COUNT(*) as count FROM teachers WHERE school_id = ?',
        [school_id]
    );

    const [[classCount]] = await db.query(
        'SELECT COUNT(*) as count FROM classes WHERE school_id = ?',
        [school_id]
    );

    // Today's attendance rate
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
    const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;

    // Recent marks count (last 30 days)
    const [[marksRow]] = await db.query(
        `SELECT COUNT(*) as count FROM marks m
         JOIN assessments a ON m.assessment_id = a.assessment_id
         JOIN course_offerings co ON a.offering_id = co.offering_id
         WHERE co.school_id = ? AND a.due_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`,
        [school_id]
    );

    return {
        totalStudents: studentCount?.count || 0,
        totalTeachers: teacherCount?.count || 0,
        totalClasses: classCount?.count || 0,
        attendanceRate,
        recentMarksCount: marksRow?.count || 0
    };
};

/**
 * Get list of classes for the school (for dropdowns)
 * @param {number} school_id - Admin's school ID
 * @returns {Promise<Array>} List of classes
 */
export const getClassesList = async (school_id) => {
    const [rows] = await db.query(
        `SELECT c.class_id, c.name, c.level, 
                COUNT(s.student_id) as student_count
         FROM classes c
         LEFT JOIN students s ON c.class_id = s.current_class_id
         WHERE c.school_id = ?
         GROUP BY c.class_id
         ORDER BY c.level, c.name`,
        [school_id]
    );
    return rows;
};

export default { addStudent, addTeacher, createAnnouncement, getReportsSummary, getClassesList };
