import {
  parseIssuerAssetsList,
  parseIssuerCapitalRaised,
  parseIssuerDashboardAllocation,
  parseIssuerDashboardSummary,
  parseIssuerRecentActivity,
  parseIssuerTokenTicker,
  parseIssuerUpcomingEvents,
  type CapitalRaisedPeriod,
  type IssuerAssetsListResult,
  type IssuerCapitalRaised,
  type IssuerDashboardAllocation,
  type IssuerDashboardSummary,
  type IssuerRecentActivityResult,
  type ListIssuerAssetsParams,
  type ListRecentActivityParams,
  type TokenTickerItem,
  type UpcomingEventItem,
} from "@/lib/issuerDashboard";
import { baseApi } from "./baseApi";

export const issuerDashboardApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getIssuerDashboardSummary: build.query<IssuerDashboardSummary, void>({
      query: () => ({ url: "/issuer/dashboard/summary", method: "GET" }),
      transformResponse: (response: unknown) =>
        parseIssuerDashboardSummary(response),
      providesTags: [{ type: "IssuerDashboard", id: "SUMMARY" }],
    }),
    getIssuerCapitalRaised: build.query<
      IssuerCapitalRaised,
      { period?: CapitalRaisedPeriod } | void
    >({
      query: (params) => {
        const period = params?.period ?? "9m";
        return {
          url: `/issuer/dashboard/capital-raised?period=${encodeURIComponent(period)}`,
          method: "GET",
        };
      },
      transformResponse: (response: unknown) =>
        parseIssuerCapitalRaised(response),
      providesTags: [{ type: "IssuerDashboard", id: "CAPITAL_RAISED" }],
    }),
    getIssuerDashboardAllocation: build.query<IssuerDashboardAllocation, void>({
      query: () => ({ url: "/issuer/dashboard/allocation", method: "GET" }),
      transformResponse: (response: unknown) =>
        parseIssuerDashboardAllocation(response),
      providesTags: [{ type: "IssuerDashboard", id: "ALLOCATION" }],
    }),
    getIssuerTokenTicker: build.query<TokenTickerItem[], void>({
      query: () => ({ url: "/issuer/dashboard/token-ticker", method: "GET" }),
      transformResponse: (response: unknown) => parseIssuerTokenTicker(response),
      providesTags: [{ type: "IssuerDashboard", id: "TOKEN_TICKER" }],
    }),
    getIssuerRecentActivity: build.query<
      IssuerRecentActivityResult,
      ListRecentActivityParams | void
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        const p = params ?? {};
        if (p.page != null) searchParams.set("page", String(p.page));
        if (p.limit != null) searchParams.set("limit", String(p.limit));
        const qs = searchParams.toString();
        return {
          url: `/issuer/dashboard/recent-activity${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
      transformResponse: (response: unknown) =>
        parseIssuerRecentActivity(response),
      providesTags: [{ type: "IssuerDashboard", id: "RECENT_ACTIVITY" }],
    }),
    getIssuerUpcomingEvents: build.query<UpcomingEventItem[], void>({
      query: () => ({
        url: "/issuer/dashboard/upcoming-events",
        method: "GET",
      }),
      transformResponse: (response: unknown) => parseIssuerUpcomingEvents(response),
      providesTags: [{ type: "IssuerDashboard", id: "UPCOMING_EVENTS" }],
    }),
    listIssuerAssets: build.query<IssuerAssetsListResult, ListIssuerAssetsParams | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        const p = params ?? {};
        if (p.page != null) searchParams.set("page", String(p.page));
        if (p.limit != null) searchParams.set("limit", String(p.limit));
        if (p.status?.trim()) searchParams.set("status", p.status.trim());
        const qs = searchParams.toString();
        return {
          url: `/issuer/assets${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
      transformResponse: (response: unknown) => parseIssuerAssetsList(response),
      providesTags: [{ type: "IssuerDashboard", id: "ASSETS" }],
    }),
  }),
});

export const {
  useGetIssuerDashboardSummaryQuery,
  useGetIssuerCapitalRaisedQuery,
  useGetIssuerDashboardAllocationQuery,
  useGetIssuerTokenTickerQuery,
  useGetIssuerRecentActivityQuery,
  useGetIssuerUpcomingEventsQuery,
  useListIssuerAssetsQuery,
} = issuerDashboardApi;
