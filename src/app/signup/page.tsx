"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import AuthLayout from "@/components/AuthLayout";
import { formatRequestError } from "@/lib/formatRequestError";
import { uiPersonaToApiRole } from "@/lib/authUi";
import { useSendOtpMutation, useVerifyOtpMutation } from "@/store/api/authApi";
import { LoadingSpinner } from "@/app/components/VectorImages";
import toast from "react-hot-toast";

export default function SignUpPage() {
  const router = useRouter();
  const [role, setRole] = useState<"issuer" | "investor">("issuer");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation();

  async function handleSendOtp(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setApiError(null);

    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();
    const cleanEmail = email.trim();

    let fnErr: string | null = null;
    let lnErr: string | null = null;
    let emailErr: string | null = null;
    let pwErr: string | null = null;

    const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    if (!cleanFirstName) fnErr = "Please enter your first name.";
    else if (!nameRegex.test(cleanFirstName)) fnErr = "Letters, spaces, hyphens, and apostrophes only.";

    if (!cleanLastName) lnErr = "Please enter your last name.";
    else if (!nameRegex.test(cleanLastName)) lnErr = "Letters, spaces, hyphens, and apostrophes only.";

    if (!cleanEmail) emailErr = "Please enter your email address.";
    else if (!emailRegex.test(cleanEmail)) emailErr = "Please enter a valid email address.";

    if (!password) pwErr = "Please enter your password.";
    else if (!passwordRegex.test(password)) pwErr = "Password must be at least 8 characters, include uppercase, lowercase, number, and special character.";

    setFirstNameError(fnErr);
    setLastNameError(lnErr);
    setEmailError(emailErr);
    setPasswordError(pwErr);

    if (fnErr || lnErr || emailErr || pwErr) return;

    const fullName = `${cleanFirstName} ${cleanLastName}`;
    try {
      await sendOtp({
        fullName,
        email: cleanEmail,
        password,
        role: uiPersonaToApiRole(role),
      }).unwrap();
      setOtpSent(true);
      setResendCooldown(60);
    } catch (err) {
      const apiErr = err as { status?: number; data?: Record<string, unknown> };
      const message = formatRequestError(err);

      if (
        apiErr?.status === 409 ||
        message.toLowerCase().includes("already") ||
        message.toLowerCase().includes("please wait before requesting another otp")
      ) {
        setApiError(
          "This email is already registered. Please sign in instead."
        );
      } else {
        setApiError(message);
      }
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setApiError(null);
    const trimmedOtp = otp.trim();
    let otpErr: string | null = null;

    if (!trimmedOtp) {
      otpErr = "Please enter the OTP sent to your email.";
    } else if (trimmedOtp.length !== 6) {
      otpErr = "OTP must be exactly 6 digits.";
    } else if (/\s/.test(trimmedOtp)) {
      otpErr = "OTP cannot contain spaces.";
    }

    setOtpError(otpErr);

    if (otpErr) return;

    try {
      await verifyOtp({
        email: email.trim(),
        otp: trimmedOtp,
      }).unwrap();
      toast.success("Account created successfully!");
      router.push("/setup-profile");
    } catch (err) {
      setApiError(formatRequestError(err));
    }
  }

  return (
    <AuthLayout isSignUp={true}>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div>
          <p className="text-xs font-bold text-[#4B5563] uppercase tracking-[0.1em] mb-4">
            I am a
          </p>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              disabled={otpSent}
              onClick={() => setRole("issuer")}
              className={`flex flex-col items-center justify-center p-6 border-2 rounded-2xl transition-all duration-200 ${otpSent ? "opacity-60 cursor-not-allowed" : "hover:-translate-y-0.5 cursor-pointer"} ${role === "issuer" ? "border-[#C084FC] bg-[#faf5ff] text-[#7C3AED] shadow-sm hover:opacity-80" : "border-[#E5E7EB] bg-[#F9FAFB] text-[#9CA3AF] hover:bg-[#F3F4F6] hover:text-[#4B5563] hover:border-[#D1D5DB]"}`}
            >
              <div className="w-8 h-8 mb-2">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
                  <path d="M9 20v-8h6v8" />
                  <path d="M9 4v4h6V4" />
                </svg>
              </div>
              <span className="text-base font-bold">Asset Issuer</span>
            </button>
            <button
              type="button"
              disabled={otpSent}
              onClick={() => setRole("investor")}
              className={`flex flex-col items-center justify-center p-6 border-2 rounded-2xl transition-all duration-200 ${otpSent ? "opacity-60 cursor-not-allowed" : "hover:-translate-y-0.5 cursor-pointer"} ${role === "investor" ? "border-[#C084FC] bg-[#faf5ff] text-[#7C3AED] shadow-sm hover:opacity-80" : "border-[#E5E7EB] bg-[#F9FAFB] text-[#9CA3AF] hover:bg-[#F3F4F6] hover:text-[#4B5563] hover:border-[#D1D5DB]"}`}
            >
              <div className="w-8 h-8 mb-2">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <span className="text-base font-bold">Investor</span>
            </button>
          </div>
        </div>

        {apiError && (
          <p
            className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-base text-red-700"
            role="alert"
          >
            {apiError}
          </p>
        )}

        <form
          className="space-y-6"
          noValidate
          onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}
        >
          {!otpSent && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-[#4B5563] uppercase tracking-[0.1em] mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      if (firstNameError) setFirstNameError(null);
                    }}
                    autoComplete="given-name"
                    placeholder="Alex"
                    className={`w-full px-5 py-4 rounded-xl border bg-[#F9FAFB] text-base text-[#1F2937] placeholder:text-[#9CA3AF] outline-none transition-all focus:bg-white focus:ring-2 ${firstNameError
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                      : "border-[#E5E7EB] focus:border-[#C084FC] focus:ring-[#8B5CF6]/20"
                      }`}
                  />
                  {firstNameError && (
                    <p className="text-xs text-red-600 mt-1" role="alert">{firstNameError}</p>
                  )}
                </div>
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-[#4B5563] uppercase tracking-[0.1em] mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      if (lastNameError) setLastNameError(null);
                    }}
                    autoComplete="family-name"
                    placeholder="Chen"
                    className={`w-full px-5 py-4 rounded-xl border bg-[#F9FAFB] text-base text-[#1F2937] placeholder:text-[#9CA3AF] outline-none transition-all focus:bg-white focus:ring-2 ${lastNameError
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                      : "border-[#E5E7EB] focus:border-[#C084FC] focus:ring-[#8B5CF6]/20"
                      }`}
                  />
                  {lastNameError && (
                    <p className="text-xs text-red-600 mt-1" role="alert">{lastNameError}</p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold text-[#4B5563] uppercase tracking-[0.1em] mb-1">
                  Work Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError(null);
                  }}
                  autoComplete="email"
                  placeholder="you@yourfirm.com"
                  className={`w-full px-5 py-4 rounded-xl border bg-[#F9FAFB] text-base text-[#1F2937] placeholder:text-[#9CA3AF] outline-none transition-all focus:bg-white focus:ring-2 ${emailError
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                    : "border-[#E5E7EB] focus:border-[#C084FC] focus:ring-[#8B5CF6]/20"
                    }`}
                />
                {emailError && (
                  <p className="text-xs text-red-600 mt-1" role="alert">{emailError}</p>
                )}
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold text-[#4B5563] uppercase tracking-[0.1em] mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value.replace(/\s/g, ""));
                      if (passwordError) setPasswordError(null);
                    }}
                    autoComplete="new-password"
                    placeholder="Create a strong password"
                    className={`w-full px-5 py-4 pr-12 rounded-xl border bg-[#F9FAFB] text-base text-[#1F2937] placeholder:text-[#9CA3AF] outline-none transition-all focus:bg-white focus:ring-2 ${passwordError
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                      : "border-[#E5E7EB] focus:border-[#C084FC] focus:ring-[#8B5CF6]/20"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible((v) => !v)}
                    aria-label={
                      passwordVisible ? "Hide password" : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-[#9CA3AF] hover:text-[#111827] hover:bg-gray-200/60 transition-all duration-200 cursor-pointer hover:opacity-80"
                  >
                    {passwordVisible ? (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-xs text-red-600 mt-1" role="alert">{passwordError}</p>
                )}
              </div>
            </>
          )}

          {otpSent && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => {
                  setOtpSent(false);
                  setOtp("");
                  setApiError(null);
                  setOtpError(null);
                  setResendCooldown(0);
                }}
                className="flex items-center gap-1.5 text-base font-bold text-[#6B7280] transition-colors hover:text-[#7C3AED]"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back
              </button>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#4B5563] uppercase tracking-[0.1em]">
                  Enter OTP
                </label>
                <input
                  required
                  type="text"
                  inputMode="numeric"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, ""));
                    if (otpError) setOtpError(null);
                  }}
                  autoComplete="one-time-code"
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  className={`w-full px-5 py-4 rounded-xl border bg-[#F9FAFB] text-base text-[#1F2937] placeholder:text-[#9CA3AF] outline-none transition-all focus:bg-white focus:ring-2 text-center tracking-widest ${otpError
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                    : "border-[#E5E7EB] focus:border-[#C084FC] focus:ring-[#8B5CF6]/20"
                    }`}
                />
                {otpError && (
                  <p className="text-xs text-red-600 mt-1" role="alert">{otpError}</p>
                )}
                <p className="text-sm text-[#9CA3AF] mt-2">OTP sent to {email}</p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-1 text-sm">
                  <span className="text-[#9CA3AF]">
                    OTP is valid for 30 minutes.
                  </span>
                  <button
                    type="button"
                    disabled={resendCooldown > 0 || isSendingOtp}
                    onClick={() => handleSendOtp()}
                    className={`font-bold transition-all text-left ${resendCooldown > 0 || isSendingOtp
                      ? "text-[#9CA3AF] cursor-not-allowed"
                      : "text-[#7C3AED] hover:underline"
                      }`}
                  >
                    {resendCooldown > 0
                      ? `Resend OTP in ${resendCooldown}s`
                      : "Resend OTP"}
                  </button>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSendingOtp || isVerifyingOtp}
            className="btn-gradient-primary w-full py-4 text-white font-bold rounded-xl shadow-lg shadow-[#8B5CF6]/25 hover:shadow-xl hover:shadow-[#6366F1]/30 hover:opacity-90 transition-all flex items-center justify-center gap-2 text-base group disabled:opacity-60 cursor-pointer"
          >
            {(isSendingOtp || isVerifyingOtp) && (
              <LoadingSpinner className="h-5 w-5" color="white" />
            )}
            {isSendingOtp
              ? "Sending OTP…"
              : isVerifyingOtp
                ? "Verifying…"
                : otpSent
                  ? "Verify & Create Account"
                  : "Send OTP"}
            {!isSendingOtp && !isVerifyingOtp && (
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            )}
          </button>
        </form>

        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E5E7EB]"></div>
          </div>
        </div>

        <div className="text-center pt-2">
          <p className="text-base font-medium text-[#9CA3AF]">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/signin")}
              className="font-bold text-[#7C3AED] hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
