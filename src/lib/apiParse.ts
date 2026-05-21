export function unwrapPayload(payload: unknown): unknown {
  if (!payload || typeof payload !== "object") return payload;
  const root = payload as Record<string, unknown>;
  if (Array.isArray(root.data)) return root.data;
  if (root.data && typeof root.data === "object") return root.data;
  if (Array.isArray(root.items)) return root.items;
  if (Array.isArray(root.assets)) return root.assets;
  if (Array.isArray(root)) return root;
  return payload;
}

export function unwrapList(payload: unknown): Record<string, unknown>[] {
  const unwrapped = unwrapPayload(payload);
  if (Array.isArray(unwrapped)) {
    return unwrapped.filter(
      (item): item is Record<string, unknown> =>
        Boolean(item) && typeof item === "object",
    );
  }
  if (unwrapped && typeof unwrapped === "object") {
    return [unwrapped as Record<string, unknown>];
  }
  return [];
}

export function pickString(
  obj: Record<string, unknown>,
  keys: string[],
): string | null {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

export function pickNumber(
  obj: Record<string, unknown>,
  keys: string[],
): number | null {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "number" && !Number.isNaN(value)) return value;
    if (typeof value === "string" && value.trim()) {
      const parsed = Number(value.replace(/[^0-9.-]/g, ""));
      if (!Number.isNaN(parsed)) return parsed;
    }
  }
  return null;
}

export function pickStringArray(
  obj: Record<string, unknown>,
  keys: string[],
): string[] {
  for (const key of keys) {
    const value = obj[key];
    if (Array.isArray(value)) {
      return value.map(String).filter(Boolean);
    }
    if (typeof value === "string" && value.trim()) {
      return value.split(",").map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
}
