import {
  parseInvestorHubAnalyticsInit,
  parseInvestorHubAnalyticsSummary,
  parseInvestorHubPerformance,
  type InvestorHubAnalyticsInit,
  type InvestorHubAnalyticsPeriod,
  type InvestorHubAnalyticsSummary,
  type InvestorHubPerformance,
} from "@/lib/investorHubAnalytics";
import { baseApi } from "./baseApi";

export const investorHubAnalyticsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getInvestorHubAnalyticsSummary: build.query<InvestorHubAnalyticsSummary, void>({
      query: () => ({
        url: "/investor/hub/analytics/summary",
        method: "GET",
      }),
      transformResponse: (response: unknown) =>
        parseInvestorHubAnalyticsSummary(response),
      providesTags: [{ type: "InvestorHubAnalytics", id: "SUMMARY" }],
    }),
    getInvestorHubAnalyticsInit: build.query<
      InvestorHubAnalyticsInit,
      { period?: InvestorHubAnalyticsPeriod } | void
    >({
      query: (params) => {
        const period = params?.period ?? "9m";
        return {
          url: `/investor/hub/analytics/init?period=${encodeURIComponent(period)}`,
          method: "GET",
        };
      },
      transformResponse: (response: unknown) =>
        parseInvestorHubAnalyticsInit(response),
      providesTags: [{ type: "InvestorHubAnalytics", id: "INIT" }],
    }),
    getInvestorHubAnalyticsPerformance: build.query<
      InvestorHubPerformance,
      { period?: InvestorHubAnalyticsPeriod } | void
    >({
      query: (params) => {
        const period = params?.period ?? "9m";
        return {
          url: `/investor/hub/analytics/performance?period=${encodeURIComponent(period)}`,
          method: "GET",
        };
      },
      transformResponse: (response: unknown) =>
        parseInvestorHubPerformance(response),
      providesTags: [{ type: "InvestorHubAnalytics", id: "PERFORMANCE" }],
    }),
  }),
});

export const {
  useGetInvestorHubAnalyticsSummaryQuery,
  useGetInvestorHubAnalyticsInitQuery,
  useGetInvestorHubAnalyticsPerformanceQuery,
} = investorHubAnalyticsApi;
