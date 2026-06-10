export type UserRole = "issuer" | "investor";

const SESSION_COOKIE = "maxtronize_session";
const ACCESS_TOKEN_KEY = "access_token";
const ROLE_KEY = "maxtronize_role";
const EMAIL_KEY = "maxtronize_user_email";

const STORAGE_KEYS = [ACCESS_TOKEN_KEY, ROLE_KEY, EMAIL_KEY, "refresh_token"] as const;

export function signIn({
  role,
  email,
  token,
  rememberMe = true,
}: {
  role: UserRole;
  email?: string;
  token?: string;
  rememberMe?: boolean;
}) {
  if (typeof window === "undefined") return;

  const storage = rememberMe ? window.localStorage : window.sessionStorage;

  if (token && token !== "demo-session") {
    storage.setItem(ACCESS_TOKEN_KEY, token);
  }
  storage.setItem(ROLE_KEY, role);
  if (email) {
    storage.setItem(EMAIL_KEY, email);
  }

  if (rememberMe) {
    document.cookie = `${SESSION_COOKIE}=${role}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
  } else {
    document.cookie = `${SESSION_COOKIE}=${role}; path=/; SameSite=Lax`;
  }
}

export function signOut() {
  if (typeof window === "undefined") return;

  for (const key of STORAGE_KEYS) {
    window.localStorage.removeItem(key);
    window.sessionStorage.removeItem(key);
  }

  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  const token = window.localStorage.getItem(ACCESS_TOKEN_KEY) || window.sessionStorage.getItem(ACCESS_TOKEN_KEY);
  if (token && token !== "demo-session") return true;
  const role = window.localStorage.getItem(ROLE_KEY) || window.sessionStorage.getItem(ROLE_KEY);
  return role === "issuer" || role === "investor";
}

export function getSession(): { role: UserRole | null; email: string | null } {
  if (typeof window === "undefined") {
    return { role: null, email: null };
  }

  const role = (window.localStorage.getItem(ROLE_KEY) || window.sessionStorage.getItem(ROLE_KEY)) as UserRole | null;
  const email = window.localStorage.getItem(EMAIL_KEY) || window.sessionStorage.getItem(EMAIL_KEY);

  return {
    role: role === "issuer" || role === "investor" ? role : null,
    email,
  };
}
