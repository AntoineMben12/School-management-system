// ─── SuperAdmin API Service ───────────────────────────────────────────────────
// All calls go to /superadmin/* (protected, requires Bearer token)

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function authHeader() {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(method, path, body, params) {
  let url = `${API_BASE_URL}${path}`;
  if (params) {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== "")
    ).toString();
    if (qs) url += `?${qs}`;
  }

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || data.error?.message || `HTTP ${res.status}`);
  }
  return data;
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
export const getDashboardMetrics = () =>
  request("GET", "/superadmin/dashboard");

// ─────────────────────────────────────────────────────────────────────────────
// SCHOOLS
// ─────────────────────────────────────────────────────────────────────────────
export const getSchools = ({ page = 1, limit = 10, search = "", status = "" } = {}) =>
  request("GET", "/superadmin/schools", undefined, { page, limit, search, status });

export const getSchoolById = (schoolId) =>
  request("GET", `/superadmin/schools/${schoolId}`);

export const createSchool = (payload) =>
  request("POST", "/superadmin/schools", payload);

export const updateSchool = (schoolId, payload) =>
  request("PUT", `/superadmin/schools/${schoolId}`, payload);

export const deleteSchool = (schoolId) =>
  request("DELETE", `/superadmin/schools/${schoolId}`);

// ─────────────────────────────────────────────────────────────────────────────
// LICENSES
// ─────────────────────────────────────────────────────────────────────────────
export const getLicenses = ({ page = 1, limit = 10, search = "", status = "" } = {}) =>
  request("GET", "/superadmin/licenses", undefined, { page, limit, search, status });

export const updateLicense = (schoolId, payload) =>
  request("PUT", `/superadmin/licenses/${schoolId}`, payload);

export const renewLicense = (licenseId, payload) =>
  request("PUT", `/superadmin/licenses/${licenseId}/renew`, payload);

// ─────────────────────────────────────────────────────────────────────────────
// FINANCE
// ─────────────────────────────────────────────────────────────────────────────
export const getFinanceSummary = () =>
  request("GET", "/superadmin/finance/summary");

export const getRecentPayments = ({ page = 1, limit = 10, search = "" } = {}) =>
  request("GET", "/superadmin/finance/payments", undefined, { page, limit, search });

// ─────────────────────────────────────────────────────────────────────────────
// USERS
// ─────────────────────────────────────────────────────────────────────────────
export const getUsers = ({ page = 1, limit = 10, search = "", role = "" } = {}) =>
  request("GET", "/superadmin/users", undefined, { page, limit, search, role });

export const toggleUserActive = (userId, is_active) =>
  request("PATCH", `/superadmin/users/${userId}/toggle-active`, { is_active });

export default {
  getDashboardMetrics,
  getSchools,
  getSchoolById,
  createSchool,
  updateSchool,
  deleteSchool,
  getLicenses,
  updateLicense,
  renewLicense,
  getFinanceSummary,
  getRecentPayments,
  getUsers,
  toggleUserActive,
};
