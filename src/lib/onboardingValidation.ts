import { z, type ZodError } from "zod";

export type OnboardingAssetType =
  | "real-estate"
  | "private-credit"
  | "data-centers"
  | "commodities";

export type OnboardingFormSnapshot = {
  startAssetName: string;
  legalCompanyName: string;
  entityType: string;
  ein: string;
  businessAddress: string;
  directorsNotes: string;
  ubosNotes: string;
  entityDocumentTypes: string[];
  selectedReg: string;
  verificationMethod: string;
  selectedAssetType: OnboardingAssetType;
  assetName: string;
  assetAddress: string;
  assetAppraisal: string;
  assetMetadata: Record<string, string>;
  spvEntityName: string;
  spvJurisdiction: string;
  retainedOwnership: string;
  targetRaiseAmount: string;
  minimumInvestment: string;
  offeringOpenDate: string;
  offeringCloseDate: string;
  tokenName: string;
  tokenSymbol: string;
  totalSupply: string;
  tokenPrice: string;
  selectedCustodian: string;
  coldStorageRatio: string;
  multiSigConfig: string;
  acceptedTerms: boolean[];
};

export type OnboardingValidationResult =
  | { success: true }
  | {
      success: false;
      fieldErrors: Record<string, string>;
      message: string;
    };

const STEP_REQUIRED_MESSAGE =
  "Please fill in all required fields before continuing.";
const SUBMIT_REQUIRED_MESSAGE =
  "Please complete all required fields and accept the terms before submitting.";

const ENTITY_KYB_DOCUMENTS = [
  "CERTIFICATE_OF_FORMATION",
  "OPERATING_AGREEMENT",
  "EIN_CONFIRMATION",
  "GOVERNMENT_ID",
] as const;

function requiredField(label: string) {
  return z
    .string()
    .trim()
    .min(1, `${label} is required`);
}

function parsePositiveNumber(raw: string): number {
  const normalized = String(raw).replace(/[$,%\s,]/g, "");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : NaN;
}

const positiveAmount = (label: string) =>
  requiredField(label).refine((v) => parsePositiveNumber(v) > 0, {
    message: `${label} must be a positive number`,
  });

const percent0to100 = (label: string) =>
  requiredField(label).refine((v) => {
    const n = parsePositiveNumber(v);
    return Number.isFinite(n) && n >= 0 && n <= 100;
  }, `${label} must be between 0 and 100`);

