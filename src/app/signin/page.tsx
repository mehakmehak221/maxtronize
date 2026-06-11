"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import AuthLayout from "@/components/AuthLayout";
import { formatRequestError } from "@/lib/formatRequestError";
import { uiPersonaToApiRole } from "@/lib/authUi";
import { getPostAuthRedirect } from "@/lib/authSession";
import { useLoginMutation } from "@/store/api/authApi";
import { useAppDispatch } from "@/store/hooks";
import { LoadingSpinner } from "@/app/components/VectorImages";
import toast from "react-hot-toast";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const passwordResetSuccess = searchParams.get("reset") === "1";
  const [role, setRole] = useState<"issuer" | "investor">("issuer");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError(null);

    // Validate all fields simultaneously
    const trimmedEmail = email.trim();
    let emailErr: string | null = null;
    let passwordErr: string | null = null;

    if (!trimmedEmail) {
      emailErr = "Please enter your email address.";
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      emailErr = "Please enter a valid email address.";
    }

    if (!password) {
      passwordErr = "Please enter your password.";
    } else if (password.length < 8) {
      passwordErr = "Password must be at least 8 characters.";
    }

    setEmailError(emailErr);
    setPasswordError(passwordErr);

    if (emailErr || passwordErr) return;

    try {
      const data = await login({
        email: trimmedEmail,
        password,
        role: uiPersonaToApiRole(role),
        rememberMe,
      }).unwrap();
      toast.success("Signed in successfully!");
      const path = await getPostAuthRedirect(dispatch, data, role);
      router.push(path);
    } catch (err) {
      setApiError(formatRequestError(err));
    }
  }

  return (
    <AuthLayout isSignUp={false}>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div>
          <p className="text-xs font-bold text-[#4B5563] uppercase tracking-[0.1em] mb-4">
            I am a
          </p>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setRole("issuer")}
              className={`flex flex-col items-center justify-center p-6 border-2 rounded-2xl transition-all duration-200 cursor-pointer ${role === "issuer" ? "border-[#C084FC] bg-[#faf5ff] text-[#7C3AED] shadow-sm hover:opacity-80" : "border-[#E5E7EB] bg-[#F9FAFB] text-[#9CA3AF] hover:bg-[#F3F4F6] hover:text-[#4B5563] hover:border-[#D1D5DB]"}`}
            >
              <div className="w-10 h-10 mb-2 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                  <ellipse cx="12" cy="6" rx="8" ry="3" />
                  <path d="M4 6v4c0 1.657 3.582 3 8 3s8-1.343 8-3V6" />
                  <path d="M4 10v4c0 1.657 3.582 3 8 3s8-1.343 8-3v-4" />
                </svg>
              </div>
              <span className="text-base font-bold">Asset Issuer</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("investor")}
              className={`flex flex-col items-center justify-center p-6 border-2 rounded-2xl transition-all duration-200 cursor-pointer ${role === "investor" ? "border-[#C084FC] bg-[#faf5ff] text-[#7C3AED] shadow-sm hover:opacity-80" : "border-[#E5E7EB] bg-[#F9FAFB] text-[#9CA3AF] hover:bg-[#F3F4F6] hover:text-[#4B5563] hover:border-[#D1D5DB]"}`}
            >
              <div className="w-10 h-10 mb-2 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                  <polyline points="16 7 22 7 22 13" />
                </svg>
              </div>
              <span className="text-base font-bold">Investor</span>
            </button>
          </div>
        </div>

        {passwordResetSuccess && (
          <p className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-base text-emerald-700">
            Password reset successful. Sign in with your new password.
          </p>
        )}

        {apiError && (
          <p
            className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-base text-red-700"
            role="alert"
          >
            {apiError}
          </p>
        )}

        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#4B5563] uppercase tracking-[0.1em] mb-1">
                Work Email
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(null); }}
                  autoComplete="email"
                  placeholder="alex@maxtronize.com"
                  className={`w-full pl-10 pr-5 py-4 rounded-xl border bg-[#F9FAFB] text-base text-[#1F2937] placeholder:text-[#9CA3AF] outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#8B5CF6]/20 ${emailError
                    ? "border-red-400 focus:border-red-400"
                    : "border-[#E5E7EB] focus:border-[#C084FC]"
                    }`}
                />
              </div>
              {emailError && (
                <p className="text-xs text-red-600 mt-1" role="alert">{emailError}</p>
              )}
            </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold text-[#4B5563] uppercase tracking-[0.1em] mb-1">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-bold text-[#7C3AED] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                type={passwordVisible ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPasswordError(null); }}
                placeholder="Enter your password"
                autoComplete="current-password"
                className={`w-full pl-10 pr-12 py-4 rounded-xl border bg-[#F9FAFB] text-base text-[#1F2937] placeholder:text-[#9CA3AF] outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#8B5CF6]/20 ${passwordError
                  ? "border-red-400 focus:border-red-400"
                  : "border-[#E5E7EB] focus:border-[#C084FC]"
                  }`}
              />
              <button
                type="button"
                onClick={() => setPasswordVisible((v) => !v)}
                aria-label={passwordVisible ? "Hide password" : "Show password"}
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

          <div
            className="flex items-center gap-3 cursor-pointer group w-fit"
            onClick={() => setRememberMe(!rememberMe)}
          >
            <div
              className={`flex items-center justify-center w-5 h-5 rounded shadow-sm transition-colors ${
                rememberMe
                  ? "bg-[#7C3AED]"
                  : "bg-white border-2 border-[#E5E7EB] group-hover:border-[#C084FC]"
              }`}
            >
              {rememberMe && (
                <svg
                  className="w-3.5 h-3.5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="4"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <span className="text-base font-medium text-[#4B5563] group-hover:text-[#111827] transition-colors">
              Remember me for 30 days
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-gradient-primary w-full py-4 text-white font-bold rounded-xl shadow-lg shadow-[#8B5CF6]/25 hover:shadow-xl hover:shadow-[#6366F1]/30 hover:opacity-90 transition-all flex items-center justify-center gap-2 text-base group disabled:opacity-60 cursor-pointer"
          >
            {isLoading && (
              <LoadingSpinner className="h-5 w-5" color="white" />
            )}
            {isLoading ? "Signing in…" : "Sign In to Platform"}
            {!isLoading && (
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
            {"Don't have an account? "}
            <button
              type="button"
              onClick={() => router.push("/signup")}
              className="group inline-flex items-center gap-1 font-bold text-[#7C3AED] hover:text-[#6D28D9] transition-all focus:outline-none"
            >
              <span>Apply for institutional access</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
            </button>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}

function SignInFallback() {
  return (
    <AuthLayout isSignUp={false}>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="h-28 animate-pulse rounded-2xl bg-ui-muted-deep" />
        <div className="h-64 animate-pulse rounded-2xl bg-ui-muted-deep" />
      </div>
    </AuthLayout>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<SignInFallback />}>
      <SignInContent />
    </Suspense>
  );
}
