import pool from '../config/database.js';
import bcrypt from 'bcrypt';

class SuperAdminService {
    /**
     * Create a new school tenant with license and initial admin.
     * Transactional: If any step fails, everything is rolled back.
     */
    static async createSchoolTenant({ schoolData, licenseData, adminData }) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Create School
            const [schoolResult] = await connection.query(
                `INSERT INTO schools (name, subdomain, contact_email, address, type) 
                 VALUES (?, ?, ?, ?, ?)`,
                [schoolData.name, schoolData.subdomain, schoolData.contact_email, schoolData.address, schoolData.type]
            );
            const schoolId = schoolResult.insertId;

            // 2. Create License
            await connection.query(
                `INSERT INTO school_licenses (school_id, plan_name, start_date, end_date, max_students, features) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [schoolId, licenseData.plan_name, licenseData.start_date, licenseData.end_date, licenseData.max_students, JSON.stringify(licenseData.features)]
            );

            // 3. Create School Admin User
            const hashedPassword = await bcrypt.hash(adminData.password, 10);
            const [userResult] = await connection.query(
                `INSERT INTO users (school_id, username, email, password_hash, role) 
                 VALUES (?, ?, ?, ?, 'school_admin')`,
                [schoolId, adminData.username, adminData.email, hashedPassword]
            );
            const userId = userResult.insertId;

            // 4. Create Admin Profile (if needed, though 'users' table might be enough for login, 
            // usually we want a profile entry in 'teachers' or a dedicated 'admins' table if it existed, 
            // but based on schema, 'users' holds the role. 
            // However, the schema has a 'teachers' table but not a specific 'admins' profile table 
            // other than the generic 'users'. 
            // Wait, the schema HAD an 'admin' table in the old version, but in my NEW schema 
            // I only defined 'teachers', 'parents', 'students'. 
            // Let's assume for now School Admin is just a User with role 'school_admin'.
            // If we need a profile, we might add it later. For now, this is sufficient.)

            await connection.commit();
            return { schoolId, message: 'School tenant created successfully' };

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getGlobalMetrics() {
        const [schools] = await pool.query('SELECT COUNT(*) as count FROM schools');
        const [students] = await pool.query('SELECT COUNT(*) as count FROM students');
        const [revenue] = await pool.query('SELECT SUM(paid_amount) as total FROM invoices'); // Global revenue across all schools (if Super Admin owns the platform)

        return {
            total_schools: schools[0].count,
            total_students: students[0].count,
            total_revenue: revenue[0].total || 0
        };
    }

    static async updateLicense(schoolId, { plan_name, end_date, status, max_students }) {
        await pool.query(
            `UPDATE school_licenses 
             SET plan_name = ?, end_date = ?, status = ?, max_students = ? 
             WHERE school_id = ?`,
            [plan_name, end_date, status, max_students, schoolId]
        );
        return { message: 'License updated successfully' };
    }
}

export default SuperAdminService;
