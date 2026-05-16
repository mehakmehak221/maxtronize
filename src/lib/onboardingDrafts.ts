import { pickNumber, pickString, unwrapList, unwrapPayload } from "@/lib/apiParse";
import { readStringField, toApiAssetType } from "@/lib/onboarding";

export type OnboardingStepKey =
  | "ENTITY_SETUP"
  | "ACCREDITATION"
  | "ASSET_DETAILS"
  | "LEGAL_STRUCTURE"
  | "OFFERING_SETUP"
  | "TOKENIZATION"
  | "CUSTODY"
  | "REVIEW_SUBMIT";

export const ONBOARDING_STEP_ORDER: Record<OnboardingStepKey, number> = {
  ENTITY_SETUP: 1,
  ACCREDITATION: 2,
  ASSET_DETAILS: 3,
  LEGAL_STRUCTURE: 4,
  OFFERING_SETUP: 5,
  TOKENIZATION: 6,
  CUSTODY: 7,
  REVIEW_SUBMIT: 8,
};

export type LegalPayload = {
  spvEntityName: string;
  jurisdiction: string;
  retainedOwnershipPercent: number;
  proRataDistributions: boolean;
  votingRights: boolean;
  liquidationPreference: boolean;
  informationRights: boolean;
  metadata?: Record<string, unknown>;
};

export type OfferingPayload = {
  targetRaiseAmount: number;
  minimumInvestment: number;
  maximumInvestors?: number;
  currency: string;
  offeringOpenDate?: string;
  offeringCloseDate?: string;
  firstYieldDate?: string;
  distributionFrequency?: string;
  lockupPeriod?: string;
  secondaryMarket?: string;
  regulationType?: string;
  metadata?: Record<string, unknown>;
};

export type TokenizationPayload = {
  tokenName: string;
  tokenSymbol: string;
  totalSupply?: number;
  tokenPrice: number;
  tokenStandard: string;
  blockchainNetwork: string;
  contractAddress?: string;
  metadata?: Record<string, unknown>;
};

export type StartOnboardingPayload = {
  assetType: string;
  assetName: string;
  metadata?: Record<string, unknown>;
};

export type OnboardingProgress = {
  currentStep: OnboardingStepKey;
  status: string;
  stepNumber: number;
  steps: {
    step: OnboardingStepKey;
    order: number;
    completed: boolean;
    isCurrent: boolean;
  }[];
};

export type OnboardingReviewSection = {
  title: string;
  subtitle: string;
};

export type OnboardingReview = {
  sections: OnboardingReviewSection[];
  status: string | null;
};

export type LegalFormState = {
  spvEntityName: string;
  jurisdiction: string;
  retainedOwnershipPercent: string;
  proRataDistributions: boolean;
  votingRights: boolean;
  liquidationPreference: boolean;
  informationRights: boolean;
};

export type OfferingFormState = {
  targetRaiseAmount: string;
  minimumInvestment: string;
  maximumInvestors: string;
  currency: string;
  offeringOpenDate: string;
  offeringCloseDate: string;
  firstYieldDate: string;
  distributionFrequency: string;
  lockupPeriod: string;
  secondaryMarket: string;
};

export type TokenizationFormState = {
  tokenName: string;
  tokenSymbol: string;
  totalSupply: string;
  tokenPrice: string;
  tokenStandard: string;
  blockchainNetwork: string;
  contractAddress: string;
};

const TOKEN_STANDARD_TO_API: Record<string, string> = {
  "erc-1400": "ERC1400",
  "erc-3643": "ERC3643",
  "erc-20": "ERC20",
};

const TOKEN_STANDARD_FROM_API: Record<string, string> = {
  ERC1400: "erc-1400",
  ERC_1400: "erc-1400",
  ERC3643: "erc-3643",
  ERC_3643: "erc-3643",
  ERC20: "erc-20",
  ERC_20: "erc-20",
};

const NETWORK_TO_API: Record<string, string> = {
  ethereum: "ETHEREUM",
  polygon: "POLYGON",
  avalanche: "AVALANCHE",
};

const NETWORK_FROM_API: Record<string, string> = {
  ETHEREUM: "ethereum",
  POLYGON: "polygon",
  AVALANCHE: "avalanche",
};

const REGULATION_TO_API: Record<string, string> = {
  "reg-d-506b": "REG_D_506B",
  "reg-d-506c": "REG_D_506C",
  "reg-s": "REG_S",
  "reg-a": "REG_A",
};

