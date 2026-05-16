"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { formatRequestError } from "@/lib/formatRequestError";
import {
  buildLegalPayload,
  buildOfferingPayload,
  buildStartOnboardingPayload,
  buildTokenizationPayload,
  parseLegalFormFromDraft,
  parseOfferingFormFromDraft,
  parseTokenizationFormFromDraft,
  stepNumberFromProgress,
  type LegalFormState,
  type OfferingFormState,
  type TokenizationFormState,
} from "@/lib/onboardingDrafts";
import {
  accreditedOnlyFromDraft,
  assetTypeFromDraft,
  buildAccreditationPayload,
  buildAssetPayload,
  buildCustodyPayload,
  buildEntityPayload,
  custodianFromDraft,
  parseAssetFormFromDraft,
  parseCustodyFormFromDraft,
  parseEntityFormFromDraft,
  regulationFromDraft,
  type EntityFormState,
  type OnboardingDocumentType,
} from "@/lib/onboarding";
import {
  getStoredOnboardingId,
  setStoredOnboardingId,
} from "@/lib/onboardingStorage";
import { useAuthenticatedProfileQuery } from "@/store/api/authApi";
import {
  useDeleteOnboardingDocumentMutation,
  useGetAccreditationQuery,
  useGetAssetDraftQuery,
  useGetCustodyQuery,
  useGetEntityQuery,
  useGetLegalQuery,
  useGetOfferingQuery,
  useGetOnboardingProgressQuery,
  useGetOnboardingQuery,
  useGetOnboardingReviewQuery,
  useGetTokenizationQuery,
  useListOnboardingDocumentsQuery,
  useStartOnboardingMutation,
  useSubmitOnboardingMutation,
  useUpdateAccreditationMutation,
  useUpdateAssetDraftMutation,
  useUpdateCustodyMutation,
  useUpdateEntityMutation,
  useUpdateLegalMutation,
  useUpdateOfferingMutation,
  useUpdateTokenizationMutation,
  useUploadOnboardingDocumentMutation,
} from "@/store/api/onboardingApi";

