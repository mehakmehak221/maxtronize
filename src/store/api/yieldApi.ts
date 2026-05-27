import {
  parseDistributionHistory,
  parseDistributionSchedule,
  parsePayoutDetails,
  parseProjectionResponse,
  parseUpcomingPayouts,
  parseYieldAssetBreakdown,
  parseYieldSummary,
  type DistributionHistoryItem,
  type DistributionSchedule,
  type PayoutDetails,
  type ProjectionRequest,
  type ProjectionResponse,
  type SchedulePayoutRequest,
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
      transformResponse: (response: unknown) =>
        parseDistributionSchedule(response),
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
      transformResponse: (response: unknown) =>
        parseYieldAssetBreakdown(response),
      providesTags: [{ type: "Yield", id: "BREAKDOWN" }],
    }),
    getDistributionHistory: build.query<
      DistributionHistoryItem[],
      { year?: number } | void
    >({
      query: (params) => ({
        url: "/yield/distribution-history",
        method: "GET",
        params: params?.year ? { year: params.year } : undefined,
      }),
      transformResponse: (response: unknown) =>
        parseDistributionHistory(response),
      providesTags: (_result, _error, params) => [
        { type: "Yield", id: `HISTORY-${params?.year ?? "current"}` },
      ],
    }),
    schedulePayout: build.mutation<unknown, SchedulePayoutRequest>({
      query: (body) => ({
        url: "/yield/schedule-payout",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Yield", id: "UPCOMING" },
        { type: "Yield", id: "SCHEDULE-*" },
      ],
    }),
    cancelPayout: build.mutation<unknown, string>({
      query: (id) => ({
        url: `/yield/${id}/cancel`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Yield", id: "UPCOMING" },
        { type: "Yield", id: "SCHEDULE-*" },
      ],
    }),
    processPayout: build.mutation<unknown, string>({
      query: (id) => ({
        url: `/yield/${id}/process-payout`,
        method: "POST",
      }),
      invalidatesTags: [
        { type: "Yield", id: "UPCOMING" },
        { type: "Yield", id: "SCHEDULE-*" },
      ],
    }),
    setProjection: build.mutation<ProjectionResponse, ProjectionRequest>({
      query: (body) => ({
        url: "/yield/projection",
        method: "POST",
        body,
      }),
      transformResponse: (response: unknown) =>
        parseProjectionResponse(response),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Yield", id: `SCHEDULE-${arg.year}` },
      ],
    }),
  }),
});

export const {
  useGetYieldSummaryQuery,
  useGetDistributionScheduleQuery,
  useGetUpcomingPayoutsQuery,
  useGetYieldAssetBreakdownQuery,
  useGetDistributionHistoryQuery,
  useSchedulePayoutMutation,
  useCancelPayoutMutation,
  useProcessPayoutMutation,
  useSetProjectionMutation,
} = yieldApi;
