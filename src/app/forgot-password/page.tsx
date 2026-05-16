"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthLayout from "@/components/AuthLayout";
import { formatRequestError } from "@/lib/formatRequestError";
import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyForgotPasswordOtpMutation,
} from "@/store/api/authApi";

type Step = "email" | "otp" | "password";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [sendOtp, { isLoading: sending }] = useForgotPasswordMutation();
  const [verifyOtp, { isLoading: verifying }] =
    useVerifyForgotPasswordOtpMutation();
  const [resetPassword, { isLoading: resetting }] = useResetPasswordMutation();

  const busy = sending || verifying || resetting;

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
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
          : "OTP sent successfully";
      setSuccessMessage(message);
      setStep("otp");
    } catch (err) {
      setFormError(formatRequestError(err));
    }
  }

  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);
    try {
      const result = await verifyOtp({
        email: email.trim(),
        otp: otp.trim(),
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
    try {
      await resetPassword({
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
      }).unwrap();
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
    <AuthLayout
      isSignUp={false}
      hideToggle
      onToggle={() => router.push("/signup")}
    >
      <div className="min-w-0 space-y-6 animate-fade-in sm:space-y-8">
        <div>
          <button
            type="button"
            onClick={() => router.push("/signin")}
            className="mb-4 flex items-center gap-1.5 text-xs font-bold text-[#6B7280] transition-colors hover:text-[#7C3AED]"
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
          <p className="text-sm leading-relaxed text-[#6B7280]">
            {stepDescription}
          </p>
        </div>

        {formError && (
          <p
            className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {formError}
          </p>
        )}
        {successMessage && step !== "email" && (
          <p className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {successMessage}
          </p>
        )}

        {step === "email" && (
          <form className="space-y-6" onSubmit={handleEmailSubmit}>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#4B5563]">
                Work Email
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="alex@maxtronize.com"
                className="w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-5 py-4 text-sm text-[#1F2937] placeholder:text-[#9CA3AF] outline-none transition-all focus:border-[#C084FC] focus:bg-white focus:ring-2 focus:ring-[#8B5CF6]/20"
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="btn-gradient-primary group flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-bold text-white shadow-lg shadow-[#8B5CF6]/25 transition-all hover:shadow-xl hover:shadow-[#6366F1]/30 disabled:opacity-60"
            >
              {sending ? "Sending…" : "Send reset code"}
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
            </button>
          </form>
        )}

        {step === "otp" && (
          <form className="space-y-6" onSubmit={handleOtpSubmit}>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#4B5563]">
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
                className="w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-5 py-4 text-sm text-[#1F2937] placeholder:text-[#9CA3AF] outline-none transition-all focus:border-[#C084FC] focus:bg-white focus:ring-2 focus:ring-[#8B5CF6]/20"
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="btn-gradient-primary w-full rounded-xl py-4 text-sm font-bold text-white shadow-lg shadow-[#8B5CF6]/25 disabled:opacity-60"
            >
              {verifying ? "Verifying…" : "Verify code"}
            </button>
            <button
              type="button"
              className="w-full text-sm font-semibold text-[#7C3AED] hover:underline"
              onClick={() => {
                setStep("email");
                setFormError(null);
                setSuccessMessage(null);
              }}
            >
              Use a different email
            </button>
          </form>
        )}

        {step === "password" && (
          <form className="space-y-6" onSubmit={handlePasswordSubmit}>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#4B5563]">
                New password
              </label>
              <input
                required
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                minLength={8}
                placeholder="Create a new password"
                className="w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-5 py-4 text-sm text-[#1F2937] placeholder:text-[#9CA3AF] outline-none transition-all focus:border-[#C084FC] focus:bg-white focus:ring-2 focus:ring-[#8B5CF6]/20"
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="btn-gradient-primary w-full rounded-xl py-4 text-sm font-bold text-white shadow-lg shadow-[#8B5CF6]/25 disabled:opacity-60"
            >
              {resetting ? "Saving…" : "Update password"}
            </button>
          </form>
        )}

        <p className="text-center text-xs leading-relaxed text-[#9CA3AF]">
          Codes expire after 30 minutes. Need help?{" "}
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
