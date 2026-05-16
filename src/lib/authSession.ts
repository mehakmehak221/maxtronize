import { signIn, type UserRole } from "@/lib/auth";
import { apiRoleToUiPersona, portalHomeForRole } from "@/lib/authUi";
import { isProfileComplete, parseAuthUser, parseProfile } from "@/lib/profile";
import type { AuthRole } from "@/store/api/auth.types";
import { extractAccessToken } from "@/lib/authToken";
import { authApi } from "@/store/api/authApi";
import type { AppDispatch } from "@/store/store";

export function syncSessionFromAuthResponse(
  payload: unknown,
  fallback?: { email?: string; role?: AuthRole },
): UserRole | null {
  const token = extractAccessToken(payload);
  const parsed = parseAuthUser(payload);
  const role =
    parsed?.role ??
    (fallback?.role ? apiRoleToUiPersona(fallback.role) : null);
  const email = parsed?.email ?? fallback?.email ?? undefined;

  if (role) {
    signIn({
      role,
      email,
      ...(token ? { token } : {}),
    });
  }

  return role;
}

export function resolvePostAuthPath(
  payload: unknown,
  fallbackRole: UserRole,
): string {
  const profile = parseProfile(payload);
  if (!isProfileComplete(profile)) {
    return "/setup-profile";
  }
  const role = profile?.role ?? fallbackRole;
  return portalHomeForRole(role);
}

export async function getPostAuthRedirect(
  dispatch: AppDispatch,
  authPayload: unknown,
  fallbackRole: UserRole,
): Promise<string> {
  const fromAuth = parseProfile(authPayload);
  if (isProfileComplete(fromAuth)) {
    return portalHomeForRole(fromAuth?.role ?? fallbackRole);
  }

  try {
    const profile = await dispatch(
      authApi.endpoints.getProfile.initiate(),
    ).unwrap();
    if (!isProfileComplete(profile)) {
      return "/setup-profile";
    }
    return portalHomeForRole(profile?.role ?? fallbackRole);
  } catch {
    return "/setup-profile";
  }
}
