import type { EntityFormState } from "@/lib/onboarding";
import type {
  LegalFormState,
  OfferingFormState,
  TokenizationFormState,
} from "@/lib/onboardingDrafts";
import type { OnboardingAssetType } from "@/lib/onboardingValidation";

export type ParsedAssetFormFromDraft = {
  name: string;
  description: string;
  address: string;
  appraisalValue: string;
  annualIncome: string;
  coverImageKey: string | null;
  coverImageUrl: string | null;
  capRate: string;
  occupancyRate: string;
  yearBuilt: string;
  metadata?: Record<string, string>;
};

export type ParsedCustodyFormFromDraft = {
  coldStorageRatio: string;
  multiSigConfig: string;
  walletAddress: string;
};

export type OnboardingWizardFormState = {
  currentStep: number;
  selectedAssetType: OnboardingAssetType;
  selectedReg: string;
  selectedTokenStandard: string;
  selectedNetwork: string;
  selectedCustodian: string;
  legalCompanyName: string;
  entityType: string;
  ein: string;
  businessAddress: string;
  directorsNotes: string;
  ubosNotes: string;
  spvEntityName: string;
  spvJurisdiction: string;
  retainedOwnership: string;
  proRataDistributions: boolean;
  votingRights: boolean;
  liquidationPreference: boolean;
  informationRights: boolean;
  targetRaiseAmount: string;
  minimumInvestment: string;
  maximumInvestors: string;
  offeringCurrency: string;
  offeringOpenDate: string;
  offeringCloseDate: string;
  firstYieldDate: string;
  distributionFrequency: string;
  lockupPeriod: string;
  secondaryMarket: string;
  tokenName: string;
  tokenSymbol: string;
  totalSupply: string;
  tokenPrice: string;
  accreditedOnly: boolean;
  verificationMethod: string;
  assetName: string;
  assetDescription: string;
  assetAddress: string;
  assetAppraisal: string;
  assetIncome: string;
  assetMetadata: Record<string, string>;
  coverImageKey: string | null;
  coverImageUrl: string | null;
  coldStorageRatio: string;
  multiSigConfig: string;
  acceptedTerms: boolean[];
};

export type BuildOnboardingWizardInitialStateInput = {
  hydratedEntityForm: EntityFormState;
  hydratedRegulation: string;
  hydratedAssetType: string;
  hydratedCustodian: string;
  hydratedAccreditedOnly: boolean;
  hydratedVerificationMethod: string;
  hydratedAssetForm: ParsedAssetFormFromDraft;
  hydratedCustodyForm: ParsedCustodyFormFromDraft;
  hydratedLegalForm: LegalFormState;
  hydratedOfferingForm: OfferingFormState;
  hydratedTokenizationForm: TokenizationFormState;
  progressStep: number | null;
  onboardingCurrentStep?: number | null;
  savedDraft?: Record<string, unknown> | null;
};

function applyDraftOverlay(
  base: OnboardingWizardFormState,
  draft: Record<string, unknown>,
): OnboardingWizardFormState {
  const result = { ...base };
  for (const key of Object.keys(base) as (keyof OnboardingWizardFormState)[]) {
    if (!(key in draft)) continue;
    const draftVal = draft[key];
    const baseVal = base[key];
    if (typeof draftVal === typeof baseVal) {

      if (Array.isArray(baseVal)) {
        if (Array.isArray(draftVal) && draftVal.every((v) => typeof v === typeof baseVal[0])) {
          (result as Record<string, unknown>)[key] = draftVal;
        }
      } else {
        (result as Record<string, unknown>)[key] = draftVal;
      }
    }
  }
  return result;
}

export function buildOnboardingWizardInitialState(
  input: BuildOnboardingWizardInitialStateInput,
): OnboardingWizardFormState {
  const {
    hydratedEntityForm,
    hydratedRegulation,
    hydratedAssetType,
    hydratedCustodian,
    hydratedAccreditedOnly,
    hydratedVerificationMethod,
    hydratedAssetForm,
    hydratedCustodyForm,
    hydratedLegalForm,
    hydratedOfferingForm,
    hydratedTokenizationForm,
    progressStep,
    onboardingCurrentStep,
    savedDraft,
  } = input;

  const serverState: OnboardingWizardFormState = {
    currentStep: progressStep ?? onboardingCurrentStep ?? 1,
    selectedAssetType: (hydratedAssetType || "real-estate") as OnboardingAssetType,
    selectedReg: hydratedRegulation,
    selectedTokenStandard: hydratedTokenizationForm.tokenStandard || "erc-1400",
    selectedNetwork: hydratedTokenizationForm.blockchainNetwork || "ethereum",
    selectedCustodian: hydratedCustodian,
    legalCompanyName: hydratedEntityForm.legalCompanyName,
    entityType: hydratedEntityForm.entityType,
    ein: hydratedEntityForm.ein,
    businessAddress: hydratedEntityForm.businessAddress,
    directorsNotes: hydratedEntityForm.directorsNotes,
    ubosNotes: hydratedEntityForm.ubosNotes,
    spvEntityName: hydratedLegalForm.spvEntityName,
    spvJurisdiction: hydratedLegalForm.jurisdiction,
    retainedOwnership: hydratedLegalForm.retainedOwnershipPercent,
    proRataDistributions: hydratedLegalForm.proRataDistributions,
    votingRights: hydratedLegalForm.votingRights,
    liquidationPreference: hydratedLegalForm.liquidationPreference,
    informationRights: hydratedLegalForm.informationRights,
    targetRaiseAmount: hydratedOfferingForm.targetRaiseAmount,
    minimumInvestment: hydratedOfferingForm.minimumInvestment,
    maximumInvestors: hydratedOfferingForm.maximumInvestors,
    offeringCurrency: hydratedOfferingForm.currency || "USD",
    offeringOpenDate: hydratedOfferingForm.offeringOpenDate,
    offeringCloseDate: hydratedOfferingForm.offeringCloseDate,
    firstYieldDate: hydratedOfferingForm.firstYieldDate,
    distributionFrequency:
      hydratedOfferingForm.distributionFrequency || "QUARTERLY",
    lockupPeriod: hydratedOfferingForm.lockupPeriod || "12",
    secondaryMarket: hydratedOfferingForm.secondaryMarket || "RESTRICTED",
    tokenName: hydratedTokenizationForm.tokenName,
    tokenSymbol: hydratedTokenizationForm.tokenSymbol,
    totalSupply: hydratedTokenizationForm.totalSupply,
    tokenPrice: hydratedTokenizationForm.tokenPrice,
    accreditedOnly: hydratedAccreditedOnly,
    verificationMethod: hydratedVerificationMethod || "parallel-markets",
    assetName: hydratedAssetForm.name,
    assetDescription: hydratedAssetForm.description,
    assetAddress: hydratedAssetForm.address,
    assetAppraisal: hydratedAssetForm.appraisalValue,
    assetIncome: hydratedAssetForm.annualIncome,
    assetMetadata: hydratedAssetForm.metadata || {},
    coverImageKey: hydratedAssetForm.coverImageKey,
    coverImageUrl: hydratedAssetForm.coverImageUrl,
    coldStorageRatio: hydratedCustodyForm.coldStorageRatio,
    multiSigConfig: hydratedCustodyForm.multiSigConfig,
    acceptedTerms: [false, false, false, false],
  };

  // Overlay in-progress session draft on top of server state.
  if (savedDraft) {
    return applyDraftOverlay(serverState, savedDraft);
  }

  return serverState;
}
