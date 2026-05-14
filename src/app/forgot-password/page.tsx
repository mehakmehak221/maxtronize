"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ForceLightTheme } from "@/components/ForceLightTheme";
import { MaxtronizeLogo } from "@/components/MaxtronizeLogo";
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

  const [sendOtp, { isLoading: sending }] = useForgotPasswordMutation();
  const [verifyOtp, { isLoading: verifying }] =
    useVerifyForgotPasswordOtpMutation();
  const [resetPassword, { isLoading: resetting }] = useResetPasswordMutation();

  const busy = sending || verifying || resetting;

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    try {
      await sendOtp({ email: email.trim() }).unwrap();
      setStep("otp");
    } catch (err) {
      setFormError(formatRequestError(err));
    }
  }

  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    try {
      await verifyOtp({ email: email.trim(), otp: otp.trim() }).unwrap();
      setStep("password");
    } catch (err) {
      setFormError(formatRequestError(err));
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    try {
      await resetPassword({
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
      }).unwrap();
      setFormError(null);
      setStep("email");
      setEmail("");
      setOtp("");
      setNewPassword("");
      router.replace("/signin?reset=1");
    } catch (err) {
      setFormError(formatRequestError(err));
    }
  }

  return (
    <ForceLightTheme>
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#F9FAFB] px-4 py-10">
        <div className="mb-8 text-center">
          <div className="relative mx-auto mb-3 h-8 w-32">
            <MaxtronizeLogo
              fill
              sizes="128px"
              className="object-contain"
              alt="Maxtronize"
            />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#7C3AED]">
            Reset password
          </p>
        </div>

        <div className="w-full max-w-md rounded-2xl border border-[#E5E7EB] bg-white p-8 shadow-sm">
          {formError && (
            <p
              className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
              role="alert"
            >
              {formError}
            </p>
          )}

          {step === "email" && (
            <form className="space-y-5" onSubmit={handleEmailSubmit}>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#4B5563]">
                  Email
                </label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-5 py-4 text-sm text-[#1F2937] outline-none transition-all focus:border-[#C084FC] focus:bg-white focus:ring-2 focus:ring-[#8B5CF6]/20"
                  placeholder="you@yourfirm.com"
                />
              </div>
              <button
                type="submit"
                disabled={busy}
                className="btn-gradient-primary w-full rounded-xl py-4 text-sm font-bold text-white shadow-lg shadow-[#8B5CF6]/25 disabled:opacity-60"
              >
                {sending ? "Sending…" : "Send reset code"}
              </button>
            </form>
          )}

          {step === "otp" && (
            <form className="space-y-5" onSubmit={handleOtpSubmit}>
              <p className="text-sm text-[#6B7280]">
                Enter the code sent to{" "}
                <span className="font-semibold text-[#111827]">{email}</span>
              </p>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#4B5563]">
                  One-time code
                </label>
                <input
                  required
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  autoComplete="one-time-code"
                  className="w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-5 py-4 text-sm text-[#1F2937] outline-none transition-all focus:border-[#C084FC] focus:bg-white focus:ring-2 focus:ring-[#8B5CF6]/20"
                  placeholder="Enter OTP"
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
                }}
              >
                Use a different email
              </button>
            </form>
          )}

          {step === "password" && (
            <form className="space-y-5" onSubmit={handlePasswordSubmit}>
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
                  className="w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-5 py-4 text-sm text-[#1F2937] outline-none transition-all focus:border-[#C084FC] focus:bg-white focus:ring-2 focus:ring-[#8B5CF6]/20"
                  placeholder="Create a new password"
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

          <p className="mt-6 text-center text-sm text-[#9CA3AF]">
            <Link
              href="/signin"
              className="font-bold text-[#7C3AED] hover:underline"
            >
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </ForceLightTheme>
  );
}
