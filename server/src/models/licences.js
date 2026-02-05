import db from '../config/database.js';

/**
 * License Model - License key and subscription management
 * Manages license generation, validation, and expiration
 */

export const create = async (licenseData) => {
    const { school_id, license_key, license_type, start_date, end_date, max_users, is_active } = licenseData;
    try {
        const [result] = await db.execute(
            `INSERT INTO licenses (school_id, license_key, license_type, start_date, end_date, max_users, is_active, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [school_id, license_key, license_type || 'STANDARD', start_date, end_date, max_users || 1000, is_active !== false]
        );
        return { id: result.insertId, ...licenseData };
    } catch (error) {
        throw new Error(`Failed to create license: ${error.message}`);
    }
};

export const findById = async (licenseId) => {
    try {
        const [rows] = await db.query(
            `SELECT l.*, s.name as school_name
             FROM licenses l
             LEFT JOIN schools s ON l.school_id = s.id
             WHERE l.id = ?`,
            [licenseId]
        );
        return rows[0] || null;
    } catch (error) {
        throw new Error(`Failed to find license: ${error.message}`);
    }
};

export const findBySchool = async (schoolId) => {
    try {
        const [rows] = await db.query(
            `SELECT * FROM licenses WHERE school_id = ? ORDER BY start_date DESC`,
            [schoolId]
        );
        return rows;
    } catch (error) {
        throw new Error(`Failed to find licenses by school: ${error.message}`);
    }
};

export const findByLicenseKey = async (licenseKey) => {
    try {
        const [rows] = await db.query(
            `SELECT l.*, s.name as school_name
             FROM licenses l
             LEFT JOIN schools s ON l.school_id = s.id
             WHERE l.license_key = ?`,
            [licenseKey]
        );
        return rows[0] || null;
    } catch (error) {
        throw new Error(`Failed to find license by key: ${error.message}`);
    }
};

export const findActiveBySchool = async (schoolId) => {
    try {
        const [rows] = await db.query(
            `SELECT * FROM licenses 
             WHERE school_id = ? AND is_active = 1 AND end_date >= NOW()
             ORDER BY start_date DESC`,
            [schoolId]
        );
        return rows;
    } catch (error) {
        throw new Error(`Failed to find active licenses: ${error.message}`);
    }
};

export const isValid = async (schoolId) => {
    try {
        const [rows] = await db.query(
            `SELECT * FROM licenses 
             WHERE school_id = ? AND is_active = 1 AND end_date >= NOW()`,
            [schoolId]
        );
        return rows.length > 0;
    } catch (error) {
        throw new Error(`Failed to validate license: ${error.message}`);
    }
};

export const isExpired = async (licenseId) => {
    try {
        const license = await findById(licenseId);
        if (!license) return true;
        return new Date(license.end_date) < new Date();
    } catch (error) {
        throw new Error(`Failed to check expiration: ${error.message}`);
    }
};

export const update = async (licenseId, updates) => {
    const allowedFields = ['license_key', 'license_type', 'start_date', 'end_date', 'max_users', 'is_active'];
    const updateFields = [];
    const updateValues = [];

    for (const [key, value] of Object.entries(updates)) {
        if (allowedFields.includes(key)) {
            updateFields.push(`${key} = ?`);
            updateValues.push(value);
        }
    }

    if (updateFields.length === 0) return { affectedRows: 0 };

    updateFields.push('updated_at = NOW()');
    updateValues.push(licenseId);

    try {
        const [result] = await db.execute(
            `UPDATE licenses SET ${updateFields.join(', ')} WHERE id = ?`,
            updateValues
        );
        return result;
    } catch (error) {
        throw new Error(`Failed to update license: ${error.message}`);
    }
};

export const deleteLicense = async (licenseId) => {
    try {
        const [result] = await db.execute(
            'DELETE FROM licenses WHERE id = ?',
            [licenseId]
        );
        return result;
    } catch (error) {
        throw new Error(`Failed to delete license: ${error.message}`);
    }
};

export const getCountBySchool = async (schoolId) => {
    try {
        const [rows] = await db.query(
            'SELECT COUNT(*) as count FROM licenses WHERE school_id = ?',
            [schoolId]
        );
        return rows[0]?.count || 0;
    } catch (error) {
        throw new Error(`Failed to count licenses: ${error.message}`);
    }
};

export const getExpiringLicenses = async (daysFromNow = 30) => {
    try {
        const [rows] = await db.query(
            `SELECT l.*, s.name as school_name
             FROM licenses l
             LEFT JOIN schools s ON l.school_id = s.id
             WHERE is_active = 1 AND end_date BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL ? DAY)
             ORDER BY end_date ASC`,
            [daysFromNow]
        );
        return rows;
    } catch (error) {
        throw new Error(`Failed to get expiring licenses: ${error.message}`);
    }
};

export default {
    create,
    findById,
    findBySchool,
    findByLicenseKey,
    findActiveBySchool,
    isValid,
    isExpired,
    update,
    deleteLicense,
    getCountBySchool,
    getExpiringLicenses
};