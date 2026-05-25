import { pickString } from "@/lib/apiParse";

export function getApiBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");
}

/** Build a browser-loadable API URL from a path or absolute URL. */
export function resolveStoragePublicUrl(
  keyOrPath: string | null | undefined,
  explicitUrl?: string | null,
): string | null {
  const direct = explicitUrl?.trim() || null;
  if (direct) {
    if (direct.startsWith("http://") || direct.startsWith("https://")) {
      return direct;
    }
    const baseUrl = getApiBaseUrl();
    if (!baseUrl) return direct;
    return direct.startsWith("/") ? `${baseUrl}${direct}` : `${baseUrl}/${direct}`;
  }

  const raw = keyOrPath?.trim();
  if (!raw) return null;
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;

  const baseUrl = getApiBaseUrl();
  if (!baseUrl) return raw;

  const normalized = raw.replace(/^\//, "");
  if (normalized.startsWith("storage/")) {
    return `${baseUrl}/${normalized}`;
  }
  return `${baseUrl}/storage/${normalized}`;
}

export function pickCoverImageUrl(source: Record<string, unknown>): string | null {
  return pickString(source, [
    "coverImageUrl",
    "cover_image_url",
    "imageUrl",
    "image_url",
    "url",
    "fileUrl",
    "file_url",
    "downloadUrl",
    "download_url",
    "signedUrl",
    "signed_url",
    "publicUrl",
    "public_url",
    "accessUrl",
    "access_url",
  ]);
}

/** Fetch private API files with auth cookies / bearer token for <img> preview. */
export async function loadAuthenticatedImageBlobUrl(
  apiUrl: string,
): Promise<string | null> {
  if (!apiUrl || typeof window === "undefined") return null;

  const token = window.localStorage.getItem("access_token");
  const headers: HeadersInit = {};
  if (token && token !== "demo-session") {
    headers.authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(apiUrl, {
      credentials: "include",
      headers,
    });
    if (!response.ok) return null;
    const blob = await response.blob();
    if (!blob.size) return null;
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
}

export async function resolveCoverImagePreviewSrc(options: {
  coverImageUrl?: string | null;
  coverImageKey?: string | null;
}): Promise<string | null> {
  const candidates = [
    resolveStoragePublicUrl(null, options.coverImageUrl),
    resolveStoragePublicUrl(options.coverImageKey, null),
  ].filter((url): url is string => Boolean(url));

  const unique = [...new Set(candidates)];
  for (const url of unique) {
    const blobUrl = await loadAuthenticatedImageBlobUrl(url);
    if (blobUrl) return blobUrl;
  }
  return null;
}
