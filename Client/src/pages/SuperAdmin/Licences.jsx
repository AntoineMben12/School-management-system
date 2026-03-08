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
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cls}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
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

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const diff = Math.ceil(
    (new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24),
  );
  return diff;
}

function RenewalCell({ endDate }) {
  const days = daysUntil(endDate);
  if (days === null) return <span className="text-slate-500">—</span>;
  const formatted = new Date(endDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  if (days < 0)
    return (
      <span className="text-red-400 text-sm font-medium">
        {formatted} (Expired)
      </span>
    );
  if (days <= 30)
    return (
      <span className="text-amber-400 text-sm font-medium">
        {formatted}
        <span className="block text-xs text-amber-500/70">
          {days}d remaining
        </span>
      </span>
    );
  return <span className="text-slate-400 text-sm">{formatted}</span>;
}

// ─── Renew / Edit Modal ───────────────────────────────────────────────────────
function LicenseModal({ license, onClose, onSaved }) {
  const oneYearOut = new Date(Date.now() + 365 * 24 * 3600 * 1000)
    .toISOString()
    .split("T")[0];

  const [form, setForm] = useState({
    plan_name: license.plan_name || "Basic",
    end_date: license.end_date ? license.end_date.split("T")[0] : oneYearOut,
    max_students: license.max_students || 500,
    status: license.status || "active",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.end_date) {
      setError("End date is required.");
      return;
    }
    setSaving(true);
    try {
      await api.updateLicense(license.school_id, {
        plan_name: form.plan_name,
        end_date: form.end_date,
        max_students: parseInt(form.max_students),
        status: form.status,
      });
      onSaved();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to update license.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1a1625] rounded-2xl border border-white/10 shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-lg">
              <span className="material-symbols-outlined text-primary text-[20px]">
                verified_user
              </span>
            </div>
            <div>
              <h2 className="text-white font-bold text-base">Edit License</h2>
              <p className="text-slate-500 text-xs truncate max-w-[200px]">
                {license.school_name}
              </p>
            </div>
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

          {/* Plan */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-slate-300 font-medium">
              Plan / Tier
            </label>
            <div className="grid grid-cols-2 gap-2">
              {["Basic", "Standard", "Premium", "Enterprise"].map((plan) => (
                <label key={plan} className="cursor-pointer">
                  <input
                    type="radio"
                    name="plan"
                    className="sr-only peer"
                    checked={form.plan_name === plan}
                    onChange={() => set("plan_name", plan)}
                  />
                  <div className="flex items-center gap-2 p-3 rounded-xl border border-white/10 bg-[#2e2839]/50 peer-checked:border-primary peer-checked:bg-primary/10 hover:bg-[#2e2839] transition-all cursor-pointer">
                    <span className="text-sm font-medium text-white">
                      {plan}
                    </span>
                    <span className="material-symbols-outlined text-primary text-[16px] ml-auto opacity-0 peer-checked:opacity-100">
                      check_circle
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* End Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-slate-300 font-medium">
              Expiry Date <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              className="bg-[#2e2839] rounded-lg px-4 py-2.5 text-white text-sm outline-none border border-transparent focus:border-primary transition-all"
              value={form.end_date}
              onChange={(e) => set("end_date", e.target.value)}
              required
            />
          </div>

          {/* Max Students */}
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

          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-slate-300 font-medium">Status</label>
            <div className="relative">
              <select
                className="w-full bg-[#2e2839] rounded-lg px-4 py-2.5 text-white text-sm outline-none border border-transparent focus:border-primary transition-all cursor-pointer appearance-none"
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
              >
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="suspended">Suspended</option>
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                <span className="material-symbols-outlined text-[16px]">
                  expand_more
                </span>
              </span>
            </div>
          </div>

          {/* Quick renew buttons */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-slate-300 font-medium">
              Quick Extend
            </label>
            <div className="flex gap-2">
              {[
                { label: "+6 mo", months: 6 },
                { label: "+1 yr", months: 12 },
                { label: "+2 yr", months: 24 },
              ].map(({ label, months }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    const base =
                      form.end_date && new Date(form.end_date) > new Date()
                        ? new Date(form.end_date)
                        : new Date();
                    base.setMonth(base.getMonth() + months);
                    set("end_date", base.toISOString().split("T")[0]);
                  }}
                  className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-medium transition-all border border-white/10 hover:border-primary/30"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

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
                    save
                  </span>
                  Save License
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
function Licences() {
  const [licenses, setLicenses] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const [editLicense, setEditLicense] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchLicenses = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const data = await api.getLicenses({
          page,
          limit: pagination.limit,
          search,
          status: statusFilter,
        });
        setLicenses(data.data || []);
        setPagination((p) => ({ ...p, ...(data.pagination || {}), page }));
      } catch {
        setLicenses([]);
      } finally {
        setLoading(false);
      }
    },
    [search, statusFilter, pagination.limit],
  );

  useEffect(() => {
    fetchLicenses(1);
  }, [search, statusFilter]);

  // ── Summary counts ──
  const active = licenses.filter((l) => l.status === "active").length;
  const expired = licenses.filter((l) => l.status === "expired").length;
  const expiringSoon = licenses.filter((l) => {
    const d = daysUntil(l.end_date);
    return d !== null && d >= 0 && d <= 30;
  }).length;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-dark">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 shrink-0 flex items-center justify-between px-8 border-b border-white/5 bg-background-dark/80 backdrop-blur-md z-10">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              License Management
            </h2>
            <p className="text-slate-500 text-xs">
              Manage subscription licenses for all registered schools.
            </p>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* ── Summary cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  label: "Active Licenses",
                  value: loading ? null : active,
                  icon: "verified_user",
                  color: "text-emerald-400",
                  bg: "bg-emerald-500/10",
                },
                {
                  label: "Expired Licenses",
                  value: loading ? null : expired,
                  icon: "warning",
                  color: "text-red-400",
                  bg: "bg-red-500/10",
                },
                {
                  label: "Expiring Soon (≤30d)",
                  value: loading ? null : expiringSoon,
                  icon: "schedule",
                  color: "text-amber-400",
                  bg: "bg-amber-500/10",
                },
              ].map(({ label, value, icon, color, bg }) => (
                <div
                  key={label}
                  className="bg-surface-dark rounded-xl p-5 border border-white/5 flex items-center gap-4"
                >
                  <div className={`${bg} p-3 rounded-xl`}>
                    <span
                      className={`material-symbols-outlined ${color} text-[24px]`}
                    >
                      {icon}
                    </span>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">{label}</p>
                    {value === null ? (
                      <div className="h-7 w-12 bg-white/10 rounded animate-pulse mt-1" />
                    ) : (
                      <p className={`text-2xl font-bold ${color}`}>{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* ── Filters ── */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="flex gap-3 flex-wrap">
                {/* Search */}
                <div className="relative">
                  <span className="material-symbols-outlined text-slate-400 text-[18px] absolute left-3 top-2.5 pointer-events-none">
                    search
                  </span>
                  <input
                    className="bg-surface-dark border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary/50 w-60"
                    placeholder="Search schools or plans…"
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
                  : `${pagination.total} license${pagination.total !== 1 ? "s" : ""} found`}
              </p>
            </div>

            {/* ── Table ── */}
            <div className="bg-surface-dark rounded-xl border border-white/5 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02]">
                      <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        School
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
                      <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Start Date
                      </th>
                      <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Expiry
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
                          {Array.from({ length: 7 }).map((__, j) => (
                            <td key={j} className="p-4">
                              <div className="h-4 bg-white/10 rounded animate-pulse" />
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : licenses.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="p-16 text-center text-slate-500"
                        >
                          <span className="material-symbols-outlined text-5xl block mb-3 opacity-20">
                            verified_user
                          </span>
                          <p className="font-medium">No licenses found</p>
                          {search && (
                            <p className="text-sm mt-1">
                              Try clearing the search or filter.
                            </p>
                          )}
                        </td>
                      </tr>
                    ) : (
                      licenses.map((lic) => (
                        <tr
                          key={lic.license_id}
                          className="group hover:bg-white/[0.025] transition-colors"
                        >
                          {/* School */}
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`size-9 rounded-lg bg-gradient-to-br ${avatarColor(lic.school_id)} flex items-center justify-center text-white text-xs font-bold shrink-0`}
                              >
                                {getInitials(lic.school_name || "")}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-white">
                                  {lic.school_name}
                                </p>
                                <p className="text-xs text-slate-500 truncate max-w-[160px]">
                                  {lic.school_email}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Plan */}
                          <td className="p-4">
                            <PlanBadge plan={lic.plan_name} />
                          </td>

                          {/* Students */}
                          <td className="p-4 text-right text-sm text-slate-300 font-mono">
                            {Number(lic.student_count || 0).toLocaleString()}
                            {lic.max_students ? (
                              <span className="text-slate-600">
                                /{Number(lic.max_students).toLocaleString()}
                              </span>
                            ) : null}
                          </td>

                          {/* Status */}
                          <td className="p-4 text-center">
                            <StatusBadge status={lic.status} />
                          </td>

                          {/* Start Date */}
                          <td className="p-4 text-sm text-slate-400">
                            {lic.start_date
                              ? new Date(lic.start_date).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  },
                                )
                              : "—"}
                          </td>

                          {/* Expiry */}
                          <td className="p-4">
                            <RenewalCell endDate={lic.end_date} />
                          </td>

                          {/* Actions */}
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => setEditLicense(lic)}
                                title="Edit / Renew License"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-xs font-medium transition-all"
                              >
                                <span className="material-symbols-outlined text-[16px]">
                                  edit
                                </span>
                                Edit
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
                  licenses
                </p>
                <div className="flex items-center gap-1">
                  <button
                    disabled={pagination.page <= 1 || loading}
                    onClick={() => fetchLicenses(pagination.page - 1)}
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
                          onClick={() => fetchLicenses(p)}
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
                    onClick={() => fetchLicenses(pagination.page + 1)}
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

      {/* Edit / Renew Modal */}
      {editLicense && (
        <LicenseModal
          license={editLicense}
          onClose={() => setEditLicense(null)}
          onSaved={() => {
            fetchLicenses(pagination.page);
            showToast("License updated successfully.");
          }}
        />
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border text-sm font-medium transition-all ${
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

export default Licences;
