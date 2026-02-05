import db from '../config/database.js';

/**
 * Admin Model
 * Handles database operations for school administrators
 */

export const create = async (adminData) => {
    const { user_id, school_id, department, phone, address, qualification } = adminData;
    try {
        const [result] = await db.execute(
            `INSERT INTO admin (user_id, school_id, department, phone, address, qualification, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [user_id, school_id, department || null, phone || null, address || null, qualification || null]
        );
        return { id: result.insertId, ...adminData };
    } catch (error) {
        throw new Error(`Failed to create admin: ${error.message}`);
    }
};

export const findById = async (adminId) => {
    try {
        const [rows] = await db.query(
            `SELECT a.*, u.email, u.first_name, u.last_name, u.is_active
             FROM admin a
             JOIN users u ON a.user_id = u.id
             WHERE a.id = ?`,
            [adminId]
        );
        return rows[0] || null;
    } catch (error) {
        throw new Error(`Failed to find admin: ${error.message}`);
    }
};

export const findByUserId = async (userId) => {
    try {
        const [rows] = await db.query(
            `SELECT a.*, u.email, u.first_name, u.last_name, u.is_active
             FROM admin a
             JOIN users u ON a.user_id = u.id
             WHERE a.user_id = ?`,
            [userId]
        );
        return rows[0] || null;
    } catch (error) {
        throw new Error(`Failed to find admin by user: ${error.message}`);
    }
};

export const findBySchool = async (schoolId) => {
    try {
        const [rows] = await db.query(
            `SELECT a.*, u.email, u.first_name, u.last_name, u.is_active
             FROM admin a
             JOIN users u ON a.user_id = u.id
             WHERE a.school_id = ?
             ORDER BY a.created_at DESC`,
            [schoolId]
        );
        return rows;
    } catch (error) {
        throw new Error(`Failed to find admins by school: ${error.message}`);
    }
};

export const update = async (adminId, updates) => {
    const allowedFields = ['department', 'phone', 'address', 'qualification'];
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
    updateValues.push(adminId);

    try {
        const [result] = await db.execute(
            `UPDATE admin SET ${updateFields.join(', ')} WHERE id = ?`,
            updateValues
        );
        return result;
    } catch (error) {
        throw new Error(`Failed to update admin: ${error.message}`);
    }
};

export const deleteAdmin = async (adminId) => {
    try {
        const [result] = await db.execute(
            'DELETE FROM admin WHERE id = ?',
            [adminId]
        );
        return result;
    } catch (error) {
        throw new Error(`Failed to delete admin: ${error.message}`);
    }
};

export const getCountBySchool = async (schoolId) => {
    try {
        const [rows] = await db.query(
            'SELECT COUNT(*) as count FROM admin WHERE school_id = ?',
            [schoolId]
        );
        return rows[0]?.count || 0;
    } catch (error) {
        throw new Error(`Failed to count admins: ${error.message}`);
    }
};

export default {
    create,
    findById,
    findByUserId,
    findBySchool,
    update,
    deleteAdmin,
    getCountBySchool
};