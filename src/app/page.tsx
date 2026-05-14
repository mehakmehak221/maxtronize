"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthLayout from "@/components/AuthLayout";
import { formatRequestError } from "@/lib/formatRequestError";
import { uiPersonaToApiRole } from "@/lib/authUi";
import { useLoginMutation, useRegisterMutation } from "@/store/api/authApi";

export default function Home() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState<"issuer" | "investor">("issuer");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const [login, { isLoading: loginLoading }] = useLoginMutation();
  const [register, { isLoading: registerLoading }] = useRegisterMutation();
  const busy = isSignUp ? registerLoading : loginLoading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (isSignUp) {
      const fullName = `${firstName} ${lastName}`.trim();
      if (!fullName) {
        setFormError("Please enter your name.");
        return;
      }
      try {
        await register({
          fullName,
          email: email.trim(),
          password,
          role: uiPersonaToApiRole(role),
          ...(referralCode.trim()
            ? { referralCode: referralCode.trim() }
            : {}),
        }).unwrap();
        setIsSignUp(false);
        setPassword("");
      } catch (err) {
        setFormError(formatRequestError(err));
      }
      return;
    }
    try {
      await login({
        email: email.trim(),
        password,
        role: uiPersonaToApiRole(role),
      }).unwrap();
      router.push(role === "investor" ? "/investor/hub" : "/issuer/dashboard");
    } catch (err) {
      setFormError(formatRequestError(err));
    }
  }

  return (
    <AuthLayout isSignUp={isSignUp} onToggle={setIsSignUp}>
      <div className="space-y-8">
        <div>
          <p className="text-[10px] font-bold text-[#4B5563] uppercase tracking-[0.1em] mb-4">
            I am a
          </p>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setRole("issuer")}
              className={`flex flex-col items-center justify-center p-6 border-2 rounded-2xl transition-all ${role === "issuer" ? "border-[#C084FC] bg-[#faf5ff] text-[#7C3AED]" : "border-[#E5E7EB] bg-[#F9FAFB] text-[#9CA3AF] hover:border-[#D1D5DB]"}`}
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
              <span className="text-xs font-bold">Asset Issuer</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("investor")}
              className={`flex flex-col items-center justify-center p-6 border-2 rounded-2xl transition-all ${role === "investor" ? "border-[#C084FC] bg-[#faf5ff] text-[#7C3AED]" : "border-[#E5E7EB] bg-[#F9FAFB] text-[#9CA3AF] hover:border-[#D1D5DB]"}`}
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
              <span className="text-xs font-bold">Investor</span>
            </button>
          </div>
        </div>

        {formError && (
          <p
            className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {formError}
          </p>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {isSignUp && (
            <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-1 duration-300">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#4B5563] uppercase tracking-[0.1em]">
                  First Name
                </label>
                <input
                  required={isSignUp}
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  autoComplete="given-name"
                  placeholder="Alex"
                  className="w-full px-5 py-4 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-sm text-[#1F2937] placeholder:text-[#9CA3AF] outline-none transition-all focus:bg-white focus:border-[#C084FC] focus:ring-2 focus:ring-[#8B5CF6]/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#4B5563] uppercase tracking-[0.1em]">
                  Last Name
                </label>
                <input
                  required={isSignUp}
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  autoComplete="family-name"
                  placeholder="Chen"
                  className="w-full px-5 py-4 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-sm text-[#1F2937] placeholder:text-[#9CA3AF] outline-none transition-all focus:bg-white focus:border-[#C084FC] focus:ring-2 focus:ring-[#8B5CF6]/20"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#4B5563] uppercase tracking-[0.1em]">
              Work Email
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder={isSignUp ? "you@yourfirm.com" : "alex@maxtronize.com"}
              className="w-full px-5 py-4 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-sm text-[#1F2937] placeholder:text-[#9CA3AF] outline-none transition-all focus:bg-white focus:border-[#C084FC] focus:ring-2 focus:ring-[#8B5CF6]/20"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-[#4B5563] uppercase tracking-[0.1em]">
                Password
              </label>
              {!isSignUp && (
                <Link
                  href="/forgot-password"
                  className="text-[10px] font-bold text-[#7C3AED] hover:underline"
                >
                  Forgot password?
                </Link>
              )}
            </div>
            <div className="relative">
              <input
                required
                type={passwordVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isSignUp ? "Create a strong password" : ""}
                autoComplete={isSignUp ? "new-password" : "current-password"}
                minLength={isSignUp ? 8 : undefined}
                className="w-full px-5 py-4 pr-12 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-sm text-[#1F2937] placeholder:text-[#9CA3AF] outline-none transition-all focus:bg-white focus:border-[#C084FC] focus:ring-2 focus:ring-[#8B5CF6]/20"
              />
              <button
                type="button"
                onClick={() => setPasswordVisible((v) => !v)}
                aria-label={passwordVisible ? "Hide password" : "Show password"}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#4B5563]"
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
          </div>

          {isSignUp && (
            <div className="space-y-2 animate-in fade-in duration-300">
              <label className="text-[10px] font-bold text-[#4B5563] uppercase tracking-[0.1em]">
                Referral code{" "}
                <span className="font-normal normal-case text-[#9CA3AF]">
                  (optional)
                </span>
              </label>
              <input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                autoComplete="off"
                placeholder="Enter code if you have one"
                className="w-full px-5 py-4 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-sm text-[#1F2937] placeholder:text-[#9CA3AF] outline-none transition-all focus:bg-white focus:border-[#C084FC] focus:ring-2 focus:ring-[#8B5CF6]/20"
              />
            </div>
          )}

          {!isSignUp && (
            <div className="flex items-center gap-3">
              <div className="flex h-5 w-5 items-center justify-center rounded bg-[#7C3AED] shadow-sm">
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
              </div>
              <span className="text-sm font-medium text-[#9CA3AF]">
                Remember me for 30 days
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="btn-gradient-primary w-full py-4 text-white font-bold rounded-2xl shadow-lg shadow-[#8B5CF6]/25 hover:shadow-xl hover:shadow-[#6366F1]/30 transition-all flex items-center justify-center gap-2 text-sm group disabled:opacity-60"
          >
            {busy
              ? isSignUp
                ? "Creating account…"
                : "Signing in…"
              : isSignUp
                ? "Create Account"
                : "Sign In to Platform"}
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
          </button>
        </form>

        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E5E7EB]"></div>
          </div>
          <span className="relative bg-white px-4 text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF]">
            or continue with
          </span>
        </div>

        <button
          type="button"
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#E5E7EB] bg-white py-4 text-sm font-bold text-[#1F2937] transition-all hover:bg-[#F9FAFB]"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.6575 4.66327V2.66472C12.6575 2.48804 12.5873 2.31859 12.4623 2.19366C12.3374 2.06872 12.168 1.99854 11.9913 1.99854H3.3309C2.97754 1.99854 2.63864 2.13891 2.38878 2.38878C2.13891 2.63864 1.99854 2.97754 1.99854 3.3309C1.99854 3.68427 2.13891 4.02316 2.38878 4.27303C2.63864 4.52289 2.97754 4.66327 3.3309 4.66327H13.3237C13.5003 4.66327 13.6698 4.73346 13.7947 4.85839C13.9196 4.98332 13.9898 5.15277 13.9898 5.32945V7.99419M13.9898 7.99419H11.9913C11.6379 7.99419 11.299 8.13456 11.0492 8.38443C10.7993 8.63429 10.6589 8.97319 10.6589 9.32655C10.6589 9.67992 10.7993 10.0188 11.0492 10.2687C11.299 10.5185 11.6379 10.6589 11.9913 10.6589H13.9898C14.1665 10.6589 14.336 10.5887 14.4609 10.4638C14.5858 10.3389 14.656 10.1694 14.656 9.99274V8.66037C14.656 8.48369 14.5858 8.31424 14.4609 8.18931C14.336 8.06437 14.1665 7.99419 13.9898 7.99419Z"
              stroke="#90A1B9"
              strokeWidth="1.33237"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1.99854 3.33093V12.6575C1.99854 13.0109 2.13891 13.3498 2.38878 13.5996C2.63864 13.8495 2.97754 13.9899 3.3309 13.9899H13.3237C13.5003 13.9899 13.6698 13.9197 13.7947 13.7947C13.9196 13.6698 13.9898 13.5004 13.9898 13.3237V10.6589"
              stroke="#90A1B9"
              strokeWidth="1.33237"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Connect Wallet (MetaMask / WalletConnect)
        </button>

        <div className="text-center pt-2">
          <p className="text-sm font-medium text-[#9CA3AF]">
            {isSignUp ? (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="font-bold text-[#7C3AED] hover:underline"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="font-bold text-[#7C3AED] hover:underline"
                >
                  Apply for institutional access →
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
