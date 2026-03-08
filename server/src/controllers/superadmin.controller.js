import SuperAdminService from "../services/superadmin.service.js";

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────

export const dashboard = async (req, res) => {
  try {
    const metrics = await SuperAdminService.getGlobalMetrics();
    res.json(metrics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching dashboard metrics" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// SCHOOLS
// ─────────────────────────────────────────────────────────────────────────────

export const getSchools = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", status = "" } = req.query;
    const result = await SuperAdminService.getAllSchools({
      page: parseInt(page),
      limit: parseInt(limit),
      search,
      status,
    });
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching schools" });
  }
};

export const getSchoolById = async (req, res) => {
  try {
    const school = await SuperAdminService.getSchoolById(req.params.schoolId);
    if (!school) return res.status(404).json({ message: "School not found" });
    res.json(school);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching school" });
  }
};

export const createSchool = async (req, res) => {
  try {
    const { school, license, admin } = req.body;

    if (!school || !admin) {
      return res
        .status(400)
        .json({ message: "Missing required fields: school or admin data." });
    }

    const result = await SuperAdminService.createSchoolTenant({
      schoolData: school,
      licenseData: license || {},
      adminData: admin,
    });

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export const updateSchool = async (req, res) => {
  try {
    const result = await SuperAdminService.updateSchool(
      req.params.schoolId,
      req.body,
    );
    res.json({ message: "School updated successfully", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating school" });
  }
};

export const deleteSchool = async (req, res) => {
  try {
    await SuperAdminService.deleteSchool(req.params.schoolId);
    res.json({ message: "School deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting school" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// LICENSES
// ─────────────────────────────────────────────────────────────────────────────

export const getLicenses = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", status = "" } = req.query;
    const result = await SuperAdminService.getAllLicenses({
      page: parseInt(page),
      limit: parseInt(limit),
      search,
      status,
    });
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching licenses" });
  }
};

export const updateLicense = async (req, res) => {
  try {
    const { schoolId } = req.params;
    const { plan_name, end_date, status, max_students } = req.body;
    await SuperAdminService.updateLicense(schoolId, {
      plan_name,
      end_date,
      status,
      max_students,
    });
    res.json({ message: "License updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating license" });
  }
};

export const renewLicense = async (req, res) => {
  try {
    const { licenseId } = req.params;
    const { end_date, plan_name, max_students } = req.body;
    if (!end_date) {
      return res.status(400).json({ message: "end_date is required" });
    }
    await SuperAdminService.renewLicense(licenseId, {
      end_date,
      plan_name,
      max_students,
    });
    res.json({ message: "License renewed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error renewing license" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// FINANCE
// ─────────────────────────────────────────────────────────────────────────────

export const getFinanceSummary = async (req, res) => {
  try {
    const summary = await SuperAdminService.getFinanceSummary();
    res.json(summary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching finance summary" });
  }
};

export const getRecentPayments = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const result = await SuperAdminService.getRecentPayments({
      page: parseInt(page),
      limit: parseInt(limit),
      search,
    });
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching payments" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// USERS
// ─────────────────────────────────────────────────────────────────────────────

export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", role = "" } = req.query;
    const result = await SuperAdminService.getAllUsers({
      page: parseInt(page),
      limit: parseInt(limit),
      search,
      role,
    });
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

export const toggleUserActive = async (req, res) => {
  try {
    const { userId } = req.params;
    const { is_active } = req.body;
    if (is_active === undefined) {
      return res.status(400).json({ message: "is_active is required" });
    }
    await SuperAdminService.toggleUserActive(userId, is_active);
    res.json({
      message: `User ${is_active ? "activated" : "deactivated"} successfully`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating user status" });
  }
};
