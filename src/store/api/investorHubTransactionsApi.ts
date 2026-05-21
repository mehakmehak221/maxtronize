import {
  buildTransactionsQueryString,
  parseInvestorHubTransactionFilters,
  parseInvestorHubTransactions,
  type InvestorHubTransactionFilters,
  type InvestorHubTransactionsResult,
  type ListInvestorHubTransactionsParams,
} from "@/lib/investorHubTransactions";
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

export const investorHubTransactionsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    listInvestorHubTransactions: build.query<
      InvestorHubTransactionsResult,
      ListInvestorHubTransactionsParams | void
    >({
      query: (params) => ({
        url: `/investor/hub/transactions${buildTransactionsQueryString(params ?? {})}`,
        method: "GET",
      }),
      transformResponse: (response: unknown) =>
        parseInvestorHubTransactions(response),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((tx) => ({
                type: "InvestorHubTransactions" as const,
                id: tx.id,
              })),
              { type: "InvestorHubTransactions", id: "LIST" },
            ]
          : [{ type: "InvestorHubTransactions", id: "LIST" }],
    }),

    getInvestorHubTransactionFilters: build.query<
      InvestorHubTransactionFilters,
      void
    >({
      query: () => ({
        url: "/investor/hub/transactions/filters",
        method: "GET",
      }),
      transformResponse: (response: unknown) =>
        parseInvestorHubTransactionFilters(response),
      providesTags: [{ type: "InvestorHubTransactions", id: "FILTERS" }],
    }),

    exportInvestorHubTransactions: build.mutation<
      { success: true },
      ListInvestorHubTransactionsParams | void
    >({
      query: (params) => ({
        url: `/investor/hub/transactions/export${buildTransactionsQueryString(params ?? {})}`,
        method: "GET",
        responseHandler: (response) =>
          exportCsvHandler(response, "transactions.csv"),
      }),
    }),
  }),
});

export const {
  useListInvestorHubTransactionsQuery,
  useGetInvestorHubTransactionFiltersQuery,
  useExportInvestorHubTransactionsMutation,
} = investorHubTransactionsApi;
