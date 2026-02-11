import AuthService from '../services/auth.service.js';

/**
 * Register a new user
 */
export const register = async (req, res, next) => {
    try {
        const result = await AuthService.register(req);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

/**
 * Login user
 */
export const login = async (req, res, next) => {
    try {
        const { email, password, school_id } = req.body;
        const result = await AuthService.login(email, password, school_id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

/**
 * Change password (requires authentication)
 */
export const changePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const result = await AuthService.changePassword(req.user.user_id, oldPassword, newPassword);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

/**
 * Request password reset
 */
export const requestPasswordReset = async (req, res, next) => {
    try {
        const { email, school_id } = req.body;
        const result = await AuthService.requestPasswordReset(email, school_id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

/**
 * Reset password using token
 */
export const resetPassword = async (req, res, next) => {
    try {
        const { resetToken, newPassword } = req.body;
        const result = await AuthService.resetPassword(resetToken, newPassword);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
