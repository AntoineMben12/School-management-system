import db from '../config/database.js';

/**
 * Class Model
 * Handles database operations for classes table
 */

/**
 * Create a new class
 * @param {Object} classData - Class data
 * @returns {Promise} Database result
 */
export const create = async (classData) => {
    const { school_id, dept_id, name, level, class_teacher_id } = classData;
    const [result] = await db.execute(
        'INSERT INTO classes (school_id, dept_id, name, level, class_teacher_id) VALUES (?, ?, ?, ?, ?)',
        [school_id, dept_id || null, name, level || null, class_teacher_id || null]
    );
    return { class_id: result.insertId, ...classData };
};

/**
 * Find all classes in a school
 * @param {number} school_id - School ID
 * @returns {Promise} Array of classes
 */
export const findBySchool = async (school_id) => {
    const [rows] = await db.query(
        `SELECT c.*, 
                CONCAT(t.first_name, ' ', t.last_name) as teacher_name,
                d.name as department_name
         FROM classes c
         LEFT JOIN teachers t ON c.class_teacher_id = t.teacher_id
         LEFT JOIN departments d ON c.dept_id = d.dept_id
         WHERE c.school_id = ?
         ORDER BY c.level, c.name`,
        [school_id]
    );
    return rows;
};

/**
 * Find class by ID
 * @param {number} class_id - Class ID
 * @returns {Promise} Class data
 */
export const findById = async (class_id) => {
    const [rows] = await db.query(
        `SELECT c.*, 
                CONCAT(t.first_name, ' ', t.last_name) as teacher_name,
                d.name as department_name
         FROM classes c
         LEFT JOIN teachers t ON c.class_teacher_id = t.teacher_id
         LEFT JOIN departments d ON c.dept_id = d.dept_id
         WHERE c.class_id = ?`,
        [class_id]
    );
    return rows[0] || null;
};

/**
 * Update class details
 * @param {number} class_id - Class ID
 * @param {Object} updateData - Data to update
 * @returns {Promise} Database result
 */
export const update = async (class_id, updateData) => {
    const { name, level, dept_id, class_teacher_id } = updateData;
    const [result] = await db.execute(
        'UPDATE classes SET name = ?, level = ?, dept_id = ?, class_teacher_id = ? WHERE class_id = ?',
        [name, level, dept_id, class_teacher_id, class_id]
    );
    return result;
};

/**
 * Assign class teacher
 * @param {number} class_id - Class ID
 * @param {number} teacher_id - Teacher ID
 * @returns {Promise} Database result
 */
export const assignTeacher = async (class_id, teacher_id) => {
    const [result] = await db.execute(
        'UPDATE classes SET class_teacher_id = ? WHERE class_id = ?',
        [teacher_id, class_id]
    );
    return result;
};

/**
 * Get students in a class
 * @param {number} class_id - Class ID
 * @returns {Promise} Array of students
 */
export const getStudents = async (class_id) => {
    const [rows] = await db.query(
        `SELECT s.*, u.email, u.username
         FROM students s
         INNER JOIN users u ON s.user_id = u.user_id
         WHERE s.current_class_id = ?
         ORDER BY s.last_name, s.first_name`,
        [class_id]
    );
    return rows;
};

/**
 * Get class count by school
 * @param {number} school_id - School ID
 * @returns {Promise} Class count
 */
export const countBySchool = async (school_id) => {
    const [rows] = await db.query(
        'SELECT COUNT(*) as count FROM classes WHERE school_id = ?',
        [school_id]
    );
    return rows[0].count;
};

/**
 * Delete class
 * @param {number} class_id - Class ID
 * @returns {Promise} Database result
 */
export const deleteClass = async (class_id) => {
    const [result] = await db.execute(
        'DELETE FROM classes WHERE class_id = ?',
        [class_id]
    );
    return result;
};
