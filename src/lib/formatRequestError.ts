import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export function isApiNotFoundError(error: unknown): boolean {
  if (!error || typeof error !== "object" || !("status" in error)) return false;
  return (error as FetchBaseQueryError).status === 404;
}

export function formatRequestError(error: unknown): string {
  if (!error) return "Something went wrong";
  if (typeof error === "object" && error !== null && "status" in error) {
    const fe = error as FetchBaseQueryError;
    if (fe.status === "FETCH_ERROR") {
      const message = (fe as { error?: string }).error;
      if (message) return message;
    }
    const data = fe.data;
    if (typeof data === "string" && data.trim()) return data;
    if (data && typeof data === "object") {
      const d = data as Record<string, unknown>;
      if (typeof d.message === "string") return d.message;
      if (Array.isArray(d.message)) return d.message.map(String).join(", ");
      if (typeof d.error === "string") return d.error;
      if (Array.isArray(d.errors)) return d.errors.map(String).join(", ");
    }
    if (typeof fe.status === "number") {
      if (fe.status === 401) return "Your session has expired. Please sign in again.";
      if (fe.status === 403) return "You do not have permission to update this profile.";
    }
  }
  const se = error as SerializedError;
  if (se?.message) return se.message;
  return "Something went wrong";
}
