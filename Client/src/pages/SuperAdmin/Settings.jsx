import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { authAPI } from "../../services/api";

/* ─────────────────────────────────────────────────────────────────────────────
   REUSABLE PRIMITIVES
───────────────────────────────────────────────────────────────────────────── */

function SectionCard({ title, description, icon, children, danger = false }) {
  return (
    <div
      className={`rounded-xl border shadow-sm overflow-hidden ${danger ? "bg-surface-dark border-red-500/10" : "bg-surface-dark border-white/5"}`}
    >
      <div
        className={`flex items-center gap-3 px-6 py-4 border-b ${danger ? "border-red-500/10 bg-red-500/[0.02]" : "border-white/5 bg-white/[0.015]"}`}
      >
        <div
          className={`p-2 rounded-lg shrink-0 ${danger ? "bg-red-500/10" : "bg-primary/10"}`}
        >
          <span
            className={`material-symbols-outlined text-[20px] ${danger ? "text-red-400" : "text-primary"}`}
          >
            {icon}
          </span>
        </div>
        <div>
          <h3
            className={`font-semibold text-sm ${danger ? "text-red-300" : "text-white"}`}
          >
            {title}
          </h3>
          {description && (
            <p
              className={`text-xs mt-0.5 ${danger ? "text-red-500/60" : "text-slate-500"}`}
            >
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  mono = false,
  badge = null,
  copyable = false,
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(String(value)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 gap-4 min-w-0">
      <span className="text-slate-400 text-sm shrink-0">{label}</span>
      <div className="flex items-center gap-2 min-w-0">
        {badge && (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border shrink-0 ${badge.cls}`}
          >
            {badge.dot && (
              <span className="size-1.5 rounded-full bg-current animate-pulse" />
            )}
            {badge.text}
          </span>
        )}
        <span
          className={`text-sm text-right truncate max-w-[240px] ${mono ? "font-mono text-slate-300" : "text-white font-medium"}`}
        >
          {value ?? "—"}
        </span>
        {copyable && value && (
          <button
            onClick={handleCopy}
            title="Copy"
            className="text-slate-600 hover:text-slate-300 transition-colors shrink-0 ml-1"
          >
            <span className="material-symbols-outlined text-[15px]">
              {copied ? "check" : "content_copy"}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
  disabled = false,
}) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-white/5 last:border-0 gap-6">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white font-medium">{label}</p>
        {description && (
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <button
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        role="switch"
        aria-checked={checked}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none shrink-0 disabled:opacity-40 ${checked ? "bg-primary" : "bg-white/15"}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${checked ? "translate-x-6" : "translate-x-1"}`}
        />
      </button>
    </div>
  );
}

function HealthRow({ label, detail, status }) {
  const cfg = {
    ok: {
      dot: "bg-emerald-400",
      badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      label: "Operational",
    },
    warn: {
      dot: "bg-amber-400 animate-pulse",
      badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      label: "Degraded",
    },
    error: {
      dot: "bg-red-400 animate-pulse",
      badge: "bg-red-500/10 text-red-400 border-red-500/20",
      label: "Down",
    },
    loading: {
      dot: "bg-slate-500 animate-pulse",
      badge: "bg-white/5 text-slate-400 border-white/10",
      label: "Checking…",
    },
  }[status] ?? {
    dot: "bg-slate-500",
    badge: "bg-white/5 text-slate-400 border-white/10",
    label: "Unknown",
  };

  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-3">
        <span className={`size-2 rounded-full shrink-0 ${cfg.dot}`} />
        <div>
          <p className="text-sm text-white font-medium">{label}</p>
          {detail && <p className="text-xs text-slate-500">{detail}</p>}
        </div>
      </div>
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.badge}`}
      >
        {cfg.label}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CHANGE PASSWORD MODAL
───────────────────────────────────────────────────────────────────────────── */
function ChangePasswordModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [show, setShow] = useState({ old: false, new: false });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggleShow = (k) => setShow((s) => ({ ...s, [k]: !s[k] }));

  const strength =
    form.newPassword.length === 0
      ? null
      : form.newPassword.length < 6
        ? "weak"
        : form.newPassword.length < 10
          ? "fair"
          : "strong";

  const strengthCfg = {
    weak: {
      label: "Too short",
      color: "bg-red-400",
      bars: 1,
      text: "text-red-400",
    },
    fair: {
      label: "Fair",
      color: "bg-amber-400",
      bars: 2,
      text: "text-amber-400",
    },
    strong: {
      label: "Strong",
      color: "bg-emerald-400",
      bars: 4,
      text: "text-emerald-400",
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (form.newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (form.oldPassword === form.newPassword) {
      setError("New password must differ from the current one.");
      return;
    }
    setSaving(true);
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/auth/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            oldPassword: form.oldPassword,
            newPassword: form.newPassword,
          }),
        },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error(data.message || data.error?.message || "Failed");
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to change password.");
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { key: "oldPassword", label: "Current Password", showKey: "old" },
    { key: "newPassword", label: "New Password", showKey: "new" },
    { key: "confirmPassword", label: "Confirm New Password", showKey: "new" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#1a1625] rounded-2xl border border-white/10 shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <span className="material-symbols-outlined text-primary text-[20px]">
                lock_reset
              </span>
            </div>
            <h2 className="text-white font-bold text-base">Change Password</h2>
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

          {fields.map(({ key, label, showKey }) => (
            <div key={key} className="flex flex-col gap-1.5">
              <label className="text-sm text-slate-300 font-medium">
                {label}
              </label>
              <div className="relative">
                <input
                  type={show[showKey] ? "text" : "password"}
                  className="w-full bg-[#2e2839] rounded-lg px-4 py-2.5 pr-10 text-white text-sm outline-none border border-transparent focus:border-primary/60 transition-all placeholder-slate-600"
                  placeholder="••••••••"
                  value={form[key]}
                  onChange={(e) => set(key, e.target.value)}
                  required
                  autoComplete="off"
                />
                {key !== "confirmPassword" && (
                  <button
                    type="button"
                    onClick={() => toggleShow(showKey)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-300 transition-colors"
                    tabIndex={-1}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {show[showKey] ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                )}
              </div>
            </div>
          ))}

          {strength && (
            <div className="flex items-center gap-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
                    i < (strengthCfg[strength]?.bars ?? 0)
                      ? strengthCfg[strength]?.color
                      : "bg-white/10"
                  }`}
                />
              ))}
              <span
                className={`text-xs font-medium ml-1 ${strengthCfg[strength]?.text}`}
              >
                {strengthCfg[strength]?.label}
              </span>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2 border-t border-white/5 mt-1">
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
                    lock_reset
                  </span>
                  Update Password
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CONFIRM DIALOG
───────────────────────────────────────────────────────────────────────────── */
function ConfirmDialog({
  title,
  description,
  confirmLabel,
  onConfirm,
  onCancel,
  destructive = true,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#1a1625] rounded-2xl border border-white/10 shadow-2xl w-full max-w-sm p-6 flex flex-col gap-5">
        <div className="flex items-start gap-3">
          <div
            className={`p-2.5 rounded-xl shrink-0 ${destructive ? "bg-red-500/10" : "bg-amber-500/10"}`}
          >
            <span
              className={`material-symbols-outlined text-[22px] ${destructive ? "text-red-400" : "text-amber-400"}`}
            >
              warning
            </span>
          </div>
          <div>
            <h3 className="text-white font-bold text-base">{title}</h3>
            <p className="text-slate-400 text-sm mt-1 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 text-sm font-medium transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              destructive
                ? "bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30"
                : "bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ACTIVITY LOG  (static until a dedicated endpoint is added)
───────────────────────────────────────────────────────────────────────────── */
const ACTIVITY_LOG = [
  {
    icon: "login",
    colorText: "text-emerald-400",
    colorBg: "bg-emerald-500/10",
    action: "Signed in",
    detail: "Successful super admin authentication",
    ago: "4m ago",
  },
  {
    icon: "domain_add",
    colorText: "text-blue-400",
    colorBg: "bg-blue-500/10",
    action: "School created",
    detail: "New tenant provisioned via Create School wizard",
    ago: "38m ago",
  },
  {
    icon: "verified_user",
    colorText: "text-violet-400",
    colorBg: "bg-violet-500/10",
    action: "License renewed",
    detail: "Extended active license for an existing school",
    ago: "2h ago",
  },
  {
    icon: "toggle_off",
    colorText: "text-amber-400",
    colorBg: "bg-amber-500/10",
    action: "User deactivated",
    detail: "Account status changed to inactive",
    ago: "5h ago",
  },
  {
    icon: "lock_reset",
    colorText: "text-pink-400",
    colorBg: "bg-pink-500/10",
    action: "Password changed",
    detail: "Super admin account password updated",
    ago: "1d ago",
  },
  {
    icon: "settings",
    colorText: "text-slate-400",
    colorBg: "bg-white/5",
    action: "Preferences updated",
    detail: "Dashboard preferences saved to local storage",
    ago: "2d ago",
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */
function Settings() {
  const navigate = useNavigate();
  const user = authAPI.getCurrentUser();
  // Stable snapshot of "now" for the lifetime of this render cycle
  const [renderTime] = useState(() => Date.now());

  /* ── Preferences ─────────────────────────────────────────────────────────── */
  const [prefs, setPrefs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("sa_prefs") || "{}");
    } catch {
      return {};
    }
  });
  const setPref = (key, value) => {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    localStorage.setItem("sa_prefs", JSON.stringify(next));
  };

  /* ── UI state ────────────────────────────────────────────────────────────── */
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  /* ── System health ───────────────────────────────────────────────────────── */
  const [health, setHealth] = useState({
    api: "loading",
    database: "loading",
    auth: "loading",
    email: "loading",
  });

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/health`,
          { signal: AbortSignal.timeout(5000) },
        );
        const data = await res.json().catch(() => ({}));
        setHealth((h) => ({
          ...h,
          api: res.ok ? "ok" : "warn",
          database: data.status === "OK" ? "ok" : "warn",
        }));
      } catch {
        setHealth((h) => ({ ...h, api: "error", database: "error" }));
      }
      const token = localStorage.getItem("authToken");
      setHealth((h) => ({
        ...h,
        auth: token ? "ok" : "warn",
        email: h.api === "error" ? "warn" : "ok",
      }));
    };
    run();
  }, []);

  /* ── Token decode ────────────────────────────────────────────────────────── */
  const tokenInfo = (() => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return null;
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  })();

  const tokenExpiry = tokenInfo?.exp
    ? new Date(tokenInfo.exp * 1000).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Unknown";

  const _expiresInMs = tokenInfo?.exp
    ? tokenInfo.exp * 1000 - renderTime
    : null;
  const tokenExpired = _expiresInMs !== null && _expiresInMs <= 0;
  const tokenSoonExpiring =
    _expiresInMs !== null &&
    _expiresInMs > 0 &&
    _expiresInMs < 2 * 60 * 60 * 1000;
  const timeRemainingLabel = (() => {
    if (_expiresInMs === null) return "—";
    if (tokenExpired) return "Expired";
    const totalMins = Math.floor(_expiresInMs / 60000);
    const hrs = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    return hrs > 0 ? `${hrs}h ${mins}m` : `${totalMins}m`;
  })();

  /* ── Overall health summary ──────────────────────────────────────────────── */
  const overallHealth = Object.values(health).some((v) => v === "error")
    ? "error"
    : Object.values(health).some((v) => v === "warn" || v === "loading")
      ? "warn"
      : "ok";

  const healthPill = {
    ok: {
      label: "All Systems Operational",
      dot: "bg-emerald-400",
      pill: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    },
    warn: {
      label: "Partial Degradation",
      dot: "bg-amber-400 animate-pulse",
      pill: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    },
    error: {
      label: "System Issues Detected",
      dot: "bg-red-400 animate-pulse",
      pill: "bg-red-500/10 border-red-500/20 text-red-400",
    },
  }[overallHealth];

  /* ── Handlers ────────────────────────────────────────────────────────────── */
  const handleLogout = () => {
    authAPI.logout();
    navigate("/login");
  };
  const handleResetPrefs = () => {
    localStorage.removeItem("sa_prefs");
    setPrefs({});
    setConfirmReset(false);
    showToast("Preferences reset to defaults.");
  };

  /* ═══════════════════════════════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════════════════════════════ */
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-dark">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <header className="h-16 shrink-0 flex items-center justify-between px-8 border-b border-white/5 bg-background-dark/80 backdrop-blur-md z-10">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Settings
            </h2>
            <p className="text-slate-500 text-xs">
              Account, session, preferences, and platform configuration.
            </p>
          </div>
          <div
            className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${healthPill.pill}`}
          >
            <span className={`size-1.5 rounded-full ${healthPill.dot}`} />
            {healthPill.label}
          </div>
        </header>

        {/* ── Scrollable body ─────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* ══════════════════════════════════════════════════════════════
                1 — PROFILE
            ══════════════════════════════════════════════════════════════ */}
            <SectionCard
              title="Your Profile"
              description="Logged-in super admin account information."
              icon="account_circle"
            >
              {/* Avatar banner */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5 mb-5">
                <div className="size-14 rounded-2xl bg-gradient-to-br from-primary/60 to-purple-600 flex items-center justify-center text-white text-xl font-bold shrink-0 shadow-lg ring-2 ring-primary/20">
                  {user?.username?.slice(0, 2).toUpperCase() || "SA"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-white font-semibold text-base">
                    {user?.username || "Super Admin"}
                  </p>
                  <p className="text-slate-400 text-sm truncate">
                    {user?.email || "—"}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      <span className="material-symbols-outlined text-[12px]">
                        shield
                      </span>
                      Super Admin
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Active Session
                    </span>
                  </div>
                </div>
              </div>

              <InfoRow label="Username" value={user?.username} />
              <InfoRow label="Email" value={user?.email} copyable />
              <InfoRow label="Role" value="super_admin" mono />
              <InfoRow
                label="User ID"
                value={user?.user_id ? `#${user.user_id}` : "—"}
                mono
              />

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium transition-all border border-primary/20"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    lock_reset
                  </span>
                  Change Password
                </button>
              </div>
            </SectionCard>

            {/* ══════════════════════════════════════════════════════════════
                2 — SESSION / JWT
            ══════════════════════════════════════════════════════════════ */}
            <SectionCard
              title="Current Session"
              description="Active JWT authentication token details."
              icon="key"
            >
              <InfoRow
                label="Token Status"
                value={tokenExpired ? "Expired" : "Valid"}
                badge={
                  tokenExpired
                    ? {
                        cls: "bg-red-500/10 text-red-400 border-red-500/20",
                        text: "Expired",
                        dot: false,
                      }
                    : tokenSoonExpiring
                      ? {
                          cls: "bg-amber-500/10 text-amber-400 border-amber-500/20",
                          text: "Expiring Soon",
                          dot: true,
                        }
                      : {
                          cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                          text: "Active",
                          dot: true,
                        }
                }
              />
              <InfoRow label="Expires At" value={tokenExpiry} />
              <InfoRow label="Time Remaining" value={timeRemainingLabel} />
              <InfoRow
                label="Issued For"
                value={tokenInfo?.email || "—"}
                mono
                copyable
              />
              <InfoRow label="Role Claim" value={tokenInfo?.role || "—"} mono />

              {(tokenExpired || tokenSoonExpiring) && (
                <div className="mt-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/15 flex items-start gap-3">
                  <span className="material-symbols-outlined text-amber-400 text-[20px] shrink-0 mt-0.5">
                    warning
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-amber-300 text-sm font-semibold">
                      {tokenExpired
                        ? "Session Expired"
                        : "Session Expiring Soon"}
                    </p>
                    <p className="text-amber-500/70 text-xs mt-0.5 leading-relaxed">
                      {tokenExpired
                        ? "Your session has expired. Sign out and sign back in to continue."
                        : "Your session expires in less than 2 hours. Re-login to refresh it."}
                    </p>
                    <button
                      onClick={() => setConfirmLogout(true)}
                      className="mt-2.5 inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 text-xs font-semibold transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        logout
                      </span>
                      Sign Out &amp; Re-login
                    </button>
                  </div>
                </div>
              )}
            </SectionCard>

            {/* ══════════════════════════════════════════════════════════════
                3 — SYSTEM HEALTH
            ══════════════════════════════════════════════════════════════ */}
            <SectionCard
              title="System Health"
              description="Live status of connected platform services."
              icon="monitor_heart"
            >
              <HealthRow
                label="REST API"
                detail={
                  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
                }
                status={health.api}
              />
              <HealthRow
                label="Database"
                detail="MySQL — primary data store"
                status={health.database}
              />
              <HealthRow
                label="Authentication"
                detail="JWT token present in local storage"
                status={health.auth}
              />
              <HealthRow
                label="Email Service"
                detail="Nodemailer — SMTP relay"
                status={health.email}
              />

              <button
                onClick={() => {
                  setHealth({
                    api: "loading",
                    database: "loading",
                    auth: "loading",
                    email: "loading",
                  });
                  const run = async () => {
                    try {
                      const res = await fetch(
                        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/health`,
                        { signal: AbortSignal.timeout(5000) },
                      );
                      const data = await res.json().catch(() => ({}));
                      setHealth((h) => ({
                        ...h,
                        api: res.ok ? "ok" : "warn",
                        database: data.status === "OK" ? "ok" : "warn",
                      }));
                    } catch {
                      setHealth((h) => ({
                        ...h,
                        api: "error",
                        database: "error",
                      }));
                    }
                    const token = localStorage.getItem("authToken");
                    setHealth((h) => ({
                      ...h,
                      auth: token ? "ok" : "warn",
                      email: h.api === "error" ? "warn" : "ok",
                    }));
                  };
                  run();
                }}
                className="mt-5 flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] text-slate-400 hover:text-white text-sm font-medium transition-all border border-white/5"
              >
                <span className="material-symbols-outlined text-[16px]">
                  refresh
                </span>
                Re-run health check
              </button>
            </SectionCard>

            {/* ══════════════════════════════════════════════════════════════
                4 — PLATFORM CONFIGURATION
            ══════════════════════════════════════════════════════════════ */}
            <SectionCard
              title="Platform Configuration"
              description="Read-only overview of the server environment."
              icon="settings"
            >
              <InfoRow
                label="API Base URL"
                value={
                  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
                }
                mono
                copyable
              />
              <InfoRow
                label="Environment"
                value={import.meta.env.MODE || "development"}
                badge={
                  import.meta.env.MODE === "production"
                    ? {
                        cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                        text: "Production",
                        dot: true,
                      }
                    : {
                        cls: "bg-amber-500/10 text-amber-400 border-amber-500/20",
                        text: "Development",
                        dot: false,
                      }
                }
              />
              <InfoRow label="App Version" value="1.0.0" mono />
              <InfoRow label="JWT Expiry" value="24 hours (server-side)" />
              <InfoRow label="Max Upload" value="10 MB" />
              <InfoRow
                label="CORS Origins"
                value="localhost:5173, :3000, :5000"
                mono
              />

              <div className="mt-5 p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/10 flex items-start gap-3">
                <span className="material-symbols-outlined text-blue-400 text-[20px] shrink-0 mt-0.5">
                  info
                </span>
                <p className="text-blue-300/70 text-xs leading-relaxed">
                  Server-side settings (database credentials, JWT secret, mail
                  configuration) are managed via the{" "}
                  <code className="bg-white/10 px-1 py-0.5 rounded text-blue-300 font-mono">
                    .env
                  </code>{" "}
                  file. A server restart is required for changes to take effect.
                </p>
              </div>
            </SectionCard>

            {/* ══════════════════════════════════════════════════════════════
                5 — PREFERENCES
            ══════════════════════════════════════════════════════════════ */}
            <SectionCard
              title="Preferences"
              description="Customise your dashboard experience (saved locally)."
              icon="tune"
            >
              <ToggleRow
                label="Email Notifications"
                description="Receive alerts when a license expires or a new school registers."
                checked={prefs.emailNotifications ?? true}
                onChange={(v) => {
                  setPref("emailNotifications", v);
                  showToast(
                    `Email notifications ${v ? "enabled" : "disabled"}.`,
                  );
                }}
              />
              <ToggleRow
                label="Expiry Warnings"
                description="Show in-dashboard banners for licenses expiring within 30 days."
                checked={prefs.expiryWarnings ?? true}
                onChange={(v) => {
                  setPref("expiryWarnings", v);
                  showToast(`Expiry warnings ${v ? "enabled" : "disabled"}.`);
                }}
              />
              <ToggleRow
                label="Compact Table View"
                description="Reduce row padding in data tables for a denser information display."
                checked={prefs.compactTables ?? false}
                onChange={(v) => {
                  setPref("compactTables", v);
                  showToast(`Compact tables ${v ? "enabled" : "disabled"}.`);
                }}
              />
              <ToggleRow
                label="Show Student Counts"
                description="Display enrolled vs. max counts in school and license tables."
                checked={prefs.showStudentCounts ?? true}
                onChange={(v) => {
                  setPref("showStudentCounts", v);
                  showToast(`Student counts ${v ? "shown" : "hidden"}.`);
                }}
              />
              <ToggleRow
                label="Auto-refresh Dashboard"
                description="Automatically refresh dashboard metrics every 60 seconds."
                checked={prefs.autoRefresh ?? false}
                onChange={(v) => {
                  setPref("autoRefresh", v);
                  showToast(`Auto-refresh ${v ? "enabled" : "disabled"}.`);
                }}
              />
            </SectionCard>

            {/* ══════════════════════════════════════════════════════════════
                6 — ACTIVITY LOG
            ══════════════════════════════════════════════════════════════ */}
            <SectionCard
              title="Recent Activity"
              description="Last recorded super admin actions on this device."
              icon="history"
            >
              <div className="flex flex-col divide-y divide-white/5">
                {ACTIVITY_LOG.map((entry, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3.5 py-3.5 first:pt-0 last:pb-0"
                  >
                    <div
                      className={`size-8 rounded-lg ${entry.colorBg} flex items-center justify-center shrink-0 mt-0.5`}
                    >
                      <span
                        className={`material-symbols-outlined text-[16px] ${entry.colorText}`}
                      >
                        {entry.icon}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium">
                        {entry.action}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">
                        {entry.detail}
                      </p>
                    </div>
                    <span className="text-[11px] text-slate-600 shrink-0 pt-0.5">
                      {entry.ago}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-white/5">
                <p className="text-xs text-slate-600 text-center">
                  Full audit log available via server-side logging. This list is
                  illustrative.
                </p>
              </div>
            </SectionCard>

            {/* ══════════════════════════════════════════════════════════════
                7 — DANGER ZONE
            ══════════════════════════════════════════════════════════════ */}
            <SectionCard
              title="Danger Zone"
              description="Irreversible actions — proceed with caution."
              icon="dangerous"
              danger
            >
              {/* Sign out */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5 mb-4">
                <div>
                  <p className="text-white text-sm font-semibold">
                    Sign Out of All Devices
                  </p>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Invalidate your current session and return to the login
                    screen.
                  </p>
                </div>
                <button
                  onClick={() => setConfirmLogout(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-sm font-medium transition-all border border-red-500/20 shrink-0"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    logout
                  </span>
                  Sign Out
                </button>
              </div>

              {/* Reset preferences */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div>
                  <p className="text-white text-sm font-semibold">
                    Reset All Preferences
                  </p>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Restore all dashboard preferences to their factory defaults.
                  </p>
                </div>
                <button
                  onClick={() => setConfirmReset(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-sm font-medium transition-all border border-white/10 shrink-0"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    restart_alt
                  </span>
                  Reset Preferences
                </button>
              </div>
            </SectionCard>

            <div className="h-6" />
          </div>
        </div>
      </div>

      {/* ── Modals ──────────────────────────────────────────────────────────── */}
      {showPasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowPasswordModal(false)}
          onSuccess={() => {
            showToast("Password changed successfully. Please re-login.");
            setShowPasswordModal(false);
          }}
        />
      )}

      {confirmLogout && (
        <ConfirmDialog
          title="Sign Out?"
          description="You will be logged out immediately. Any unsaved work will be lost."
          confirmLabel="Sign Out"
          onConfirm={handleLogout}
          onCancel={() => setConfirmLogout(false)}
        />
      )}

      {confirmReset && (
        <ConfirmDialog
          title="Reset Preferences?"
          description="All dashboard preferences will be restored to their defaults. This cannot be undone."
          confirmLabel="Reset"
          onConfirm={handleResetPrefs}
          onCancel={() => setConfirmReset(false)}
          destructive={false}
        />
      )}

      {/* ── Toast ───────────────────────────────────────────────────────────── */}
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

export default Settings;
