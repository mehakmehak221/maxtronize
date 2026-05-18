import {
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
  }),
});

export const {
  useListInvestorHubInvestmentDocumentsQuery,
  useLazyGetInvestorHubInvestmentDocumentsDownloadAllQuery,
} = investorHubInvestmentDocumentsApi;
