import {
  parseInvestorHubMonthlyEarnings,
  parseInvestorHubOverviewAllocation,
  parseInvestorHubOverviewHeader,
  parseInvestorHubOverviewInit,
  parseInvestorHubOverviewSummary,
  type InvestorHubMonthlyEarnings,
  type InvestorHubOverviewAllocation,
  type InvestorHubOverviewHeader,
  type InvestorHubOverviewInit,
  type InvestorHubOverviewPeriod,
  type InvestorHubOverviewSummary,
} from "@/lib/investorHubOverview";
import { baseApi } from "./baseApi";

export const investorHubOverviewApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getInvestorHubOverviewInit: build.query<
      InvestorHubOverviewInit,
      { period?: InvestorHubOverviewPeriod } | void
    >({
      query: (params) => {
        const period = params?.period ?? "9m";
        return {
          url: `/investor/hub/overview/init?period=${encodeURIComponent(period)}`,
          method: "GET",
        };
      },
      transformResponse: (response: unknown) =>
        parseInvestorHubOverviewInit(response),
      providesTags: [{ type: "InvestorHubOverview", id: "INIT" }],
    }),
    getInvestorHubOverviewHeader: build.query<InvestorHubOverviewHeader, void>({
      query: () => ({ url: "/investor/hub/overview/header", method: "GET" }),
      transformResponse: (response: unknown) =>
        parseInvestorHubOverviewHeader(response),
      providesTags: [{ type: "InvestorHubOverview", id: "HEADER" }],
    }),
    getInvestorHubOverviewSummary: build.query<InvestorHubOverviewSummary, void>({
      query: () => ({ url: "/investor/hub/overview/summary", method: "GET" }),
      transformResponse: (response: unknown) =>
        parseInvestorHubOverviewSummary(response),
      providesTags: [{ type: "InvestorHubOverview", id: "SUMMARY" }],
    }),
    getInvestorHubOverviewAllocation: build.query<
      InvestorHubOverviewAllocation,
      void
    >({
      query: () => ({ url: "/investor/hub/overview/allocation", method: "GET" }),
      transformResponse: (response: unknown) =>
        parseInvestorHubOverviewAllocation(response),
      providesTags: [{ type: "InvestorHubOverview", id: "ALLOCATION" }],
    }),
    getInvestorHubOverviewMonthlyEarnings: build.query<
      InvestorHubMonthlyEarnings,
      { period?: InvestorHubOverviewPeriod } | void
    >({
      query: (params) => {
        const period = params?.period ?? "9m";
        return {
          url: `/investor/hub/overview/monthly-earnings?period=${encodeURIComponent(period)}`,
          method: "GET",
        };
      },
      transformResponse: (response: unknown) =>
        parseInvestorHubMonthlyEarnings(response),
      providesTags: [{ type: "InvestorHubOverview", id: "MONTHLY_EARNINGS" }],
    }),
  }),
});

export const {
  useGetInvestorHubOverviewInitQuery,
  useGetInvestorHubOverviewHeaderQuery,
  useGetInvestorHubOverviewSummaryQuery,
  useGetInvestorHubOverviewAllocationQuery,
  useGetInvestorHubOverviewMonthlyEarningsQuery,
} = investorHubOverviewApi;
