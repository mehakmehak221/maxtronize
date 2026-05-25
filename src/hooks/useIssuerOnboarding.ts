"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { formatRequestError, isApiNotFoundError } from "@/lib/formatRequestError";
import {
  buildLegalPayload,
  buildOfferingPayload,
  buildStartOnboardingPayload,
  type StartOnboardingSessionResult,
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
  metadataRecord,
  ONBOARDING_COVER_DOCUMENT_TYPE,
  parseAssetFormFromDraft,
  pickCoverImageKey,
  resolveCoverImageKeyFromUpload,
  storageUrlFromCoverKey,
  parseCustodyFormFromDraft,
  parseEntityFormFromDraft,
  regulationFromDraft,
  resolveOnboardingApplicationStatus,
  verificationMethodFromDraft,
  type EntityFormState,
  type OnboardingDocument,
  type OnboardingDocumentType,
} from "@/lib/onboarding";
import {
  clearIssuerOnboardingLocalSession,
  clearStoredOnboardingId,
} from "@/lib/onboardingStorage";
import { parseUploadFileResult } from "@/lib/profile";
import { pickCoverImageUrl, resolveStoragePublicUrl } from "@/lib/storageUrl";
import { useAuthenticatedProfileQuery } from "@/store/api/authApi";
import { useUploadFileMutation } from "@/store/api/uploadApi";
import {
  useDeleteOnboardingDocumentMutation,
  useGetOnboardingQuery,
  useGetOnboardingReviewQuery,
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
  const searchParams = useSearchParams();
  const forceFreshStart = searchParams.get("start") === "1";

  const { data: profile, isLoading: profileLoading } =
    useAuthenticatedProfileQuery();
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [resetStoredSession, setResetStoredSession] = useState(false);
  const [invalidOnboardingId, setInvalidOnboardingId] = useState<string | null>(null);

  const storedOrProfileId = useMemo(() => {
    if (resetStoredSession || forceFreshStart) return null;
    return profile?.onboardingId ?? null;
  }, [forceFreshStart, profile?.onboardingId, resetStoredSession]);

  const candidateOnboardingId = sessionId ?? storedOrProfileId;
  const onboardingId =
    candidateOnboardingId && candidateOnboardingId !== invalidOnboardingId
      ? candidateOnboardingId
      : null;

  useEffect(() => {
    clearIssuerOnboardingLocalSession();
  }, []);

  const skip = !onboardingId;
  const {
    data: onboardingState,
    isLoading: stateLoading,
    isError: stateIsError,
    error: stateError,
    refetch: refetchState,
  } = useGetOnboardingQuery(onboardingId ?? "", { skip });

  const { data: review, refetch: refetchReview } = useGetOnboardingReviewQuery(
    onboardingId ?? "",
    { skip },
  );

  const [prevForceFreshStart, setPrevForceFreshStart] = useState(false);
  if (forceFreshStart && !prevForceFreshStart) {
    setPrevForceFreshStart(true);
    clearIssuerOnboardingLocalSession();
    setSessionId(null);
  } else if (!forceFreshStart && prevForceFreshStart) {
    setPrevForceFreshStart(false);
  }

  const [prevCandidateOnboardingId, setPrevCandidateOnboardingId] = useState<string | null>(null);
  const [prevIsError, setPrevIsError] = useState(false);

  if (candidateOnboardingId && stateIsError && isApiNotFoundError(stateError)) {
    if (candidateOnboardingId !== prevCandidateOnboardingId || !prevIsError) {
      setPrevCandidateOnboardingId(candidateOnboardingId);
      setPrevIsError(true);
      clearStoredOnboardingId();
      setInvalidOnboardingId(candidateOnboardingId);
      setSessionId(null);
    }
  } else if (!stateIsError && prevIsError) {
    setPrevIsError(false);
  }

  const docsLoading = stateLoading;
  const refetchDocuments = refetchState;

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
  const [uploadFile] = useUploadFileMutation();
  const [deleteDocument] = useDeleteOnboardingDocumentMutation();

  const isReady = !profileLoading;
  const onboardingSessionMissing =
    Boolean(candidateOnboardingId) &&
    stateIsError &&
    isApiNotFoundError(stateError);
  const isLoading =
    profileLoading ||
    (Boolean(onboardingId) && stateLoading && !onboardingSessionMissing);

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

  type StartSessionParams = {
    assetType?: string;
    assetName?: string;
    metadata?: Record<string, unknown>;
    coverFile?: File | null;
    coverImageKey?: string | null;
    coverImageUrl?: string | null;
  };

  const uploadCoverFileToStorage = useCallback(
    async (file: File): Promise<{ key: string; url: string | null } | null> => {
      try {
        const fileUpload = await uploadFile({ file, folder: "assets" }).unwrap();
        const parsed = parseUploadFileResult(fileUpload.raw);
        if (!parsed.key) return null;
        return {
          key: parsed.key,
          url: parsed.url,
        };
      } catch {
        return null;
      }
    },
    [uploadFile],
  );

  const syncCoverOnAssetDraft = useCallback(
    async (
      id: string,
      cover: { key: string; url?: string | null },
      assetType: string,
      assetName: string,
    ) => {
      const coverUrl = resolveStoragePublicUrl(cover.key, cover.url);
      await updateAsset({
        id,
        body: buildAssetPayload({
          assetType,
          name: assetName,
          metadata: {
            coverImageKey: cover.key,
            ...(coverUrl ? { coverImageUrl: coverUrl } : {}),
          },
        }),
      }).unwrap();
    },
    [updateAsset],
  );

  const startOnboardingSession = useCallback(
    async ({
      assetType = "real-estate",
      assetName = "New Asset",
      metadata,
      coverFile,
      coverImageKey: coverKeyParam,
      coverImageUrl: coverUrlParam,
    }: StartSessionParams = {}): Promise<StartOnboardingSessionResult | null> => {
      setSaveError(null);
      try {
        let coverImageKey = coverKeyParam?.trim() || undefined;
        let coverImageUrl = coverUrlParam?.trim() || undefined;

        if (coverFile && !coverImageKey) {
          const uploaded = await uploadCoverFileToStorage(coverFile);
          if (!uploaded) {
            setSaveError("Could not upload cover image. Try a JPG or PNG under 10MB.");
            return null;
          }
          coverImageKey = uploaded.key;
          coverImageUrl = uploaded.url ?? undefined;
        }

        const result = await startOnboarding(
          buildStartOnboardingPayload({
            assetType,
            assetName,
            coverImageKey,
            coverImageUrl,
            metadata,
          }),
        ).unwrap();
        if (!result.id) {
          setSaveError("Could not start onboarding session.");
          return null;
        }

        if (coverImageKey) {
          try {
            await syncCoverOnAssetDraft(
              result.id,
              { key: coverImageKey, url: coverImageUrl },
              assetType,
              assetName,
            );
          } catch {
            // Start payload already includes cover; asset sync is best-effort.
          }
        }

        setSessionId(result.id);
        return {
          id: result.id,
          coverImageKey,
          coverImageUrl,
        };
      } catch (err) {
        setSaveError(formatRequestError(err));
        return null;
      }
    },
    [
      startOnboarding,
      syncCoverOnAssetDraft,
      uploadCoverFileToStorage,
    ],
  );

  const ensureOnboardingSession = useCallback(
    async (params: StartSessionParams = {}) => {
      if (onboardingId) return onboardingId;
      const started = await startOnboardingSession(params);
      return started?.id ?? null;
    },
    [onboardingId, startOnboardingSession],
  );

  const forceStartOnboardingSession = useCallback(
    async (params: StartSessionParams = {}): Promise<StartOnboardingSessionResult | null> => {
      clearIssuerOnboardingLocalSession();
      setSessionId(null);
      setInvalidOnboardingId(null);
      setResetStoredSession(true);
      try {
        return await startOnboardingSession(params);
      } finally {
        setResetStoredSession(false);
      }
    },
    [startOnboardingSession],
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

  const dismissOnboardingSession = useCallback((submittedId?: string) => {
    clearIssuerOnboardingLocalSession();
    setSessionId(null);
    if (submittedId) {
      setInvalidOnboardingId(submittedId);
    }
  }, []);

  const submitApplication = useCallback(async () => {
    if (!onboardingId) {
      setSaveError("No onboarding session found.");
      return false;
    }
    const submittedId = onboardingId;
    setIsSaving(true);
    setSaveError(null);
    try {
      await submitOnboarding(submittedId).unwrap();
      await refetchReview();
      await refetchState();
      dismissOnboardingSession(submittedId);
      return true;
    } catch (err) {
      setSaveError(formatRequestError(err));
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [
    dismissOnboardingSession,
    onboardingId,
    refetchReview,
    refetchState,
    submitOnboarding,
  ]);

  const uploadOnboardingFile = useCallback(
    async (
      file: File,
      type: OnboardingDocumentType | string,
      metadata?: Record<string, unknown>,
    ): Promise<{ document: OnboardingDocument | null; error: string | null }> => {
      const id = await ensureOnboardingSession();
      if (!id) {
        return {
          document: null,
          error: "No onboarding session found. Start onboarding first.",
        };
      }
      try {
        const result = await uploadDocument({
          id,
          file,
          type,
          metadata,
        }).unwrap();
        await refetchDocuments();
        return { document: result, error: null };
      } catch (err) {
        return { document: null, error: formatRequestError(err) };
      }
    },
    [ensureOnboardingSession, refetchDocuments, uploadDocument],
  );

  const uploadAndLinkCoverImage = useCallback(
    async (
      file: File,
      options?: {
        onboardingId?: string;
        assetType?: string;
        assetName?: string;
      },
    ): Promise<
      | { key: string; url: string | null; error?: undefined }
      | { key?: undefined; url?: undefined; error: string }
      | null
    > => {
      const id =
        options?.onboardingId ??
        (await ensureOnboardingSession({
          assetType: options?.assetType,
          assetName: options?.assetName,
        }));
      if (!id) return null;

      setIsSaving(true);
      try {
        const fileUpload = await uploadFile({ file, folder: "assets" }).unwrap();
        const uploaded = parseUploadFileResult(fileUpload.raw);

        let complianceDoc: OnboardingDocument | null = null;
        try {
          complianceDoc = await uploadDocument({
            id,
            file,
            type: ONBOARDING_COVER_DOCUMENT_TYPE,
            metadata: {
              role: "cover",
              purpose: "asset_cover",
              documentRole: "ASSET_COVER",
            },
          }).unwrap();
        } catch {
          // Compliance copy is optional; asset cover still links via /upload/file.
        }

        const key =
          uploaded.key ??
          complianceDoc?.storageKey ??
          resolveCoverImageKeyFromUpload(complianceDoc, id, file.name);

        const previewUrl =
          uploaded.url ??
          complianceDoc?.url ??
          (key ? storageUrlFromCoverKey(key) : null);
        const persistedCoverUrl = key
          ? resolveStoragePublicUrl(key, previewUrl)
          : null;

        const draft =
          onboardingState?.asset && typeof onboardingState.asset === "object"
            ? onboardingState.asset
            : {};
        const parsed = parseAssetFormFromDraft(draft);
        await updateAsset({
          id,
          body: buildAssetPayload({
            assetType: options?.assetType ?? assetTypeFromDraft(draft),
            name: options?.assetName ?? parsed.name,
            description: parsed.description || undefined,
            address: parsed.address || undefined,
            appraisalValue: parsed.appraisalValue || undefined,
            annualIncome: parsed.annualIncome || undefined,
            metadata: {
              ...metadataRecord(draft),
              coverImageKey: key,
              ...(persistedCoverUrl ? { coverImageUrl: persistedCoverUrl } : {}),
            },
          }),
        }).unwrap();

        await refetchDocuments();
        await refetchState();
        return { key, url: previewUrl };
      } catch (err) {
        return { error: formatRequestError(err) };
      } finally {
        setIsSaving(false);
      }
    },
    [
      ensureOnboardingSession,
      onboardingState?.asset,
      refetchDocuments,
      refetchState,
      updateAsset,
      uploadDocument,
      uploadFile,
    ],
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

  const entityRecord = onboardingState?.entity ?? {};
  const accreditationRecord = onboardingState?.accreditation ?? {};
  const assetRecord = onboardingState?.asset ?? {};
  const legalRecord = onboardingState?.legal ?? {};
  const offeringRecord = onboardingState?.offering ?? {};
  const tokenizationRecord = onboardingState?.tokenization ?? {};
  const custodyRecord = onboardingState?.custody ?? {};
  const documents = onboardingState?.documents ?? [];
  const progress = onboardingState?.progress ?? null;

  const applicationStatus = useMemo(
    () =>
      resolveOnboardingApplicationStatus([
        onboardingState?.status,
        progress?.status,
        review?.status,
      ]),
    [onboardingState?.status, progress?.status, review?.status],
  );

  const isSessionTerminal = applicationStatus.key !== "draft";

  const hydratedEntityForm = parseEntityFormFromDraft(entityRecord);
  const hydratedRegulation = regulationFromDraft(accreditationRecord);
  const hydratedAssetType = assetTypeFromDraft(assetRecord);
  const hydratedCustodian = custodianFromDraft(custodyRecord);
  const hydratedAccreditedOnly = accreditedOnlyFromDraft(accreditationRecord);
  const hydratedVerificationMethod = verificationMethodFromDraft(accreditationRecord);
  const hydratedAssetForm = parseAssetFormFromDraft(assetRecord);
  const hydratedLegalForm = parseLegalFormFromDraft(
    legalRecord && typeof legalRecord === "object" ? legalRecord : {},
  );
  const hydratedOfferingForm = parseOfferingFormFromDraft(offeringRecord);
  const hydratedTokenizationForm =
    parseTokenizationFormFromDraft(tokenizationRecord);
  const hydratedCustodyForm = parseCustodyFormFromDraft(custodyRecord);
  const progressStep = stepNumberFromProgress(progress ?? null);

  const isApprovedOrLocked = isSessionTerminal;

  const clearSaveError = useCallback(() => setSaveError(null), []);

  return {
    onboardingId,
    isReady,
    isLoading,
    isSaving,
    saveError,
    lastSaved,
    stateError: stateIsError,
    onboardingSessionMissing,
    onboardingState,
    progress,
    progressStep,
    isApprovedOrLocked,
    isSessionTerminal,
    forceFreshStart,
    applicationStatus,
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
    hydratedVerificationMethod,
    hydratedAssetForm,
    hydratedLegalForm,
    hydratedOfferingForm,
    hydratedTokenizationForm,
    hydratedCustodyForm,
    refetchState,
    refetchDocuments,
    refetchReview,
    startOnboardingSession,
    ensureOnboardingSession,
    forceStartOnboardingSession,
    saveEntityDraft,
    saveAccreditationDraft,
    saveAssetDraft,
    saveLegalDraft,
    saveOfferingDraft,
    saveTokenizationDraft,
    saveCustodyDraft,
    submitApplication,
    uploadOnboardingFile,
    uploadAndLinkCoverImage,
    deleteOnboardingDocument,
    clearSaveError,
    coverImageKeyFromAsset:
      pickCoverImageKey(assetRecord) ?? pickCoverImageKey(metadataRecord(assetRecord)),
    coverImageUrlFromAsset:
      pickCoverImageUrl(metadataRecord(assetRecord)) ??
      pickCoverImageUrl(assetRecord),
  };
}