export function useIssuerOnboarding() {
  const { data: profile, isLoading: profileLoading } =
    useAuthenticatedProfileQuery();
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const storedOrProfileId = useMemo(() => {
    const stored = getStoredOnboardingId();
    if (stored) return stored;
    return profile?.onboardingId ?? null;
  }, [profile?.onboardingId]);

  const onboardingId = sessionId ?? storedOrProfileId;

  useEffect(() => {
    if (onboardingId) {
      setStoredOnboardingId(onboardingId);
    }
  }, [onboardingId]);

  const skip = !onboardingId;
  const {
    data: onboardingState,
    isLoading: stateLoading,
    isError: stateError,
    refetch: refetchState,
  } = useGetOnboardingQuery(onboardingId ?? "", { skip });

  const { data: entityDraft } = useGetEntityQuery(onboardingId ?? "", { skip });
  const { data: accreditationDraft } = useGetAccreditationQuery(
    onboardingId ?? "",
    { skip },
  );
  const { data: assetDraft } = useGetAssetDraftQuery(onboardingId ?? "", {
    skip,
  });
  const { data: legalDraft } = useGetLegalQuery(onboardingId ?? "", { skip });
  const { data: offeringDraft } = useGetOfferingQuery(onboardingId ?? "", {
    skip,
  });
  const { data: tokenizationDraft } = useGetTokenizationQuery(
    onboardingId ?? "",
    { skip },
  );
  const { data: custodyDraft } = useGetCustodyQuery(onboardingId ?? "", {
    skip,
  });
  const { data: progress } = useGetOnboardingProgressQuery(onboardingId ?? "", {
    skip,
  });
  const { data: review, refetch: refetchReview } = useGetOnboardingReviewQuery(
    onboardingId ?? "",
    { skip },
  );

  const {
    data: documents = [],
    isLoading: docsLoading,
    refetch: refetchDocuments,
  } = useListOnboardingDocumentsQuery(onboardingId ?? "", { skip });

  const [startOnboarding] = useStartOnboardingMutation();
  const [updateEntity] = useUpdateEntityMutation();
  const [updateAccreditation] = useUpdateAccreditationMutation();
  const [updateAsset] = useUpdateAssetDraftMutation();
  const [updateLegal] = useUpdateLegalMutation();
  const [updateOffering] = useUpdateOfferingMutation();
  const [updateTokenization] = useUpdateTokenizationMutation();
  const [updateCustody] = useUpdateCustodyMutation();
  const [submitOnboarding] = useSubmitOnboardingMutation();
  const [uploadDocument] = useUploadOnboardingDocumentMutation();
  const [deleteDocument] = useDeleteOnboardingDocumentMutation();

  const isReady = !profileLoading;
  const isLoading =
    profileLoading || (Boolean(onboardingId) && stateLoading);

  const persist = useCallback(
    async (fn: () => Promise<unknown>) => {
      if (!onboardingId) {
        setSaveError("No onboarding session found. Sign in again or contact support.");
        return false;
      }
      setIsSaving(true);
      setSaveError(null);
      setLastSaved(false);
      try {
        await fn();
        setLastSaved(true);
        return true;
      } catch (err) {
        setSaveError(formatRequestError(err));
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [onboardingId],
  );

  const ensureOnboardingSession = useCallback(
    async (assetType = "real-estate", assetName = "New Asset") => {
      if (onboardingId) return onboardingId;
      setSaveError(null);
      try {
        const result = await startOnboarding(
          buildStartOnboardingPayload({ assetType, assetName }),
        ).unwrap();
        if (!result.id) {
          setSaveError("Could not start onboarding session.");
          return null;
        }
        setSessionId(result.id);
        setStoredOnboardingId(result.id);
        return result.id;
      } catch (err) {
        setSaveError(formatRequestError(err));
        return null;
      }
    },
    [onboardingId, startOnboarding],
  );

  const saveEntityDraft = useCallback(
    async (ui: EntityFormState) => {
      const id = await ensureOnboardingSession();
      if (!id) return false;
      return persist(() =>
        updateEntity({ id, body: buildEntityPayload(ui) }).unwrap(),
      );
    },
    [ensureOnboardingSession, persist, updateEntity],
  );

  const saveAccreditationDraft = useCallback(
    (ui: Parameters<typeof buildAccreditationPayload>[0]) =>
      persist(() =>
        updateAccreditation({
          id: onboardingId!,
          body: buildAccreditationPayload(ui),
        }).unwrap(),
      ),
    [onboardingId, persist, updateAccreditation],
  );

  const saveAssetDraft = useCallback(
    (ui: Parameters<typeof buildAssetPayload>[0]) =>
      persist(() =>
        updateAsset({
          id: onboardingId!,
          body: buildAssetPayload(ui),
        }).unwrap(),
      ),
    [onboardingId, persist, updateAsset],
  );

  const saveLegalDraft = useCallback(
    (ui: LegalFormState) =>
      persist(() =>
        updateLegal({
          id: onboardingId!,
          body: buildLegalPayload(ui),
        }).unwrap(),
      ),
    [onboardingId, persist, updateLegal],
  );

  const saveOfferingDraft = useCallback(
    (ui: OfferingFormState, regulationType?: string) =>
      persist(() =>
        updateOffering({
          id: onboardingId!,
          body: buildOfferingPayload(ui, regulationType),
        }).unwrap(),
      ),
    [onboardingId, persist, updateOffering],
  );

  const saveTokenizationDraft = useCallback(
    (ui: TokenizationFormState) =>
      persist(() =>
        updateTokenization({
          id: onboardingId!,
          body: buildTokenizationPayload(ui),
        }).unwrap(),
      ),
    [onboardingId, persist, updateTokenization],
  );

  const saveCustodyDraft = useCallback(
    (ui: Parameters<typeof buildCustodyPayload>[0]) =>
      persist(() =>
        updateCustody({
          id: onboardingId!,
          body: buildCustodyPayload(ui),
        }).unwrap(),
      ),
    [onboardingId, persist, updateCustody],
  );

  const submitApplication = useCallback(async () => {
    if (!onboardingId) {
      setSaveError("No onboarding session found.");
      return false;
    }
    setIsSaving(true);
    setSaveError(null);
    try {
      await submitOnboarding(onboardingId).unwrap();
      await refetchReview();
      await refetchState();
      return true;
    } catch (err) {
      setSaveError(formatRequestError(err));
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [onboardingId, refetchReview, refetchState, submitOnboarding]);

  const uploadOnboardingFile = useCallback(
    async (
      file: File,
      type: OnboardingDocumentType | string,
      metadata?: Record<string, unknown>,
    ) => {
      const id = await ensureOnboardingSession();
      if (!id) return null;
      setSaveError(null);
      try {
        const result = await uploadDocument({
          id,
          file,
          type,
          metadata,
        }).unwrap();
        await refetchDocuments();
        return result;
      } catch (err) {
        setSaveError(formatRequestError(err));
        return null;
      }
    },
    [ensureOnboardingSession, refetchDocuments, uploadDocument],
  );

  const deleteOnboardingDocument = useCallback(
    async (documentId: string) => {
      if (!onboardingId) {
        setSaveError("No onboarding session found.");
        return false;
      }
      setSaveError(null);
      try {
        await deleteDocument({ id: onboardingId, documentId }).unwrap();
        await refetchDocuments();
        return true;
      } catch (err) {
        setSaveError(formatRequestError(err));
        return false;
      }
    },
    [deleteDocument, onboardingId, refetchDocuments],
  );

  const entityRecord =
    onboardingState?.entity && Object.keys(onboardingState.entity).length > 0
      ? onboardingState.entity
      : (entityDraft ?? {});

  const accreditationRecord =
    onboardingState?.accreditation &&
    Object.keys(onboardingState.accreditation).length > 0
      ? onboardingState.accreditation
      : (accreditationDraft ?? {});

  const assetRecord =
    onboardingState?.asset && Object.keys(onboardingState.asset).length > 0
      ? onboardingState.asset
      : (assetDraft ?? {});

  const legalRecord = legalDraft ?? {};

  const offeringRecord = offeringDraft ?? {};
  const tokenizationRecord = tokenizationDraft ?? {};

  const custodyRecord =
    onboardingState?.custody && Object.keys(onboardingState.custody).length > 0
      ? onboardingState.custody
      : (custodyDraft ?? {});

  const hydratedEntityForm = parseEntityFormFromDraft(entityRecord);
  const hydratedRegulation = regulationFromDraft(accreditationRecord);
  const hydratedAssetType = assetTypeFromDraft(assetRecord);
  const hydratedCustodian = custodianFromDraft(custodyRecord);
  const hydratedAccreditedOnly = accreditedOnlyFromDraft(accreditationRecord);
  const hydratedAssetForm = parseAssetFormFromDraft(assetRecord);
  const hydratedLegalForm = parseLegalFormFromDraft(
    legalRecord && typeof legalRecord === "object" ? legalRecord : {},
  );
  const hydratedOfferingForm = parseOfferingFormFromDraft(offeringRecord);
  const hydratedTokenizationForm =
    parseTokenizationFormFromDraft(tokenizationRecord);
  const hydratedCustodyForm = parseCustodyFormFromDraft(custodyRecord);
  const progressStep = stepNumberFromProgress(progress ?? null);

  return {
    onboardingId,
    isReady,
    isLoading,
    isSaving,
    saveError,
    lastSaved,
    stateError,
    onboardingState,
    progress,
    progressStep,
    review,
    entityDraft: entityRecord,
    accreditationDraft: accreditationRecord,
    assetDraft: assetRecord,
    legalDraft: legalRecord,
    offeringDraft: offeringRecord,
    tokenizationDraft: tokenizationRecord,
    custodyDraft: custodyRecord,
    documents,
    docsLoading,
    hydratedEntityForm,
    hydratedRegulation,
    hydratedAssetType,
    hydratedCustodian,
    hydratedAccreditedOnly,
    hydratedAssetForm,
    hydratedLegalForm,
    hydratedOfferingForm,
    hydratedTokenizationForm,
    hydratedCustodyForm,
    refetchState,
    refetchDocuments,
    refetchReview,
    ensureOnboardingSession,
    saveEntityDraft,
    saveAccreditationDraft,
    saveAssetDraft,
    saveLegalDraft,
    saveOfferingDraft,
    saveTokenizationDraft,
    saveCustodyDraft,
    submitApplication,
    uploadOnboardingFile,
    deleteOnboardingDocument,
    clearSaveError: () => setSaveError(null),
  };
}
