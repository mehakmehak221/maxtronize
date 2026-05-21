import { unwrapPayload } from "@/lib/apiParse";
import {
  parseOnboardingDocuments,
  parseOnboardingState,
  type AccreditationPayload,
  type AssetDraftPayload,
  type CustodyPayload,
  type EntityPayload,
  type OnboardingDocument,
  type OnboardingState,
} from "@/lib/onboarding";
import {
  parseOnboardingProgress,
  parseOnboardingReview,
  parseStartOnboardingResponse,
  type LegalPayload,
  type OfferingPayload,
  type OnboardingProgress,
  type OnboardingReview,
  type StartOnboardingPayload,
  type TokenizationPayload,
} from "@/lib/onboardingDrafts";
import { baseApi } from "./baseApi";

function parseDraftResponse(response: unknown): OnboardingDraftPayload {
  const record = unwrapPayload(response);
  return record && typeof record === "object" && !Array.isArray(record)
    ? (record as OnboardingDraftPayload)
    : {};
}

export type OnboardingDraftPayload = Record<string, unknown>;

export const onboardingApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getOnboarding: build.query<OnboardingState | null, string>({
      query: (id) => ({ url: `/onboarding/${id}`, method: "GET" }),
      transformResponse: (response: unknown, _meta, id) =>
        parseOnboardingState(response, id),
      providesTags: (_result, _error, id) => [{ type: "Onboarding", id }],
    }),
    getAccreditation: build.query<OnboardingDraftPayload, string>({
      query: (id) => ({
        url: `/onboarding/${id}/accreditation`,
        method: "GET",
      }),
      transformResponse: parseDraftResponse,
      providesTags: (_result, _error, id) => [
        { type: "Onboarding", id: `${id}-accreditation` },
      ],
    }),
    updateAccreditation: build.mutation<
      OnboardingDraftPayload,
      { id: string; body: AccreditationPayload }
    >({
      query: ({ id, body }) => ({
        url: `/onboarding/${id}/accreditation`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Onboarding", id },
        { type: "Onboarding", id: `${id}-accreditation` },
      ],
    }),
    getAssetDraft: build.query<OnboardingDraftPayload, string>({
      query: (id) => ({ url: `/onboarding/${id}/asset`, method: "GET" }),
      transformResponse: parseDraftResponse,
      providesTags: (_result, _error, id) => [
        { type: "Onboarding", id: `${id}-asset` },
      ],
    }),
    updateAssetDraft: build.mutation<
      OnboardingDraftPayload,
      { id: string; body: AssetDraftPayload }
    >({
      query: ({ id, body }) => ({
        url: `/onboarding/${id}/asset`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Onboarding", id },
        { type: "Onboarding", id: `${id}-asset` },
      ],
    }),
    getCustody: build.query<OnboardingDraftPayload, string>({
      query: (id) => ({ url: `/onboarding/${id}/custody`, method: "GET" }),
      transformResponse: parseDraftResponse,
      providesTags: (_result, _error, id) => [
        { type: "Onboarding", id: `${id}-custody` },
      ],
    }),
    updateCustody: build.mutation<
      OnboardingDraftPayload,
      { id: string; body: CustodyPayload }
    >({
      query: ({ id, body }) => ({
        url: `/onboarding/${id}/custody`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Onboarding", id },
        { type: "Onboarding", id: `${id}-custody` },
      ],
    }),
    getEntity: build.query<OnboardingDraftPayload, string>({
      query: (id) => ({ url: `/onboarding/${id}/entity`, method: "GET" }),
      transformResponse: parseDraftResponse,
      providesTags: (_result, _error, id) => [
        { type: "Onboarding", id: `${id}-entity` },
      ],
    }),
    updateEntity: build.mutation<
      OnboardingDraftPayload,
      { id: string; body: EntityPayload }
    >({
      query: ({ id, body }) => ({
        url: `/onboarding/${id}/entity`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Onboarding", id },
        { type: "Onboarding", id: `${id}-entity` },
      ],
    }),
    listOnboardingDocuments: build.query<OnboardingDocument[], string>({
      query: (id) => ({
        url: `/onboarding/${id}/documents`,
        method: "GET",
      }),
      transformResponse: (response: unknown) => parseOnboardingDocuments(response),
      providesTags: (_result, _error, id) => [
        { type: "Onboarding", id: `${id}-documents` },
      ],
    }),
    uploadOnboardingDocument: build.mutation<
      OnboardingDocument | null,
      {
        id: string;
        file: File;
        type: string;
        metadata?: Record<string, unknown>;
      }
    >({
      query: ({ id, file, type, metadata }) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", type);
        if (metadata && Object.keys(metadata).length > 0) {
          formData.append("metadata", JSON.stringify(metadata));
        }
        return {
          url: `/onboarding/${id}/documents`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Onboarding", id },
        { type: "Onboarding", id: `${id}-documents` },
      ],
    }),
    deleteOnboardingDocument: build.mutation<
      void,
      { id: string; documentId: string }
    >({
      query: ({ id, documentId }) => ({
        url: `/onboarding/${id}/documents/${documentId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Onboarding", id },
        { type: "Onboarding", id: `${id}-documents` },
      ],
    }),
    getLegal: build.query<OnboardingDraftPayload, string>({
      query: (id) => ({ url: `/onboarding/${id}/legal`, method: "GET" }),
      transformResponse: parseDraftResponse,
      providesTags: (_result, _error, id) => [
        { type: "Onboarding", id: `${id}-legal` },
      ],
    }),
    updateLegal: build.mutation<
      OnboardingDraftPayload,
      { id: string; body: LegalPayload }
    >({
      query: ({ id, body }) => ({
        url: `/onboarding/${id}/legal`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Onboarding", id },
        { type: "Onboarding", id: `${id}-legal` },
        { type: "Onboarding", id: `${id}-progress` },
      ],
    }),
    getOffering: build.query<OnboardingDraftPayload, string>({
      query: (id) => ({ url: `/onboarding/${id}/offering`, method: "GET" }),
      transformResponse: parseDraftResponse,
      providesTags: (_result, _error, id) => [
        { type: "Onboarding", id: `${id}-offering` },
      ],
    }),
    updateOffering: build.mutation<
      OnboardingDraftPayload,
      { id: string; body: OfferingPayload }
    >({
      query: ({ id, body }) => ({
        url: `/onboarding/${id}/offering`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Onboarding", id },
        { type: "Onboarding", id: `${id}-offering` },
        { type: "Onboarding", id: `${id}-progress` },
      ],
    }),
    getTokenization: build.query<OnboardingDraftPayload, string>({
      query: (id) => ({
        url: `/onboarding/${id}/tokenization`,
        method: "GET",
      }),
      transformResponse: parseDraftResponse,
      providesTags: (_result, _error, id) => [
        { type: "Onboarding", id: `${id}-tokenization` },
      ],
    }),
    updateTokenization: build.mutation<
      OnboardingDraftPayload,
      { id: string; body: TokenizationPayload }
    >({
      query: ({ id, body }) => ({
        url: `/onboarding/${id}/tokenization`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Onboarding", id },
        { type: "Onboarding", id: `${id}-tokenization` },
        { type: "Onboarding", id: `${id}-progress` },
      ],
    }),
    getOnboardingProgress: build.query<OnboardingProgress | null, string>({
      query: (id) => ({ url: `/onboarding/${id}/progress`, method: "GET" }),
      transformResponse: (response: unknown) => parseOnboardingProgress(response),
      providesTags: (_result, _error, id) => [
        { type: "Onboarding", id: `${id}-progress` },
      ],
    }),
    getOnboardingReview: build.query<OnboardingReview | null, string>({
      query: (id) => ({ url: `/onboarding/${id}/review`, method: "GET" }),
      transformResponse: (response: unknown) => parseOnboardingReview(response),
      providesTags: (_result, _error, id) => [
        { type: "Onboarding", id: `${id}-review` },
      ],
    }),
    submitOnboarding: build.mutation<OnboardingDraftPayload, string>({
      query: (id) => ({
        url: `/onboarding/${id}/submit`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Onboarding", id },
        { type: "Onboarding", id: `${id}-progress` },
        { type: "Onboarding", id: `${id}-review` },
      ],
    }),
    startOnboarding: build.mutation<
      { id: string; progress: OnboardingProgress | null },
      StartOnboardingPayload
    >({
      query: (body) => ({
        url: "/onboarding/start",
        method: "POST",
        body,
      }),
      transformResponse: (response: unknown) =>
        parseStartOnboardingResponse(response) ?? { id: "", progress: null },
      invalidatesTags: [{ type: "Onboarding", id: "LIST" }],
    }),
  }),
});

export const {
  useGetOnboardingQuery,
  useGetAccreditationQuery,
  useUpdateAccreditationMutation,
  useGetAssetDraftQuery,
  useUpdateAssetDraftMutation,
  useGetCustodyQuery,
  useUpdateCustodyMutation,
  useGetEntityQuery,
  useUpdateEntityMutation,
  useGetLegalQuery,
  useUpdateLegalMutation,
  useGetOfferingQuery,
  useUpdateOfferingMutation,
  useGetTokenizationQuery,
  useUpdateTokenizationMutation,
  useGetOnboardingProgressQuery,
  useGetOnboardingReviewQuery,
  useSubmitOnboardingMutation,
  useStartOnboardingMutation,
  useListOnboardingDocumentsQuery,
  useUploadOnboardingDocumentMutation,
  useDeleteOnboardingDocumentMutation,
} = onboardingApi;
