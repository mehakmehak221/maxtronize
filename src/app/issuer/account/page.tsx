"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { AccountProfileForm } from "@/components/profile/AccountProfileForm";

export default function IssuerAccountPage() {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6 lg:p-8">
        <div>
          <h1 className="text-2xl font-bold text-ui-strong">Account settings</h1>
          <p className="mt-1 text-sm text-ui-muted-text">
            Update your profile details. Email and phone are managed by support.
          </p>
        </div>
        <AccountProfileForm />
      </div>
    </DashboardLayout>
  );
}
