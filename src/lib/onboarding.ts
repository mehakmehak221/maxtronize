import {
  pickNumber,
  pickString,
  pickStringArray,
  unwrapList,
  unwrapPayload,
} from "@/lib/apiParse";

export type AccreditationType =
  | "QUALIFIED_ISSUER"
  | "ACCREDITED_INVESTOR"
  | "INSTITUTIONAL";

export type ApiAssetType =
  | "REAL_ESTATE"
  | "PRIVATE_CREDIT"
  | "DATA_CENTERS"
  | "COMMODITIES";

export type OnboardingDocumentType =
  | "CERTIFICATE_OF_FORMATION"
  | "OPERATING_AGREEMENT"
  | "EIN_CONFIRMATION_LETTER"
  | "GOVERNMENT_ISSUED_ID"
  | "MAI_APPRAISAL_REPORT"
  | "RENT_ROLL"
  | "TITLE_REPORT"
  | "ENVIRONMENTAL_ASSESSMENT"
  | "VAULT_STORAGE_CERTIFICATE"
  | "INDEPENDENT_ASSAY_REPORT"
  | "FACILITY_APPRAISAL_REPORT"
  | "LOAN_AGREEMENT"
  | "OTHER";

export type AccreditationPayload = {
  accreditationType: AccreditationType;
  verified: boolean;
  notes?: string;
  metadata?: {
    exemptions?: string[];
    jurisdiction?: string;
    accreditedInvestorsOnly?: boolean;
    verificationMethod?: string;
    offeringRegulation?: string;
  };
};

export type AssetDraftPayload = {
  assetType: ApiAssetType;
  name?: string;
  description?: string;
  address?: string;
  appraisalValue?: number;
  annualIncome?: number;
  metadata?: Record<string, unknown>;
};

export type CustodyPayload = {
  custodianName: string;
  coldStorageRatio?: number;
  multiSigConfiguration?: string;
  metadata?: Record<string, unknown>;
};

export type EntityDirector = {
  fullName: string;
  title?: string;
  dateOfBirth?: string;
  ssnLast4?: string;
};

export type EntityBeneficialOwner = {
  fullName: string;
  ownershipPercent: number;
};

export type EntityPayload = {
  legalCompanyName: string;
  entityType: string;
  ein: string;
  businessAddress: string;
  directors: EntityDirector[];
  beneficialOwners: EntityBeneficialOwner[];
  metadata?: Record<string, unknown>;
};

export type EntityFormState = {
  legalCompanyName: string;
  entityType: string;
  ein: string;
  businessAddress: string;
  directorsNotes: string;
  ubosNotes: string;
};

export type OnboardingDocument = {
  id: string;
  name: string;
  type: string;
  category: string | null;
  size: string;
  date: string;
  url: string | null;
};

export type OnboardingState = {
  id: string;
  currentStep: number;
  status: string | null;
  accreditation: Record<string, unknown>;
  asset: Record<string, unknown>;
  custody: Record<string, unknown>;
  entity: Record<string, unknown>;
  documents: OnboardingDocument[];
};

const REGULATION_TO_EXEMPTION: Record<string, string> = {
  "reg-d-506b": "REG_D_506B",
  "reg-d-506c": "REG_D_506C",
  "reg-s": "REG_S",
  "reg-a": "REG_A",
};

const EXEMPTION_TO_REGULATION: Record<string, string> = {
  REG_D_506B: "reg-d-506b",
  REG_D_506C: "reg-d-506c",
  REG_S: "reg-s",
  REG_A: "reg-a",
};

const UI_TO_API_ASSET: Record<string, ApiAssetType> = {
  "real-estate": "REAL_ESTATE",
  "private-credit": "PRIVATE_CREDIT",
  "data-centers": "DATA_CENTERS",
  commodities: "COMMODITIES",
};

const API_TO_UI_ASSET: Record<string, string> = {
  REAL_ESTATE: "real-estate",
  PRIVATE_CREDIT: "private-credit",
  DATA_CENTERS: "data-centers",
  COMMODITIES: "commodities",
};

const CUSTODIAN_UI_TO_NAME: Record<string, string> = {
  anchorage: "Anchorage Digital",
  bitgo: "BitGo",
  fireblocks: "Fireblocks",
};

