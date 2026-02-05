import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

function Otp() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef([]);

  const handleOtpChange = (index, value) => {
    // Only allow numeric input
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace to go to previous input
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Handle arrow keys
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];

    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    // Focus last filled input
    if (pastedData.length > 0) {
      inputRefs.current[Math.min(pastedData.length - 1, 5)]?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      alert("Please enter all 6 digits");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement OTP verification with backend API
      // For now, navigate to next page on verification
      console.log("Verifying OTP:", otpCode);
      navigate("/teacher-dashboard");
    } catch (error) {
      console.error("Verification failed:", error);
      alert("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setResendTimer(60);
    try {
      // TODO: Implement resend OTP with backend API
      console.log("Resending OTP...");
      alert("OTP sent to your registered email");

      // Countdown timer
      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Resend failed:", error);
      alert("Failed to resend OTP. Please try again.");
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-200 antialiased min-h-screen w-full flex flex-col overflow-x-hidden">
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-[480px] bg-white dark:bg-[#1e1e24] rounded-2xl shadow-apple p-8 md:p-12 border border-white/50 dark:border-white/5 relative flex flex-col justify-center">
          {/* Header Section */}
          <div className="flex flex-col items-center justify-center mb-10 text-center">
            <div className="w-16 h-16 bg-gradient-to-tr from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mb-6 shadow-sm text-primary">
              <span className="material-symbols-outlined text-[36px]">school</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-[#131118] dark:text-white mb-3">
              Verification
            </h1>
            <p className="text-[#706189] dark:text-slate-400 text-sm font-normal max-w-[280px] mx-auto leading-relaxed">
              Enter the 6-digit code sent to your registered email
            </p>
          </div>

          {/* OTP Form */}
          <form className="flex flex-col gap-8" onSubmit={handleVerify}>
            <div className="flex flex-col gap-4">
              {/* OTP Input Fields */}
              <div className="flex justify-between gap-2 sm:gap-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    className="w-full aspect-square text-center text-2xl font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[#131118] dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200 shadow-sm"
                    maxLength="1"
                    placeholder="•"
                    type="text"
                    inputMode="numeric"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    disabled={isLoading}
                  />
                ))}
              </div>

              {/* Resend Code */}
              <div className="text-center mt-2">
                <p className="text-sm text-[#706189] dark:text-slate-400">
                  Didn't receive the code?{" "}
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendTimer > 0 || isLoading}
                    className={`font-semibold transition-colors ml-1 underline-offset-4 hover:underline ${
                      resendTimer > 0
                        ? "text-slate-400 dark:text-slate-600 cursor-not-allowed"
                        : "text-primary hover:text-primary/80"
                    }`}
                  >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
                  </button>
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4">
              <button
                className="w-full bg-primary hover:bg-primary/90 active:scale-[0.98] text-white font-semibold py-4 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-primary/20 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={isLoading || otp.join("").length !== 6}
              >
                {isLoading ? "Verifying..." : "Verify & Continue"}
              </button>
              <button
                className="w-full py-2 text-sm font-medium text-[#706189] dark:text-slate-400 hover:text-[#131118] dark:hover:text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
                onClick={handleBackToLogin}
                disabled={isLoading}
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Back to login
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-12 text-center border-t border-slate-100 dark:border-slate-800 pt-8">
            <p className="text-sm text-[#706189] dark:text-slate-500">
              Contact{" "}
              <a
                className="font-medium text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors"
                href="#"
              >
                Support
              </a>{" "}
              if you're having trouble.
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

export default Otp;