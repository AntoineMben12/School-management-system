import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/database.js';
import { sendEmail, getPasswordResetTemplate } from '../utils/email.util.js';

/**
 * Auth Service
 * Handles authentication operations including registration, login, and password management
 */
class AuthService {
    /**
     * Register a new user
     * @param {Object} req - Express request object
     * @returns {Object} Created user and token
     */

    static async register(req) {
        const userData = req.body;
        if (!userData) {
            throw new Error('No registration data provided');
        }
        const { username, email, password, role, school_id, profile } = userData;

        // Validate required fields
        if (!username || !email || !password || !role || !school_id) {
            throw new Error('Missing required fields: username, email, password, role, or school_id');
        }

        // Validate role
        const validRoles = ['super_admin', 'school_admin', 'teacher', 'student', 'parent', 'accountant'];
        if (!validRoles.includes(role)) {
            throw new Error(`Invalid role. Must be one of: ${validRoles.join(', ')}`);
        }

        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            // Check if email already exists for this school
            const [existingUsers] = await connection.query(
                'SELECT user_id FROM users WHERE school_id = ? AND email = ?',
                [school_id, email]
            );

            if (existingUsers.length > 0) {
                throw new Error('Email already registered for this school');
            }

            // Hash password
            const password_hash = await bcrypt.hash(password, 10);

            // Insert user
            const [userResult] = await connection.execute(
                `INSERT INTO users (school_id, username, email, password_hash, role, is_active) 
                 VALUES (?, ?, ?, ?, ?, TRUE)`,
                [school_id, username, email, password_hash, role]
            );

            const userId = userResult.insertId;

            // Create role-specific profile if provided
            if (profile) {
                switch (role) {
                    case 'teacher':
                        await connection.execute(
                            `INSERT INTO teachers (user_id, school_id, first_name, last_name, qualification, phone) 
                             VALUES (?, ?, ?, ?, ?, ?)`,
                            [userId, school_id, profile.first_name, profile.last_name, profile.qualification || null, profile.phone || null]
                        );
                        break;

                    case 'student':
                        await connection.execute(
                            `INSERT INTO students (user_id, school_id, parent_id, current_class_id, admission_number, 
                                                   first_name, last_name, dob, gender, enrollment_date) 
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                            [
                                userId,
                                school_id,
                                profile.parent_id || null,
                                profile.current_class_id || null,
                                profile.admission_number,
                                profile.first_name,
                                profile.last_name,
                                profile.dob || null,
                                profile.gender || null,
                                profile.enrollment_date || new Date()
                            ]
                        );
                        break;

                    case 'parent':
                        await connection.execute(
                            `INSERT INTO parents (user_id, school_id, father_name, mother_name, phone) 
                             VALUES (?, ?, ?, ?, ?)`,
                            [userId, school_id, profile.father_name || null, profile.mother_name || null, profile.phone || null]
                        );
                        break;
                }
            }

            await connection.commit();

            // Generate JWT token
            const token = jwt.sign(
                {
                    user_id: userId,
                    email,
                    role,
                    school_id
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
            );

            return {
                message: 'User registered successfully',
                user: {
                    user_id: userId,
                    username,
                    email,
                    role,
                    school_id
                },
                token
            };

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    /**
     * Login user
     * @param {string} email - User email
     * @param {string} password - User password
     * @param {number} school_id - School ID
     * @returns {Object} User data and token
     */
    static async login(email, password, school_id) {
        if (!email || !password || !school_id) {
            throw new Error('Email, password, and school_id are required');
        }

        // Get user from database
        const [users] = await db.query(
            `SELECT user_id, username, email, password_hash, role, school_id, is_active 
             FROM users 
             WHERE email = ? AND school_id = ?`,
            [email, school_id]
        );

        if (users.length === 0) {
            throw new Error('Invalid credentials');
        }

        const user = users[0];

        // Check if user is active
        if (!user.is_active) {
            throw new Error('Account is deactivated. Please contact administrator.');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        // Update last login
        await db.query(
            'UPDATE users SET last_login = NOW() WHERE user_id = ?',
            [user.user_id]
        );

        // Generate JWT token
        const token = jwt.sign(
            {
                user_id: user.user_id,
                email: user.email,
                role: user.role,
                school_id: user.school_id
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        return {
            message: 'Login successful',
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                role: user.role,
                school_id: user.school_id
            },
            token
        };
    }

    /**
     * Change user password
     * @param {number} userId - User ID
     * @param {string} oldPassword - Current password
     * @param {string} newPassword - New password
     * @returns {Object} Success message
     */
    static async changePassword(userId, oldPassword, newPassword) {
        if (!oldPassword || !newPassword) {
            throw new Error('Old password and new password are required');
        }

        if (newPassword.length < 6) {
            throw new Error('New password must be at least 6 characters long');
        }

        // Get current password hash
        const [users] = await db.query(
            'SELECT password_hash FROM users WHERE user_id = ?',
            [userId]
        );

        if (users.length === 0) {
            throw new Error('User not found');
        }

        // Verify old password
        const isPasswordValid = await bcrypt.compare(oldPassword, users[0].password_hash);
        if (!isPasswordValid) {
            throw new Error('Current password is incorrect');
        }

        // Hash new password
        const newPasswordHash = await bcrypt.hash(newPassword, 10);

        // Update password
        await db.query(
            'UPDATE users SET password_hash = ? WHERE user_id = ?',
            [newPasswordHash, userId]
        );

        return { message: 'Password changed successfully' };
    }

    /**
     * Request password reset (generates reset token)
     * Note: In production, this should send an email with reset link
     * @param {string} email - User email
     * @param {number} school_id - School ID
     * @returns {Object} Reset token (in production, send via email)
     */
    static async requestPasswordReset(email, school_id) {
        const [users] = await db.query(
            'SELECT user_id, username FROM users WHERE email = ? AND school_id = ?',
            [email, school_id]
        );

        if (users.length === 0) {
            // Don't reveal if email exists or not for security
            return { message: 'If the email exists, a reset link will be sent' };
        }

        const user = users[0];

        // Generate reset token (valid for 1 hour)
        const resetToken = jwt.sign(
            { user_id: user.user_id, purpose: 'password_reset' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Generate reset link
        const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

        // Send email

        await sendEmail(
            email,
            'Password Reset Request',
            getPasswordResetTemplate(resetLink)
        );

        return {
            message: 'If the email exists, a reset link will be sent',
        };
    }

    /**
     * Reset password using reset token
     * @param {string} resetToken - Reset token from email
     * @param {string} newPassword - New password
     * @returns {Object} Success message
     */
    static async resetPassword(resetToken, newPassword) {
        if (!resetToken || !newPassword) {
            throw new Error('Reset token and new password are required');
        }

        if (newPassword.length < 6) {
            throw new Error('New password must be at least 6 characters long');
        }

        try {
            // Verify reset token
            const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);

            if (decoded.purpose !== 'password_reset') {
                throw new Error('Invalid reset token');
            }

            // Hash new password
            const newPasswordHash = await bcrypt.hash(newPassword, 10);

            // Update password
            await db.query(
                'UPDATE users SET password_hash = ? WHERE user_id = ?',
                [newPasswordHash, decoded.user_id]
            );

            return { message: 'Password reset successfully' };

        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new Error('Reset token has expired');
            }
            throw new Error('Invalid or expired reset token');
        }
    }
}

export default AuthService;