const CUSTODIAN_NAME_TO_UI: Record<string, string> = {
  "Anchorage Digital": "anchorage",
  Anchorage: "anchorage",
  BitGo: "bitgo",
  Fireblocks: "fireblocks",
};

function pickBool(obj: Record<string, unknown>, keys: string[]): boolean {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "boolean") return value;
  }
  return false;
}

function metadataRecord(
  draft: Record<string, unknown>,
): Record<string, unknown> {
  const meta = draft.metadata;
  return meta && typeof meta === "object" && !Array.isArray(meta)
    ? (meta as Record<string, unknown>)
    : {};
}

function parseNumberish(value: string | undefined): number | undefined {
  if (!value?.trim()) return undefined;
  const normalized = value.replace(/[$,%\s]/g, "").replace(/,/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseDocument(doc: Record<string, unknown>, index: number): OnboardingDocument {
  const name =
    pickString(doc, ["name", "title", "fileName", "file_name"]) ??
    `Document ${index + 1}`;
  return {
    id: pickString(doc, ["id", "_id"]) ?? `${index}-${name}`,
    name,
    type: pickString(doc, ["type", "documentType", "mimeType"]) ?? "Document",
    category: pickString(doc, ["category", "documentCategory", "label"]),
    size: pickString(doc, ["size", "fileSize", "file_size"]) ?? "—",
    date:
      pickString(doc, ["date", "createdAt", "created_at", "uploadedAt"]) ?? "—",
    url: pickString(doc, ["url", "fileUrl", "file_url", "downloadUrl"]),
  };
}

function parseDraft(payload: unknown): Record<string, unknown> {
  const record = unwrapPayload(payload);
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    return {};
  }
  return record as Record<string, unknown>;
}

export function parseOnboardingDocuments(payload: unknown): OnboardingDocument[] {
  return unwrapList(payload).map(parseDocument);
}

export function parseOnboardingState(
  payload: unknown,
  fallbackId: string,
): OnboardingState | null {
  const record = unwrapPayload(payload);
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    return null;
  }
  const root = record as Record<string, unknown>;

  const id =
    pickString(root, ["id", "_id", "onboardingId", "onboarding_id"]) ??
    fallbackId;

  const step =
    pickNumber(root, [
      "currentStep",
      "current_step",
      "step",
      "activeStep",
      "active_step",
    ]) ?? 1;

  const accreditation =
    (root.accreditation && typeof root.accreditation === "object"
      ? (root.accreditation as Record<string, unknown>)
      : null) ?? parseDraft(root.accreditation);

  const asset =
    (root.asset && typeof root.asset === "object"
      ? (root.asset as Record<string, unknown>)
      : null) ??
    parseDraft(root.assetDetails ?? root.asset_details);

  const custody =
    (root.custody && typeof root.custody === "object"
      ? (root.custody as Record<string, unknown>)
      : null) ?? parseDraft(root.custodySetup ?? root.custody_setup);

  const entity =
    (root.entity && typeof root.entity === "object"
      ? (root.entity as Record<string, unknown>)
      : null) ??
    parseDraft(
      root.entitySetup ?? root.entity_setup ?? root.kyb ?? root.knowYourBusiness,
    );

  const documentsRaw = root.documents ?? root.files;
  const documents = Array.isArray(documentsRaw)
    ? documentsRaw
        .filter((d): d is Record<string, unknown> => Boolean(d) && typeof d === "object")
        .map((d, i) => parseDocument(d, i))
    : parseOnboardingDocuments(documentsRaw);

  return {
    id,
    currentStep: Math.min(8, Math.max(1, step)),
    status: pickString(root, ["status", "state", "onboardingStatus"]),
    accreditation,
    asset,
    custody,
    entity,
    documents,
  };
}

export function readStringField(
  draft: Record<string, unknown>,
  keys: string[],
  fallback = "",
): string {
  return pickString(draft, keys) ?? fallback;
}

export function readBoolField(
  draft: Record<string, unknown>,
  keys: string[],
  fallback = false,
): boolean {
  return pickBool(draft, keys) ?? fallback;
}

export function toApiAssetType(uiSlug: string): ApiAssetType {
  const normalized = uiSlug.trim().toLowerCase();
  if (UI_TO_API_ASSET[normalized]) return UI_TO_API_ASSET[normalized];
  const upper = uiSlug.replace(/-/g, "_").toUpperCase();
  if (upper in API_TO_UI_ASSET) return upper as ApiAssetType;
  return "REAL_ESTATE";
}

