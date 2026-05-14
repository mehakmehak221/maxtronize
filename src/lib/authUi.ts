import type { AuthRole } from "@/store/api/auth.types";

export function uiPersonaToApiRole(
  role: "issuer" | "investor",
): Extract<AuthRole, "INVESTOR" | "ISSUER"> {
  return role === "investor" ? "INVESTOR" : "ISSUER";
}
