import db from '../config/database.js';

/**
 * Teacher Model
 * Handles database operations for teachers table
 */

/**
 * Create a new teacher profile
 * @param {Object} teacherData - Teacher data
 * @returns {Promise} Database result
 */
export const create = async (teacherData) => {
    const { user_id, school_id, first_name, last_name, qualification, phone } = teacherData;
    const [result] = await db.execute(
        'INSERT INTO teachers (user_id, school_id, first_name, last_name, qualification, phone) VALUES (?, ?, ?, ?, ?, ?)',
        [user_id, school_id, first_name, last_name, qualification || null, phone || null]
    );
    return { teacher_id: result.insertId, ...teacherData };
};

/**
 * Find all teachers in a school
 * @param {number} school_id - School ID
 * @returns {Promise} Array of teachers
 */
export const findBySchool = async (school_id) => {
    const [rows] = await db.query(
        `SELECT t.*, u.email, u.username, u.is_active
         FROM teachers t
         INNER JOIN users u ON t.user_id = u.user_id
         WHERE t.school_id = ?
         ORDER BY t.last_name, t.first_name`,
        [school_id]
    );
    return rows;
};

/**
 * Find teacher by ID
 * @param {number} teacher_id - Teacher ID
 * @returns {Promise} Teacher data
 */
export const findById = async (teacher_id) => {
    const [rows] = await db.query(
        `SELECT t.*, u.email, u.username, u.is_active
         FROM teachers t
         INNER JOIN users u ON t.user_id = u.user_id
         WHERE t.teacher_id = ?`,
        [teacher_id]
    );
    return rows[0] || null;
};

/**
 * Find teacher by user ID
 * @param {number} user_id - User ID
 * @returns {Promise} Teacher data
 */
export const findByUserId = async (user_id) => {
    const [rows] = await db.query(
        `SELECT t.*, u.email, u.username, u.is_active
         FROM teachers t
         INNER JOIN users u ON t.user_id = u.user_id
         WHERE t.user_id = ?`,
        [user_id]
    );
    return rows[0] || null;
};

/**
 * Update teacher details
 * @param {number} teacher_id - Teacher ID
 * @param {Object} updateData - Data to update
 * @returns {Promise} Database result
 */
export const update = async (teacher_id, updateData) => {
    const { first_name, last_name, qualification, phone } = updateData;
    const [result] = await db.execute(
        'UPDATE teachers SET first_name = ?, last_name = ?, qualification = ?, phone = ? WHERE teacher_id = ?',
        [first_name, last_name, qualification, phone, teacher_id]
    );
    return result;
};

/**
 * Get classes taught by a teacher
 * @param {number} teacher_id - Teacher ID
 * @returns {Promise} Array of classes
 */
export const getClasses = async (teacher_id) => {
    const [rows] = await db.query(
        `SELECT c.*
         FROM classes c
         WHERE c.class_teacher_id = ?
         ORDER BY c.level, c.name`,
        [teacher_id]
    );
    return rows;
};

/**
 * Get course offerings by teacher
 * @param {number} teacher_id - Teacher ID
 * @param {number} term_id - Optional term ID filter
 * @returns {Promise} Array of course offerings
 */
export const getCourseOfferings = async (teacher_id, term_id = null) => {
    let query = `
        SELECT co.*, s.name as subject_name, s.code as subject_code,
               c.name as class_name, t.name as term_name
        FROM course_offerings co
        INNER JOIN subjects s ON co.subject_id = s.subject_id
        LEFT JOIN classes c ON co.class_id = c.class_id
        INNER JOIN terms t ON co.term_id = t.term_id
        WHERE co.teacher_id = ?`;

    const params = [teacher_id];

    if (term_id) {
        query += ' AND co.term_id = ?';
        params.push(term_id);
    }

    query += ' ORDER BY t.start_date DESC, s.name';

    const [rows] = await db.query(query, params);
    return rows;
};

/**
 * Count teachers by school
 * @param {number} school_id - School ID
 * @returns {Promise} Teacher count
 */
export const countBySchool = async (school_id) => {
    const [rows] = await db.query(
        'SELECT COUNT(*) as count FROM teachers WHERE school_id = ?',
        [school_id]
    );
    return rows[0].count;
};

/**
 * Delete teacher
 * @param {number} teacher_id - Teacher ID
 * @returns {Promise} Database result
 */
export const deleteTeacher = async (teacher_id) => {
    const [result] = await db.execute(
        'DELETE FROM teachers WHERE teacher_id = ?',
        [teacher_id]
    );
    return result;
};