export function toUiAssetType(draft: Record<string, unknown>): string {
  const raw = readStringField(draft, ["assetType", "asset_type", "type", "category"]);
  if (API_TO_UI_ASSET[raw]) return API_TO_UI_ASSET[raw];
  const lower = raw.toLowerCase();
  if (UI_TO_API_ASSET[lower]) return lower;
  return "real-estate";
}

export function buildAccreditationPayload(ui: {
  regulation: string;
  accreditedOnly?: boolean;
  verificationMethod?: string;
  notes?: string;
  jurisdiction?: string;
}): AccreditationPayload {
  const exemption = REGULATION_TO_EXEMPTION[ui.regulation] ?? "REG_D_506C";
  return {
    accreditationType: "QUALIFIED_ISSUER",
    verified: false,
    notes: ui.notes?.trim() || undefined,
    metadata: {
      exemptions: [exemption],
      jurisdiction: ui.jurisdiction?.trim() || "US",
      accreditedInvestorsOnly: ui.accreditedOnly ?? true,
      verificationMethod: ui.verificationMethod?.trim() || undefined,
      offeringRegulation: ui.regulation,
    },
  };
}

export function buildAssetPayload(ui: {
  assetType: string;
  name?: string;
  description?: string;
  address?: string;
  appraisalValue?: string;
  annualIncome?: string;
  metadata?: Record<string, unknown>;
}): AssetDraftPayload {
  const appraisalValue = parseNumberish(ui.appraisalValue);
  const annualIncome = parseNumberish(ui.annualIncome);
  return {
    assetType: toApiAssetType(ui.assetType),
    name: ui.name?.trim() || undefined,
    description: ui.description?.trim() || undefined,
    address: ui.address?.trim() || undefined,
    appraisalValue,
    annualIncome,
    metadata: ui.metadata && Object.keys(ui.metadata).length > 0 ? ui.metadata : undefined,
  };
}

export function buildCustodyPayload(ui: {
  custodian: string;
  coldStorageRatio?: string;
  multiSigConfig?: string;
  walletAddress?: string;
}): CustodyPayload {
  const custodianName =
    CUSTODIAN_UI_TO_NAME[ui.custodian] ??
    readStringField({ custodian: ui.custodian }, ["custodian"]);
  const coldStorageRatio =
    parseNumberish(ui.coldStorageRatio) ??
    pickNumber({ ratio: ui.coldStorageRatio }, ["ratio"]);
  return {
    custodianName,
    coldStorageRatio: coldStorageRatio ?? 85,
    multiSigConfiguration:
      ui.multiSigConfig?.trim() || "2-of-3 multisig",
    metadata: {
      custodianId: ui.custodian,
      custodyType: "THIRD_PARTY",
      walletAddress: ui.walletAddress?.trim() || undefined,
    },
  };
}

function parseDirectorsFromNotes(text: string): EntityDirector[] {
  const blocks = text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks
    .map((block) => {
      const lines = block
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
      const header = lines[0] ?? "";
      const dashMatch = header.match(/^(.+?)\s*[—–-]\s*(.+)$/);
      const fullName = (dashMatch?.[1] ?? header).trim();
      const title = dashMatch?.[2]?.trim();
      const detail = lines.slice(1).join(" ");
      const dobMatch = detail.match(/DOB:\s*(\d{4}-\d{2}-\d{2})/i);
      const ssnMatch =
        detail.match(/SSN[^:]*:\s*[*•]*(\d{4})/i) ??
        detail.match(/last four:\s*[*•]*(\d{4})/i);

      return {
        fullName,
        title: title || undefined,
        dateOfBirth: dobMatch?.[1],
        ssnLast4: ssnMatch?.[1],
      };
    })
    .filter((director) => director.fullName.length > 0);
}

function parseBeneficialOwnersFromNotes(text: string): EntityBeneficialOwner[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const dashMatch = line.match(/^(.+?)\s*[—–-]\s*(.+)$/);
      const fullName = (dashMatch?.[1] ?? line).trim();
      const rest = dashMatch?.[2] ?? line;
      const pctMatch = rest.match(/(\d+(?:\.\d+)?)\s*%/);
      return {
        fullName,
        ownershipPercent: pctMatch ? Number(pctMatch[1]) : 0,
      };
    })
    .filter((owner) => owner.fullName.length > 0);
}

