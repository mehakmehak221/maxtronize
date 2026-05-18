import {
  buildOpportunitiesQueryString,
  parseMarketplaceFeatured,
  parseMarketplaceFilters,
  parseMarketplaceOpportunities,
  parseOpportunityDetail,
  parseOpportunityDocuments,
  parseOpportunityFinancials,
  parseOpportunityInit,
  parseOpportunityOverview,
  parseMarketplaceStats,
  type ListMarketplaceOpportunitiesParams,
  type MarketplaceFilters,
  type MarketplaceOpportunitiesResult,
  type OpportunityFinancial,
  type OpportunityInit,
  type OpportunityOverview,
  type MarketplaceStats,
} from "@/lib/investorMarketplace";
import type { AssetDetail, AssetDocument, MarketplaceAsset } from "@/lib/assets";
import { baseApi } from "./baseApi";

export const investorMarketplaceApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getMarketplaceFeatured: build.query<MarketplaceAsset[], void>({
      query: () => ({
        url: "/investor/marketplace/featured",
        method: "GET",
      }),
      transformResponse: (response: unknown) =>
        parseMarketplaceFeatured(response),
      providesTags: [{ type: "InvestorMarketplace", id: "FEATURED" }],
    }),

    getMarketplaceFilters: build.query<MarketplaceFilters, void>({
      query: () => ({
        url: "/investor/marketplace/filters",
        method: "GET",
      }),
      transformResponse: (response: unknown) =>
        parseMarketplaceFilters(response),
      providesTags: [{ type: "InvestorMarketplace", id: "FILTERS" }],
    }),

    getMarketplaceStats: build.query<MarketplaceStats, void>({
      query: () => ({
        url: "/investor/marketplace/stats",
        method: "GET",
      }),
      transformResponse: (response: unknown) =>
        parseMarketplaceStats(response),
      providesTags: [{ type: "InvestorMarketplace", id: "STATS" }],
    }),

    listMarketplaceOpportunities: build.query<
      MarketplaceOpportunitiesResult,
      ListMarketplaceOpportunitiesParams | void
    >({
      query: (params) => ({
        url: `/investor/marketplace/opportunities${buildOpportunitiesQueryString(params ?? {})}`,
        method: "GET",
      }),
      transformResponse: (response: unknown) =>
        parseMarketplaceOpportunities(response),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((asset) => ({
                type: "InvestorMarketplace" as const,
                id: asset.id,
              })),
              { type: "InvestorMarketplace", id: "LIST" },
            ]
          : [{ type: "InvestorMarketplace", id: "LIST" }],
    }),

    getMarketplaceOpportunity: build.query<AssetDetail | null, string>({
      query: (id) => ({
        url: `/investor/marketplace/opportunities/${id}`,
        method: "GET",
      }),
      transformResponse: (response: unknown) => parseOpportunityDetail(response),
      providesTags: (result, error, id) => [{ type: "InvestorMarketplace", id }],
    }),

    getMarketplaceOpportunityDocuments: build.query<AssetDocument[], string>({
      query: (id) => ({
        url: `/investor/marketplace/opportunities/${id}/documents`,
        method: "GET",
      }),
      transformResponse: (response: unknown) => parseOpportunityDocuments(response),
      providesTags: (result, error, id) => [{ type: "InvestorMarketplace", id: `${id}_DOCS` }],
    }),

    getMarketplaceOpportunityFinancials: build.query<OpportunityFinancial[], string>({
      query: (id) => ({
        url: `/investor/marketplace/opportunities/${id}/financials`,
        method: "GET",
      }),
      transformResponse: (response: unknown) => parseOpportunityFinancials(response),
      providesTags: (result, error, id) => [{ type: "InvestorMarketplace", id: `${id}_FINANCIALS` }],
    }),

    getMarketplaceOpportunityInit: build.query<OpportunityInit, string>({
      query: (id) => ({
        url: `/investor/marketplace/opportunities/${id}/init`,
        method: "GET",
      }),
      transformResponse: (response: unknown) => parseOpportunityInit(response),
      providesTags: (result, error, id) => [{ type: "InvestorMarketplace", id: `${id}_INIT` }],
    }),

    getMarketplaceOpportunityOverview: build.query<OpportunityOverview, string>({
      query: (id) => ({
        url: `/investor/marketplace/opportunities/${id}/overview`,
        method: "GET",
      }),
      transformResponse: (response: unknown) => parseOpportunityOverview(response),
      providesTags: (result, error, id) => [{ type: "InvestorMarketplace", id: `${id}_OVERVIEW` }],
    }),

    addOpportunityToWatchlist: build.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/investor/marketplace/opportunities/${id}/watchlist`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "InvestorMarketplace", id },
        { type: "InvestorMarketplace", id: "LIST" },
        { type: "InvestorMarketplace", id: "FEATURED" },
      ],
    }),

    removeOpportunityFromWatchlist: build.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/investor/marketplace/opportunities/${id}/watchlist`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "InvestorMarketplace", id },
        { type: "InvestorMarketplace", id: "LIST" },
        { type: "InvestorMarketplace", id: "FEATURED" },
      ],
    }),
  }),
});

export const {
  useGetMarketplaceFeaturedQuery,
  useGetMarketplaceFiltersQuery,
  useGetMarketplaceStatsQuery,
  useListMarketplaceOpportunitiesQuery,
  useGetMarketplaceOpportunityQuery,
  useGetMarketplaceOpportunityDocumentsQuery,
  useGetMarketplaceOpportunityFinancialsQuery,
  useGetMarketplaceOpportunityInitQuery,
  useGetMarketplaceOpportunityOverviewQuery,
  useAddOpportunityToWatchlistMutation,
  useRemoveOpportunityFromWatchlistMutation,
} = investorMarketplaceApi;
