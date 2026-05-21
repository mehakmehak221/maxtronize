import {
  buildOpportunitiesQueryString,
  parseMarketplaceFeatured,
  parseMarketplaceFilters,
  parseMarketplaceOpportunities,
  parseOpportunityDetail,
  parseOpportunityDocuments,
  parseOpportunityFinancials,
  parseOpportunityInit,
  parseMarketplaceInvestment,
  parseMarketplaceInvestPreview,
  parseMarketplaceInvestResponse,
  parseOpportunityOverview,
  parseMarketplaceStats,
  type ListMarketplaceOpportunitiesParams,
  type MarketplaceInvestment,
  type MarketplaceInvestPreview,
  type MarketplaceInvestResponse,
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

    getMarketplaceInvestment: build.query<MarketplaceInvestment | null, string>({
      query: (investmentId) => ({
        url: `/investor/marketplace/investments/${investmentId}`,
        method: "GET",
      }),
      transformResponse: (response: unknown) =>
        parseMarketplaceInvestment(response),
      providesTags: (result, error, investmentId) => [
        { type: "InvestorMarketplace", id: `INVESTMENT_${investmentId}` },
      ],
    }),

    getMarketplaceOpportunityInvestPreview: build.query<
      MarketplaceInvestPreview,
      {
        id: string;
        amount?: number;
        currency?: string;
        walletId?: string;
      }
    >({
      query: ({ id, amount, currency, walletId }) => ({
        url: `/investor/marketplace/opportunities/${id}/invest-preview`,
        method: "GET",
        params: {
          ...(amount != null ? { amount, investmentAmount: amount } : {}),
          ...(currency ? { currency } : {}),
          ...(walletId ? { walletId } : {}),
        },
      }),
      transformResponse: (response: unknown) =>
        parseMarketplaceInvestPreview(response),
      providesTags: (result, error, { id }) => [
        { type: "InvestorMarketplace", id: `${id}_INVEST_PREVIEW` },
      ],
    }),

    investInMarketplaceOpportunity: build.mutation<
      MarketplaceInvestResponse,
      {
        id: string;
        amount: number;
        currency?: string;
        walletId?: string;
        tokenAmount?: number | null;
      }
    >({
      query: ({ id, amount, currency, walletId, tokenAmount }) => ({
        url: `/investor/marketplace/opportunities/${id}/invest`,
        method: "POST",
        body: {
          amount,
          investmentAmount: amount,
          ...(currency ? { currency } : {}),
          ...(walletId ? { walletId } : {}),
          ...(tokenAmount != null ? { tokenAmount } : {}),
        },
      }),
      transformResponse: (response: unknown) =>
        parseMarketplaceInvestResponse(response),
      invalidatesTags: (result, error, { id }) => [
        { type: "InvestorMarketplace", id },
        { type: "InvestorMarketplace", id: `${id}_INIT` },
        { type: "InvestorMarketplace", id: `${id}_OVERVIEW` },
        { type: "InvestorMarketplace", id: `${id}_INVEST_PREVIEW` },
        { type: "InvestorMarketplace", id: "LIST" },
        { type: "InvestorMarketplace", id: "FEATURED" },
      ],
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
  useGetMarketplaceInvestmentQuery,
  useGetMarketplaceOpportunityInvestPreviewQuery,
  useGetMarketplaceOpportunityOverviewQuery,
  useInvestInMarketplaceOpportunityMutation,
  useAddOpportunityToWatchlistMutation,
  useRemoveOpportunityFromWatchlistMutation,
} = investorMarketplaceApi;
