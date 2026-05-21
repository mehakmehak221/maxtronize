const ONBOARDING_ID_KEY = "issuer_onboarding_id";

export function getStoredOnboardingId(): string | null {
  if (typeof window === "undefined") return null;
  const id = window.localStorage.getItem(ONBOARDING_ID_KEY);
  return id?.trim() || null;
}

export function setStoredOnboardingId(id: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ONBOARDING_ID_KEY, id);
}

export function clearStoredOnboardingId(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ONBOARDING_ID_KEY);
}
