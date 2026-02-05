import db from '../config/database.js';

/**
 * Student Model - Handle all student database operations
 */

/**
 * Create a new student
 * @param {Object} studentData - { user_id, school_id, parent_id, current_class_id, admission_number, first_name, last_name, dob, gender, enrollment_date }
 * @returns {Promise} Student ID and data
 */
export const create = async (studentData) => {
    const {
        user_id,
        school_id,
        parent_id = null,
        current_class_id = null,
        admission_number,
        first_name,
        last_name,
        dob = null,
        gender = null,
        enrollment_date = new Date()
    } = studentData;

    try {
        const [result] = await db.execute(
            `INSERT INTO students (user_id, school_id, parent_id, current_class_id, admission_number, first_name, last_name, dob, gender, enrollment_date)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [user_id, school_id, parent_id, current_class_id, admission_number, first_name, last_name, dob, gender, enrollment_date]
        );
        return { student_id: result.insertId, ...studentData };
    } catch (error) {
        throw new Error(`Failed to create student: ${error.message}`);
    }
};

/**
 * Find student by ID
 * @param {number} student_id - Student ID
 * @returns {Promise} Student data with user and class info
 */
export const findById = async (student_id) => {
    const [rows] = await db.query(
        `SELECT s.*, u.email, u.username, c.name as class_name
         FROM students s
         LEFT JOIN users u ON s.user_id = u.user_id
         LEFT JOIN classes c ON s.current_class_id = c.class_id
         WHERE s.student_id = ?`,
        [student_id]
    );
    return rows[0] || null;
};

/**
 * Find student by user ID
 * @param {number} user_id - User ID
 * @returns {Promise} Student data
 */
export const findByUserId = async (user_id) => {
    const [rows] = await db.query(
        `SELECT s.*, u.email, u.username, c.name as class_name
         FROM students s
         LEFT JOIN users u ON s.user_id = u.user_id
         LEFT JOIN classes c ON s.current_class_id = c.class_id
         WHERE s.user_id = ?`,
        [user_id]
    );
    return rows[0] || null;
};

/**
 * Find all students in a school
 * @param {number} school_id - School ID
 * @param {number} class_id - Optional class filter
 * @returns {Promise} Array of students
 */
export const findBySchool = async (school_id, class_id = null) => {
    let sql = `SELECT s.*, u.email, u.username, c.name as class_name
               FROM students s
               LEFT JOIN users u ON s.user_id = u.user_id
               LEFT JOIN classes c ON s.current_class_id = c.class_id
               WHERE s.school_id = ?`;
    const params = [school_id];

    if (class_id) {
        sql += ' AND s.current_class_id = ?';
        params.push(class_id);
    }

    sql += ' ORDER BY s.last_name, s.first_name';
    const [rows] = await db.query(sql, params);
    return rows;
};

/**
 * Find students by class
 * @param {number} class_id - Class ID
 * @returns {Promise} Array of students in the class
 */
export const findByClass = async (class_id) => {
    const [rows] = await db.query(
        `SELECT s.*, u.email, u.username
         FROM students s
         LEFT JOIN users u ON s.user_id = u.user_id
         WHERE s.current_class_id = ?
         ORDER BY s.last_name, s.first_name`,
        [class_id]
    );
    return rows;
};

/**
 * Find students by parent
 * @param {number} parent_id - Parent ID
 * @returns {Promise} Array of students
 */
export const findByParent = async (parent_id) => {
    const [rows] = await db.query(
        `SELECT s.*, u.email, u.username, c.name as class_name
         FROM students s
         LEFT JOIN users u ON s.user_id = u.user_id
         LEFT JOIN classes c ON s.current_class_id = c.class_id
         WHERE s.parent_id = ?
         ORDER BY s.last_name, s.first_name`,
        [parent_id]
    );
    return rows;
};

/**
 * Update student
 * @param {number} student_id - Student ID
 * @param {Object} updates - Fields to update
 * @returns {Promise} Update result
 */
export const update = async (student_id, updates) => {
    const allowedFields = ['parent_id', 'current_class_id', 'first_name', 'last_name', 'dob', 'gender'];
    const fields = [];
    const values = [];

    Object.entries(updates).forEach(([key, value]) => {
        if (allowedFields.includes(key)) {
            fields.push(`${key} = ?`);
            values.push(value);
        }
    });

    if (fields.length === 0) return { affectedRows: 0 };

    values.push(student_id);
    const [result] = await db.execute(
        `UPDATE students SET ${fields.join(', ')} WHERE student_id = ?`,
        values
    );
    return result;
};

/**
 * Transfer student to different class
 * @param {number} student_id - Student ID
 * @param {number} new_class_id - New class ID
 * @returns {Promise} Update result
 */
export const transferClass = async (student_id, new_class_id) => {
    const [result] = await db.execute(
        `UPDATE students SET current_class_id = ? WHERE student_id = ?`,
        [new_class_id, student_id]
    );
    return result;
};

/**
 * Delete student
 * @param {number} student_id - Student ID
 * @returns {Promise} Delete result
 */
export const deleteStudent = async (student_id) => {
    const [result] = await db.execute(
        `DELETE FROM students WHERE student_id = ?`,
        [student_id]
    );
    return result;
};

/**
 * Get student count in school
 * @param {number} school_id - School ID
 * @returns {Promise} Count of students
 */
export const getCount = async (school_id) => {
    const [rows] = await db.query(
        `SELECT COUNT(*) as count FROM students WHERE school_id = ?`,
        [school_id]
    );
    return rows[0].count;
};

/**
 * Check if admission number exists
 * @param {string} admission_number - Admission number
 * @param {number} school_id - School ID
 * @returns {Promise} Boolean
 */
export const admissionNumberExists = async (admission_number, school_id) => {
    const [rows] = await db.query(
        `SELECT student_id FROM students WHERE admission_number = ? AND school_id = ?`,
        [admission_number, school_id]
    );
    return rows.length > 0;
};

export default { create, findById, findByUserId, findBySchool, findByClass, findByParent, update, transferClass, deleteStudent, getCount, admissionNumberExists };