"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatRequestError } from "@/lib/formatRequestError";
import { portalHomeForRole } from "@/lib/authUi";
import { getSession } from "@/lib/auth";
import { useSetupProfileMutation } from "@/store/api/authApi";

const inputClass =
  "w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-5 py-4 text-sm text-[#1F2937] placeholder:text-[#9CA3AF] outline-none transition-all focus:border-[#C084FC] focus:bg-white focus:ring-2 focus:ring-[#8B5CF6]/20";

export function SetupProfileForm() {
  const router = useRouter();
  const { role } = getSession();
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [nationality, setNationality] = useState("");
  const [residentialAddress, setResidentialAddress] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const [setupProfile, { isLoading }] = useSetupProfileMutation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    try {
      await setupProfile({
        fullName: fullName.trim(),
        dateOfBirth,
        nationality: nationality.trim(),
        residentialAddress: residentialAddress.trim(),
      }).unwrap();
      const home = role ? portalHomeForRole(role) : "/signin";
      router.replace(home);
    } catch (err) {
      setFormError(formatRequestError(err));
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {formError ? (
        <p
          className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {formError}
        </p>
      ) : null}

      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#4B5563]">
          Full name
        </label>
        <input
          required
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className={inputClass}
          placeholder="Alex Chen"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#4B5563]">
          Date of birth
        </label>
        <input
          required
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#4B5563]">
          Nationality
        </label>
        <input
          required
          type="text"
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
          className={inputClass}
          placeholder="United States"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#4B5563]">
          Residential address
        </label>
        <textarea
          required
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
        className="btn-gradient-primary w-full rounded-xl py-4 text-sm font-bold text-white shadow-lg shadow-[#8B5CF6]/25 disabled:opacity-60"
      >
        {isLoading ? "Saving…" : "Complete profile"}
      </button>
    </form>
  );
}
