import type { UserRole } from "@/lib/auth";

export type UserProfile = {
  id: string | null;
  onboardingId: string | null;
  fullName: string | null;
  email: string | null;
  country: string | null;
  role: UserRole | null;
  dateOfBirth: string | null;
  nationality: string | null;
  residentialAddress: string | null;
  profileComplete: boolean;
};

function pickString(
  obj: Record<string, unknown>,
  keys: string[],
): string | null {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

function pickBool(obj: Record<string, unknown>, keys: string[]): boolean {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "boolean") return value;
  }
  return false;
}

function apiRoleToUi(role: string | null): UserRole | null {
  const normalized = role?.toUpperCase();
  if (normalized === "INVESTOR") return "investor";
  if (normalized === "ISSUER") return "issuer";
  return null;
}

function mergeRoleSpecificProfile(
  record: Record<string, unknown>,
): Record<string, unknown> {
  const nested = record.issuerProfile ?? record.investorProfile;
  if (!nested || typeof nested !== "object" || Array.isArray(nested)) {
    return record;
  }
  const { issuerProfile: _i, investorProfile: _v, ...rest } = record;
  return { ...(nested as Record<string, unknown>), ...rest };
}

function unwrapRecord(payload: unknown): Record<string, unknown> | null {
  if (!payload || typeof payload !== "object") return null;
  const root = payload as Record<string, unknown>;
  let record: Record<string, unknown>;
  if (root.data && typeof root.data === "object") {
    record = root.data as Record<string, unknown>;
  } else if (root.user && typeof root.user === "object") {
    record = root.user as Record<string, unknown>;
  } else if (root.profile && typeof root.profile === "object") {
    record = root.profile as Record<string, unknown>;
  } else {
    record = root;
  }
  return mergeRoleSpecificProfile(record);
}

export function parseProfile(payload: unknown): UserProfile | null {
  const record = unwrapRecord(payload);
  if (!record) return null;

  const roleRaw = pickString(record, ["role", "userRole", "user_type"]);
  const role = apiRoleToUi(roleRaw);

  const dateOfBirth = pickString(record, [
    "dateOfBirth",
    "date_of_birth",
    "dob",
  ]);
  const residentialAddress = pickString(record, [
    "residentialAddress",
    "residential_address",
    "address",
  ]);

  const profileComplete =
    pickBool(record, [
      "profileComplete",
      "profileCompleted",
      "isProfileComplete",
      "profile_complete",
      "setupComplete",
    ]) ||
    Boolean(dateOfBirth && residentialAddress);

  return {
    id: pickString(record, ["id", "_id", "userId", "user_id"]),
    onboardingId: pickString(record, [
      "onboardingId",
      "onboarding_id",
      "applicationId",
      "application_id",
      "issuerOnboardingId",
    ]),
    fullName: pickString(record, ["fullName", "full_name", "name"]),
    email: pickString(record, ["email"]),
    country: pickString(record, ["country"]),
    role,
    dateOfBirth,
    nationality: pickString(record, ["nationality"]),
    residentialAddress,
    profileComplete,
  };
}

export function isProfileComplete(profile: UserProfile | null | undefined): boolean {
  if (!profile) return false;
  return profile.profileComplete;
}

export function parseUploadFileUrl(payload: unknown): string | null {
  const record = unwrapRecord(payload);
  if (!record) return null;
  return pickString(record, [
    "url",
    "fileUrl",
    "file_url",
    "location",
    "path",
    "key",
  ]);
}

export function parseAuthUser(payload: unknown): {
  email: string | null;
  role: UserRole | null;
} | null {
  const profile = parseProfile(payload);
  if (!profile) return null;
  return { email: profile.email, role: profile.role };
}
