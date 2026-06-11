"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AuthLayout from "@/components/AuthLayout";
import { formatRequestError } from "@/lib/formatRequestError";
import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyForgotPasswordOtpMutation,
} from "@/store/api/authApi";
import { LoadingSpinner } from "@/app/components/VectorImages";
import toast from "react-hot-toast";

// Must match Sign Up password policy exactly
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
const PASSWORD_HINT = "Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character (!@#$%^&*).";


type Step = "email" | "otp" | "password";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const [sendOtp, { isLoading: sending }] = useForgotPasswordMutation();
  const [verifyOtp, { isLoading: verifying }] =
    useVerifyForgotPasswordOtpMutation();
  const [resetPassword, { isLoading: resetting }] = useResetPasswordMutation();

  const busy = sending || verifying || resetting;

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    const trimmedEmail = email.trim();

    // Client-side email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
      setFormError("Please enter your email address.");
      return;
    }
    if (!emailRegex.test(trimmedEmail)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    try {
      const result = await sendOtp({ email: trimmedEmail }).unwrap();
      const message =
        result &&
          typeof result === "object" &&
          "message" in result &&
          typeof (result as { message: unknown }).message === "string"
          ? (result as { message: string }).message
          : "OTP sent successfully";
      setSuccessMessage(message);
      setStep("otp");
      setResendCooldown(60);
    } catch (err) {
      setFormError(formatRequestError(err));
    }
  }

  async function handleResendOtp() {
    setFormError(null);
    setSuccessMessage(null);
    try {
      const result = await sendOtp({ email: email.trim() }).unwrap();
      const message =
        result &&
          typeof result === "object" &&
          "message" in result &&
          typeof (result as { message: unknown }).message === "string"
          ? (result as { message: string }).message
          : "OTP resent successfully";
      setSuccessMessage(message);
      setOtp("");
      setResendCooldown(60);
    } catch (err) {
      setFormError(formatRequestError(err));
    }
  }

  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);
    const trimmedOtp = otp.trim();
    if (!trimmedOtp) {
      setFormError("Please enter the OTP sent to your email.");
      return;
    }
    if (trimmedOtp.length !== 6) {
      setFormError("OTP must be exactly 6 digits.");
      return;
    }
    if (/\s/.test(trimmedOtp)) {
      setFormError("OTP cannot contain spaces.");
      return;
    }
    try {
      const result = await verifyOtp({
        email: email.trim(),
        otp: trimmedOtp,
      }).unwrap();
      const message =
        result &&
          typeof result === "object" &&
          "message" in result &&
          typeof (result as { message: unknown }).message === "string"
          ? (result as { message: string }).message
          : "Code verified. Choose a new password.";
      setSuccessMessage(message);
      setStep("password");
    } catch (err) {
      setFormError(formatRequestError(err));
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);
    // Enforce the same password policy as Sign Up
    if (!PASSWORD_REGEX.test(newPassword)) {
      setFormError(PASSWORD_HINT);
      return;
    }
    try {
      await resetPassword({
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
      }).unwrap();
      toast.success("Password reset successfully!");
      router.replace("/signin?reset=1");
    } catch (err) {
      setFormError(formatRequestError(err));
    }
  }

  const stepTitle =
    step === "email"
      ? "Forgot your password?"
      : step === "otp"
        ? "Verify your email"
        : "Set a new password";

  const stepDescription =
    step === "email"
      ? "Enter your work email and we'll send a one-time code to reset your password."
      : step === "otp"
        ? `Enter the code sent to ${email}.`
        : "Choose a strong password for your account.";

  return (
    <AuthLayout isSignUp={false} hideToggle>
      <div className="min-w-0 space-y-6 animate-fade-in sm:space-y-8">
        <div>
          <button
            type="button"
            onClick={() => router.push("/signin")}
            className="mb-4 flex items-center gap-1.5 text-base font-bold text-[#6B7280] transition-colors hover:text-[#7C3AED] cursor-pointer"
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
            Back to Sign In
          </button>
          <h2 className="mb-2 text-xl font-bold text-[#111827] sm:text-2xl">
            {stepTitle}
          </h2>
          <p className="text-base leading-relaxed text-[#6B7280]">
            {stepDescription}
          </p>
        </div>

        {formError && (
          <p
            className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-base text-red-700"
            role="alert"
          >
            {formError}
          </p>
        )}
        {successMessage && step !== "email" && (
          <p className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-base text-emerald-700">
            {successMessage}
          </p>
        )}

        {step === "email" && (
          <form className="space-y-6" onSubmit={handleEmailSubmit}>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-[0.1em] text-[#4B5563] mb-1">
                Work Email
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="alex@maxtronize.com"
                className="w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-5 py-4 text-base text-[#1F2937] placeholder:text-[#9CA3AF] outline-none transition-all focus:border-[#C084FC] focus:bg-white focus:ring-2 focus:ring-[#8B5CF6]/20"
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="btn-gradient-primary group flex w-full items-center justify-center gap-2 rounded-xl py-4 text-base font-bold text-white shadow-lg shadow-[#8B5CF6]/25 transition-all hover:shadow-xl hover:shadow-[#6366F1]/30 hover:opacity-90 disabled:opacity-60 cursor-pointer"
            >
              {sending && (
                <LoadingSpinner className="h-5 w-5" color="white" />
              )}
              {sending ? "Sending…" : "Send reset code"}
              {!sending && (
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
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
        )}

        {step === "otp" && (
          <form className="space-y-6" onSubmit={handleOtpSubmit}>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-[0.1em] text-[#4B5563] mb-1">
                One-time code
              </label>
              <input
                required
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                className="w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-5 py-4 text-base text-[#1F2937] placeholder:text-[#9CA3AF] outline-none transition-all focus:border-[#C084FC] focus:bg-white focus:ring-2 focus:ring-[#8B5CF6]/20"
              />
              <div className="bg-[#FAF5FF] border border-[#E9D5FF] rounded-xl p-3.5 flex items-start gap-2.5 mt-2">
                <svg className="w-5 h-5 text-[#9333EA] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-[#4B5563]">
                  We sent a 6-digit OTP to <span className="font-semibold text-gray-900 break-all">{email}</span>
                </p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-1 text-sm">
                <span className="text-[#6B7280]">Codes expire shortly — enter yours promptly.</span>
                <button
                  type="button"
                  disabled={resendCooldown > 0 || sending}
                  onClick={handleResendOtp}
                  className={`font-bold transition-all text-left ${
                    resendCooldown > 0 || sending
                      ? "text-[#9CA3AF] cursor-not-allowed"
                      : "text-[#7C3AED] hover:underline cursor-pointer"
                  }`}
                >
                  {sending
                    ? "Sending…"
                    : resendCooldown > 0
                      ? `Resend code in ${resendCooldown}s`
                      : "Resend code"}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={busy}
              className="btn-gradient-primary w-full rounded-xl py-4 text-base font-bold text-white shadow-lg shadow-[#8B5CF6]/25 disabled:opacity-60 transition-all hover:shadow-xl hover:shadow-[#6366F1]/30 hover:opacity-90 cursor-pointer"
            >
              {verifying && (
                <LoadingSpinner className="h-5 w-5" color="white" />
              )}
              {verifying ? "Verifying…" : "Verify code"}
            </button>
            <button
              type="button"
              className="w-full text-base font-semibold text-[#7C3AED] hover:underline cursor-pointer"
              onClick={() => {
                setStep("email");
                setFormError(null);
                setSuccessMessage(null);
                setResendCooldown(0);
              }}
            >
              Use a different email
            </button>
          </form>
        )}

        {step === "password" && (
          <form className="space-y-6" onSubmit={handlePasswordSubmit}>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-[0.1em] text-[#4B5563] mb-1">
                New password
              </label>
              <div className="relative">
                <input
                  required
                  type={passwordVisible ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value.replace(/\s/g, ""))}
                  autoComplete="new-password"
                  placeholder="Create a strong password"
                  className="w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-5 py-4 pr-12 text-base text-[#1F2937] placeholder:text-[#9CA3AF] outline-none transition-all focus:border-[#C084FC] focus:bg-white focus:ring-2 focus:ring-[#8B5CF6]/20"
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible((v) => !v)}
                  aria-label={passwordVisible ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-[#9CA3AF] hover:text-[#111827] hover:bg-gray-200/60 transition-all duration-200 cursor-pointer hover:opacity-80"
                >
                  {passwordVisible ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="text-xs text-[#6B7280] leading-relaxed">{PASSWORD_HINT}</p>
            </div>
            <button
              type="submit"
              disabled={busy}
              className="btn-gradient-primary w-full rounded-xl py-4 text-base font-bold text-white shadow-lg shadow-[#8B5CF6]/25 disabled:opacity-60 transition-all hover:shadow-xl hover:shadow-[#6366F1]/30 hover:opacity-90 cursor-pointer"
            >
              {resetting && (
                <LoadingSpinner className="h-5 w-5" color="white" />
              )}
              {resetting ? "Saving…" : "Update password"}
            </button>
          </form>
        )}

        <p className="text-center text-base leading-relaxed text-[#9CA3AF]">
          Codes expire shortly — enter yours promptly. Need help?{" "}
          <Link
            href="mailto:support@maxtronize.com"
            className="font-bold text-[#7C3AED] hover:underline"
          >
            Contact support
          </Link>
          .
        </p>
      </div>
    </AuthLayout>
  );
}
