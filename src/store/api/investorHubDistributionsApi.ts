import {
  buildDistributionsQueryString,
  parseInvestorDistributionsList,
  parseInvestorDistributionsSummary,
  type InvestorDistributionsListResult,
  type InvestorDistributionsSummary,
  type ListInvestorDistributionsParams,
} from "@/lib/investorHubDistributions";
import {
  downloadBlob,
  parseContentDispositionFilename,
} from "@/lib/issuerHubDownload";
import { baseApi } from "./baseApi";

async function exportCsvHandler(response: Response, fallbackFilename: string) {
  const blob = await response.blob();
  const filename = parseContentDispositionFilename(
    response.headers.get("content-disposition"),
    fallbackFilename,
  );
  downloadBlob(blob, filename);
  return { success: true as const };
}

export const investorHubDistributionsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getInvestorHubDistributionsSummary: build.query<
      InvestorDistributionsSummary,
      void
    >({
      query: () => ({
        url: "/investor/hub/distributions/summary",
        method: "GET",
      }),
      transformResponse: (response: unknown) =>
        parseInvestorDistributionsSummary(response),
      providesTags: [{ type: "InvestorHubDistributions", id: "SUMMARY" }],
    }),
    listInvestorHubDistributions: build.query<
      InvestorDistributionsListResult,
      ListInvestorDistributionsParams | void
    >({
      query: (params) => ({
        url: `/investor/hub/distributions${buildDistributionsQueryString(params ?? {})}`,
        method: "GET",
      }),
      transformResponse: (response: unknown) =>
        parseInvestorDistributionsList(response),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((item) => ({
                type: "InvestorHubDistributions" as const,
                id: item.id,
              })),
              { type: "InvestorHubDistributions", id: "LIST" },
            ]
          : [{ type: "InvestorHubDistributions", id: "LIST" }],
    }),
    exportInvestorHubDistributions: build.mutation<
      { success: true },
      ListInvestorDistributionsParams | void
    >({
      query: (params) => ({
        url: `/investor/hub/distributions/export${buildDistributionsQueryString(params ?? {})}`,
        method: "GET",
        responseHandler: (response) =>
          exportCsvHandler(response, "distributions.csv"),
      }),
    }),
  }),
});

export const {
  useGetInvestorHubDistributionsSummaryQuery,
  useListInvestorHubDistributionsQuery,
  useExportInvestorHubDistributionsMutation,
} = investorHubDistributionsApi;
