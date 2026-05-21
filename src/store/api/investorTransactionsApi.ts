import {
  buildTransactionsQueryString,
  parseInvestorHubTransactions,
  type InvestorHubTransactionsResult,
  type ListInvestorHubTransactionsParams,
} from "@/lib/investorHubTransactions";
import { baseApi } from "./baseApi";

export const investorTransactionsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    listInvestorTransactions: build.query<
      InvestorHubTransactionsResult,
      ListInvestorHubTransactionsParams | void
    >({
      query: (params) => ({
        url: `/investor/transactions${buildTransactionsQueryString(params ?? {})}`,
        method: "GET",
      }),
      transformResponse: (response: unknown) =>
        parseInvestorHubTransactions(response),
      providesTags: [{ type: "InvestorTransactions", id: "LIST" }],
    }),
  }),
});

export const { useListInvestorTransactionsQuery } = investorTransactionsApi;
