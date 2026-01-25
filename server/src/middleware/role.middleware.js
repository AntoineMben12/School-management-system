/**
 * Middleware to check if the user has one of the required roles.
 * Usage: router.post('/some-route', authMiddleware, checkRole(['super_admin', 'school_admin']), controller)
 * 
 * @param {string[]} allowedRoles - Array of roles allowed to access the route
 */
const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized. User not authenticated.' });
        }

        // Normalize roles to ensure consistency (optional, but good practice)
        // Assuming req.user.role is a string. If it's an array (multiple roles), logic needs adjustment.
        // My schema design has single role per user, so this is fine.

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'Forbidden. You do not have permission to perform this action.',
            });
        }

        next();
    };
};

export default checkRole;
