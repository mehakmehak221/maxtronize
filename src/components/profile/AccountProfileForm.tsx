"use client";

import { useEffect, useState } from "react";
import { formatRequestError } from "@/lib/formatRequestError";
import {
  useAuthenticatedProfileQuery,
  useUpdateProfileMutation,
} from "@/store/api/authApi";
import { getSession } from "@/lib/auth";

const inputClass =
  "w-full rounded-xl border border-ui-border bg-ui-card px-5 py-4 text-base leading-normal text-ui-strong outline-none transition-all focus:border-violet-300 focus:ring-4 focus:ring-violet-500/10";

export function AccountProfileForm() {
  const { data: profile, isLoading: loadingProfile } =
    useAuthenticatedProfileQuery();

  if (loadingProfile) {
    return (
      <p className="text-base text-ui-muted-text">Loading profile…</p>
    );
  }

  const session = typeof window !== "undefined" ? getSession() : { email: null };
  const activeProfile = profile || (session.email ? {
    email: session.email,
    fullName: session.email.split("@")[0],
    country: "",
  } : null);

  if (!activeProfile) return null;

  return <AccountProfileFormInner profile={activeProfile} />;
}

function AccountProfileFormInner({ profile }: { profile: any }) {
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const [fullName, setFullName] = useState(profile.fullName ?? "");
  const [country, setCountry] = useState(profile.country ?? profile.nationality ?? "");
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const countryRegex = /^[a-zA-ZÀ-ÿ\s'\-\.]+$/;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSuccess(null);
    const trimmedName = fullName.trim();
    const trimmedCountry = country.trim();
    if (!trimmedName) {
      setFormError("Full name is required.");
      return;
    }
    if (!trimmedCountry) {
      setFormError("Country is required.");
      return;
    }
    if (!countryRegex.test(trimmedCountry)) {
      setFormError("Country name can only contain letters, spaces, hyphens, apostrophes, and periods.");
      return;
    }
    try {
      await updateProfile({
        fullName: trimmedName,
        country: trimmedCountry,
      }).unwrap();
      try {
        localStorage.setItem("maxtronize_user_name", trimmedName);
      } catch (e) {}
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setFormError(formatRequestError(err));
    }
  }

  return (
    <form className="max-w-xl space-y-6" onSubmit={handleSubmit}>
      {formError ? (
        <p
          className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-base text-red-700"
          role="alert"
        >
          {formError}
        </p>
      ) : null}
      {success ? (
        <p className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-base text-emerald-700">
          {success}
        </p>
      ) : null}

      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-widest text-ui-faint">
          Email
        </label>
        <input
          type="email"
          value={profile?.email ?? ""}
          disabled
          className={`${inputClass} cursor-not-allowed opacity-70`}
        />
        <p className="text-xs text-ui-faint">
          Email cannot be changed here. Contact support if you need to update it.
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-widest text-ui-faint">
          Full name
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className={inputClass}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-widest text-ui-faint">
          Country
        </label>
        <input
          type="text"
          value={country}
          onChange={(e) =>
            setCountry(e.target.value.replace(/[^a-zA-ZÀ-ÿ\s'\-\.]/g, ""))
          }
          required
          className={inputClass}
          placeholder="United States"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn-gradient-primary rounded-xl px-6 py-3 text-base font-bold text-white shadow-lg shadow-violet-500/20 disabled:opacity-60"
      >
        {isLoading ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
