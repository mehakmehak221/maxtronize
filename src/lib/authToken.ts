export function extractAccessToken(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const o = payload as Record<string, unknown>;
  if (typeof o.access_token === "string") return o.access_token;
  if (typeof o.accessToken === "string") return o.accessToken;
  if (typeof o.token === "string") return o.token;
  const data = o.data;
  if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    if (typeof d.access_token === "string") return d.access_token;
    if (typeof d.accessToken === "string") return d.accessToken;
    if (typeof d.token === "string") return d.token;
  }
  return null;
}

export function persistAccessToken(payload: unknown): boolean {
  const token = extractAccessToken(payload);
  if (token && typeof window !== "undefined") {
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
