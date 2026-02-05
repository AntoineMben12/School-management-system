import db from "../config/database.js";

/**
 * User Model - Handle all user database operations
 * Supports: super_admin, school_admin, teacher, student, parent, accountant
 */

/**
 * Create a new user
 * @param {Object} userData - { username, email, password_hash, role, school_id, is_active }
 * @returns {Promise} User ID and data
 */
export const create = async (userData) => {
    const { username, email, password_hash, role, school_id, is_active = true } = userData;
    
    try {
        const [result] = await db.execute(
            `INSERT INTO users (username, email, password_hash, role, school_id, is_active) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [username, email, password_hash, role, school_id, is_active]
        );
        return { user_id: result.insertId, username, email, role, school_id };
    } catch (error) {
        throw new Error(`Failed to create user: ${error.message}`);
    }
};

/**
 * Find user by ID
 * @param {number} user_id - User ID
 * @returns {Promise} User data (without password)
 */
export const findById = async (user_id) => {
    const [rows] = await db.query(
        `SELECT user_id, school_id, username, email, role, is_active, last_login, created_at 
         FROM users WHERE user_id = ?`,
        [user_id]
    );
    return rows[0] || null;
};

/**
 * Find user by email in specific school
 * @param {string} email - User email
 * @param {number} school_id - School ID
 * @returns {Promise} User data with password for authentication
 */
export const findByEmail = async (email, school_id) => {
    const [rows] = await db.query(
        `SELECT user_id, school_id, username, email, password_hash, role, is_active, last_login, created_at 
         FROM users WHERE email = ? AND school_id = ?`,
        [email, school_id]
    );
    return rows[0] || null;
};

/**
 * Find all users in a school
 * @param {number} school_id - School ID
 * @param {string} role - Optional role filter
 * @returns {Promise} Array of users
 */
export const findBySchool = async (school_id, role = null) => {
    let sql = `SELECT user_id, school_id, username, email, role, is_active, last_login, created_at 
               FROM users WHERE school_id = ?`;
    const params = [school_id];
    
    if (role) {
        sql += ' AND role = ?';
        params.push(role);
    }
    
    sql += ' ORDER BY created_at DESC';
    const [rows] = await db.query(sql, params);
    return rows;
};

/**
 * Update user
 * @param {number} user_id - User ID
 * @param {Object} updates - Fields to update
 * @returns {Promise} Update result
 */
export const update = async (user_id, updates) => {
    const allowedFields = ['username', 'email', 'password_hash', 'role', 'is_active'];
    const fields = [];
    const values = [];
    
    Object.entries(updates).forEach(([key, value]) => {
        if (allowedFields.includes(key)) {
            fields.push(`${key} = ?`);
            values.push(value);
        }
    });
    
    if (fields.length === 0) return { affectedRows: 0 };
    
    values.push(user_id);
    const [result] = await db.execute(
        `UPDATE users SET ${fields.join(', ')} WHERE user_id = ?`,
        values
    );
    return result;
};

/**
 * Update last login timestamp
 * @param {number} user_id - User ID
 * @returns {Promise} Update result
 */
export const updateLastLogin = async (user_id) => {
    const [result] = await db.execute(
        `UPDATE users SET last_login = NOW() WHERE user_id = ?`,
        [user_id]
    );
    return result;
};

/**
 * Delete user
 * @param {number} user_id - User ID
 * @returns {Promise} Delete result
 */
export const deleteUser = async (user_id) => {
    const [result] = await db.execute(
        `DELETE FROM users WHERE user_id = ?`,
        [user_id]
    );
    return result;
};

/**
 * Get user count by role
 * @param {number} school_id - School ID
 * @returns {Promise} Count by role
 */
export const getCountByRole = async (school_id) => {
    const [rows] = await db.query(
        `SELECT role, COUNT(*) as count FROM users WHERE school_id = ? GROUP BY role`,
        [school_id]
    );
    return rows;
};

/**
 * Check if email exists
 * @param {string} email - User email
 * @param {number} school_id - School ID
 * @returns {Promise} Boolean
 */
export const emailExists = async (email, school_id) => {
    const user = await findByEmail(email, school_id);
    return !!user;
};

export default { create, findById, findByEmail, findBySchool, update, updateLastLogin, deleteUser, getCountByRole, emailExists };

