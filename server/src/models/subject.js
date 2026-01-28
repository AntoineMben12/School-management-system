import db from '../config/database.js';

/**
 * Subject Model
 * Handles database operations for subjects table
 */

/**
 * Create a new subject
 * @param {Object} subjectData - Subject data
 * @returns {Promise} Database result
 */
export const create = async (subjectData) => {
    const { school_id, name, code, credits, is_elective } = subjectData;
    const [result] = await db.execute(
        'INSERT INTO subjects (school_id, name, code, credits, is_elective) VALUES (?, ?, ?, ?, ?)',
        [school_id, name, code || null, credits || 1.0, is_elective || false]
    );
    return { subject_id: result.insertId, ...subjectData };
};

/**
 * Find all subjects in a school
 * @param {number} school_id - School ID
 * @returns {Promise} Array of subjects
 */
export const findBySchool = async (school_id) => {
    const [rows] = await db.query(
        'SELECT * FROM subjects WHERE school_id = ? ORDER BY name',
        [school_id]
    );
    return rows;
};

/**
 * Find subject by ID
 * @param {number} subject_id - Subject ID
 * @returns {Promise} Subject data
 */
export const findById = async (subject_id) => {
    const [rows] = await db.query(
        'SELECT * FROM subjects WHERE subject_id = ?',
        [subject_id]
    );
    return rows[0] || null;
};

/**
 * Find subject by code
 * @param {number} school_id - School ID
 * @param {string} code - Subject code
 * @returns {Promise} Subject data
 */
export const findByCode = async (school_id, code) => {
    const [rows] = await db.query(
        'SELECT * FROM subjects WHERE school_id = ? AND code = ?',
        [school_id, code]
    );
    return rows[0] || null;
};

/**
 * Update subject details
 * @param {number} subject_id - Subject ID
 * @param {Object} updateData - Data to update
 * @returns {Promise} Database result
 */
export const update = async (subject_id, updateData) => {
    const { name, code, credits, is_elective } = updateData;
    const [result] = await db.execute(
        'UPDATE subjects SET name = ?, code = ?, credits = ?, is_elective = ? WHERE subject_id = ?',
        [name, code, credits, is_elective, subject_id]
    );
    return result;
};

/**
 * Get elective subjects for a school
 * @param {number} school_id - School ID
 * @returns {Promise} Array of elective subjects
 */
export const getElectives = async (school_id) => {
    const [rows] = await db.query(
        'SELECT * FROM subjects WHERE school_id = ? AND is_elective = TRUE ORDER BY name',
        [school_id]
    );
    return rows;
};

/**
 * Get core (non-elective) subjects for a school
 * @param {number} school_id - School ID
 * @returns {Promise} Array of core subjects
 */
export const getCoreSubjects = async (school_id) => {
    const [rows] = await db.query(
        'SELECT * FROM subjects WHERE school_id = ? AND is_elective = FALSE ORDER BY name',
        [school_id]
    );
    return rows;
};

/**
 * Delete subject
 * @param {number} subject_id - Subject ID
 * @returns {Promise} Database result
 */
export const deleteSubject = async (subject_id) => {
    const [result] = await db.execute(
        'DELETE FROM subjects WHERE subject_id = ?',
        [subject_id]
    );
    return result;
};

/**
 * Count subjects by school
 * @param {number} school_id - School ID
 * @returns {Promise} Subject count
 */
export const countBySchool = async (school_id) => {
    const [rows] = await db.query(
        'SELECT COUNT(*) as count FROM subjects WHERE school_id = ?',
        [school_id]
    );
    return rows[0].count;
};
