import db from '../config/database.js';

/**
 * Exam Format Model
 * Handles database operations for exam_formats table
 */

/**
 * Create a new exam format
 * @param {Object} formatData - Exam format data
 * @returns {Promise} Database result
 */
export const create = async (formatData) => {
    const { school_id, name, grading_system } = formatData;
    const gradingSystemJson = typeof grading_system === 'string'
        ? grading_system
        : JSON.stringify(grading_system);

    const [result] = await db.execute(
        'INSERT INTO exam_formats (school_id, name, grading_system) VALUES (?, ?, ?)',
        [school_id, name, gradingSystemJson]
    );
    return { format_id: result.insertId, ...formatData };
};

/**
 * Find all exam formats for a school
 * @param {number} school_id - School ID
 * @returns {Promise} Array of exam formats
 */
export const findBySchool = async (school_id) => {
    const [rows] = await db.query(
        'SELECT * FROM exam_formats WHERE school_id = ? ORDER BY name',
        [school_id]
    );

    // Parse grading_system JSON for each row
    return rows.map(row => ({
        ...row,
        grading_system: typeof row.grading_system === 'string'
            ? JSON.parse(row.grading_system)
            : row.grading_system
    }));
};

/**
 * Find exam format by ID
 * @param {number} format_id - Exam format ID
 * @returns {Promise} Exam format data
 */
export const findById = async (format_id) => {
    const [rows] = await db.query(
        'SELECT * FROM exam_formats WHERE format_id = ?',
        [format_id]
    );

    if (rows.length === 0) return null;

    const row = rows[0];
    return {
        ...row,
        grading_system: typeof row.grading_system === 'string'
            ? JSON.parse(row.grading_system)
            : row.grading_system
    };
};

/**
 * Update exam format
 * @param {number} format_id - Exam format ID
 * @param {Object} updateData - Data to update
 * @returns {Promise} Database result
 */
export const update = async (format_id, updateData) => {
    const { name, grading_system } = updateData;
    const gradingSystemJson = typeof grading_system === 'string'
        ? grading_system
        : JSON.stringify(grading_system);

    const [result] = await db.execute(
        'UPDATE exam_formats SET name = ?, grading_system = ? WHERE format_id = ?',
        [name, gradingSystemJson, format_id]
    );
    return result;
};

/**
 * Delete exam format
 * @param {number} format_id - Exam format ID
 * @returns {Promise} Database result
 */
export const deleteFormat = async (format_id) => {
    const [result] = await db.execute(
        'DELETE FROM exam_formats WHERE format_id = ?',
        [format_id]
    );
    return result;
};
