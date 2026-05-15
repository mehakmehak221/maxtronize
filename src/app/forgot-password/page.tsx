"use client";

import { useState } from "react";
import AuthLayout from "@/components/AuthLayout";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <AuthLayout
      isSignUp={false}
      hideToggle
      onToggle={() => router.push("/signup")}
    >
      {submitted ? (
        <div className="min-w-0 space-y-6 animate-fade-in sm:space-y-8">
          <div className="flex flex-col items-center text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#E9D5FF] bg-[#faf5ff]">
              <svg
                className="h-8 w-8 text-[#7C3AED]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-bold text-[#111827] sm:text-2xl">
              Check your inbox
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-[#6B7280]">
              If an account exists for{" "}
              <span className="font-semibold text-[#1F2937]">{email}</span>,
              you&apos;ll receive a password reset link shortly. Links expire in
              30 minutes.
            </p>
          </div>

          <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4">
            <p className="text-xs leading-relaxed text-[#6B7280]">
              Didn&apos;t get it? Check your spam folder, or{" "}
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="font-bold text-[#9810FA] hover:underline"
              >
                resend the link
              </button>
              .
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/signin")}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#9810FA] to-[#4F39F6] py-4 text-sm font-bold text-white shadow-lg shadow-[#9810FA]/25 transition-all hover:shadow-xl hover:shadow-[#4F39F6]/30"
          >
            Back to Sign In
          </button>
        </div>
      ) : (
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
              Forgot your password?
            </h2>
            <p className="text-sm leading-relaxed text-[#6B7280]">
              Enter your work email and we&apos;ll send a secure link to reset
              your password.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#4B5563]">
                Work Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@maxtronize.com"
                required
                autoComplete="email"
                className="w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-5 py-4 text-sm text-[#1F2937] placeholder:text-[#9CA3AF] outline-none transition-all focus:border-[#C084FC] focus:bg-white focus:ring-2 focus:ring-[#8B5CF6]/20"
              />
            </div>

            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#9810FA] to-[#4F39F6] py-4 text-sm font-bold text-white shadow-lg shadow-[#9810FA]/25 transition-all hover:shadow-xl hover:shadow-[#4F39F6]/30"
            >
              Send Reset Link
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

          <p className="text-center text-xs leading-relaxed text-[#9CA3AF]">
            Reset links are single-use and expire after 30 minutes. Need help?{" "}
            <a
              href="mailto:support@maxtronize.com"
              className="font-bold text-[#7C3AED] hover:underline"
            >
              Contact support
            </a>
            .
          </p>
        </div>
      )}
    </AuthLayout>
  );
}
