const TOKEN_KEYS = [
  "access_token",
  "accessToken",
  "token",
  "jwt",
  "authToken",
  "auth_token",
] as const;

const NESTED_TOKEN_CONTAINERS = ["data", "tokens", "auth", "session", "result"] as const;

function readTokenFromRecord(record: Record<string, unknown>): string | null {
  for (const key of TOKEN_KEYS) {
    const value = record[key];
    if (typeof value === "string" && value.trim() && value !== "demo-session") {
      return value.trim();
    }
  }
  return null;
}

export function extractAccessToken(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;

  const queue: unknown[] = [payload];
  const seen = new Set<unknown>();
  let depth = 0;

  while (queue.length > 0 && depth < 6) {
    const levelSize = queue.length;
    depth += 1;

    for (let i = 0; i < levelSize; i += 1) {
      const current = queue.shift();
      if (!current || typeof current !== "object" || seen.has(current)) continue;
      seen.add(current);

      const record = current as Record<string, unknown>;
      const direct = readTokenFromRecord(record);
      if (direct) return direct;

      for (const key of NESTED_TOKEN_CONTAINERS) {
        const nested = record[key];
        if (nested && typeof nested === "object") {
          queue.push(nested);
        }
      }
    }
  }

  return null;
}

export function isValidAccessToken(token: string | null | undefined): token is string {
  return Boolean(token && token.trim() && token !== "demo-session");
}

export function persistAccessToken(payload: unknown): boolean {
  const token = extractAccessToken(payload);
  if (isValidAccessToken(token) && typeof window !== "undefined") {
    window.localStorage.setItem("access_token", token);
    return true;
  }
  return false;
}

export function clearAccessToken(): void {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("access_token");
  }
}

export function getStoredAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  const token = window.localStorage.getItem("access_token");
  return isValidAccessToken(token) ? token : null;
}

/** Removes legacy demo placeholder so API calls are not sent with a fake token. */
export function sanitizeStaleAccessToken(): void {
  if (typeof window === "undefined") return;
  const token = window.localStorage.getItem("access_token");
  if (token === "demo-session") {
    window.localStorage.removeItem("access_token");
  }
}
