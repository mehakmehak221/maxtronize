import {
  parseSecondaryChart,
  parseSecondaryFilters,
  parseSecondaryListingDetail,
  parseSecondaryListings,
  parseSecondaryStats,
  type SecondaryChartResult,
  type SecondaryListing,
  type SecondaryMarketFilters,
  type SecondaryMarketListingsResult,
  type SecondaryMarketStats,
} from "@/lib/secondaryMarket";
import { baseApi } from "./baseApi";

export type ListSecondaryMarketParams = {
  page?: number;
  limit?: number;
  search?: string;
  liquidityLevel?: string;
};

export type PlaceSecondaryOrderParams = {
  id: string;
  side: "BUY" | "SELL";
  orderType: "LIMIT" | "MARKET";
  tokenAmount: number;
  pricePerToken: number;
};

export const secondaryMarketApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getSecondaryFilters: build.query<SecondaryMarketFilters, void>({
      query: () => ({
        url: "/investor/secondary-market/filters",
        method: "GET",
      }),
      transformResponse: (response: unknown) => parseSecondaryFilters(response),
      providesTags: [{ type: "SecondaryMarket", id: "FILTERS" }],
    }),

    listSecondaryListings: build.query<
      SecondaryMarketListingsResult,
      ListSecondaryMarketParams | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params) {
          if (params.page != null) queryParams.set("page", String(params.page));
          if (params.limit != null) queryParams.set("limit", String(params.limit));
          if (params.search?.trim()) queryParams.set("search", params.search.trim());
          if (params.liquidityLevel?.trim())
            queryParams.set("liquidityLevel", params.liquidityLevel.trim());
        }
        const qs = queryParams.toString();
        return {
          url: `/investor/secondary-market/listings${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
      transformResponse: (response: unknown) => parseSecondaryListings(response),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((listing) => ({
                type: "SecondaryMarket" as const,
                id: listing.id,
              })),
              { type: "SecondaryMarket", id: "LIST" },
            ]
          : [{ type: "SecondaryMarket", id: "LIST" }],
    }),

    getSecondaryListing: build.query<SecondaryListing | null, string>({
      query: (id) => ({
        url: `/investor/secondary-market/listings/${id}`,
        method: "GET",
      }),
      transformResponse: (response: unknown) => parseSecondaryListingDetail(response),
      providesTags: (result, error, id) => [{ type: "SecondaryMarket", id }],
    }),

    getSecondaryAssetChart: build.query<SecondaryChartResult, string>({
      query: (assetId) => ({
        url: `/investor/secondary-market/assets/${assetId}/chart`,
        method: "GET",
      }),
      transformResponse: (response: unknown) => parseSecondaryChart(response),
      providesTags: (result, error, assetId) => [{ type: "SecondaryMarket", id: `CHART_${assetId}` }],
    }),

    getSecondaryStats: build.query<SecondaryMarketStats, void>({
      query: () => ({
        url: "/investor/secondary-market/stats",
        method: "GET",
      }),
      transformResponse: (response: unknown) => parseSecondaryStats(response),
      providesTags: [{ type: "SecondaryMarket", id: "STATS" }],
    }),

    placeSecondaryOrder: build.mutation<unknown, PlaceSecondaryOrderParams>({
      query: ({ id, ...body }) => ({
        url: `/investor/secondary-market/listings/${id}/orders`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "SecondaryMarket", id },
        { type: "SecondaryMarket", id: "LIST" },
        { type: "SecondaryMarket", id: "STATS" },
      ],
    }),
  }),
});

export const {
  useGetSecondaryFiltersQuery,
  useListSecondaryListingsQuery,
  useGetSecondaryListingQuery,
  useGetSecondaryAssetChartQuery,
  useGetSecondaryStatsQuery,
  usePlaceSecondaryOrderMutation,
} = secondaryMarketApi;
