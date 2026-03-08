import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { authAPI } from "../../../services/api";

const NAV_ITEMS = [
  {
    label: "Main Menu",
    items: [
      { to: "/superadmin/dashboard", icon: "dashboard", label: "Dashboard" },
      { to: "/superadmin/schools", icon: "domain", label: "Schools" },
      { to: "/superadmin/licenses", icon: "verified_user", label: "Licenses" },
      { to: "/superadmin/finance", icon: "payments", label: "Finance" },
      { to: "/superadmin/users", icon: "group", label: "Users" },
    ],
  },
  {
    label: "System",
    items: [
      { to: "/superadmin/settings", icon: "settings", label: "Settings" },
    ],
  },
];

function Sidebar() {
  const navigate = useNavigate();
  const user = authAPI.getCurrentUser();

  const handleLogout = () => {
    authAPI.logout();
    navigate("/login");
  };

  return (
    <aside className="w-64 shrink-0 flex flex-col h-full bg-[#131118] border-r border-white/5">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
        <div className="bg-primary/20 p-2 rounded-lg text-primary shrink-0">
          <span className="material-symbols-outlined text-2xl">school</span>
        </div>
        <div>
          <h1 className="text-white text-base font-bold leading-tight tracking-tight">
            SchoolOS
          </h1>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">
            Superadmin
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-5">
        {NAV_ITEMS.map((section) => (
          <div key={section.label} className="flex flex-col gap-1">
            <p className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1">
              {section.label}
            </p>
            {section.items.map(({ to, icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ` +
                  (isActive
                    ? "bg-primary/10 text-primary border-l-4 border-primary pl-2"
                    : "text-slate-400 hover:text-white hover:bg-white/5 border-l-4 border-transparent pl-2")
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className="material-symbols-outlined text-[20px] shrink-0"
                      style={
                        isActive
                          ? { fontVariationSettings: "'FILL' 1" }
                          : {}
                      }
                    >
                      {icon}
                    </span>
                    <span>{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* User / Logout */}
      <div className="p-3 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-all">
          <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
            {user?.username
              ? user.username.slice(0, 2).toUpperCase()
              : "SA"}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <p className="text-white text-sm font-medium truncate">
              {user?.username || "Super Admin"}
            </p>
            <p className="text-slate-500 text-xs truncate">
              {user?.email || ""}
            </p>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="text-slate-500 hover:text-red-400 transition-colors ml-auto shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
