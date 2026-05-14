import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export function formatRequestError(error: unknown): string {
  if (!error) return "Something went wrong";
  if (typeof error === "object" && error !== null && "status" in error) {
    const fe = error as FetchBaseQueryError;
    const data = fe.data;
    if (typeof data === "string") return data;
    if (data && typeof data === "object") {
      const d = data as Record<string, unknown>;
      if (typeof d.message === "string") return d.message;
      if (Array.isArray(d.message)) return d.message.map(String).join(", ");
      if (typeof d.error === "string") return d.error;
    }
  }
  const se = error as SerializedError;
  if (se?.message) return se.message;
  return "Something went wrong";
}
