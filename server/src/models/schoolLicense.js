import db from '../config/database.js';

/**
 * School License Model - Comprehensive CRUD operations
 * Manages school subscription plans and feature access
 */

export const create = async (licenseData) => {
    const { school_id, plan_name, start_date, end_date, status, max_students, features } = licenseData;
    const featuresJson = typeof features === 'string' ? features : JSON.stringify(features || {});

    try {
        const [result] = await db.execute(
            `INSERT INTO school_licenses (school_id, plan_name, start_date, end_date, status, max_students, features, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [school_id, plan_name, start_date, end_date, status || 'ACTIVE', max_students || 500, featuresJson]
        );
        return { id: result.insertId, ...licenseData };
    } catch (error) {
        throw new Error(`Failed to create school license: ${error.message}`);
    }
};

export const findById = async (licenseId) => {
    try {
        const [rows] = await db.query(
            `SELECT sl.*, s.name as school_name
             FROM school_licenses sl
             LEFT JOIN schools s ON sl.school_id = s.id
             WHERE sl.id = ?`,
            [licenseId]
        );

        if (!rows[0]) return null;

        const row = rows[0];
        return {
            ...row,
            features: typeof row.features === 'string' ? JSON.parse(row.features) : row.features
        };
    } catch (error) {
        throw new Error(`Failed to find school license: ${error.message}`);
    }
};

export const findBySchool = async (schoolId) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM school_licenses WHERE school_id = ? ORDER BY start_date DESC',
            [schoolId]
        );

        return rows.map(row => ({
            ...row,
            features: typeof row.features === 'string' ? JSON.parse(row.features) : row.features
        }));
    } catch (error) {
        throw new Error(`Failed to find school licenses: ${error.message}`);
    }
};

export const getActiveLicense = async (schoolId) => {
    try {
        const [rows] = await db.query(
            `SELECT * FROM school_licenses 
             WHERE school_id = ? 
             AND status = 'ACTIVE' 
             AND end_date >= CURDATE()
             ORDER BY end_date DESC
             LIMIT 1`,
            [schoolId]
        );

        if (!rows[0]) return null;

        const row = rows[0];
        return {
            ...row,
            features: typeof row.features === 'string' ? JSON.parse(row.features) : row.features
        };
    } catch (error) {
        throw new Error(`Failed to get active license: ${error.message}`);
    }
};

export const update = async (licenseId, updates) => {
    const allowedFields = ['plan_name', 'end_date', 'status', 'max_students', 'features'];
    const updateFields = [];
    const updateValues = [];

    for (const [key, value] of Object.entries(updates)) {
        if (allowedFields.includes(key)) {
            if (key === 'features') {
                const featuresJson = typeof value === 'string' ? value : JSON.stringify(value);
                updateFields.push(`${key} = ?`);
                updateValues.push(featuresJson);
            } else {
                updateFields.push(`${key} = ?`);
                updateValues.push(value);
            }
        }
    }

    if (updateFields.length === 0) return { affectedRows: 0 };

    updateFields.push('updated_at = NOW()');
    updateValues.push(licenseId);

    try {
        const [result] = await db.execute(
            `UPDATE school_licenses SET ${updateFields.join(', ')} WHERE id = ?`,
            updateValues
        );
        return result;
    } catch (error) {
        throw new Error(`Failed to update school license: ${error.message}`);
    }
};

export const deleteLicense = async (licenseId) => {
    try {
        const [result] = await db.execute(
            'DELETE FROM school_licenses WHERE id = ?',
            [licenseId]
        );
        return result;
    } catch (error) {
        throw new Error(`Failed to delete school license: ${error.message}`);
    }
};

export const checkValidity = async (schoolId) => {
    try {
        const [rows] = await db.query(
            `SELECT COUNT(*) as count FROM school_licenses 
             WHERE school_id = ? 
             AND status = 'ACTIVE' 
             AND end_date >= CURDATE()`,
            [schoolId]
        );
        return rows[0]?.count > 0;
    } catch (error) {
        throw new Error(`Failed to validate license: ${error.message}`);
    }
};

export const getExpiredLicenses = async () => {
    try {
        const [rows] = await db.query(
            `SELECT sl.*, s.name as school_name FROM school_licenses sl
             LEFT JOIN schools s ON sl.school_id = s.id
             WHERE status = 'ACTIVE' 
             AND end_date < CURDATE()
             ORDER BY end_date DESC`
        );

        return rows.map(row => ({
            ...row,
            features: typeof row.features === 'string' ? JSON.parse(row.features) : row.features
        }));
    } catch (error) {
        throw new Error(`Failed to get expired licenses: ${error.message}`);
    }
};

export const getExpiringLicenses = async (daysFromNow = 30) => {
    try {
        const [rows] = await db.query(
            `SELECT sl.*, s.name as school_name FROM school_licenses sl
             LEFT JOIN schools s ON sl.school_id = s.id
             WHERE status = 'ACTIVE' AND end_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ? DAY)
             ORDER BY end_date ASC`,
            [daysFromNow]
        );

        return rows.map(row => ({
            ...row,
            features: typeof row.features === 'string' ? JSON.parse(row.features) : row.features
        }));
    } catch (error) {
        throw new Error(`Failed to get expiring licenses: ${error.message}`);
    }
};

export default {
    create,
    findById,
    findBySchool,
    getActiveLicense,
    update,
    deleteLicense,
    checkValidity,
    getExpiredLicenses,
    getExpiringLicenses
};
