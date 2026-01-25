import pool from '../config/database.js';

const checkLicense = async (req, res, next) => {
    try {
        // 1. Identify the school. 
        // Ideally, authMiddleware runs first and populates req.user.school_id
        const schoolId = req.user?.school_id;

        if (!schoolId) {
            // If user is not logged in or is a superadmin (who might not have a school_id in the same way),
            // we skip this check. Superadmins manage licenses, so they shouldn't be locked out.
            // However, if it's a tenant user without a school_id, that's an anomaly.
            if (req.user?.role === 'super_admin') return next();

            // If not authenticated yet, we can't check license (unless we use subdomain).
            // For safety, if we are in a protected route (req.user exists) but no school_id, block it.
            if (req.user) {
                return res.status(403).json({ message: 'School context missing.' });
            }
            return next();
        }

        // 2. Fetch License Status
        const [rows] = await pool.query(
            'SELECT status, end_date FROM school_licenses WHERE school_id = ? ORDER BY end_date DESC LIMIT 1',
            [schoolId]
        );

        if (rows.length === 0) {
            return res.status(403).json({ message: 'No license record found for this school.' });
        }

        const license = rows[0];
        const now = new Date();
        const endDate = new Date(license.end_date);

        // Check if effectively expired (status says active but date passed)
        const isExpired = license.status === 'expired' || endDate < now;

        // 3. Enforce Read-Only on Expiry
        if (isExpired) {
            if (req.method === 'GET') {
                // Allow Read-Only
                return next();
            } else {
                // Block Write Operations
                return res.status(402).json({
                    message: 'License expired. System is in Read-Only mode. Please renew your subscription to perform this action.',
                    code: 'LICENSE_EXPIRED'
                });
            }
        }

        // 4. Handle Suspended
        if (license.status === 'suspended') {
            return res.status(403).json({ message: 'School account is suspended. Contact support.' });
        }

        next();
    } catch (error) {
        console.error('License check error:', error);
        res.status(500).json({ message: 'Internal Server Error during license verification' });
    }
};

export default checkLicense;