function zodToFieldErrors(error: ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.length ? issue.path.join(".") : "_form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

function fail(error: ZodError, message: string): OnboardingValidationResult {
  return {
    success: false,
    fieldErrors: zodToFieldErrors(error),
    message,
  };
}

function parseSchema(
  schema: z.ZodType,
  data: unknown,
  message: string,
): OnboardingValidationResult {
  const result = schema.safeParse(data);
  if (result.success) return { success: true };
  return fail(result.error, message);
}

export const onboardingStartSchema = z.object({
  startAssetName: requiredField("Asset name"),
});

export const onboardingEntitySchema = z.object({
  legalCompanyName: requiredField("Legal company name"),
  entityType: requiredField("Entity type"),
  ein: requiredField("EIN"),
  businessAddress: requiredField("Registered business address"),
  directorsNotes: requiredField("Directors information"),
  ubosNotes: requiredField("Ultimate beneficial owners (UBOs)"),
});

export const onboardingAccreditationSchema = z.object({
  selectedReg: requiredField("Offering regulation"),
  verificationMethod: requiredField("Accreditation verification method"),
});

export const onboardingLegalSchema = z.object({
  spvEntityName: requiredField("SPV entity name"),
  spvJurisdiction: requiredField("SPV jurisdiction"),
  retainedOwnership: percent0to100("Issuer retained ownership"),
});

export const onboardingOfferingSchema = z
  .object({
    targetRaiseAmount: positiveAmount("Target raise amount"),
    minimumInvestment: positiveAmount("Minimum investment"),
    offeringOpenDate: requiredField("Offering open date"),
    offeringCloseDate: requiredField("Offering close date"),
  })
  .superRefine((data, ctx) => {
    const open = Date.parse(data.offeringOpenDate);
    const close = Date.parse(data.offeringCloseDate);
    if (Number.isFinite(open) && Number.isFinite(close) && close < open) {
      ctx.addIssue({
        code: "custom",
        message: "Offering close date must be on or after the open date",
        path: ["offeringCloseDate"],
      });
    }
  });

export const onboardingTokenizationSchema = z.object({
  tokenName: requiredField("Token name"),
  tokenSymbol: requiredField("Token symbol").refine(
    (v) => /^[A-Za-z0-9]{2,12}$/.test(v),
    "Token symbol must be 2–12 letters or numbers",
  ),
  totalSupply: positiveAmount("Total supply"),
  tokenPrice: positiveAmount("Token price"),
});

export const onboardingCustodySchema = z.object({
  selectedCustodian: requiredField("Custodian"),
  coldStorageRatio: percent0to100("Cold storage ratio"),
  multiSigConfig: requiredField("Multi-sig configuration"),
});

function resolvedAssetName(snapshot: OnboardingFormSnapshot): string {
  return snapshot.assetName.trim() || snapshot.startAssetName.trim();
}

function buildAssetSchema(assetType: OnboardingAssetType) {
  const name = z
    .string()
    .trim()
    .min(1, "Asset name is required");

  switch (assetType) {
    case "real-estate":
      return z.object({
        assetName: name,
        assetAddress: requiredField("Property address"),
        assetAppraisal: positiveAmount("Appraised valuation"),
      });
    case "private-credit":
      return z.object({
        assetName: name,
        assetAppraisal: positiveAmount("Principal amount"),
        creditType: requiredField("Credit type"),
      });
    case "data-centers":
      return z.object({
        assetName: name,
        assetAddress: requiredField("Location"),
        assetAppraisal: positiveAmount("Appraised value"),
      });
    case "commodities":
      return z.object({
        assetName: name,
        commodityType: requiredField("Commodity type"),
        assetAppraisal: positiveAmount("Total value"),
      });
    default:
      return z.object({ assetName: name });
  }
}

function validateEntityDocuments(
  uploadedTypes: string[],
): OnboardingValidationResult {
  const missing = ENTITY_KYB_DOCUMENTS.filter(
    (type) => !uploadedTypes.includes(type),
  );
  if (missing.length === 0) return { success: true };

  const labels: Record<string, string> = {
    CERTIFICATE_OF_FORMATION: "Certificate of Formation",
    OPERATING_AGREEMENT: "Operating Agreement",
    EIN_CONFIRMATION: "EIN Confirmation Letter",
    GOVERNMENT_ID: "Government-Issued ID",
  };

  return {
    success: false,
    fieldErrors: {
      entityDocuments: `Upload required documents: ${missing.map((t) => labels[t] ?? t).join(", ")}`,
    },
    message: STEP_REQUIRED_MESSAGE,
  };
}

function validateAssetStep(
  snapshot: OnboardingFormSnapshot,
): OnboardingValidationResult {
  const schema = buildAssetSchema(snapshot.selectedAssetType);
  const payload: Record<string, string> = {
    assetName: resolvedAssetName(snapshot),
    assetAddress: snapshot.assetAddress,
    assetAppraisal: snapshot.assetAppraisal,
    creditType: snapshot.assetMetadata.creditType ?? "",
    commodityType: snapshot.assetMetadata.commodityType ?? "",
  };

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return fail(parsed.error, STEP_REQUIRED_MESSAGE);
  }

  const docTypes = snapshot.entityDocumentTypes || [];
  let requiredDocType: string | null = null;
  let requiredDocLabel = "";

  switch (snapshot.selectedAssetType) {
    case "real-estate":
      requiredDocType = "APPRAISAL_REPORT";
      requiredDocLabel = "MAI Appraisal Report";
      break;
    case "commodities":
      requiredDocType = "VAULT_CERTIFICATE";
      requiredDocLabel = "Vault Storage Certificate";
      break;
    case "data-centers":
      requiredDocType = "FACILITY_APPRAISAL";
      requiredDocLabel = "Facility Appraisal Report";
      break;
    case "private-credit":
      requiredDocType = "CREDIT_AGREEMENT";
      requiredDocLabel = "Credit Agreement";
      break;
  }

  if (requiredDocType && !docTypes.includes(requiredDocType)) {
    return {
      success: false,
      fieldErrors: {
        assetDocuments: `Upload required document: ${requiredDocLabel}`,
      },
      message: STEP_REQUIRED_MESSAGE,
    };
  }

  return { success: true };
}

