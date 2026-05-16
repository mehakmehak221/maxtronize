import {
  parsePortfolioAssets,
  parsePortfolioFilters,
  parsePortfolioSummary,
  type PortfolioCategory,
  type PortfolioListResult,
  type PortfolioSummary,
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
      query: () => ({ url: "/portfolio/filters", method: "GET" }),
      transformResponse: (response: unknown) => parsePortfolioFilters(response),
      providesTags: [{ type: "Portfolio", id: "FILTERS" }],
    }),
    getPortfolioSummary: build.query<PortfolioSummary, { months: number }>({
      query: ({ months }) => ({
        url: "/portfolio/summary",
        method: "GET",
        params: { months },
      }),
      transformResponse: (response: unknown, _meta, { months }) =>
        parsePortfolioSummary(response, months),
      providesTags: [{ type: "Portfolio", id: "SUMMARY" }],
    }),
    listPortfolioAssets: build.query<PortfolioListResult, ListPortfolioAssetsParams>({
      query: ({ page = 1, limit = 20, search, category }) => ({
        url: "/portfolio/assets",
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
  useListPortfolioAssetsQuery,
} = portfolioApi;
