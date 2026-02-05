import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../../services/api";

function SignUp() {
  const navigate = useNavigate();
  const [role, setRole] = useState("School Admin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!fullName.trim()) {
      setError("Full name is required");
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
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    try {
      const result = await authAPI.signup({
        fullName,
        email,
        password,
        role,
      });

      // Signup successful, redirect to dashboard based on role
      const roleRoute = {
        "School Admin": "/admin/dashboard",
        "Teacher": "/teacher/dashboard",
        "Student": "/student/dashboard",
      };
      
      navigate(roleRoute[role] || "/dashboard");
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-200 antialiased min-h-screen w-full flex flex-col overflow-x-hidden">
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-[480px] bg-white dark:bg-[#1e1e24] rounded-2xl shadow-apple p-8 md:p-12 border border-white/50 dark:border-white/5 relative flex flex-col justify-center">
          {/* Header Section */}
          <div className="flex flex-col items-center justify-center mb-10 text-center">
            <div className="w-14 h-14 bg-gradient-to-tr from-primary/20 to-primary/5 rounded-xl flex items-center justify-center mb-5 shadow-sm text-primary">
              <span className="material-symbols-outlined text-[32px]">school</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-[#131118] dark:text-white mb-2">
              Create Account
            </h1>
            <p className="text-[#706189] dark:text-slate-400 text-sm font-normal">
              Join AcademyOS for your institution
            </p>
          </div>

          {/* Role Selector */}
          <div className="mb-8">
            <div className="flex h-12 w-full items-center justify-center rounded-xl bg-[#f2f0f4] dark:bg-slate-800/50 p-1.5">
              {["School Admin", "Teacher", "Student"].map((r) => (
                <label key={r} className="flex-1 h-full relative cursor-pointer group">
                  <input
                    className="peer sr-only"
                    name="role"
                    type="radio"
                    value={r}
                    checked={role === r}
                    onChange={() => setRole(r)}
                  />
                  <div
                    className={`w-full h-full flex items-center justify-center rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 text-center leading-tight px-1 ${
                      role === r
                        ? "bg-white dark:bg-slate-700 text-primary shadow-apple-sm font-semibold"
                        : "text-[#706189] dark:text-slate-400"
                    }`}
                  >
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

          {/* Signup Form */}
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {/* Full Name Field */}
            <div className="flex flex-col gap-2">
              <label className="text-[#131118] dark:text-slate-200 text-sm font-medium leading-normal ml-1" htmlFor="name">
                Full Name
              </label>
              <div className="relative group">
                <input
                  className="form-input block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3.5 text-base text-[#131118] dark:text-white placeholder-[#706189] focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all duration-200 shadow-sm group-hover:border-slate-300 dark:group-hover:border-slate-600"
                  id="name"
                  placeholder="John Doe"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#706189]">
                  <span className="material-symbols-outlined text-[20px]">person</span>
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label className="text-[#131118] dark:text-slate-200 text-sm font-medium leading-normal ml-1" htmlFor="email">
                School/Institution Email
              </label>
              <div className="relative group">
                <input
                  className="form-input block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3.5 text-base text-[#131118] dark:text-white placeholder-[#706189] focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all duration-200 shadow-sm group-hover:border-slate-300 dark:group-hover:border-slate-600"
                  id="email"
                  placeholder="email@institution.edu"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#706189]">
                  <span className="material-symbols-outlined text-[20px]">alternate_email</span>
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <label className="text-[#131118] dark:text-slate-200 text-sm font-medium leading-normal ml-1" htmlFor="password">
                Password
              </label>
              <div className="relative group">
                <input
                  className="form-input block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3.5 text-base text-[#131118] dark:text-white placeholder-[#706189] focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all duration-200 shadow-sm group-hover:border-slate-300 dark:group-hover:border-slate-600"
                  id="password"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
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
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="px-1 mt-1">
              <p className="text-xs text-[#706189] dark:text-slate-400 leading-relaxed">
                By signing up, you agree to our{" "}
                <a className="text-primary hover:underline" href="#">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a className="text-primary hover:underline" href="#">
                  Privacy Policy
                </a>
                .
              </p>
            </div>

            {/* Submit Button */}
            <button
              className="w-full bg-primary hover:bg-primary/90 active:scale-[0.98] text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-primary/20 text-base mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 text-center border-t border-slate-100 dark:border-slate-800 pt-6">
            <p className="text-sm text-[#706189] dark:text-slate-500">
              Already have an account?{" "}
              <button
                onClick={handleNavigateToLogin}
                className="font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                Log In
              </button>
            </p>
          </div>
        </div>

        {/* Bottom Branding */}
        <div className="fixed bottom-6 text-center w-full pointer-events-none hidden md:block">
          <p className="text-xs text-slate-400 dark:text-slate-600">
            © 2024 AcademyOS. Empowering the future of education.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;