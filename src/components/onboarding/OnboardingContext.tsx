"use client";

import React, { createContext, useContext } from "react";
import { useIssuerOnboarding } from "@/hooks/useIssuerOnboarding";

type OnboardingContextValue = ReturnType<typeof useIssuerOnboarding>;

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const value = useIssuerOnboarding();
  return (
    <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }
  return ctx;
}