function directorsArrayFromDraft(
  draft: Record<string, unknown>,
): EntityDirector[] | null {
  const raw = draft.directors;
  if (!Array.isArray(raw)) return null;
  return raw
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
    .map((item) => ({
      fullName: readStringField(item, ["fullName", "full_name", "name"]),
      title: readStringField(item, ["title", "role"]) || undefined,
      dateOfBirth:
        readStringField(item, ["dateOfBirth", "date_of_birth", "dob"]) ||
        undefined,
      ssnLast4:
        readStringField(item, ["ssnLast4", "ssn_last4", "ssnLastFour"]) ||
        undefined,
    }))
    .filter((director) => director.fullName.length > 0);
}

function beneficialOwnersArrayFromDraft(
  draft: Record<string, unknown>,
): EntityBeneficialOwner[] | null {
  const raw = draft.beneficialOwners ?? draft.ultimateBeneficialOwners ?? draft.ubos;
  if (!Array.isArray(raw)) return null;
  return raw
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
    .map((item) => ({
      fullName: readStringField(item, ["fullName", "full_name", "name"]),
      ownershipPercent:
        pickNumber(item, ["ownershipPercent", "ownership_percent", "percent"]) ?? 0,
    }))
    .filter((owner) => owner.fullName.length > 0);
}

export function formatDirectorsToNotes(directors: EntityDirector[]): string {
  if (directors.length === 0) return "";
  return directors
    .map((director) => {
      const header = director.title
        ? `${director.fullName} — ${director.title}`
        : director.fullName;
      const details: string[] = [];
      if (director.dateOfBirth) details.push(`DOB: ${director.dateOfBirth}`);
      if (director.ssnLast4) {
        details.push(`SSN last four: ••••${director.ssnLast4}`);
      }
      return details.length > 0 ? `${header}\n${details.join(" | ")}` : header;
    })
    .join("\n\n");
}

export function formatBeneficialOwnersToNotes(
  owners: EntityBeneficialOwner[],
): string {
  if (owners.length === 0) return "";
  return owners
    .map((owner) => `${owner.fullName} — ${owner.ownershipPercent}% beneficial ownership`)
    .join("\n");
}

export function buildEntityPayload(ui: EntityFormState): EntityPayload {
  const directors = parseDirectorsFromNotes(ui.directorsNotes);
  const beneficialOwners = parseBeneficialOwnersFromNotes(ui.ubosNotes);

  return {
    legalCompanyName: ui.legalCompanyName.trim(),
    entityType: ui.entityType.trim(),
    ein: ui.ein.trim(),
    businessAddress: ui.businessAddress.trim(),
    directors,
    beneficialOwners,
    metadata:
      directors.length === 0 && beneficialOwners.length === 0
        ? undefined
        : {
            directorsNotes: ui.directorsNotes.trim() || undefined,
            ubosNotes: ui.ubosNotes.trim() || undefined,
          },
  };
}

export function parseEntityFormFromDraft(
  draft: Record<string, unknown>,
): EntityFormState {
  const meta = metadataRecord(draft);
  const directors = directorsArrayFromDraft(draft);
  const beneficialOwners = beneficialOwnersArrayFromDraft(draft);

  const directorsNotes =
    directors && directors.length > 0
      ? formatDirectorsToNotes(directors)
      : readStringField(draft, ["directorsNotes", "directors_notes"]) ||
        (typeof draft.directors === "string" ? String(draft.directors) : "");

  const ubosNotes =
    beneficialOwners && beneficialOwners.length > 0
      ? formatBeneficialOwnersToNotes(beneficialOwners)
      : readStringField(draft, ["ubosNotes", "ubos_notes", "beneficialOwnersNotes"]) ||
        (typeof draft.ubos === "string" ? String(draft.ubos) : "") ||
        (typeof draft.beneficialOwners === "string"
          ? String(draft.beneficialOwners)
          : "");

  return {
    legalCompanyName: readStringField(draft, [
      "legalCompanyName",
      "legal_company_name",
      "legalName",
    ]),
    entityType: readStringField(draft, ["entityType", "entity_type"]),
    ein: readStringField(draft, ["ein", "employerIdentificationNumber"]),
    businessAddress: readStringField(draft, [
      "businessAddress",
      "business_address",
      "registeredAddress",
      "registered_address",
      "address",
    ]),
    directorsNotes:
      directorsNotes ||
      readStringField(meta, ["directorsNotes", "directors_notes"]),
    ubosNotes:
      ubosNotes || readStringField(meta, ["ubosNotes", "ubos_notes"]),
  };
}