function metadataRecord(draft: Record<string, unknown>): Record<string, unknown> {
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

function toIsoDate(value: string | undefined): string | undefined {
  if (!value?.trim()) return undefined;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString();
}

function normalizeFrequency(value: string | undefined): string | undefined {
  if (!value?.trim()) return undefined;
  return value.trim().replace(/\s+/g, "_").toUpperCase();
}

export function toApiTokenStandard(ui: string): string {
  const key = ui.trim().toLowerCase();
  if (TOKEN_STANDARD_TO_API[key]) return TOKEN_STANDARD_TO_API[key];
  return ui.replace(/-/g, "").toUpperCase();
}

export function fromApiTokenStandard(api: string): string {
  const upper = api.trim().toUpperCase();
  if (TOKEN_STANDARD_FROM_API[upper]) return TOKEN_STANDARD_FROM_API[upper];
  return api.toLowerCase();
}

export function toApiNetwork(ui: string): string {
  const key = ui.trim().toLowerCase();
  if (NETWORK_TO_API[key]) return NETWORK_TO_API[key];
  return ui.toUpperCase();
}

export function fromApiNetwork(api: string): string {
  const upper = api.trim().toUpperCase();
  if (NETWORK_FROM_API[upper]) return NETWORK_FROM_API[upper];
  return api.toLowerCase();
}

export function toApiRegulationType(ui: string): string {
  return REGULATION_TO_API[ui] ?? ui.replace(/-/g, "_").toUpperCase();
}

export function buildLegalPayload(ui: LegalFormState): LegalPayload {
  return {
    spvEntityName: ui.spvEntityName.trim(),
    jurisdiction: ui.jurisdiction.trim(),
    retainedOwnershipPercent:
      parseNumberish(ui.retainedOwnershipPercent) ?? 100,
    proRataDistributions: ui.proRataDistributions,
    votingRights: ui.votingRights,
    liquidationPreference: ui.liquidationPreference,
    informationRights: ui.informationRights,
  };
}

export function buildOfferingPayload(
  ui: OfferingFormState,
  regulationType?: string,
): OfferingPayload {
  const targetRaiseAmount = parseNumberish(ui.targetRaiseAmount) ?? 0;
  const minimumInvestment = parseNumberish(ui.minimumInvestment) ?? 0;
  const maximumInvestors = parseNumberish(ui.maximumInvestors);

  return {
    targetRaiseAmount,
    minimumInvestment,
    maximumInvestors,
    currency: ui.currency.trim() || "USD",
    offeringOpenDate: toIsoDate(ui.offeringOpenDate),
    offeringCloseDate: toIsoDate(ui.offeringCloseDate),
    firstYieldDate: toIsoDate(ui.firstYieldDate),
    distributionFrequency: normalizeFrequency(ui.distributionFrequency),
    lockupPeriod: ui.lockupPeriod.trim() || undefined,
    secondaryMarket: ui.secondaryMarket.trim().toUpperCase() || undefined,
    regulationType: regulationType
      ? toApiRegulationType(regulationType)
      : undefined,
  };
}

export function buildTokenizationPayload(ui: TokenizationFormState): TokenizationPayload {
  return {
    tokenName: ui.tokenName.trim(),
    tokenSymbol: ui.tokenSymbol.trim().toUpperCase(),
    totalSupply: parseNumberish(ui.totalSupply),
    tokenPrice: parseNumberish(ui.tokenPrice) ?? 0,
    tokenStandard: toApiTokenStandard(ui.tokenStandard),
    blockchainNetwork: toApiNetwork(ui.blockchainNetwork),
    contractAddress: ui.contractAddress.trim() || undefined,
  };
}

export function buildStartOnboardingPayload(ui: {
  assetType: string;
  assetName: string;
  metadata?: Record<string, unknown>;
}): StartOnboardingPayload {
  return {
    assetType: toApiAssetType(ui.assetType),
    assetName: ui.assetName.trim() || "New Asset",
    metadata: ui.metadata,
  };
}

export function parseLegalFormFromDraft(draft: Record<string, unknown>): LegalFormState {
  const retained =
    pickNumber(draft, [
      "retainedOwnershipPercent",
      "retained_ownership_percent",
      "issuerRetainedOwnership",
    ]) ?? 100;

  return {
    spvEntityName: readStringField(draft, [
      "spvEntityName",
      "spv_entity_name",
      "entityName",
    ]),
    jurisdiction: readStringField(draft, ["jurisdiction", "spvJurisdiction"]),
    retainedOwnershipPercent: String(retained),
    proRataDistributions:
      draft.proRataDistributions === true ||
      draft.pro_rata_distributions === true,
    votingRights:
      draft.votingRights === true || draft.voting_rights === true,
    liquidationPreference:
      draft.liquidationPreference === true ||
      draft.liquidation_preference === true,
    informationRights:
      draft.informationRights === true ||
      draft.information_rights === true,
  };
}

export function parseOfferingFormFromDraft(
  draft: Record<string, unknown>,
): OfferingFormState {
  return {
    targetRaiseAmount: String(
      pickNumber(draft, ["targetRaiseAmount", "target_raise_amount"]) ?? "",
    ),
    minimumInvestment: String(
      pickNumber(draft, ["minimumInvestment", "minimum_investment"]) ?? "",
    ),
    maximumInvestors: String(
      pickNumber(draft, ["maximumInvestors", "maximum_investors"]) ?? "",
    ),
    currency: readStringField(draft, ["currency", "offeringCurrency"]) || "USD",
    offeringOpenDate: readStringField(draft, [
      "offeringOpenDate",
      "offering_open_date",
    ]),
    offeringCloseDate: readStringField(draft, [
      "offeringCloseDate",
      "offering_close_date",
    ]),
    firstYieldDate: readStringField(draft, [
      "firstYieldDate",
      "first_yield_date",
      "firstYieldDistribution",
    ]),
    distributionFrequency: readStringField(draft, [
      "distributionFrequency",
      "distribution_frequency",
    ]),
    lockupPeriod: readStringField(draft, ["lockupPeriod", "lockup_period"]),
    secondaryMarket: readStringField(draft, [
      "secondaryMarket",
      "secondary_market",
    ]),
  };
}

export function parseTokenizationFormFromDraft(
  draft: Record<string, unknown>,
): TokenizationFormState {
  const meta = metadataRecord(draft);
  return {
    tokenName: readStringField(draft, ["tokenName", "token_name"]),
    tokenSymbol: readStringField(draft, ["tokenSymbol", "token_symbol"]),
    totalSupply: String(
      pickNumber(draft, ["totalSupply", "total_supply"]) ?? "",
    ),
    tokenPrice: String(pickNumber(draft, ["tokenPrice", "token_price"]) ?? ""),
    tokenStandard: fromApiTokenStandard(
      readStringField(draft, ["tokenStandard", "token_standard"]) ||
        readStringField(meta, ["tokenStandard"]),
    ) || "erc-1400",
    blockchainNetwork: fromApiNetwork(
      readStringField(draft, [
        "blockchainNetwork",
        "blockchain_network",
        "network",
      ]) || readStringField(meta, ["network"]),
    ) || "ethereum",
    contractAddress: readStringField(draft, [
      "contractAddress",
      "contract_address",
    ]),
  };
}

export function parseOnboardingProgress(payload: unknown): OnboardingProgress | null {
  const record = unwrapPayload(payload);
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    return null;
  }

  const root = record as Record<string, unknown>;
  const progress =
    root.progress && typeof root.progress === "object"
      ? (root.progress as Record<string, unknown>)
      : root;

  const currentStepRaw =
    pickString(progress, ["currentStep", "current_step"]) ?? "ENTITY_SETUP";
  const currentStep = currentStepRaw as OnboardingStepKey;
  const stepNumber =
    ONBOARDING_STEP_ORDER[currentStep] ??
    pickNumber(progress, ["order"]) ??
    1;

  const stepsRaw = progress.steps ?? root.steps;
  const steps = Array.isArray(stepsRaw)
    ? stepsRaw
        .filter((s): s is Record<string, unknown> => Boolean(s) && typeof s === "object")
        .map((step) => {
          const key = (pickString(step, ["step"]) ?? "ENTITY_SETUP") as OnboardingStepKey;
          return {
            step: key,
            order:
              pickNumber(step, ["order"]) ?? ONBOARDING_STEP_ORDER[key] ?? 1,
            completed: step.completed === true,
            isCurrent: step.isCurrent === true,
          };
        })
    : [];

  return {
    currentStep,
    status: pickString(progress, ["status", "onboardingStatus"]) ?? "DRAFT",
    stepNumber,
    steps,
  };
}

