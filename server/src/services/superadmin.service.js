import pool from "../config/database.js";
import bcrypt from "bcrypt";

class SuperAdminService {
  // ─────────────────────────────────────────────────────────────────────────
  // DASHBOARD METRICS
  // ─────────────────────────────────────────────────────────────────────────

  static async getGlobalMetrics() {
    const [[schoolRow]] = await pool.query(
      "SELECT COUNT(*) as count FROM schools",
    );
    const [[studentRow]] = await pool.query(
      "SELECT COUNT(*) as count FROM students",
    );
    const [[revenueRow]] = await pool.query(
      "SELECT COALESCE(SUM(paid_amount), 0) as total FROM invoices",
    );
    const [[activeLicRow]] = await pool.query(
      "SELECT COUNT(*) as count FROM school_licenses WHERE status = 'active'",
    );
    const [[expiredLicRow]] = await pool.query(
      "SELECT COUNT(*) as count FROM school_licenses WHERE status = 'expired'",
    );
    const [[suspendedLicRow]] = await pool.query(
      "SELECT COUNT(*) as count FROM school_licenses WHERE status = 'suspended'",
    );

    return {
      total_schools: Number(schoolRow.count),
      total_students: Number(studentRow.count),
      total_revenue: Number(revenueRow.total),
      active_licenses: Number(activeLicRow.count),
      expired_licenses: Number(expiredLicRow.count),
      suspended_licenses: Number(suspendedLicRow.count),
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SCHOOLS
  // ─────────────────────────────────────────────────────────────────────────

  static async getAllSchools({
    page = 1,
    limit = 10,
    search = "",
    status = "",
  } = {}) {
    const offset = (page - 1) * limit;
    const params = [];

    let where = "WHERE 1=1";
    if (search) {
      where +=
        " AND (s.name LIKE ? OR s.contact_email LIKE ? OR s.subdomain LIKE ?)";
      const like = `%${search}%`;
      params.push(like, like, like);
    }
    if (status) {
      where += " AND sl.status = ?";
      params.push(status);
    }

    const countSql = `
            SELECT COUNT(DISTINCT s.school_id) as total
            FROM schools s
            LEFT JOIN school_licenses sl ON sl.school_id = s.school_id
            ${where}
        `;
    const [[countRow]] = await pool.query(countSql, params);
    const total = Number(countRow.total);

    const dataSql = `
            SELECT
                s.school_id,
                s.name,
                s.subdomain,
                s.contact_email,
                s.address,
                s.type,
                s.created_at,
                sl.license_id,
                sl.plan_name,
                sl.start_date,
                sl.end_date,
                sl.status      AS license_status,
                sl.max_students,
                sl.features,
                (SELECT COUNT(*) FROM students st WHERE st.school_id = s.school_id) AS student_count,
                u.email        AS admin_email,
                u.username     AS admin_name
            FROM schools s
            LEFT JOIN school_licenses sl  ON sl.school_id = s.school_id
            LEFT JOIN users u             ON u.school_id  = s.school_id AND u.role = 'school_admin'
            ${where}
            GROUP BY s.school_id
            ORDER BY s.created_at DESC
            LIMIT ? OFFSET ?
        `;
    const [schools] = await pool.query(dataSql, [...params, limit, offset]);

    return {
      data: schools,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getSchoolById(schoolId) {
    const [[school]] = await pool.query(
      `SELECT
                s.*,
                sl.license_id, sl.plan_name, sl.start_date, sl.end_date,
                sl.status AS license_status, sl.max_students, sl.features,
                (SELECT COUNT(*) FROM students st WHERE st.school_id = s.school_id) AS student_count,
                (SELECT COUNT(*) FROM teachers t  WHERE t.school_id  = s.school_id) AS teacher_count,
                u.email AS admin_email, u.username AS admin_name
             FROM schools s
             LEFT JOIN school_licenses sl ON sl.school_id = s.school_id
             LEFT JOIN users u ON u.school_id = s.school_id AND u.role = 'school_admin'
             WHERE s.school_id = ?`,
      [schoolId],
    );
    return school || null;
  }

  static async createSchoolTenant({ schoolData, licenseData, adminData }) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 1. School
      const [schoolResult] = await connection.query(
        `INSERT INTO schools (name, subdomain, contact_email, address, type)
                 VALUES (?, ?, ?, ?, ?)`,
        [
          schoolData.name,
          schoolData.subdomain || null,
          schoolData.contact_email,
          schoolData.address || null,
          schoolData.type || "secondary",
        ],
      );
      const schoolId = schoolResult.insertId;

      // 2. License
      const startDate =
        licenseData.start_date || new Date().toISOString().split("T")[0];
      const endDate =
        licenseData.end_date ||
        new Date(Date.now() + 365 * 24 * 3600 * 1000)
          .toISOString()
          .split("T")[0];
      await connection.query(
        `INSERT INTO school_licenses (school_id, plan_name, start_date, end_date, max_students, features)
                 VALUES (?, ?, ?, ?, ?, ?)`,
        [
          schoolId,
          licenseData.plan_name || "Basic",
          startDate,
          endDate,
          licenseData.max_students || 500,
          JSON.stringify(licenseData.features || []),
        ],
      );

      // 3. Admin user
      const hashedPassword = await bcrypt.hash(adminData.password, 10);
      await connection.query(
        `INSERT INTO users (school_id, username, email, password_hash, role)
                 VALUES (?, ?, ?, ?, 'school_admin')`,
        [schoolId, adminData.username, adminData.email, hashedPassword],
      );

      await connection.commit();
      return { schoolId, message: "School tenant created successfully" };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async updateSchool(schoolId, updates) {
    const allowed = ["name", "subdomain", "contact_email", "address", "type"];
    const fields = [];
    const values = [];

    for (const [k, v] of Object.entries(updates)) {
      if (allowed.includes(k)) {
        fields.push(`${k} = ?`);
        values.push(v);
      }
    }
    if (!fields.length) return { affectedRows: 0 };
    values.push(schoolId);

    const [result] = await pool.query(
      `UPDATE schools SET ${fields.join(", ")} WHERE school_id = ?`,
      values,
    );
    return result;
  }

  static async deleteSchool(schoolId) {
    const [result] = await pool.query(
      "DELETE FROM schools WHERE school_id = ?",
      [schoolId],
    );
    return result;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // LICENSES
  // ─────────────────────────────────────────────────────────────────────────

  static async getAllLicenses({
    page = 1,
    limit = 10,
    search = "",
    status = "",
  } = {}) {
    const offset = (page - 1) * limit;
    const params = [];

    let where = "WHERE 1=1";
    if (search) {
      where += " AND (s.name LIKE ? OR sl.plan_name LIKE ?)";
      const like = `%${search}%`;
      params.push(like, like);
    }
    if (status) {
      where += " AND sl.status = ?";
      params.push(status);
    }

    const [[countRow]] = await pool.query(
      `SELECT COUNT(*) as total FROM school_licenses sl
             JOIN schools s ON s.school_id = sl.school_id ${where}`,
      params,
    );
    const total = Number(countRow.total);

    const [licenses] = await pool.query(
      `SELECT
                sl.*,
                s.name          AS school_name,
                s.contact_email AS school_email,
                s.type          AS school_type,
                (SELECT COUNT(*) FROM students st WHERE st.school_id = s.school_id) AS student_count
             FROM school_licenses sl
             JOIN schools s ON s.school_id = sl.school_id
             ${where}
             ORDER BY sl.created_at DESC
             LIMIT ? OFFSET ?`,
      [...params, limit, offset],
    );

    return {
      data: licenses,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  static async updateLicense(
    schoolId,
    { plan_name, end_date, status, max_students },
  ) {
    const [result] = await pool.query(
      `UPDATE school_licenses
             SET plan_name = ?, end_date = ?, status = ?, max_students = ?
             WHERE school_id = ?`,
      [plan_name, end_date, status, max_students, schoolId],
    );
    return result;
  }

  static async renewLicense(licenseId, { end_date, plan_name, max_students }) {
    const [result] = await pool.query(
      `UPDATE school_licenses
             SET end_date = ?, plan_name = COALESCE(?, plan_name),
                 max_students = COALESCE(?, max_students), status = 'active'
             WHERE license_id = ?`,
      [end_date, plan_name || null, max_students || null, licenseId],
    );
    return result;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // FINANCE
  // ─────────────────────────────────────────────────────────────────────────

  static async getFinanceSummary() {
    const [[totalRevRow]] = await pool.query(
      "SELECT COALESCE(SUM(paid_amount), 0) AS total FROM invoices",
    );
    const [[totalInvoiced]] = await pool.query(
      "SELECT COALESCE(SUM(total_amount), 0) AS total FROM invoices",
    );
    const [[paidRow]] = await pool.query(
      "SELECT COALESCE(SUM(paid_amount), 0) AS total FROM invoices WHERE status = 'paid'",
    );
    const [[pendingRow]] = await pool.query(
      "SELECT COALESCE(SUM(total_amount - paid_amount), 0) AS total FROM invoices WHERE status IN ('unpaid','partial','overdue')",
    );
    const [[overdueRow]] = await pool.query(
      "SELECT COUNT(*) as count FROM invoices WHERE status = 'overdue'",
    );

    // Revenue by month (last 6 months)
    const [monthlyRevenue] = await pool.query(`
            SELECT
                DATE_FORMAT(created_at, '%Y-%m') AS month,
                COALESCE(SUM(paid_amount), 0)    AS revenue
            FROM invoices
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
            GROUP BY month
            ORDER BY month ASC
        `);

    return {
      total_revenue: Number(totalRevRow.total),
      total_invoiced: Number(totalInvoiced.total),
      total_paid: Number(paidRow.total),
      total_pending: Number(pendingRow.total),
      overdue_count: Number(overdueRow.count),
      monthly_revenue: monthlyRevenue,
    };
  }

  static async getRecentPayments({ page = 1, limit = 10, search = "" } = {}) {
    const offset = (page - 1) * limit;
    const params = [];

    let where = "WHERE 1=1";
    if (search) {
      where += " AND (s.name LIKE ? OR i.title LIKE ?)";
      const like = `%${search}%`;
      params.push(like, like);
    }

    const [[countRow]] = await pool.query(
      `SELECT COUNT(*) as total
             FROM payments p
             JOIN invoices i ON i.invoice_id = p.invoice_id
             JOIN schools  s ON s.school_id  = i.school_id
             ${where}`,
      params,
    );
    const total = Number(countRow.total);

    const [payments] = await pool.query(
      `SELECT
                p.payment_id,
                p.amount,
                p.payment_date,
                p.method,
                p.transaction_reference,
                i.title        AS invoice_title,
                i.total_amount AS invoice_total,
                i.status       AS invoice_status,
                s.name         AS school_name,
                s.school_id
             FROM payments p
             JOIN invoices i ON i.invoice_id = p.invoice_id
             JOIN schools  s ON s.school_id  = i.school_id
             ${where}
             ORDER BY p.payment_date DESC
             LIMIT ? OFFSET ?`,
      [...params, limit, offset],
    );

    return {
      data: payments,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // USERS
  // ─────────────────────────────────────────────────────────────────────────

  static async getAllUsers({
    page = 1,
    limit = 10,
    search = "",
    role = "",
  } = {}) {
    const offset = (page - 1) * limit;
    const params = [];

    let where = "WHERE 1=1";
    if (search) {
      where += " AND (u.email LIKE ? OR u.username LIKE ?)";
      const like = `%${search}%`;
      params.push(like, like);
    }
    if (role) {
      where += " AND u.role = ?";
      params.push(role);
    }

    const [[countRow]] = await pool.query(
      `SELECT COUNT(*) as total FROM users u ${where}`,
      params,
    );
    const total = Number(countRow.total);

    const [users] = await pool.query(
      `SELECT
                u.user_id, u.username, u.email, u.role,
                u.is_active, u.last_login, u.created_at,
                s.name AS school_name, s.school_id
             FROM users u
             LEFT JOIN schools s ON s.school_id = u.school_id
             ${where}
             ORDER BY u.created_at DESC
             LIMIT ? OFFSET ?`,
      [...params, limit, offset],
    );

    return {
      data: users,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  static async toggleUserActive(userId, is_active) {
    const [result] = await pool.query(
      "UPDATE users SET is_active = ? WHERE user_id = ?",
      [is_active, userId],
    );
    return result;
  }
}

export default SuperAdminService;
