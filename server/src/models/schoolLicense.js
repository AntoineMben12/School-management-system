import db from '../config/database.js';

/**
 * School License Model
 * Handles database operations for school_licenses table
 */

/**
 * Create a new school license
 * @param {Object} licenseData - License data
 * @returns {Promise} Database result
 */
export const create = async (licenseData) => {
    const { school_id, plan_name, start_date, end_date, status, max_students, features } = licenseData;
    const featuresJson = typeof features === 'string' ? features : JSON.stringify(features || {});

    const [result] = await db.execute(
        'INSERT INTO school_licenses (school_id, plan_name, start_date, end_date, status, max_students, features) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [school_id, plan_name, start_date, end_date, status || 'active', max_students || 500, featuresJson]
    );
    return { license_id: result.insertId, ...licenseData };
};

/**
 * Find licenses by school
 * @param {number} school_id - School ID
 * @returns {Promise} Array of licenses
 */
export const findBySchool = async (school_id) => {
    const [rows] = await db.query(
        'SELECT * FROM school_licenses WHERE school_id = ? ORDER BY created_at DESC',
        [school_id]
    );

    // Parse features JSON for each row
    return rows.map(row => ({
        ...row,
        features: typeof row.features === 'string' ? JSON.parse(row.features) : row.features
    }));
};

/**
 * Find license by ID
 * @param {number} license_id - License ID
 * @returns {Promise} License data
 */
export const findById = async (license_id) => {
    const [rows] = await db.query(
        'SELECT * FROM school_licenses WHERE license_id = ?',
        [license_id]
    );

    if (rows.length === 0) return null;

    const row = rows[0];
    return {
        ...row,
        features: typeof row.features === 'string' ? JSON.parse(row.features) : row.features
    };
};

/**
 * Get active license for a school
 * @param {number} school_id - School ID
 * @returns {Promise} Active license or null
 */
export const getActiveLicense = async (school_id) => {
    const [rows] = await db.query(
        `SELECT * FROM school_licenses 
         WHERE school_id = ? 
         AND status = 'active' 
         AND end_date >= CURDATE()
         ORDER BY end_date DESC
         LIMIT 1`,
        [school_id]
    );

    if (rows.length === 0) return null;

    const row = rows[0];
    return {
        ...row,
        features: typeof row.features === 'string' ? JSON.parse(row.features) : row.features
    };
};

/**
 * Update license status
 * @param {number} license_id - License ID
 * @param {string} status - New status (active, expired, suspended)
 * @returns {Promise} Database result
 */
export const updateStatus = async (license_id, status) => {
    const [result] = await db.execute(
        'UPDATE school_licenses SET status = ? WHERE license_id = ?',
        [status, license_id]
    );
    return result;
};

/**
 * Update license details
 * @param {number} license_id - License ID
 * @param {Object} updateData - Data to update
 * @returns {Promise} Database result
 */
export const update = async (license_id, updateData) => {
    const { plan_name, end_date, status, max_students, features } = updateData;
    const featuresJson = features ? (typeof features === 'string' ? features : JSON.stringify(features)) : null;

    const updates = [];
    const values = [];

    if (plan_name) {
        updates.push('plan_name = ?');
        values.push(plan_name);
    }
    if (end_date) {
        updates.push('end_date = ?');
        values.push(end_date);
    }
    if (status) {
        updates.push('status = ?');
        values.push(status);
    }
    if (max_students) {
        updates.push('max_students = ?');
        values.push(max_students);
    }
    if (featuresJson) {
        updates.push('features = ?');
        values.push(featuresJson);
    }

    if (updates.length === 0) {
        return { affectedRows: 0 };
    }

    values.push(license_id);
    const [result] = await db.execute(
        `UPDATE school_licenses SET ${updates.join(', ')} WHERE license_id = ?`,
        values
    );
    return result;
};

/**
 * Check if license is valid (active and not expired)
 * @param {number} school_id - School ID
 * @returns {Promise} Boolean indicating validity
 */
export const checkValidity = async (school_id) => {
    const [rows] = await db.query(
        `SELECT COUNT(*) as count FROM school_licenses 
         WHERE school_id = ? 
         AND status = 'active' 
         AND end_date >= CURDATE()`,
        [school_id]
    );
    return rows[0].count > 0;
};

/**
 * Get expired licenses
 * @returns {Promise} Array of expired licenses
 */
export const getExpiredLicenses = async () => {
    const [rows] = await db.query(
        `SELECT * FROM school_licenses 
         WHERE status = 'active' 
         AND end_date < CURDATE()
         ORDER BY end_date DESC`
    );

    return rows.map(row => ({
        ...row,
        features: typeof row.features === 'string' ? JSON.parse(row.features) : row.features
    }));
};
