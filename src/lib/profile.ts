import type { UserRole } from "@/lib/auth";
import { pickCoverImageKey } from "@/lib/onboarding";
import { pickCoverImageUrl, resolveStoragePublicUrl } from "@/lib/storageUrl";

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
  kycStatus: string | null;
  kycVerified: boolean;
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
  const nestedRecord = nested as Record<string, unknown>;
  return {
    ...nestedRecord,
    ...rest,
    fullName:
      pickString(rest, ["fullName", "full_name", "name"]) ??
      pickString(nestedRecord, ["fullName", "full_name", "name"]),
    country:
      pickString(rest, ["country"]) ??
      pickString(nestedRecord, ["country"]) ??
      pickString(rest, ["nationality"]) ??
      pickString(nestedRecord, ["nationality"]),
  };
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
    (pickBool(record, [
      "profileComplete",
      "profileCompleted",
      "isProfileComplete",
      "profile_complete",
      "setupComplete",
    ]) ||
    Boolean(dateOfBirth && residentialAddress)) &&
    Boolean(dateOfBirth && residentialAddress);

  const rawKycStatus = pickString(record, [
    "kycStatus",
    "kyc_status",
    "verificationStatus",
    "verification_status",
    "status",
  ]);
  const normalizedKycStatus = rawKycStatus
    ? rawKycStatus.replace(/[_-]+/g, " ").trim()
    : null;
  const kycVerified =
    pickBool(record, [
      "kycVerified",
      "kyc_verified",
      "isKycVerified",
      "is_kyc_verified",
    ]) ||
    Boolean(
      normalizedKycStatus &&
        ["VERIFIED", "APPROVED"].includes(normalizedKycStatus.toUpperCase()),
    );

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
    country:
      pickString(record, ["country"]) ??
      pickString(record, ["nationality"]),
    role,
    dateOfBirth,
    nationality: pickString(record, ["nationality"]),
    residentialAddress,
    profileComplete,
    kycStatus: normalizedKycStatus,
    kycVerified,
  };
}

export function isProfileComplete(profile: UserProfile | null | undefined): boolean {
  if (!profile) return false;
  return profile.profileComplete;
}

export function isKycVerified(profile: UserProfile | null | undefined): boolean {
  if (!profile) return false;
  return profile.kycVerified;
}

export function isKycRejected(profile: UserProfile | null | undefined): boolean {
  const status = profile?.kycStatus?.toUpperCase() ?? "";
  return status.includes("REJECT");
}

export function isKycPendingReview(profile: UserProfile | null | undefined): boolean {
  if (!profile || !profile.profileComplete || profile.kycVerified) return false;
  const status = profile.kycStatus?.toUpperCase() ?? "";
  if (!status) return false;
  return status.includes("PENDING") || status.includes("UNDER REVIEW") || status.includes("REVIEW");
}

function collectUploadRecords(payload: unknown): Record<string, unknown>[] {
  const record = unwrapRecord(payload);
  if (!record) return [];
  const candidates: Record<string, unknown>[] = [];
  for (const field of ["file", "result", "upload"]) {
    const nested = record[field];
    if (nested && typeof nested === "object" && !Array.isArray(nested)) {
      candidates.push(nested as Record<string, unknown>);
    }
  }
  candidates.push(record);
  return candidates;
}

export type UploadFileParseResult = {
  key: string | null;
  /** Browser-loadable URL (absolute or API /storage/ path). */
  url: string | null;
};

/** Parse storage key and public URL from POST /upload/file responses. */
export function parseUploadFileResult(payload: unknown): UploadFileParseResult {
  let key: string | null = null;
  let explicitUrl: string | null = null;

  for (const record of collectUploadRecords(payload)) {
    key = key ?? pickCoverImageKey(record);
    explicitUrl = explicitUrl ?? pickCoverImageUrl(record);
  }

  const url = resolveStoragePublicUrl(key, explicitUrl);
  return { key, url };
}

export function parseUploadFileUrl(payload: unknown): string | null {
  return parseUploadFileResult(payload).url;
}

export function parseAuthUser(payload: unknown): {
  email: string | null;
  role: UserRole | null;
} | null {
  const profile = parseProfile(payload);
  if (!profile) return null;
  return { email: profile.email, role: profile.role };
}
