import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import * as api from "../../services/superadminAPI";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getInitials(name = "") {
  return (
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?"
  );
}

function fmtDate(dateStr) {
  if (!dateStr) return "Never";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function timeAgo(dateStr) {
  if (!dateStr) return "Never";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (days > 30) return fmtDate(dateStr);
  if (days > 0) return `${days}d ago`;
  if (hrs > 0) return `${hrs}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return "Just now";
}

const ROLE_META = {
  super_admin: {
    label: "Super Admin",
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/20",
    icon: "shield",
  },
  school_admin: {
    label: "School Admin",
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/20",
    icon: "manage_accounts",
  },
  teacher: {
    label: "Teacher",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
    icon: "school",
  },
  student: {
    label: "Student",
    bg: "bg-sky-500/10",
    text: "text-sky-400",
    border: "border-sky-500/20",
    icon: "person",
  },
  parent: {
    label: "Parent",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/20",
    icon: "family_restroom",
  },
  accountant: {
    label: "Accountant",
    bg: "bg-orange-500/10",
    text: "text-orange-400",
    border: "border-orange-500/20",
    icon: "calculate",
  },
};

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

// ─── Role Badge ───────────────────────────────────────────────────────────────
function RoleBadge({ role }) {
  const meta = ROLE_META[role] || {
    label: role || "Unknown",
    bg: "bg-slate-500/10",
    text: "text-slate-400",
    border: "border-slate-500/20",
    icon: "person",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${meta.bg} ${meta.text} ${meta.border}`}
    >
      <span className="material-symbols-outlined text-[14px]">{meta.icon}</span>
      {meta.label}
    </span>
  );
}

