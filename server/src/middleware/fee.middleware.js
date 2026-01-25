import pool from '../config/database.js';

/**
 * Middleware to check if a student has outstanding fees before allowing access to sensitive resources (like Report Cards).
 * Usage: router.get('/report-card', auth, checkFeeStatus, controller.getReportCard)
 */
const checkFeeStatus = async (req, res, next) => {
    try {
        const studentId = req.user.role === 'student' ? req.user.student_id : req.query.student_id;

        if (!studentId) {
            // If we can't identify the student, we can't check fees. 
            // If it's a teacher/admin accessing, maybe we allow it? 
            // Requirement says "Access restriction based on payment status". 
            // Usually this applies to Parents/Students viewing results.
            if (['teacher', 'school_admin', 'super_admin'].includes(req.user.role)) {
                return next();
            }
            return res.status(400).json({ message: 'Student ID required for fee check.' });
        }

        // Check for any overdue invoices or significant outstanding balance
        // Policy: Block if ANY invoice is 'overdue' OR if total outstanding > threshold (e.g. 0)
        const [rows] = await pool.query(
            `SELECT COUNT(*) as overdue_count 
             FROM invoices 
             WHERE student_id = ? 
             AND (status = 'overdue' OR (status != 'paid' AND due_date < CURRENT_DATE))`,
            [studentId]
        );

        if (rows[0].overdue_count > 0) {
            return res.status(402).json({
                message: 'Access Denied. Outstanding fees detected. Please clear your dues to view this resource.',
                code: 'FEES_OUTSTANDING'
            });
        }

        next();
    } catch (error) {
        console.error('Fee check error:', error);
        res.status(500).json({ message: 'Error verifying fee status' });
    }
};

export default checkFeeStatus;
