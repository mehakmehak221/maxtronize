export type UserRole = "issuer" | "investor";

const SESSION_COOKIE = "maxtronize_session";
const ACCESS_TOKEN_KEY = "access_token";
const ROLE_KEY = "maxtronize_role";
const EMAIL_KEY = "maxtronize_user_email";

const STORAGE_KEYS = [ACCESS_TOKEN_KEY, ROLE_KEY, EMAIL_KEY, "refresh_token"] as const;

export function signIn({
  role,
  email,
  token = "demo-session",
}: {
  role: UserRole;
  email?: string;
  token?: string;
}) {
  if (typeof window === "undefined") return;

  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  localStorage.setItem(ROLE_KEY, role);
  if (email) {
    localStorage.setItem(EMAIL_KEY, email);
  }

  document.cookie = `${SESSION_COOKIE}=${role}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

export function signOut() {
  if (typeof window === "undefined") return;

  for (const key of STORAGE_KEYS) {
    localStorage.removeItem(key);
  }

  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(localStorage.getItem(ACCESS_TOKEN_KEY));
}

export function getSession(): { role: UserRole | null; email: string | null } {
  if (typeof window === "undefined") {
    return { role: null, email: null };
  }

  const role = localStorage.getItem(ROLE_KEY) as UserRole | null;
  const email = localStorage.getItem(EMAIL_KEY);

  return {
    role: role === "issuer" || role === "investor" ? role : null,
    email,
  };
}
