const ONBOARDING_ID_KEY = "issuer_onboarding_id";
const WIZARD_DRAFT_KEY_PREFIX = "onboarding_wizard_draft:";

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

export function clearIssuerOnboardingLocalSession(): void {
  clearStoredOnboardingId();
}


export function saveOnboardingWizardDraft(
  onboardingId: string,
  state: Record<string, unknown>,
): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(
      `${WIZARD_DRAFT_KEY_PREFIX}${onboardingId}`,
      JSON.stringify(state),
    );
  } catch {
  }
}

export function loadOnboardingWizardDraft(
  onboardingId: string,
): Record<string, unknown> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(
      `${WIZARD_DRAFT_KEY_PREFIX}${onboardingId}`,
    );
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function clearOnboardingWizardDraft(onboardingId: string): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(
      `${WIZARD_DRAFT_KEY_PREFIX}${onboardingId}`,
    );
  } catch {
    // ignore
  }
}

