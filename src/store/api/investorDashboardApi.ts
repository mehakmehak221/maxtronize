import {
  parseInvestorCapitalDeployed,
  parseInvestorDashboardInit,
  parseInvestorDashboardOverview,
  parseInvestorDashboardSummary,
  parseInvestorUpcomingEvents,
  type CapitalRaisedPeriod,
  type InvestorCapitalDeployed,
  type InvestorDashboardInit,
  type InvestorDashboardOverview,
  type InvestorDashboardSummary,
} from "@/lib/investorDashboard";
import {
  parseIssuerDashboardAllocation,
  parseIssuerRecentActivity,
  parseIssuerTokenTicker,
  type IssuerDashboardAllocation,
  type IssuerRecentActivityResult,
  type TokenTickerItem,
  type UpcomingEventItem,
} from "@/lib/issuerDashboard";
import { baseApi } from "./baseApi";

export type ListInvestorRecentActivityParams = {
  page?: number;
  limit?: number;
};

export const investorDashboardApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getInvestorDashboardInit: build.query<
      InvestorDashboardInit,
      { period?: CapitalRaisedPeriod } | void
    >({
      query: (params) => {
        const period = params?.period ?? "9m";
        return {
          url: `/investor/dashboard/init?period=${encodeURIComponent(period)}`,
          method: "GET",
        };
      },
      transformResponse: (response: unknown) =>
        parseInvestorDashboardInit(response),
      providesTags: [{ type: "InvestorDashboard", id: "INIT" }],
    }),
    getInvestorDashboardOverview: build.query<InvestorDashboardOverview, void>({
      query: () => ({ url: "/investor/dashboard/overview", method: "GET" }),
      transformResponse: (response: unknown) =>
        parseInvestorDashboardOverview(response),
      providesTags: [{ type: "InvestorDashboard", id: "OVERVIEW" }],
    }),
    getInvestorDashboardSummary: build.query<InvestorDashboardSummary, void>({
      query: () => ({ url: "/investor/dashboard/summary", method: "GET" }),
      transformResponse: (response: unknown) =>
        parseInvestorDashboardSummary(response),
      providesTags: [{ type: "InvestorDashboard", id: "SUMMARY" }],
    }),
    getInvestorDashboardAllocation: build.query<IssuerDashboardAllocation, void>({
      query: () => ({ url: "/investor/dashboard/allocation", method: "GET" }),
      transformResponse: (response: unknown) =>
        parseIssuerDashboardAllocation(response),
      providesTags: [{ type: "InvestorDashboard", id: "ALLOCATION" }],
    }),
    getInvestorCapitalDeployed: build.query<
      InvestorCapitalDeployed,
      { period?: CapitalRaisedPeriod } | void
    >({
      query: (params) => {
        const period = params?.period ?? "9m";
        return {
          url: `/investor/dashboard/capital-deployed?period=${encodeURIComponent(period)}`,
          method: "GET",
        };
      },
      transformResponse: (response: unknown) =>
        parseInvestorCapitalDeployed(response),
      providesTags: [{ type: "InvestorDashboard", id: "CAPITAL_DEPLOYED" }],
    }),
    getInvestorTokenTicker: build.query<TokenTickerItem[], void>({
      query: () => ({ url: "/investor/dashboard/token-ticker", method: "GET" }),
      transformResponse: (response: unknown) => parseIssuerTokenTicker(response),
      providesTags: [{ type: "InvestorDashboard", id: "TOKEN_TICKER" }],
    }),
    getInvestorRecentActivity: build.query<
      IssuerRecentActivityResult,
      ListInvestorRecentActivityParams | void
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        const p = params ?? {};
        if (p.page != null) searchParams.set("page", String(p.page));
        if (p.limit != null) searchParams.set("limit", String(p.limit));
        const qs = searchParams.toString();
        return {
          url: `/investor/dashboard/recent-activity${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
      transformResponse: (response: unknown) =>
        parseIssuerRecentActivity(response),
      providesTags: [{ type: "InvestorDashboard", id: "RECENT_ACTIVITY" }],
    }),
    getInvestorUpcomingEvents: build.query<UpcomingEventItem[], void>({
      query: () => ({
        url: "/investor/dashboard/upcoming-events",
        method: "GET",
      }),
      transformResponse: (response: unknown) =>
        parseInvestorUpcomingEvents(response),
      providesTags: [{ type: "InvestorDashboard", id: "UPCOMING_EVENTS" }],
    }),
  }),
});

export const {
  useGetInvestorDashboardInitQuery,
  useGetInvestorDashboardOverviewQuery,
  useGetInvestorDashboardSummaryQuery,
  useGetInvestorDashboardAllocationQuery,
  useGetInvestorCapitalDeployedQuery,
  useGetInvestorTokenTickerQuery,
  useGetInvestorRecentActivityQuery,
  useGetInvestorUpcomingEventsQuery,
} = investorDashboardApi;
