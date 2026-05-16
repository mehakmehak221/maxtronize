"use client";

import { useEffect, useState } from "react";
import { formatRequestError } from "@/lib/formatRequestError";
import {
  useAuthenticatedProfileQuery,
  useUpdateProfileMutation,
} from "@/store/api/authApi";

const inputClass =
  "w-full rounded-xl border border-ui-border bg-ui-card px-5 py-3.5 text-sm text-ui-strong outline-none transition-all focus:border-violet-300 focus:ring-4 focus:ring-violet-500/10";

export function AccountProfileForm() {
  const { data: profile, isLoading: loadingProfile } =
    useAuthenticatedProfileQuery();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName ?? "");
      setCountry(profile.country ?? "");
    }
  }, [profile]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSuccess(null);
    try {
      await updateProfile({
        fullName: fullName.trim() || undefined,
        country: country.trim() || undefined,
      }).unwrap();
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setFormError(formatRequestError(err));
    }
  }

  if (loadingProfile) {
    return (
      <p className="text-sm text-ui-muted-text">Loading profile…</p>
    );
  }

  return (
    <form className="max-w-xl space-y-6" onSubmit={handleSubmit}>
      {formError ? (
        <p
          className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {formError}
        </p>
      ) : null}
      {success ? (
        <p className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </p>
      ) : null}

      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-ui-faint">
          Email
        </label>
        <input
          type="email"
          value={profile?.email ?? ""}
          disabled
          className={`${inputClass} cursor-not-allowed opacity-70`}
        />
        <p className="text-[11px] text-ui-faint">
          Email cannot be changed here. Contact support if you need to update it.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-ui-faint">
          Full name
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-ui-faint">
          Country
        </label>
        <input
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className={inputClass}
          placeholder="United States"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn-gradient-primary rounded-xl px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/20 disabled:opacity-60"
      >
        {isLoading ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