// ─── Status Toggle ────────────────────────────────────────────────────────────
function ActiveToggle({ isActive, userId, onToggled, disabled }) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (loading || disabled) return;
    setLoading(true);
    try {
      await api.toggleUserActive(userId, !isActive);
      onToggled(!isActive);
    } catch {
      // silent fail — parent will show toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading || disabled}
      title={isActive ? "Deactivate user" : "Activate user"}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-40 ${
        isActive ? "bg-primary" : "bg-white/20"
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${
          isActive ? "translate-x-[18px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  );
}

// ─── User Detail Drawer ───────────────────────────────────────────────────────
function UserDrawer({ user, onClose, onStatusChanged }) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      {/* Panel */}
      <div className="w-full max-w-sm bg-[#1a1625] border-l border-white/10 shadow-2xl flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="text-white font-bold text-base">User Details</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Avatar + Name */}
        <div className="px-6 py-6 flex flex-col items-center gap-3 border-b border-white/5">
          <div
            className={`size-16 rounded-2xl bg-gradient-to-br ${avatarColor(user.user_id)} flex items-center justify-center text-white text-xl font-bold shadow-lg`}
          >
            {getInitials(user.username)}
          </div>
          <div className="text-center">
            <p className="text-white font-semibold text-lg">{user.username}</p>
            <p className="text-slate-400 text-sm">{user.email}</p>
          </div>
          <RoleBadge role={user.role} />
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`text-xs font-medium ${user.is_active ? "text-emerald-400" : "text-red-400"}`}
            >
              {user.is_active ? "Active" : "Inactive"}
            </span>
            <ActiveToggle
              isActive={!!user.is_active}
              userId={user.user_id}
              onToggled={(newState) => onStatusChanged(user.user_id, newState)}
              disabled={user.role === "super_admin"}
            />
          </div>
          {user.role === "super_admin" && (
            <p className="text-xs text-slate-600 text-center">
              Super admin accounts cannot be deactivated here.
            </p>
          )}
        </div>

        {/* Info rows */}
        <div className="px-6 py-5 flex flex-col gap-4">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
            Account Info
          </p>

          {[
            {
              icon: "apartment",
              label: "School",
              value: user.school_name || "—",
            },
            {
              icon: "badge",
              label: "User ID",
              value: `#${String(user.user_id).padStart(4, "0")}`,
            },
            {
              icon: "calendar_today",
              label: "Registered",
              value: fmtDate(user.created_at),
            },
            {
              icon: "login",
              label: "Last Login",
              value: timeAgo(user.last_login),
            },
          ].map(({ icon, label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-slate-400 text-[18px]">
                  {icon}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-slate-500 text-xs">{label}</p>
                <p className="text-white text-sm font-medium truncate">
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
function Users() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 1,
  });
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedUser, setSelectedUser] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchUsers = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const data = await api.getUsers({
          page,
          limit: pagination.limit,
          search,
          role: roleFilter,
        });
        setUsers(data.data || []);
        setPagination((p) => ({ ...p, ...(data.pagination || {}), page }));
      } catch {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    },
    [search, roleFilter, pagination.limit],
  );

  useEffect(() => {
    fetchUsers(1);
  }, [search, roleFilter, fetchUsers]);

  // ── Status changed (from drawer or inline toggle) ─────────────────────────
  const handleStatusChanged = (userId, newState) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.user_id === userId ? { ...u, is_active: newState } : u,
      ),
    );
    if (selectedUser?.user_id === userId) {
      setSelectedUser((u) => ({ ...u, is_active: newState }));
    }
    showToast(
      `User ${newState ? "activated" : "deactivated"} successfully.`,
      "success",
    );
  };

  // ── Role counts for summary ───────────────────────────────────────────────
  const roleCounts = users.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {});

  const topRoles = Object.entries(ROLE_META)
    .filter(([role]) => role !== "super_admin")
    .map(([role, meta]) => ({
      role,
      meta,
      count: roleCounts[role] || 0,
    }));

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-dark">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* ── Header ── */}
        <header className="h-16 shrink-0 flex items-center justify-between px-8 border-b border-white/5 bg-background-dark/80 backdrop-blur-md z-10">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              User Management
            </h2>
            <p className="text-slate-500 text-xs">
              View and manage all platform users across every school.
            </p>
          </div>
        </header>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* ── Stats summary cards ── */}
            {!loading && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  {
                    label: "Total Users",
                    value: pagination.total,
                    icon: "group",
                    iconBg: "bg-primary/10",
                    iconColor: "text-primary",
                    border: "border-primary/10",
                  },
                  {
                    label: "Active",
                    value: users.filter((u) => u.is_active).length,
                    icon: "check_circle",
                    iconBg: "bg-emerald-500/10",
                    iconColor: "text-emerald-400",
                    border: "border-emerald-500/10",
                    suffix: users.length
                      ? ` (${Math.round((users.filter((u) => u.is_active).length / users.length) * 100)}%)`
                      : "",
                  },
                  {
                    label: "Inactive",
                    value: users.filter((u) => !u.is_active).length,
                    icon: "cancel",
                    iconBg: "bg-red-500/10",
                    iconColor: "text-red-400",
                    border: "border-red-500/10",
                  },
                  {
                    label: "Schools",
                    value: new Set(
                      users.map((u) => u.school_id).filter(Boolean),
                    ).size,
                    icon: "domain",
                    iconBg: "bg-blue-500/10",
                    iconColor: "text-blue-400",
                    border: "border-blue-500/10",
                    note: "on this page",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className={`bg-surface-dark rounded-xl border ${stat.border} p-4 flex items-center gap-3`}
                  >
                    <div
                      className={`size-9 rounded-lg ${stat.iconBg} flex items-center justify-center shrink-0`}
                    >
                      <span
                        className={`material-symbols-outlined text-[20px] ${stat.iconColor}`}
                      >
                        {stat.icon}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-lg font-bold leading-none">
                        {stat.value.toLocaleString()}
                        {stat.suffix && (
                          <span className="text-xs font-normal text-slate-500 ml-1">
                            {stat.suffix}
                          </span>
                        )}
                      </p>
                      <p className="text-slate-500 text-xs mt-0.5">
                        {stat.label}
                      </p>
                      {stat.note && (
                        <p className="text-slate-600 text-[10px] mt-0.5">
                          {stat.note}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── Role summary chips ── */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setRoleFilter("")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  roleFilter === ""
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "bg-surface-dark text-slate-400 border-white/10 hover:border-white/20 hover:text-white"
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">
                  people
                </span>
                All Users
                {!loading && (
                  <span className="bg-white/10 px-1.5 py-0.5 rounded-full text-[10px]">
                    {pagination.total}
                  </span>
                )}
              </button>
              {topRoles.map(({ role, meta, count }) => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(roleFilter === role ? "" : role)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    roleFilter === role
                      ? `${meta.bg} ${meta.text} ${meta.border}`
                      : "bg-surface-dark text-slate-400 border-white/10 hover:border-white/20 hover:text-white"
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {meta.icon}
                  </span>
                  {meta.label}
                  {!loading && (
                    <span className="bg-white/10 px-1.5 py-0.5 rounded-full text-[10px]">
                      {count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* ── Filters bar ── */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="flex gap-3 flex-wrap">
                {/* Search */}
                <div className="relative">
                  <span className="material-symbols-outlined text-slate-400 text-[18px] absolute left-3 top-2.5 pointer-events-none">
                    search
                  </span>
                  <input
                    className="bg-surface-dark border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary/50 w-64"
                    placeholder="Search by name or email…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        close
                      </span>
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <p className="text-xs text-slate-500">
                  {loading
                    ? "Loading…"
                    : `${pagination.total} user${pagination.total !== 1 ? "s" : ""} found`}
                </p>
                {/* CSV Export */}
                <button
                  disabled={loading || users.length === 0}
                  onClick={() => {
                    const headers = [
                      "ID",
                      "Name",
                      "Email",
                      "Role",
                      "School",
                      "Joined",
                      "Last Login",
                      "Active",
                    ];
                    const rows = users.map((u) => [
                      u.user_id,
                      `"${u.username}"`,
                      u.email,
                      u.role,
                      `"${u.school_name || ""}"`,
                      u.created_at
                        ? new Date(u.created_at).toLocaleDateString()
                        : "",
                      u.last_login
                        ? new Date(u.last_login).toLocaleDateString()
                        : "",
                      u.is_active ? "Yes" : "No",
                    ]);
                    const csv = [headers, ...rows]
                      .map((r) => r.join(","))
                      .join("\n");
                    const blob = new Blob([csv], { type: "text/csv" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `users-export-${new Date().toISOString().slice(0, 10)}.csv`;
                    a.click();
                    URL.revokeObjectURL(url);
                    showToast("Users exported to CSV.");
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-dark border border-white/10 hover:border-white/20 text-slate-400 hover:text-white text-xs font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Export current page to CSV"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    download
                  </span>
                  Export CSV
                </button>
              </div>
            </div>

            {/* ── Table ── */}
            <div className="bg-surface-dark rounded-xl border border-white/5 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02]">
                      {[
                        { label: "User", align: "left" },
                        { label: "Role", align: "left" },
                        { label: "School", align: "left" },
                        { label: "Joined", align: "left" },
                        { label: "Last Login", align: "left" },
                        { label: "Active", align: "center" },
                        { label: "Details", align: "right" },
                      ].map((col) => (
                        <th
                          key={col.label}
                          className={`p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider ${
                            col.align === "center"
                              ? "text-center"
                              : col.align === "right"
                                ? "text-right"
                                : ""
                          }`}
                        >
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {loading ? (
                      Array.from({ length: 8 }).map((_, i) => (
                        <tr key={i}>
                          {Array.from({ length: 7 }).map((__, j) => (
                            <td key={j} className="p-4">
                              <div className="h-4 bg-white/10 rounded animate-pulse" />
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : users.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="p-16 text-center text-slate-500"
                        >
                          <span className="material-symbols-outlined text-5xl block mb-3 opacity-20">
                            group_off
                          </span>
                          <p className="font-medium">No users found</p>
                          {(search || roleFilter) && (
                            <p className="text-sm mt-1">
                              Try clearing the search or role filter.
                            </p>
                          )}
                          <button
                            onClick={() => {
                              setSearch("");
                              setRoleFilter("");
                            }}
                            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-sm font-medium transition-all border border-white/10"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              clear
                            </span>
                            Clear filters
                          </button>
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr
                          key={user.user_id}
                          className="group hover:bg-white/[0.025] transition-colors cursor-pointer"
                          onClick={() => setSelectedUser(user)}
                        >
                          {/* User */}
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`size-9 rounded-lg bg-gradient-to-br ${avatarColor(user.user_id)} flex items-center justify-center text-white text-xs font-bold shrink-0 relative`}
                              >
                                {getInitials(user.username)}
                                {/* Online indicator */}
                                <span
                                  className={`absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-surface-dark ${
                                    user.is_active
                                      ? "bg-emerald-400"
                                      : "bg-slate-600"
                                  }`}
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-white truncate max-w-[160px]">
                                  {user.username}
                                </p>
                                <p className="text-xs text-slate-500 truncate max-w-[160px]">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Role */}
                          <td className="p-4">
                            <RoleBadge role={user.role} />
                          </td>

                          {/* School */}
                          <td className="p-4">
                            {user.school_name ? (
                              <div>
                                <p className="text-sm text-white truncate max-w-[160px]">
                                  {user.school_name}
                                </p>
                                <p className="text-xs text-slate-600">
                                  #{String(user.school_id).padStart(4, "0")}
                                </p>
                              </div>
                            ) : (
                              <span className="text-slate-600 text-sm">—</span>
                            )}
                          </td>

                          {/* Joined */}
                          <td className="p-4 text-sm text-slate-400">
                            {fmtDate(user.created_at)}
                          </td>

                          {/* Last Login */}
                          <td className="p-4">
                            <span
                              className={`text-sm ${
                                user.last_login
                                  ? "text-slate-300"
                                  : "text-slate-600"
                              }`}
                            >
                              {timeAgo(user.last_login)}
                            </span>
                          </td>

                          {/* Active toggle */}
                          <td
                            className="p-4 text-center"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ActiveToggle
                              isActive={!!user.is_active}
                              userId={user.user_id}
                              onToggled={(newState) =>
                                handleStatusChanged(user.user_id, newState)
                              }
                              disabled={user.role === "super_admin"}
                            />
                          </td>

                          {/* Details button */}
                          <td
                            className="p-4 text-right"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => setSelectedUser(user)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-medium ml-auto"
                            >
                              <span className="material-symbols-outlined text-[16px]">
                                open_in_new
                              </span>
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* ── Pagination ── */}
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
                  users
                </p>
                <div className="flex items-center gap-1">
                  <button
                    disabled={pagination.page <= 1 || loading}
                    onClick={() => fetchUsers(pagination.page - 1)}
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
                          onClick={() => fetchUsers(p)}
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
                    onClick={() => fetchUsers(pagination.page + 1)}
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

      {/* ── User Drawer ── */}
      {selectedUser && (
        <UserDrawer
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onStatusChanged={handleStatusChanged}
        />
      )}

      {/* ── Toast ── */}
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

export default Users;
