import {
  downloadInvestmentDocumentViaProxy,
  downloadResolvedInvestmentDocument,
  investmentDocumentDownloadAllPaths,
  parseInvestmentDocumentDownloadUrl,
  parseInvestmentHubDocuments,
  parseInvestmentHubDocumentsDownloadAll,
  type InvestmentHubDocumentsDownloadAll,
  type InvestmentHubDocumentsResult,
} from "@/lib/investorHubInvestmentDocuments";
import { parseProfile } from "@/lib/profile";
import { parseOnboardingDocuments } from "@/lib/onboarding";
import { baseApi } from "./baseApi";

export const investorHubInvestmentDocumentsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    listInvestorHubInvestmentDocuments: build.query<
      InvestmentHubDocumentsResult,
      void
    >({
      query: () => ({
        url: "/investor/hub/investment-documents",
        method: "GET",
      }),
      transformResponse: (response: unknown) =>
        parseInvestmentHubDocuments(response),
      providesTags: [{ type: "InvestorHubInvestmentDocuments", id: "LIST" }],
    }),
    getInvestorHubInvestmentDocumentsDownloadAll: build.query<
      InvestmentHubDocumentsDownloadAll,
      void
    >({
      query: () => ({
        url: "/investor/hub/investment-documents/download-all",
        method: "GET",
      }),
      transformResponse: (response: unknown) =>
        parseInvestmentHubDocumentsDownloadAll(response),
    }),
    downloadInvestorHubInvestmentDocument: build.mutation<
      { success: true },
      { id: string; filename: string }
    >({
      async queryFn({ id, filename }, _api, _extraOptions, baseQuery) {
        try {
          for (const url of investmentDocumentDownloadAllPaths(id)) {
            const result = await baseQuery({ url, method: "GET" });
            if (result.error) {
              const status =
                typeof result.error === "object" &&
                result.error !== null &&
                "status" in result.error
                  ? Number(result.error.status)
                  : 0;
              if (status === 401) {
                throw result.error;
              }
              continue;
            }

            const parsed = parseInvestmentHubDocumentsDownloadAll(result.data);
            if (parsed.files.length > 0) {
              await downloadResolvedInvestmentDocument(parsed.files, filename);
              return { data: { success: true as const } };
            }
          }

          const docResult = await baseQuery({
            url: `/investor/documents/${encodeURIComponent(id)}`,
            method: "GET",
          });
          if (docResult.error) {
            // Fallback for onboarding/KYC documents
            const profileResult = await baseQuery({
              url: "/auth/profile",
              method: "GET",
            });
            if (!profileResult.error && profileResult.data) {
              const profile = parseProfile(profileResult.data);
              const onboardingId = profile?.onboardingId;
              if (onboardingId) {
                const onboardingDocsResult = await baseQuery({
                  url: `/onboarding/${onboardingId}/documents`,
                  method: "GET",
                });
                if (!onboardingDocsResult.error && onboardingDocsResult.data) {
                  const onboardingDocs = parseOnboardingDocuments(onboardingDocsResult.data);
                  const targetDoc = onboardingDocs.find(
                    (d) =>
                      d.id === id ||
                      d.id === id.replace(/^kyc-/, "") ||
                      id === `kyc-${d.id}`
                  );
                  if (targetDoc?.url) {
                    await downloadInvestmentDocumentViaProxy(targetDoc.url, filename);
                    return { data: { success: true as const } };
                  }
                }
              }
            }

            const errMsg =
              typeof docResult.error === "object" &&
              docResult.error !== null &&
              "data" in docResult.error &&
              typeof (docResult.error as Record<string, unknown>).data === "object" &&
              (docResult.error as Record<string, unknown>).data !== null
                ? ((docResult.error as any).data.message || (docResult.error as any).data.error)
                : null;
            throw new Error(errMsg || `Failed to retrieve document (status: ${docResult.error.status})`);
          }

          const signedUrl = parseInvestmentDocumentDownloadUrl(docResult.data);
          if (!signedUrl) {
            throw new Error("No download URL available for this document.");
          }
          await downloadInvestmentDocumentViaProxy(signedUrl, filename);
          return { data: { success: true as const } };
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : typeof error === "object" && error !== null && "error" in error
              ? String((error as any).error)
              : "Unable to download this document.";
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: message,
              data: { message },
            },
          };
        }
      },
    }),
  }),
});

export const {
  useListInvestorHubInvestmentDocumentsQuery,
  useLazyGetInvestorHubInvestmentDocumentsDownloadAllQuery,
  useDownloadInvestorHubInvestmentDocumentMutation,
} = investorHubInvestmentDocumentsApi;
