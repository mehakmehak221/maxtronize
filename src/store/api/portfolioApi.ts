import {
  parsePortfolioAssets,
  parsePortfolioFilters,
  parsePortfolioSummary,
  parsePortfolioNavHistory,
  type PortfolioCategory,
  type PortfolioListResult,
  type PortfolioSummary,
  type PortfolioNavPoint,
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
    getPortfolioFilters: build.query<PortfolioCategory[], void>({
      query: () => ({ url: "/investor/portfolio/filters", method: "GET" }),
      transformResponse: (response: unknown) => parsePortfolioFilters(response),
      providesTags: [{ type: "Portfolio", id: "FILTERS" }],
    }),
    getPortfolioSummary: build.query<PortfolioSummary, void>({
      query: () => ({
        url: "/investor/portfolio/summary",
        method: "GET",
      }),
      transformResponse: (response: unknown) =>
        parsePortfolioSummary(response),
      providesTags: [{ type: "Portfolio", id: "SUMMARY" }],
    }),
    getPortfolioNavHistory: build.query<PortfolioNavPoint[], void>({
      query: () => ({
        url: "/investor/portfolio/nav-history",
        method: "GET",
      }),
      transformResponse: (response: unknown) =>
        parsePortfolioNavHistory(response),
      providesTags: [{ type: "Portfolio", id: "NAV_HISTORY" }],
    }),
    listPortfolioAssets: build.query<PortfolioListResult, ListPortfolioAssetsParams>({
      query: ({ page = 1, limit = 20, search, category }) => ({
        url: "/investor/portfolio/assets",
        method: "GET",
        params: {
          page,
          limit,
          ...(search ? { search } : {}),
          ...(category && category !== "ALL" ? { category } : {}),
        },
      }),
      transformResponse: (response: unknown) => parsePortfolioAssets(response),
      providesTags: [{ type: "Portfolio", id: "ASSETS" }],
    }),
  }),
});

export const {
  useGetPortfolioFiltersQuery,
  useGetPortfolioSummaryQuery,
  useGetPortfolioNavHistoryQuery,
  useListPortfolioAssetsQuery,
} = portfolioApi;
