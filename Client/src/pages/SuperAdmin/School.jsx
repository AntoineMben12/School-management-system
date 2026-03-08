import React, { useState, useEffect, useCallback } from "react";

import Sidebar from "./components/Sidebar";
import * as api from "../../services/superadminAPI";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const AVATAR_COLORS = [
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-red-600",
  "from-pink-500 to-rose-600",
  "from-cyan-500 to-blue-600",
  "from-violet-500 to-purple-600",
  "from-amber-500 to-yellow-600",
];
function avatarColor(id) {
  return AVATAR_COLORS[(id || 0) % AVATAR_COLORS.length];
}

function StatusBadge({ status }) {
  const map = {
    active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    expired: "bg-red-500/10 text-red-400 border-red-500/20",
    suspended: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };
  const cls =
    map[status] || "bg-slate-500/10 text-slate-400 border-slate-500/20";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${cls}`}
    >
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : "—"}
    </span>
  );
}

function PlanBadge({ plan }) {
  const map = {
    Enterprise: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    Premium: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Standard: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    Basic: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  };
  const cls = map[plan] || "bg-slate-500/10 text-slate-400 border-slate-500/20";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${cls}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {plan || "—"}
    </span>
  );
}

// ─── Add / Edit School Modal ──────────────────────────────────────────────────
function SchoolModal({ onClose, onSaved, initial = null }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(
    isEdit
      ? {
          name: initial.name || "",
          address: initial.address || "",
          contact_email: initial.contact_email || "",
          type: initial.type || "secondary",
          subdomain: initial.subdomain || "",
          admin_email: initial.admin_email || "",
          admin_password: "",
          plan_name: initial.plan_name || "Basic",
          max_students: initial.max_students || 500,
        }
      : {
          name: "",
          address: "",
          contact_email: "",
          type: "secondary",
          subdomain: "",
          admin_email: "",
          admin_password: "",
          plan_name: "Basic",
          max_students: 500,
        },
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.contact_email) {
      setError("School name and contact email are required.");
      return;
    }
    if (!isEdit && (!form.admin_email || !form.admin_password)) {
      setError("Admin email and password are required for new schools.");
      return;
    }
    setSaving(true);
    try {
      if (isEdit) {
        await api.updateSchool(initial.school_id, {
          name: form.name,
          address: form.address,
          contact_email: form.contact_email,
          type: form.type,
          subdomain: form.subdomain || null,
        });
      } else {
        await api.createSchool({
          school: {
            name: form.name,
            address: form.address,
            contact_email: form.contact_email,
            type: form.type,
            subdomain: form.subdomain || null,
          },
          license: {
            plan_name: form.plan_name,
            max_students: parseInt(form.max_students),
          },
          admin: {
            username: form.admin_email.split("@")[0],
            email: form.admin_email,
            password: form.admin_password,
          },
        });
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.message || "Operation failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1a1625] rounded-2xl border border-white/10 shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-lg">
              <span className="material-symbols-outlined text-primary text-[20px]">
                {isEdit ? "edit" : "add_circle"}
              </span>
            </div>
            <h2 className="text-white font-bold text-lg">
              {isEdit ? "Edit School" : "Add New School"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">
                error
              </span>
              {error}
            </div>
          )}

          {/* School Details */}
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
            School Details
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 flex flex-col gap-1.5">
              <label className="text-sm text-slate-300 font-medium">
                School Name <span className="text-red-400">*</span>
              </label>
              <input
                className="bg-[#2e2839] rounded-lg px-4 py-2.5 text-white text-sm outline-none border border-transparent focus:border-primary transition-all placeholder-slate-500"
                placeholder="e.g. Springfield High School"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-slate-300 font-medium">
                Contact Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                className="bg-[#2e2839] rounded-lg px-4 py-2.5 text-white text-sm outline-none border border-transparent focus:border-primary transition-all placeholder-slate-500"
                placeholder="school@edu.com"
                value={form.contact_email}
                onChange={(e) => set("contact_email", e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-slate-300 font-medium">
                School Type
              </label>
              <select
                className="bg-[#2e2839] rounded-lg px-4 py-2.5 text-white text-sm outline-none border border-transparent focus:border-primary transition-all cursor-pointer"
                value={form.type}
                onChange={(e) => set("type", e.target.value)}
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="university">University</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-slate-300 font-medium">
                Subdomain
              </label>
              <input
                className="bg-[#2e2839] rounded-lg px-4 py-2.5 text-white text-sm outline-none border border-transparent focus:border-primary transition-all placeholder-slate-500"
                placeholder="e.g. springfield"
                value={form.subdomain}
                onChange={(e) => set("subdomain", e.target.value)}
              />
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <label className="text-sm text-slate-300 font-medium">
                Address
              </label>
              <input
                className="bg-[#2e2839] rounded-lg px-4 py-2.5 text-white text-sm outline-none border border-transparent focus:border-primary transition-all placeholder-slate-500"
                placeholder="City, Country"
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
              />
            </div>
          </div>

          {/* License — only for new school */}
          {!isEdit && (
            <>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mt-2">
                License
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-slate-300 font-medium">
                    Plan
                  </label>
                  <select
                    className="bg-[#2e2839] rounded-lg px-4 py-2.5 text-white text-sm outline-none border border-transparent focus:border-primary transition-all cursor-pointer"
                    value={form.plan_name}
                    onChange={(e) => set("plan_name", e.target.value)}
                  >
                    <option>Basic</option>
                    <option>Standard</option>
                    <option>Premium</option>
                    <option>Enterprise</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-slate-300 font-medium">
                    Max Students
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="bg-[#2e2839] rounded-lg px-4 py-2.5 text-white text-sm outline-none border border-transparent focus:border-primary transition-all"
                    value={form.max_students}
                    onChange={(e) => set("max_students", e.target.value)}
                  />
                </div>
              </div>

              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mt-2">
                Admin Account
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-slate-300 font-medium">
                    Admin Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    className="bg-[#2e2839] rounded-lg px-4 py-2.5 text-white text-sm outline-none border border-transparent focus:border-primary transition-all placeholder-slate-500"
                    placeholder="admin@school.edu"
                    value={form.admin_email}
                    onChange={(e) => set("admin_email", e.target.value)}
                    required={!isEdit}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-slate-300 font-medium">
                    Password <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="password"
                    className="bg-[#2e2839] rounded-lg px-4 py-2.5 text-white text-sm outline-none border border-transparent focus:border-primary transition-all placeholder-slate-500"
                    placeholder="Min 6 characters"
                    value={form.admin_password}
                    onChange={(e) => set("admin_password", e.target.value)}
                    required={!isEdit}
                  />
                </div>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-2 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 text-sm font-medium transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-semibold shadow-lg shadow-primary/20 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">
                    refresh
                  </span>
                  Saving…
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">
                    {isEdit ? "save" : "add"}
                  </span>
                  {isEdit ? "Save Changes" : "Create School"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
function School() {
  const [schools, setSchools] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState(null); // null | { mode: 'add' } | { mode: 'edit', school }
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchSchools = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const data = await api.getSchools({
          page,
          limit: pagination.limit,
          search,
          status: statusFilter,
        });
        setSchools(data.data || []);
        setPagination((p) => ({ ...p, ...(data.pagination || {}), page }));
      } catch {
        setSchools([]);
      } finally {
        setLoading(false);
      }
    },
    [search, statusFilter, pagination.limit],
  );

  useEffect(() => {
    fetchSchools(1);
  }, [search, statusFilter]);

  const handleDelete = async (school) => {
    if (
      !window.confirm(`Delete "${school.name}"? This action cannot be undone.`)
    )
      return;
    try {
      await api.deleteSchool(school.school_id);
      showToast("School deleted successfully.");
      fetchSchools(pagination.page);
    } catch (err) {
      showToast(err.message || "Failed to delete school.", "error");
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-dark">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 shrink-0 flex items-center justify-between px-8 border-b border-white/5 bg-background-dark/80 backdrop-blur-md z-10">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              School Management
            </h2>
            <p className="text-slate-500 text-xs">
              Manage and view all registered schools in the platform.
            </p>
          </div>
          <button
            onClick={() => setModal({ mode: "add" })}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white text-sm font-semibold py-2 px-4 rounded-lg shadow-lg shadow-primary/20 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add School
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-5">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="flex gap-3 flex-wrap">
                {/* Search */}
                <div className="relative">
                  <span className="material-symbols-outlined text-slate-400 text-[18px] absolute left-3 top-2.5 pointer-events-none">
                    search
                  </span>
                  <input
                    className="bg-surface-dark border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary/50 w-60"
                    placeholder="Search schools…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                {/* Status filter */}
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none bg-surface-dark border border-white/10 text-white text-sm rounded-lg pl-3 pr-8 py-2 focus:ring-1 focus:ring-primary cursor-pointer"
                  >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="suspended">Suspended</option>
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-slate-400">
                    <span className="material-symbols-outlined text-[16px]">
                      expand_more
                    </span>
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                {loading
                  ? "Loading…"
                  : `${pagination.total} school${pagination.total !== 1 ? "s" : ""} found`}
              </p>
            </div>

            {/* Table */}
            <div className="bg-surface-dark rounded-xl border border-white/5 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02]">
                      <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        School
                      </th>
                      <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Plan
                      </th>
                      <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">
                        Students
                      </th>
                      <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">
                        Status
                      </th>
                      <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">
                        Expires
                      </th>
                      <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {loading ? (
                      Array.from({ length: 6 }).map((_, i) => (
                        <tr key={i}>
                          {Array.from({ length: 8 }).map((__, j) => (
                            <td key={j} className="p-4">
                              <div className="h-4 bg-white/10 rounded animate-pulse" />
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : schools.length === 0 ? (
                      <tr>
                        <td
                          colSpan={8}
                          className="p-16 text-center text-slate-500"
                        >
                          <span className="material-symbols-outlined text-5xl block mb-3 opacity-20">
                            domain_disabled
                          </span>
                          <p className="font-medium">No schools found</p>
                          {search && (
                            <p className="text-sm mt-1">
                              Try clearing the search or filter.
                            </p>
                          )}
                          <button
                            onClick={() => setModal({ mode: "add" })}
                            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-all"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              add
                            </span>
                            Add your first school
                          </button>
                        </td>
                      </tr>
                    ) : (
                      schools.map((school) => (
                        <tr
                          key={school.school_id}
                          className="group hover:bg-white/[0.025] transition-colors"
                        >
                          {/* School */}
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`size-9 rounded-lg bg-gradient-to-br ${avatarColor(school.school_id)} flex items-center justify-center text-white text-xs font-bold shrink-0`}
                              >
                                {getInitials(school.name)}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-white">
                                  {school.name}
                                </p>
                                <p className="text-xs text-slate-500">
                                  #{String(school.school_id).padStart(4, "0")}
                                  {school.subdomain
                                    ? ` · ${school.subdomain}`
                                    : ""}
                                </p>
                              </div>
                            </div>
                          </td>
                          {/* Contact */}
                          <td className="p-4">
                            <p className="text-sm text-slate-200">
                              {school.admin_name || "—"}
                            </p>
                            <p className="text-xs text-slate-500 truncate max-w-[160px]">
                              {school.admin_email || school.contact_email}
                            </p>
                          </td>
                          {/* Type */}
                          <td className="p-4">
                            <span className="text-sm text-slate-300 capitalize">
                              {school.type || "—"}
                            </span>
                          </td>
                          {/* Plan */}
                          <td className="p-4">
                            <PlanBadge plan={school.plan_name} />
                          </td>
                          {/* Students */}
                          <td className="p-4 text-right text-sm text-slate-300 font-mono">
                            {Number(school.student_count || 0).toLocaleString()}
                            {school.max_students ? (
                              <span className="text-slate-600">
                                /{Number(school.max_students).toLocaleString()}
                              </span>
                            ) : null}
                          </td>
                          {/* Status */}
                          <td className="p-4 text-center">
                            <StatusBadge status={school.license_status} />
                          </td>
                          {/* Expires */}
                          <td className="p-4 text-right text-sm text-slate-400">
                            {school.end_date
                              ? new Date(school.end_date).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  },
                                )
                              : "—"}
                          </td>
                          {/* Actions */}
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() =>
                                  setModal({ mode: "edit", school })
                                }
                                title="Edit School"
                                className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                              >
                                <span className="material-symbols-outlined text-[18px]">
                                  edit
                                </span>
                              </button>
                              <button
                                onClick={() => handleDelete(school)}
                                title="Delete School"
                                className="p-1.5 rounded-md hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                              >
                                <span className="material-symbols-outlined text-[18px]">
                                  delete
                                </span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-white/5 bg-white/[0.01]">
                <p className="text-xs text-slate-500">
                  Showing{" "}
                  <span className="text-white font-medium">
                    {pagination.total === 0
                      ? 0
                      : (pagination.page - 1) * pagination.limit + 1}
                    –
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total,
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="text-white font-medium">
                    {pagination.total}
                  </span>{" "}
                  schools
                </p>
                <div className="flex items-center gap-1">
                  <button
                    disabled={pagination.page <= 1 || loading}
                    onClick={() => fetchSchools(pagination.page - 1)}
                    className="p-1.5 rounded hover:bg-white/10 text-slate-400 disabled:opacity-30 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      chevron_left
                    </span>
                  </button>
                  {Array.from(
                    { length: pagination.totalPages || 1 },
                    (_, i) => i + 1,
                  )
                    .filter(
                      (p) =>
                        p === 1 ||
                        p === pagination.totalPages ||
                        Math.abs(p - pagination.page) <= 1,
                    )
                    .reduce((acc, p, idx, arr) => {
                      if (idx > 0 && p - arr[idx - 1] > 1) acc.push("…");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) =>
                      p === "…" ? (
                        <span
                          key={`dot-${i}`}
                          className="px-1 text-slate-600 text-sm"
                        >
                          …
                        </span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => fetchSchools(p)}
                          disabled={loading}
                          className={`size-7 rounded text-xs font-medium transition-colors ${
                            p === pagination.page
                              ? "bg-primary text-white shadow-sm"
                              : "hover:bg-white/10 text-slate-400"
                          }`}
                        >
                          {p}
                        </button>
                      ),
                    )}
                  <button
                    disabled={
                      pagination.page >= (pagination.totalPages || 1) || loading
                    }
                    onClick={() => fetchSchools(pagination.page + 1)}
                    className="p-1.5 rounded hover:bg-white/10 text-slate-400 disabled:opacity-30 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      chevron_right
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <SchoolModal
          onClose={() => setModal(null)}
          initial={modal.mode === "edit" ? modal.school : null}
          onSaved={() => {
            fetchSchools(pagination.page);
            showToast(
              modal.mode === "edit"
                ? "School updated successfully."
                : "School created successfully.",
            );
          }}
        />
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border text-sm font-medium ${
            toast.type === "error"
              ? "bg-red-500/10 border-red-500/20 text-red-400"
              : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {toast.type === "error" ? "error" : "check_circle"}
          </span>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

export default School;
