const ONBOARDING_ID_KEY = "issuer_onboarding_id";

/** @deprecated Onboarding id is no longer persisted; clears legacy localStorage key. */
export function getStoredOnboardingId(): string | null {
  if (typeof window === "undefined") return null;
  const id = window.localStorage.getItem(ONBOARDING_ID_KEY);
  return id?.trim() || null;
}

/** @deprecated Onboarding id is no longer persisted to localStorage. */
export function setStoredOnboardingId(_id: string): void {
  // no-op — session id lives in React state / profile API only
}

export function clearStoredOnboardingId(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ONBOARDING_ID_KEY);
}

/** Drop persisted issuer onboarding session (e.g. after submit). */
export function clearIssuerOnboardingLocalSession(): void {
  clearStoredOnboardingId();
}
