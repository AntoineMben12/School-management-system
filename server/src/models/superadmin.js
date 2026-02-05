import db from '../config/database.js';

/**
 * SuperAdmin Model - Platform-wide administration
 * Manages super admin profiles with full platform access
 */

export const create = async (superAdminData) => {
    const { user_id, department, phone, address, responsibilities } = superAdminData;
    try {
        const [result] = await db.execute(
            `INSERT INTO super_admin (user_id, department, phone, address, responsibilities, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
            [user_id, department || null, phone || null, address || null, responsibilities || null]
        );
        return { id: result.insertId, ...superAdminData };
    } catch (error) {
        throw new Error(`Failed to create super admin: ${error.message}`);
    }
};

export const findById = async (superAdminId) => {
    try {
        const [rows] = await db.query(
            `SELECT sa.*, u.email, u.first_name, u.last_name, u.is_active
             FROM super_admin sa
             JOIN users u ON sa.user_id = u.id
             WHERE sa.id = ?`,
            [superAdminId]
        );
        return rows[0] || null;
    } catch (error) {
        throw new Error(`Failed to find super admin: ${error.message}`);
    }
};

export const findByUserId = async (userId) => {
    try {
        const [rows] = await db.query(
            `SELECT sa.*, u.email, u.first_name, u.last_name, u.is_active
             FROM super_admin sa
             JOIN users u ON sa.user_id = u.id
             WHERE sa.user_id = ?`,
            [userId]
        );
        return rows[0] || null;
    } catch (error) {
        throw new Error(`Failed to find super admin by user: ${error.message}`);
    }
};

export const getAll = async () => {
    try {
        const [rows] = await db.query(
            `SELECT sa.*, u.email, u.first_name, u.last_name, u.is_active
             FROM super_admin sa
             JOIN users u ON sa.user_id = u.id
             ORDER BY u.last_name, u.first_name`
        );
        return rows;
    } catch (error) {
        throw new Error(`Failed to get all super admins: ${error.message}`);
    }
};

export const update = async (superAdminId, updates) => {
    const allowedFields = ['department', 'phone', 'address', 'responsibilities'];
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
    updateValues.push(superAdminId);

    try {
        const [result] = await db.execute(
            `UPDATE super_admin SET ${updateFields.join(', ')} WHERE id = ?`,
            updateValues
        );
        return result;
    } catch (error) {
        throw new Error(`Failed to update super admin: ${error.message}`);
    }
};

export const deleteSuperAdmin = async (superAdminId) => {
    try {
        const [result] = await db.execute(
            'DELETE FROM super_admin WHERE id = ?',
            [superAdminId]
        );
        return result;
    } catch (error) {
        throw new Error(`Failed to delete super admin: ${error.message}`);
    }
};

export const getCount = async () => {
    try {
        const [rows] = await db.query(
            'SELECT COUNT(*) as count FROM super_admin'
        );
        return rows[0]?.count || 0;
    } catch (error) {
        throw new Error(`Failed to count super admins: ${error.message}`);
    }
};

export default {
    create,
    findById,
    findByUserId,
    getAll,
    update,
    deleteSuperAdmin,
    getCount
};
