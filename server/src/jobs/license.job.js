import cron from 'node-cron';
import pool from '../config/database.js';
// import emailService from '../services/email.service.js'; // Assuming an email service exists

const startLicenseJobs = () => {
    // Run every day at midnight: '0 0 * * *'
    cron.schedule('0 0 * * *', async () => {
        console.log('Running License Expiry Check Job...');
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

            // 1. Auto-Expire Licenses
            // Update status to 'expired' if end_date has passed and status is still 'active'
            const [expireResult] = await connection.query(
                `UPDATE school_licenses 
                 SET status = 'expired' 
                 WHERE end_date < ? AND status = 'active'`,
                [today]
            );
            console.log(`Expired ${expireResult.affectedRows} licenses.`);

            // 2. Send Warning Emails (e.g., 7 days before expiry)
            // This query finds schools expiring in exactly 7 days
            const [warningRows] = await connection.query(
                `SELECT sl.school_id, sl.end_date, s.contact_email, s.name as school_name
                 FROM school_licenses sl
                 JOIN schools s ON sl.school_id = s.school_id
                 WHERE sl.status = 'active' 
                 AND DATEDIFF(sl.end_date, ?) = 7`,
                [today]
            );

            for (const row of warningRows) {
                console.log(`Sending warning to ${row.school_name} (${row.contact_email})`);
                // await emailService.sendLicenseWarning(row.contact_email, row.school_name, row.end_date);
            }

            await connection.commit();
        } catch (error) {
            await connection.rollback();
            console.error('Error in License Job:', error);
        } finally {
            connection.release();
        }
    });
};

export default startLicenseJobs;
