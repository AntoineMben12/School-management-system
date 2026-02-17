
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../services/api";

function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("Teacher");
  const [email, setEmail] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!schoolId.trim()) {
      setError("School ID is required");
      return;
    }
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }

    setIsLoading(true);
    try {
      const result = await authAPI.login({
        email,
        password,
        role,
        school_id: parseInt(schoolId),
      });

      // Login successful, redirect to dashboard based on role
      const roleRoute = {
        "Superadmin": "/superadmin/dashboard",
        "Admin": "/admin/dashboard",
        "Teacher": "/teacher/dashboard",
        "Student": "/student/dashboard",
      };

      // If rememberMe is checked, save credentials (not recommended for production)
      if (rememberMe) {
        localStorage.setItem("rememberEmail", email);
      }

      navigate(roleRoute[result.user.role] || "/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-200 antialiased min-h-screen w-full flex flex-col overflow-x-hidden">
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        {/* Main Card */}
        <div className="w-full max-w-[480px] bg-white dark:bg-[#1e1e24] rounded-2xl shadow-apple p-8 md:p-12 border border-white/50 dark:border-white/5 relative flex flex-col justify-center">
          {/* Header Section */}
          <div className="flex flex-col items-center justify-center mb-10 text-center">
            <div className="w-14 h-14 bg-gradient-to-tr from-primary/20 to-primary/5 rounded-xl flex items-center justify-center mb-5 shadow-sm text-primary">
              <span className="material-symbols-outlined text-[32px]">school</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-[#131118] dark:text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-[#706189] dark:text-slate-400 text-sm font-normal">
              Sign in to AcademyOS to continue
            </p>
          </div>
          {/* Role Selector */}
          <div className="mb-8">
            <div className="flex h-12 w-full items-center justify-center rounded-xl bg-[#f2f0f4] dark:bg-slate-800/50 p-1.5">
              {["Superadmin", "Admin", "Teacher", "Student"].map((r) => (
                <label key={r} className="flex-1 h-full relative cursor-pointer group">
                  <input
                    className="peer sr-only"
                    name="role"
                    type="radio"
                    value={r}
                    checked={role === r}
                    onChange={() => setRole(r)}
                    disabled={isLoading}
                  />
                  <div className={
                    `w-full h-full flex items-center justify-center rounded-lg text-xs sm:text-sm font-medium text-[#706189] dark:text-slate-400 transition-all duration-200 ` +
                    (role === r ? "bg-white dark:bg-slate-700 text-primary shadow-apple-sm font-semibold" : "")
                  }>
                    {r}
                  </div>
                </label>
              ))}
            </div>
          </div>
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
          {/* Login Form */}
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            {/* School ID Field */}
            <div className="flex flex-col gap-2">
              <label className="text-[#131118] dark:text-slate-200 text-sm font-medium leading-normal ml-1" htmlFor="schoolId">
                School ID
              </label>
              <div className="relative group">
                <input
                  className="form-input block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3.5 text-base text-[#131118] dark:text-white placeholder-[#706189] focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all duration-200 shadow-sm group-hover:border-slate-300 dark:group-hover:border-slate-600"
                  id="schoolId"
                  placeholder="1"
                  type="number"
                  value={schoolId}
                  onChange={(e) => setSchoolId(e.target.value)}
                  disabled={isLoading}
                  required
                  min="1"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#706189]">
                  <span className="material-symbols-outlined text-[20px]">apartment</span>
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label className="text-[#131118] dark:text-slate-200 text-sm font-medium leading-normal ml-1" htmlFor="email">
                Email Address
              </label>
              <div className="relative group">
                <input
                  className="form-input block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3.5 text-base text-[#131118] dark:text-white placeholder-[#706189] focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all duration-200 shadow-sm group-hover:border-slate-300 dark:group-hover:border-slate-600"
                  id="email"
                  placeholder="user@school.edu"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#706189]">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                </div>
              </div>
            </div>
            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[#131118] dark:text-slate-200 text-sm font-medium leading-normal" htmlFor="password">
                  {role === "Teacher" ? "Passkey" : "Password"}
                </label>
              </div>
              <div className="relative group">
                <input
                  className="form-input block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3.5 text-base text-[#131118] dark:text-white placeholder-[#706189] focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all duration-200 shadow-sm group-hover:border-slate-300 dark:group-hover:border-slate-600"
                  id="password"
                  placeholder={role === "Teacher" ? "Enter your passkey" : "••••••••"}
                  type={role === "Teacher" ? "passkey" : (showPassword ? "text" : "password")}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
                {role !== "Teacher" && (
                  <button
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#706189] hover:text-[#131118] dark:hover:text-white transition-colors cursor-pointer disabled:opacity-50"
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    disabled={isLoading}
                    tabIndex={-1}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                )}
              </div>
            </div>
            {/* Utilities Row */}
            <div className="flex items-center justify-between px-1">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  className="form-checkbox h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/20 transition duration-150 ease-in-out"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                />
                <span className="ml-2 text-sm text-[#706189] dark:text-slate-400">Remember me</span>
              </label>
              <a className="text-sm font-medium text-primary hover:text-primary/80 transition-colors" href="#">
                Forgot Password?
              </a>
            </div>
            {/* Primary Action */}
            <button
              className="w-full bg-primary hover:bg-primary/90 active:scale-[0.98] text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-primary/20 text-base mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>
          </form>
          {/* Footer Links */}
          <div className="mt-10 text-center border-t border-slate-100 dark:border-slate-800 pt-6">
            <p className="text-sm text-[#706189] dark:text-slate-500">
              Need help logging in?{' '}
              <a className="font-medium text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors" href="#">
                Visit Help Center
              </a>
            </p>
          </div>
        </div>
        {/* Bottom Branding */}
        <div className="fixed bottom-6 text-center w-full pointer-events-none hidden md:block">
          <p className="text-xs text-slate-400 dark:text-slate-600">
            © 2024 AcademyOS. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login