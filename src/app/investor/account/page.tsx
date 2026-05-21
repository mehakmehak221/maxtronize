"use client";

import { useSearchParams } from "next/navigation";
import InvestorLayout from "@/components/InvestorLayout";
import { AccountProfileForm } from "@/components/profile/AccountProfileForm";
import { useAuthenticatedProfileQuery } from "@/store/api/authApi";
import {
  isKycPendingReview,
  isKycRejected,
  isKycVerified,
} from "@/lib/profile";

export default function InvestorAccountPage() {
  const searchParams = useSearchParams();
  const { data: profile } = useAuthenticatedProfileQuery();
  const justSubmitted = searchParams.get("verification") === "submitted";
  const verified = isKycVerified(profile);
  const pendingReview = isKycPendingReview(profile);
  const rejected = isKycRejected(profile);

  return (
    <InvestorLayout>
      <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6 lg:p-8">
        <div>
          <h1 className="text-2xl font-bold text-ui-strong">Account settings</h1>
          <p className="mt-1 text-sm text-ui-muted-text">
            Update your profile details. Email and phone are managed by support.
          </p>
        </div>
        {justSubmitted || pendingReview ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-200">
            <p className="font-bold">Verification submitted</p>
            <p className="mt-1 leading-relaxed">
              Your investor profile has been submitted and is awaiting admin review.
              You can browse the platform, but investment actions will unlock after verification is approved.
            </p>
          </div>
        ) : null}
        {verified ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-200">
            <p className="font-bold">Verification approved</p>
            <p className="mt-1 leading-relaxed">
              Your investor verification is approved. Protected investment flows are available on eligible assets.
            </p>
          </div>
        ) : null}
        {rejected ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-800 dark:border-rose-500/25 dark:bg-rose-500/10 dark:text-rose-200">
            <p className="font-bold">Verification needs attention</p>
            <p className="mt-1 leading-relaxed">
              Your investor verification was not approved yet. Please update your profile details and follow any compliance instructions from support.
            </p>
          </div>
        ) : null}
        <AccountProfileForm />
      </div>
    </InvestorLayout>
  );
}
