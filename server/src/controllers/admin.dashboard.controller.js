import { getStats, getAttendanceTrends, getRecentActivity } from '../services/admin.dashboard.service.js';

/**
 * GET /admin/dashboard
 * Returns aggregated dashboard data for the admin's school
 */
export const getDashboardData = async (req, res, next) => {
    try {
        const { school_id } = req.user;

        const [stats, attendanceTrends, recentActivity] = await Promise.all([
            getStats(school_id),
            getAttendanceTrends(school_id),
            getRecentActivity(school_id)
        ]);

        res.json({
            stats,
            attendanceTrends,
            recentActivity
        });
    } catch (error) {
        next(error);
    }
};
