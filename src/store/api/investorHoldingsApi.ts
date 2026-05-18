import {
  parseInvestorHolding,
  parseInvestorHoldingsList,
  type InvestorHolding,
  type InvestorHoldingsListResult,
  type ListInvestorHoldingsParams,
} from "@/lib/investorHoldings";
import { baseApi } from "./baseApi";

export const investorHoldingsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    listInvestorHoldings: build.query<
      InvestorHoldingsListResult,
      ListInvestorHoldingsParams | void
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        const p = params ?? {};
        if (p.page != null) searchParams.set("page", String(p.page));
        if (p.limit != null) searchParams.set("limit", String(p.limit));
        if (p.search?.trim()) searchParams.set("search", p.search.trim());
        if (p.status?.trim()) searchParams.set("status", p.status.trim());
        const qs = searchParams.toString();
        return {
          url: `/investor/holdings${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
      transformResponse: (response: unknown) =>
        parseInvestorHoldingsList(response),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((holding) => ({
                type: "InvestorHoldings" as const,
                id: holding.id,
              })),
              { type: "InvestorHoldings", id: "LIST" },
            ]
          : [{ type: "InvestorHoldings", id: "LIST" }],
    }),
    getInvestorHolding: build.query<InvestorHolding | null, string>({
      query: (id) => ({ url: `/investor/holdings/${id}`, method: "GET" }),
      transformResponse: (response: unknown) => parseInvestorHolding(response),
      providesTags: (_result, _error, id) => [
        { type: "InvestorHoldings", id },
      ],
    }),
  }),
});

export const {
  useListInvestorHoldingsQuery,
  useGetInvestorHoldingQuery,
} = investorHoldingsApi;
