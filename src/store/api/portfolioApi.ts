import { getSession } from "@/lib/auth";
import {
  parseInvestorPortfolioInit,
  parsePortfolioAssets,
  parsePortfolioFilters,
  parsePortfolioSummary,
  parsePortfolioNavHistoryResult,
  type InvestorPortfolioInit,
  type PortfolioAsset,
  type PortfolioCategory,
  type PortfolioListResult,
  type PortfolioSummary,
  type PortfolioNavHistoryResult,
} from "@/lib/portfolio";
import { baseApi } from "./baseApi";

export type ListPortfolioAssetsParams = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
};

export const portfolioApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getInvestorPortfolioInit: build.query<InvestorPortfolioInit, void>({
      query: () => ({ url: "/investor/portfolio/init", method: "GET" }),
      transformResponse: (response: unknown) =>
        parseInvestorPortfolioInit(response),
      providesTags: [{ type: "Portfolio", id: "INVESTOR_INIT" }],
    }),
    getPortfolioFilters: build.query<PortfolioCategory[], void>({
      query: () => {
        const isInvestor = typeof window !== "undefined" && getSession().role === "investor";
        const url = isInvestor ? "/investor/portfolio/filters" : "/portfolio/filters";
        return { url, method: "GET" };
      },
      transformResponse: (response: unknown) => parsePortfolioFilters(response),
      providesTags: [{ type: "Portfolio", id: "FILTERS" }],
    }),
    getPortfolioSummary: build.query<PortfolioSummary, void>({
      query: () => {
        const isInvestor = typeof window !== "undefined" && getSession().role === "investor";
        const url = isInvestor ? "/investor/portfolio/summary" : "/portfolio/summary";
        return { url, method: "GET" };
      },
      transformResponse: (response: unknown) =>
        parsePortfolioSummary(response),
      providesTags: [{ type: "Portfolio", id: "SUMMARY" }],
    }),
    getPortfolioNavHistory: build.query<PortfolioNavHistoryResult, void>({
      query: () => {
        const isInvestor = typeof window !== "undefined" && getSession().role === "investor";
        const url = isInvestor ? "/investor/portfolio/nav-history" : "/portfolio/summary";
        return { url, method: "GET" };
      },
      transformResponse: (response: unknown) =>
        parsePortfolioNavHistoryResult(response),
      providesTags: [{ type: "Portfolio", id: "NAV_HISTORY" }],
    }),
    listPortfolioAssets: build.query<PortfolioListResult, ListPortfolioAssetsParams>({
      query: ({ page = 1, limit = 20, search, category }) => {
        const isInvestor = typeof window !== "undefined" && getSession().role === "investor";
        const url = isInvestor ? "/investor/portfolio/assets" : "/portfolio/assets";
        return {
          url,
          method: "GET",
          params: {
            page,
            limit,
            ...(search ? { search } : {}),
            ...(category && category !== "ALL" ? { category } : {}),
          },
        };
      },
      transformResponse: (response: unknown) => parsePortfolioAssets(response),
      providesTags: [{ type: "Portfolio", id: "ASSETS" }],
    }),
    /** Backend has no GET /portfolio/assets/:id — resolve from the list endpoint. */
    getPortfolioAsset: build.query<PortfolioAsset | null, string>({
      async queryFn(assetId, _api, _extraOptions, fetchWithBQ) {
        const isInvestor =
          typeof window !== "undefined" && getSession().role === "investor";
        const url = isInvestor
          ? "/investor/portfolio/assets"
          : "/portfolio/assets";
        const result = await fetchWithBQ({
          url,
          method: "GET",
          params: { page: 1, limit: 100 },
        });
        if (result.error) {
          return { error: result.error };
        }
        const parsed = parsePortfolioAssets(result.data);
        const asset =
          parsed.items.find((item) => item.id === assetId) ?? null;
        if (!asset) {
          return {
            error: {
              status: 404,
              data: { message: "Asset not found in portfolio" },
            },
          };
        }
        return { data: asset };
      },
      providesTags: (_result, _error, id) => [{ type: "Portfolio", id }],
    }),
  }),
});

export const {
  useGetInvestorPortfolioInitQuery,
  useGetPortfolioFiltersQuery,
  useGetPortfolioSummaryQuery,
  useGetPortfolioNavHistoryQuery,
  useListPortfolioAssetsQuery,
  useGetPortfolioAssetQuery,
} = portfolioApi;