export function regulationFromDraft(draft: Record<string, unknown>): string {
  const meta = metadataRecord(draft);
  const exemptions =
    pickStringArray(meta, ["exemptions"]) ??
    pickStringArray(draft, ["exemptions"]);
  if (exemptions?.[0] && EXEMPTION_TO_REGULATION[exemptions[0]]) {
    return EXEMPTION_TO_REGULATION[exemptions[0]];
  }
  const offering = readStringField(meta, ["offeringRegulation", "offering_regulation"]);
  if (offering && REGULATION_TO_EXEMPTION[offering]) return offering;
  return (
    readStringField(draft, [
      "regulation",
      "offeringRegulation",
      "offering_regulation",
      "selectedRegulation",
    ]) || "reg-d-506c"
  );
}

export function assetTypeFromDraft(draft: Record<string, unknown>): string {
  return toUiAssetType(draft);
}

export function custodianFromDraft(draft: Record<string, unknown>): string {
  const meta = metadataRecord(draft);
  const id = readStringField(meta, ["custodianId", "custodian_id"]);
  if (id && CUSTODIAN_UI_TO_NAME[id]) return id;
  const name = readStringField(draft, [
    "custodianName",
    "custodian",
    "custodianId",
    "custodian_id",
  ]);
  if (name && CUSTODIAN_NAME_TO_UI[name]) return CUSTODIAN_NAME_TO_UI[name];
  const lower = name.toLowerCase();
  if (lower.includes("anchorage")) return "anchorage";
  if (lower.includes("bitgo")) return "bitgo";
  if (lower.includes("fireblocks")) return "fireblocks";
  return "anchorage";
}

export function parseAssetFormFromDraft(draft: Record<string, unknown>) {
  const meta = metadataRecord(draft);
  const appraisal =
    pickNumber(draft, ["appraisalValue", "appraisal_value", "appraisedValue"]) ??
    pickNumber(meta, ["appraisalValue", "appraisal_value"]);
  const income =
    pickNumber(draft, ["annualIncome", "annual_income", "annualRentalIncome"]) ??
    pickNumber(meta, ["annualIncome", "annual_income"]);

  return {
    name: readStringField(draft, ["name", "assetName", "asset_name"]),
    description: readStringField(draft, ["description"]),
    address: readStringField(draft, ["address", "propertyAddress", "location"]),
    appraisalValue: appraisal != null ? String(appraisal) : "",
    annualIncome: income != null ? String(income) : "",
    capRate: readStringField(meta, ["capRate", "cap_rate"]),
    occupancyRate: readStringField(meta, ["occupancyRate", "occupancy_rate"]),
    yearBuilt: readStringField(meta, ["yearBuilt", "year_built"]),
  };
}

export function parseCustodyFormFromDraft(draft: Record<string, unknown>) {
  const meta = metadataRecord(draft);
  const ratio =
    pickNumber(draft, ["coldStorageRatio", "cold_storage_ratio"]) ??
    pickNumber(meta, ["coldStorageRatio"]);
  return {
    coldStorageRatio: ratio != null ? String(ratio) : "85",
    multiSigConfig: readStringField(draft, [
      "multiSigConfiguration",
      "multi_sig_configuration",
      "multiSigConfig",
    ]) || "2-of-3 multisig",
    walletAddress: readStringField(meta, ["walletAddress", "wallet_address"]),
  };
}

export function accreditedOnlyFromDraft(draft: Record<string, unknown>): boolean {
  const meta = metadataRecord(draft);
  if (typeof meta.accreditedInvestorsOnly === "boolean") {
    return meta.accreditedInvestorsOnly;
  }
  return readBoolField(draft, [
    "accreditedInvestorsOnly",
    "accredited_investors_only",
    "accreditedOnly",
  ], true);
}
