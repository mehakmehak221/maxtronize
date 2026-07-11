"use client";

import { useState, useEffect } from "react";
import { getSession, signIn } from "@/lib/auth";
import { formatRequestError } from "@/lib/formatRequestError";
import type { UserProfile } from "@/lib/profile";
import {
  useAuthenticatedProfileQuery,
  useUpdateProfileMutation,
  useSetupProfileMutation,
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
          id: null,
          onboardingId: null,
          email: session.email,
          fullName: session.email.split("@")[0],
          country: "",
          role: null,
          dateOfBirth: null,
          nationality: null,
          residentialAddress: null,
          profileComplete: false,
          kycStatus: null,
          kycVerified: false,
        }
      : null);

  if (!activeProfile) return null;

  return (
    <AccountProfileFormInner
      key={`${activeProfile.id ?? ""}:${activeProfile.email ?? ""}`}
      profile={activeProfile as UserProfile}
    />
  );
}

function AccountProfileFormInner({ profile }: { profile: UserProfile }) {
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [setupProfile, { isLoading: isSettingUp }] = useSetupProfileMutation();

  const [fullName, setFullName] = useState(profile.fullName ?? "");
  const [country, setCountry] = useState(
    profile.country ?? profile.nationality ?? "",
  );
  const [dateOfBirth, setDateOfBirth] = useState(profile.dateOfBirth ?? "");
  const [residentialAddress, setResidentialAddress] = useState(
    profile.residentialAddress ?? "",
  );

  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Sync profile data dynamically when it gets retrieved or updated
  useEffect(() => {
    if (profile.fullName) setFullName(profile.fullName);
    if (profile.country || profile.nationality) {
      setCountry(profile.country ?? profile.nationality ?? "");
    }
    if (profile.dateOfBirth) setDateOfBirth(profile.dateOfBirth);
    if (profile.residentialAddress) setResidentialAddress(profile.residentialAddress);
  }, [profile]);

  const countryRegex = /^[a-zA-ZÀ-ÿ\s'\-\.]+$/;

  const isComplete = profile.profileComplete;
  const isLoading = isUpdating || isSettingUp;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSuccess(null);
    const trimmedName = fullName.trim();
    const trimmedCountry = country.trim();
    const trimmedDob = dateOfBirth.trim();
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

    if (!isComplete) {
      if (!trimmedDob) {
        setFormError("Date of birth is required.");
        return;
      }
      if (!trimmedAddress) {
        setFormError("Residential address is required.");
        return;
      }
    }

    try {
      if (!isComplete) {
        // Call setup mutation to complete profile verification setup
        await setupProfile({
          fullName: trimmedName,
          dateOfBirth: trimmedDob,
          nationality: trimmedCountry,
          residentialAddress: trimmedAddress,
        }).unwrap();
        setSuccess("Profile submitted for verification successfully.");
      } else {
        // Call update mutation to change editable info
        await updateProfile({
          fullName: trimmedName,
          country: trimmedCountry,
          dateOfBirth: trimmedDob,
          residentialAddress: trimmedAddress,
        }).unwrap();
        setSuccess("Profile updated successfully.");
      }

      const session = getSession();
      if (session.role) {
        signIn({
          role: session.role,
          email: profile.email ?? session.email ?? undefined,
          name: trimmedName,
        });
      }
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
          Date of birth
        </label>
        <input
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          disabled={isComplete}
          required={!isComplete}
          className={`${inputClass} ${isComplete ? "cursor-not-allowed opacity-70" : ""}`}
        />
        {isComplete && (
          <p className="text-xs text-ui-faint">
            Date of birth is verified and cannot be updated directly. Contact support if changes are required.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-widest text-ui-faint">
          Residential Address
        </label>
        <textarea
          value={residentialAddress}
          onChange={(e) => setResidentialAddress(e.target.value)}
          disabled={isComplete}
          required={!isComplete}
          rows={3}
          className={`${inputClass} ${isComplete ? "cursor-not-allowed opacity-70" : ""}`}
          placeholder="Street, city, state, postal code, country"
        />
        {isComplete && (
          <p className="text-xs text-ui-faint">
            Address is verified and cannot be updated directly. Contact support if changes are required.
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn-gradient-primary rounded-xl px-6 py-3 text-base font-bold text-white shadow-lg shadow-violet-500/20 disabled:opacity-60"
      >
        {isLoading
          ? "Saving…"
          : isComplete
          ? "Save changes"
          : "Submit profile for verification"}
      </button>
    </form>
  );
}