export function parseOnboardingReview(payload: unknown): OnboardingReview | null {
  const record = unwrapPayload(payload);
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    return null;
  }

  const root = record as Record<string, unknown>;
  const sectionsRaw = root.sections ?? root.summary ?? root.items;
  const sections = Array.isArray(sectionsRaw)
    ? sectionsRaw
        .filter((s): s is Record<string, unknown> => Boolean(s) && typeof s === "object")
        .map((section) => ({
          title:
            pickString(section, ["title", "name", "step", "label"]) ?? "Section",
          subtitle:
            pickString(section, ["subtitle", "sub", "description", "summary"]) ??
            "",
        }))
    : [];

  if (sections.length === 0) {
    const fallback = [
      { key: "entity", title: "Entity Setup" },
      { key: "accreditation", title: "Accreditation" },
      { key: "asset", title: "Asset Details" },
      { key: "legal", title: "Legal Structure" },
      { key: "offering", title: "Offering Setup" },
      { key: "tokenization", title: "Tokenization" },
      { key: "custody", title: "Custody" },
    ];
    for (const item of fallback) {
      const block = root[item.key];
      if (block && typeof block === "object" && !Array.isArray(block)) {
        const obj = block as Record<string, unknown>;
        sections.push({
          title: item.title,
          subtitle:
            pickString(obj, ["summary", "subtitle", "description"]) ??
            pickString(obj, ["name", "legalCompanyName", "spvEntityName"]) ??
            "",
        });
      }
    }
  }

  return {
    sections,
    status: pickString(root, ["status", "onboardingStatus"]),
  };
}

export function parseStartOnboardingResponse(payload: unknown): {
  id: string;
  progress: OnboardingProgress | null;
} | null {
  const record = unwrapPayload(payload);
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    return null;
  }
  const root = record as Record<string, unknown>;
  const id = pickString(root, ["id", "_id", "onboardingId"]);
  if (!id) return null;
  return {
    id,
    progress: parseOnboardingProgress(root),
  };
}

export function stepNumberFromProgress(
  progress: OnboardingProgress | null | undefined,
): number {
  if (!progress) return 1;
  return progress.stepNumber || ONBOARDING_STEP_ORDER[progress.currentStep] || 1;
}
