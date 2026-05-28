"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AuthLayout from "@/components/AuthLayout";
import { SetupProfileForm } from "@/components/profile/SetupProfileForm";
import { isAuthenticated } from "@/lib/auth";
import { useAuthenticatedProfileQuery } from "@/store/api/authApi";
import { isProfileComplete } from "@/lib/profile";
import { portalHomeForRole } from "@/lib/authUi";
import { getSession } from "@/lib/auth";

export default function SetupProfilePage() {
  const router = useRouter();
  const { data: profile, isLoading } = useAuthenticatedProfileQuery();

  useEffect(() => {
    if (typeof window !== "undefined" && !isAuthenticated()) {
      router.replace("/signin");
    }
  }, [router]);

  useEffect(() => {
    if (!isLoading && isProfileComplete(profile)) {
      const { role } = getSession();
      if (role) router.replace(portalHomeForRole(role));
    }
  }, [isLoading, profile, router]);

  return (
    <AuthLayout isSignUp={false} hideToggle>
      <div className="min-w-0 space-y-6 animate-fade-in sm:space-y-8">
        <div>
          <h2 className="mb-2 text-xl font-bold text-[#111827] sm:text-2xl">
            Complete your profile
          </h2>
          <p className="text-sm leading-relaxed text-[#6B7280]">
            We need a few details to submit your investor verification profile.
            After submission, your details will be reviewed before protected
            investment actions are unlocked.
          </p>
        </div>
        <SetupProfileForm />
      </div>
    </AuthLayout>
  );
}
