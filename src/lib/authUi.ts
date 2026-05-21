import type { UserRole } from "@/lib/auth";
import type { AuthRole } from "@/store/api/auth.types";

export function uiPersonaToApiRole(
  role: "issuer" | "investor",
): Extract<AuthRole, "INVESTOR" | "ISSUER"> {
  return role === "investor" ? "INVESTOR" : "ISSUER";
}

export function apiRoleToUiPersona(
  role: AuthRole | string | null | undefined,
): UserRole | null {
  const normalized = role?.toString().toUpperCase();
  if (normalized === "INVESTOR") return "investor";
  if (normalized === "ISSUER") return "issuer";
  return null;
}

export function portalHomeForRole(role: UserRole): string {
  return role === "investor" ? "/investor/hub" : "/issuer/dashboard";
}
