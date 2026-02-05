import db from '../config/database.js';

/**
 * Academic Term Model - Handle academic years and terms
 */

/**
 * Create academic year
 */
export const createAcademicYear = async (yearData) => {
    const { school_id, name, start_date, end_date, is_current = false } = yearData;
    
    try {
        const [result] = await db.execute(
            `INSERT INTO academic_years (school_id, name, start_date, end_date, is_current)
             VALUES (?, ?, ?, ?, ?)`,
            [school_id, name, start_date, end_date, is_current]
        );
        return { year_id: result.insertId, ...yearData };
    } catch (error) {
        throw new Error(`Failed to create academic year: ${error.message}`);
    }
};

/**
 * Find academic year by ID
 */
export const findAcademicYearById = async (year_id) => {
    const [rows] = await db.query(
        `SELECT * FROM academic_years WHERE year_id = ?`,
        [year_id]
    );
    return rows[0] || null;
};

/**
 * Find all academic years in a school
 */
export const findAcademicYearsBySchool = async (school_id) => {
    const [rows] = await db.query(
        `SELECT * FROM academic_years WHERE school_id = ? ORDER BY start_date DESC`,
        [school_id]
    );
    return rows;
};

/**
 * Get current academic year
 */
export const getCurrentAcademicYear = async (school_id) => {
    const [rows] = await db.query(
        `SELECT * FROM academic_years WHERE school_id = ? AND is_current = 1`,
        [school_id]
    );
    return rows[0] || null;
};

/**
 * Create term
 */
export const createTerm = async (termData) => {
    const { year_id, name, start_date, end_date } = termData;
    
    try {
        const [result] = await db.execute(
            `INSERT INTO terms (year_id, name, start_date, end_date)
             VALUES (?, ?, ?, ?)`,
            [year_id, name, start_date || null, end_date || null]
        );
        return { term_id: result.insertId, ...termData };
    } catch (error) {
        throw new Error(`Failed to create term: ${error.message}`);
    }
};

/**
 * Find term by ID
 */
export const findTermById = async (term_id) => {
    const [rows] = await db.query(
        `SELECT t.*, a.name as academic_year FROM terms t
         JOIN academic_years a ON t.year_id = a.year_id
         WHERE t.term_id = ?`,
        [term_id]
    );
    return rows[0] || null;
};

/**
 * Find all terms in an academic year
 */
export const findTermsByAcademicYear = async (year_id) => {
    const [rows] = await db.query(
        `SELECT * FROM terms WHERE year_id = ? ORDER BY start_date`,
        [year_id]
    );
    return rows;
};

/**
 * Update academic year
 */
export const updateAcademicYear = async (year_id, updates) => {
    const allowedFields = ['name', 'start_date', 'end_date', 'is_current'];
    const fields = [];
    const values = [];

    Object.entries(updates).forEach(([key, value]) => {
        if (allowedFields.includes(key)) {
            fields.push(`${key} = ?`);
            values.push(value);
        }
    });

    if (fields.length === 0) return { affectedRows: 0 };

    values.push(year_id);
    const [result] = await db.execute(
        `UPDATE academic_years SET ${fields.join(', ')} WHERE year_id = ?`,
        values
    );
    return result;
};

/**
 * Update term
 */
export const updateTerm = async (term_id, updates) => {
    const allowedFields = ['name', 'start_date', 'end_date'];
    const fields = [];
    const values = [];

    Object.entries(updates).forEach(([key, value]) => {
        if (allowedFields.includes(key)) {
            fields.push(`${key} = ?`);
            values.push(value);
        }
    });

    if (fields.length === 0) return { affectedRows: 0 };

    values.push(term_id);
    const [result] = await db.execute(
        `UPDATE terms SET ${fields.join(', ')} WHERE term_id = ?`,
        values
    );
    return result;
};

/**
 * Delete academic year
 */
export const deleteAcademicYear = async (year_id) => {
    const [result] = await db.execute(
        `DELETE FROM academic_years WHERE year_id = ?`,
        [year_id]
    );
    return result;
};

/**
 * Delete term
 */
export const deleteTerm = async (term_id) => {
    const [result] = await db.execute(
        `DELETE FROM terms WHERE term_id = ?`,
        [term_id]
    );
    return result;
};

export default { 
    createAcademicYear, 
    findAcademicYearById, 
    findAcademicYearsBySchool, 
    getCurrentAcademicYear,
    createTerm,
    findTermById,
    findTermsByAcademicYear,
    updateAcademicYear,
    updateTerm,
    deleteAcademicYear,
    deleteTerm
};
