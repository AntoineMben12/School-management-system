import db from '../config/database.js';

/**
 * Academic Year Model
 * Handles database operations for academic_years and terms tables
 */

/**
 * Create a new academic year
 * @param {Object} yearData - Academic year data
 * @returns {Promise} Database result
 */
export const createAcademicYear = async (yearData) => {
    const { school_id, name, start_date, end_date, is_current } = yearData;
    const [result] = await db.execute(
        'INSERT INTO academic_years (school_id, name, start_date, end_date, is_current) VALUES (?, ?, ?, ?, ?)',
        [school_id, name, start_date, end_date, is_current || false]
    );
    return { year_id: result.insertId, ...yearData };
};

/**
 * Create a new term
 * @param {Object} termData - Term data
 * @returns {Promise} Database result
 */
export const createTerm = async (termData) => {
    const { year_id, name, start_date, end_date } = termData;
    const [result] = await db.execute(
        'INSERT INTO terms (year_id, name, start_date, end_date) VALUES (?, ?, ?, ?)',
        [year_id, name, start_date, end_date]
    );
    return { term_id: result.insertId, ...termData };
};

/**
 * Get current academic year for a school
 * @param {number} school_id - School ID
 * @returns {Promise} Current academic year
 */
export const getCurrentAcademicYear = async (school_id) => {
    const [rows] = await db.query(
        'SELECT * FROM academic_years WHERE school_id = ? AND is_current = TRUE',
        [school_id]
    );
    return rows[0] || null;
};

/**
 * Get all terms for an academic year
 * @param {number} year_id - Academic year ID
 * @returns {Promise} Array of terms
 */
export const getTermsByYear = async (year_id) => {
    const [rows] = await db.query(
        'SELECT * FROM terms WHERE year_id = ? ORDER BY start_date',
        [year_id]
    );
    return rows;
};

/**
 * Set an academic year as current (and unset others for the same school)
 * @param {number} year_id - Academic year ID
 * @param {number} school_id - School ID
 * @returns {Promise} Database result
 */
export const setCurrentYear = async (year_id, school_id) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Unset all current years for this school
        await connection.execute(
            'UPDATE academic_years SET is_current = FALSE WHERE school_id = ?',
            [school_id]
        );

        // Set the specified year as current
        await connection.execute(
            'UPDATE academic_years SET is_current = TRUE WHERE year_id = ? AND school_id = ?',
            [year_id, school_id]
        );

        await connection.commit();
        return { success: true };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

/**
 * Get all academic years for a school
 * @param {number} school_id - School ID
 * @returns {Promise} Array of academic years
 */
export const findBySchool = async (school_id) => {
    const [rows] = await db.query(
        'SELECT * FROM academic_years WHERE school_id = ? ORDER BY start_date DESC',
        [school_id]
    );
    return rows;
};

/**
 * Get academic year by ID
 * @param {number} year_id - Academic year ID
 * @returns {Promise} Academic year
 */
export const findById = async (year_id) => {
    const [rows] = await db.query(
        'SELECT * FROM academic_years WHERE year_id = ?',
        [year_id]
    );
    return rows[0] || null;
};

/**
 * Get term by ID
 * @param {number} term_id - Term ID
 * @returns {Promise} Term
 */
export const findTermById = async (term_id) => {
    const [rows] = await db.query(
        'SELECT * FROM terms WHERE term_id = ?',
        [term_id]
    );
    return rows[0] || null;
};