function validateReviewStep(
  snapshot: OnboardingFormSnapshot,
): OnboardingValidationResult {
  if (snapshot.acceptedTerms.length < 4) {
    return {
      success: false,
      fieldErrors: { acceptedTerms: "Accept all terms and certifications" },
      message: SUBMIT_REQUIRED_MESSAGE,
    };
  }
  const missing = snapshot.acceptedTerms
    .map((accepted, i) => (accepted ? -1 : i))
    .filter((i) => i >= 0);
  if (missing.length === 0) return { success: true };

  return {
    success: false,
    fieldErrors: {
      acceptedTerms: "You must accept all terms and certifications to submit",
    },
    message: SUBMIT_REQUIRED_MESSAGE,
  };
}

export function validateOnboardingStart(
  snapshot: Pick<OnboardingFormSnapshot, "startAssetName">,
): OnboardingValidationResult {
  return parseSchema(
    onboardingStartSchema,
    { startAssetName: snapshot.startAssetName },
    "Enter an asset name to begin onboarding.",
  );
}

export function validateOnboardingStep(
  step: number,
  snapshot: OnboardingFormSnapshot,
): OnboardingValidationResult {
  switch (step) {
    case 1: {
      const fields = parseSchema(
        onboardingEntitySchema,
        {
          legalCompanyName: snapshot.legalCompanyName,
          entityType: snapshot.entityType,
          ein: snapshot.ein,
          businessAddress: snapshot.businessAddress,
          directorsNotes: snapshot.directorsNotes,
          ubosNotes: snapshot.ubosNotes,
        },
        STEP_REQUIRED_MESSAGE,
      );
      if (!fields.success) return fields;
      return validateEntityDocuments(snapshot.entityDocumentTypes);
    }
    case 2:
      return parseSchema(
        onboardingAccreditationSchema,
        {
          selectedReg: snapshot.selectedReg,
          verificationMethod: snapshot.verificationMethod,
        },
        STEP_REQUIRED_MESSAGE,
      );
    case 3:
      return validateAssetStep(snapshot);
    case 4:
      return parseSchema(
        onboardingLegalSchema,
        {
          spvEntityName: snapshot.spvEntityName,
          spvJurisdiction: snapshot.spvJurisdiction,
          retainedOwnership: snapshot.retainedOwnership,
        },
        STEP_REQUIRED_MESSAGE,
      );
    case 5:
      return parseSchema(
        onboardingOfferingSchema,
        {
          targetRaiseAmount: snapshot.targetRaiseAmount,
          minimumInvestment: snapshot.minimumInvestment,
          offeringOpenDate: snapshot.offeringOpenDate,
          offeringCloseDate: snapshot.offeringCloseDate,
        },
        STEP_REQUIRED_MESSAGE,
      );
    case 6:
      return parseSchema(
        onboardingTokenizationSchema,
        {
          tokenName: snapshot.tokenName,
          tokenSymbol: snapshot.tokenSymbol,
          tokenPrice: snapshot.tokenPrice,
        },
        STEP_REQUIRED_MESSAGE,
      );
    case 7:
      return parseSchema(
        onboardingCustodySchema,
        {
          selectedCustodian: snapshot.selectedCustodian,
          coldStorageRatio: snapshot.coldStorageRatio,
          multiSigConfig: snapshot.multiSigConfig,
        },
        STEP_REQUIRED_MESSAGE,
      );
    case 8:
      return validateReviewStep(snapshot);
    default:
      return { success: true };
  }
}

export function validateOnboardingForSubmit(snapshot: OnboardingFormSnapshot): {
  success: true;
} | {
  success: false;
  firstInvalidStep: number;
  fieldErrors: Record<string, string>;
  message: string;
} {
  for (let step = 1; step <= 8; step++) {
    const result = validateOnboardingStep(step, snapshot);
    if (!result.success) {
      return {
        success: false,
        firstInvalidStep: step,
        fieldErrors: result.fieldErrors,
        message: result.message,
      };
    }
  }
  return { success: true };
}

/** Map Zod / validation keys to FormField `error` lookup helpers */
export function onboardingFieldError(
  fieldErrors: Record<string, string>,
  key: string,
): string | undefined {
  return fieldErrors[key];
}
