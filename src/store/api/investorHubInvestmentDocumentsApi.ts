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
              if (status === 404) continue;
              throw result.error;
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
            throw docResult.error;
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
