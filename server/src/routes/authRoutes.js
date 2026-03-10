import express from "express";
import * as authController from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// ─── Public Routes ────────────────────────────────────────────────────────────

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     description: >
 *       Creates a new user account. The `role` field determines which part of
 *       the platform the user can access. `school_id` is required for all roles
 *       except `super_admin`.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post("/register", authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login as any user
 *     description: >
 *       Authenticates a user and returns a JWT token. Provide `school_id` for
 *       all roles except `super_admin`. Use `POST /auth/superadmin/login` for
 *       the super admin account instead.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           example:
 *             email: admin@school.com
 *             password: Secret123!
 *             school_id: 1
 *     responses:
 *       200:
 *         description: Login successful — JWT token returned.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         description: Invalid email or password.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: Invalid credentials
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /auth/superadmin/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login as Super Admin
 *     description: >
 *       Dedicated login endpoint for the super admin account.
 *       No `school_id` is required. Returns a JWT token with the
 *       `super_admin` role claim.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SuperAdminLoginRequest'
 *           example:
 *             email: superadmin@schoolos.dev
 *             password: Admin@123
 *     responses:
 *       200:
 *         description: Super admin login successful — JWT token returned.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         description: Invalid super admin credentials.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: Invalid credentials
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post("/superadmin/login", authController.superAdminLogin);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     tags: [Auth]
 *     summary: Request a password reset email
 *     description: >
 *       Sends a password-reset link to the provided email address.
 *       The link contains a short-lived token that must be passed to
 *       `POST /auth/reset-password`. Always returns 200 to prevent
 *       user enumeration attacks.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordRequest'
 *     responses:
 *       200:
 *         description: Reset email sent (if the account exists).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *             example:
 *               message: Password reset email sent if the account exists.
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post("/forgot-password", authController.requestPasswordReset);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     tags: [Auth]
 *     summary: Reset password using a reset token
 *     description: >
 *       Consumes the one-time reset token received via email and sets a new
 *       password. Tokens expire after a server-configured duration (default 1 hour).
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordRequest'
 *     responses:
 *       200:
 *         description: Password reset successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *             example:
 *               message: Password has been reset successfully.
 *       400:
 *         description: Invalid or expired reset token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: Reset token is invalid or has expired.
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post("/reset-password", authController.resetPassword);

// ─── Protected Routes (require valid JWT) ─────────────────────────────────────

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     tags: [Auth]
 *     summary: Change the current user's password
 *     description: >
 *       Allows an authenticated user to change their own password.
 *       Both the old and new passwords are required. The new password
 *       must be at least 6 characters and must differ from the old one.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordRequest'
 *     responses:
 *       200:
 *         description: Password changed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *             example:
 *               message: Password changed successfully.
 *       400:
 *         description: Validation failed (e.g. wrong old password, passwords match).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: Old password is incorrect.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post("/change-password", authMiddleware, authController.changePassword);

export default router;
