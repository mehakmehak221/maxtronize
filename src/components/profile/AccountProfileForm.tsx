"use client";

import { useEffect, useMemo, useState } from "react";
import { getSession, signIn } from "@/lib/auth";
import { formatRequestError } from "@/lib/formatRequestError";
import type { UserProfile } from "@/lib/profile";
import {
  useAuthenticatedProfileQuery,
  useUpdateProfileMutation,
} from "@/store/api/authApi";

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
  const activeProfile =
    profile ||
    (session.email
      ? {
          email: session.email,
          fullName: session.email.split("@")[0],
          country: "",
        }
      : null);

  if (!activeProfile) return null;

  return <AccountProfileFormInner profile={activeProfile as UserProfile} />;
}

function AccountProfileFormInner({ profile }: { profile: UserProfile }) {
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const profileSnapshot = useMemo(
    () => ({
      fullName: profile.fullName ?? "",
      country: profile.country ?? profile.nationality ?? "",
      dateOfBirth: profile.dateOfBirth ?? "",
      residentialAddress: profile.residentialAddress ?? "",
    }),
    [
      profile.fullName,
      profile.country,
      profile.nationality,
      profile.dateOfBirth,
      profile.residentialAddress,
    ],
  );

  const [fullName, setFullName] = useState(profileSnapshot.fullName);
  const [country, setCountry] = useState(profileSnapshot.country);
  const [dateOfBirth, setDateOfBirth] = useState(profileSnapshot.dateOfBirth);
  const [residentialAddress, setResidentialAddress] = useState(
    profileSnapshot.residentialAddress,
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    setFullName(profileSnapshot.fullName);
    setCountry(profileSnapshot.country);
    setDateOfBirth(profileSnapshot.dateOfBirth);
    setResidentialAddress(profileSnapshot.residentialAddress);
  }, [profileSnapshot]);

  const countryRegex = /^[a-zA-ZÀ-ÿ\s'\-\.]+$/;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSuccess(null);
    const trimmedName = fullName.trim();
    const trimmedCountry = country.trim();
    const trimmedAddress = residentialAddress.trim();
    if (!trimmedName) {
      setFormError("Full name is required.");
      return;
    }
    if (!trimmedCountry) {
      setFormError("Country is required.");
      return;
    }
    if (!countryRegex.test(trimmedCountry)) {
      setFormError(
        "Country name can only contain letters, spaces, hyphens, apostrophes, and periods.",
      );
      return;
    }
    try {
      await updateProfile({
        fullName: trimmedName,
        country: trimmedCountry,
        nationality: trimmedCountry,
        ...(dateOfBirth.trim() ? { dateOfBirth: dateOfBirth.trim() } : {}),
        ...(trimmedAddress ? { residentialAddress: trimmedAddress } : {}),
      }).unwrap();

      const session = getSession();
      if (session.role) {
        signIn({
          role: session.role,
          email: profile.email ?? session.email ?? undefined,
          name: trimmedName,
        });
      }

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
          value={profile.email ?? ""}
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
          Date of birth
        </label>
        <input
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-widest text-ui-faint">
          Country / Nationality
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

      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-widest text-ui-faint">
          Residential address
        </label>
        <textarea
          value={residentialAddress}
          onChange={(e) => setResidentialAddress(e.target.value)}
          rows={3}
          className={inputClass}
          placeholder="Street, city, state, postal code, country"
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
