import {
  parseDistributionSchedule,
  parseUpcomingPayouts,
  parseYieldAssetBreakdown,
  parseYieldSummary,
  type DistributionSchedule,
  type UpcomingPayout,
  type YieldAssetBreakdownRow,
  type YieldSummary,
} from "@/lib/yield";
import { baseApi } from "./baseApi";

export const yieldApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getYieldSummary: build.query<YieldSummary, void>({
      query: () => ({ url: "/yield/summary", method: "GET" }),
      transformResponse: (response: unknown) => parseYieldSummary(response),
      providesTags: [{ type: "Yield", id: "SUMMARY" }],
    }),
    getDistributionSchedule: build.query<
      DistributionSchedule,
      { year?: number } | void
    >({
      query: (params) => ({
        url: "/yield/distribution-schedule",
        method: "GET",
        params: params?.year ? { year: params.year } : undefined,
      }),
      transformResponse: (response: unknown) => parseDistributionSchedule(response),
      providesTags: (_result, _error, params) => [
        { type: "Yield", id: `SCHEDULE-${params?.year ?? "current"}` },
      ],
    }),
    getUpcomingPayouts: build.query<UpcomingPayout[], void>({
      query: () => ({ url: "/yield/upcoming-payouts", method: "GET" }),
      transformResponse: (response: unknown) => parseUpcomingPayouts(response),
      providesTags: [{ type: "Yield", id: "UPCOMING" }],
    }),
    getYieldAssetBreakdown: build.query<YieldAssetBreakdownRow[], void>({
      query: () => ({ url: "/yield/asset-breakdown", method: "GET" }),
      transformResponse: (response: unknown) => parseYieldAssetBreakdown(response),
      providesTags: [{ type: "Yield", id: "BREAKDOWN" }],
    }),
  }),
});

export const {
  useGetYieldSummaryQuery,
  useGetDistributionScheduleQuery,
  useGetUpcomingPayoutsQuery,
  useGetYieldAssetBreakdownQuery,
} = yieldApi;
