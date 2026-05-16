import {
  buildHubQueryString,
  parseHubAssetsSummary,
  parseHubCapTableList,
  parseHubCapTableSummary,
  parseHubCapitalVelocity,
  parseHubComplianceSummary,
  parseHubInvestorsList,
  parseHubInvestorsSummary,
  parseHubOverviewActivity,
  parseHubOverviewSummary,
  parseHubRegulatoryStatusList,
  parseIssuerHubAssetsList,
  type HubAssetsSummary,
  type HubCapTableListResult,
  type HubCapTableSummary,
  type HubCapitalVelocity,
  type HubComplianceSummary,
  type HubInvestorsListResult,
  type HubInvestorsSummary,
  type HubOverviewActivityResult,
  type HubOverviewSummary,
  type HubRegulatoryStatusListResult,
  type IssuerHubAssetsListResult,
  type ListHubCapTableParams,
  type ListHubOverviewActivityParams,
  type ListHubRegulatoryStatusParams,
  type ListHubInvestorsParams,
  type ListIssuerHubAssetsParams,
} from "@/lib/issuerHub";
import {
  downloadBlob,
  parseContentDispositionFilename,
} from "@/lib/issuerHubDownload";
import { baseApi } from "./baseApi";

function hubListQuery(
  path: string,
  params: Record<string, string | number | undefined | null>,
) {
  return { url: `${path}${buildHubQueryString(params)}`, method: "GET" as const };
}

async function exportCsvHandler(response: Response, fallbackFilename: string) {
  const blob = await response.blob();
  const filename = parseContentDispositionFilename(
    response.headers.get("content-disposition"),
    fallbackFilename,
  );
  downloadBlob(blob, filename);
  return { success: true as const };
}

export const issuerHubApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getIssuerHubOverviewSummary: build.query<HubOverviewSummary, void>({
      query: () => ({ url: "/issuer/hub/overview/summary", method: "GET" }),
      transformResponse: (response: unknown) =>
        parseHubOverviewSummary(response),
      providesTags: [{ type: "IssuerHub", id: "OVERVIEW_SUMMARY" }],
    }),
    getIssuerHubCapitalVelocity: build.query<
      HubCapitalVelocity,
      { weeks?: number } | void
    >({
      query: (params) =>
        hubListQuery("/issuer/hub/overview/capital-velocity", {
          weeks: params?.weeks ?? 12,
        }),
      transformResponse: (response: unknown) =>
        parseHubCapitalVelocity(response),
      providesTags: [{ type: "IssuerHub", id: "CAPITAL_VELOCITY" }],
    }),
    getIssuerHubOverviewActivity: build.query<
      HubOverviewActivityResult,
      ListHubOverviewActivityParams | void
    >({
      query: (params) => {
        const p = params ?? {};
        return hubListQuery("/issuer/hub/overview/recent-activity", {
          page: p.page,
          limit: p.limit,
        });
      },
      transformResponse: (response: unknown) =>
        parseHubOverviewActivity(response),
      providesTags: [{ type: "IssuerHub", id: "OVERVIEW_ACTIVITY" }],
    }),
    getIssuerHubInvestorsSummary: build.query<HubInvestorsSummary, void>({
      query: () => ({ url: "/issuer/hub/investors/summary", method: "GET" }),
      transformResponse: (response: unknown) =>
        parseHubInvestorsSummary(response),
      providesTags: [{ type: "IssuerHub", id: "INVESTORS_SUMMARY" }],
    }),
    listIssuerHubAssets: build.query<
      IssuerHubAssetsListResult,
      ListIssuerHubAssetsParams | void
    >({
      query: (params) => {
        const p = params ?? {};
        return hubListQuery("/issuer/hub/assets", {
          page: p.page,
          limit: p.limit,
          search: p.search,
          displayStatus: p.displayStatus,
        });
      },
      transformResponse: (response: unknown) => parseIssuerHubAssetsList(response),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((asset) => ({
                type: "IssuerHub" as const,
                id: asset.id,
              })),
              { type: "IssuerHub", id: "ASSETS_LIST" },
            ]
          : [{ type: "IssuerHub", id: "ASSETS_LIST" }],
    }),
    getIssuerHubAssetsSummary: build.query<HubAssetsSummary, void>({
      query: () => ({ url: "/issuer/hub/assets/summary", method: "GET" }),
      transformResponse: (response: unknown) => parseHubAssetsSummary(response),
      providesTags: [{ type: "IssuerHub", id: "ASSETS_SUMMARY" }],
    }),
    getIssuerHubCapTableSummary: build.query<HubCapTableSummary, void>({
      query: () => ({ url: "/issuer/hub/cap-table/summary", method: "GET" }),
      transformResponse: (response: unknown) => parseHubCapTableSummary(response),
      providesTags: [{ type: "IssuerHub", id: "CAP_TABLE_SUMMARY" }],
    }),
    listIssuerHubCapTable: build.query<
      HubCapTableListResult,
      ListHubCapTableParams | void
    >({
      query: (params) => {
        const p = params ?? {};
        return hubListQuery("/issuer/hub/cap-table", {
          page: p.page,
          limit: p.limit,
          search: p.search,
          status: p.status,
          assetId: p.assetId,
        });
      },
      transformResponse: (response: unknown) => parseHubCapTableList(response),
      providesTags: [{ type: "IssuerHub", id: "CAP_TABLE_LIST" }],
    }),
    exportIssuerHubCapTable: build.mutation<
      { success: true },
      ListHubCapTableParams | void
    >({
      query: (params) => {
        const p = params ?? {};
        return {
          ...hubListQuery("/issuer/hub/cap-table/export", {
            page: p.page,
            limit: p.limit,
            search: p.search,
            status: p.status,
            assetId: p.assetId,
          }),
          responseHandler: (response) =>
            exportCsvHandler(response, "cap-table.csv"),
        };
      },
    }),
    listIssuerHubInvestors: build.query<
      HubInvestorsListResult,
      ListHubInvestorsParams | void
    >({
      query: (params) => {
        const p = params ?? {};
        return hubListQuery("/issuer/hub/investors", {
          page: p.page,
          limit: p.limit,
          search: p.search,
          kycStatus: p.kycStatus,
          accreditationStatus: p.accreditationStatus,
          source: p.source,
          assetId: p.assetId,
          bucket: p.bucket,
        });
      },
      transformResponse: (response: unknown) => parseHubInvestorsList(response),
      providesTags: [{ type: "IssuerHub", id: "INVESTORS_LIST" }],
    }),
    exportIssuerHubInvestors: build.mutation<
      { success: true },
      ListHubInvestorsParams | void
    >({
      query: (params) => {
        const p = params ?? {};
        return {
          ...hubListQuery("/issuer/hub/investors/export", {
            page: p.page,
            limit: p.limit,
            search: p.search,
            kycStatus: p.kycStatus,
            accreditationStatus: p.accreditationStatus,
            source: p.source,
            assetId: p.assetId,
            bucket: p.bucket,
          }),
          responseHandler: (response) =>
            exportCsvHandler(response, "investor-registry.csv"),
        };
      },
    }),
    getIssuerHubComplianceSummary: build.query<HubComplianceSummary, void>({
      query: () => ({ url: "/issuer/hub/compliance/summary", method: "GET" }),
      transformResponse: (response: unknown) =>
        parseHubComplianceSummary(response),
      providesTags: [{ type: "IssuerHub", id: "COMPLIANCE_SUMMARY" }],
    }),
    listIssuerHubRegulatoryStatus: build.query<
      HubRegulatoryStatusListResult,
      ListHubRegulatoryStatusParams | void
    >({
      query: (params) => {
        const p = params ?? {};
        return hubListQuery("/issuer/hub/compliance/regulatory-status", {
          page: p.page,
          limit: p.limit,
          search: p.search,
          status: p.status,
          type: p.type,
          assetId: p.assetId,
        });
      },
      transformResponse: (response: unknown) =>
        parseHubRegulatoryStatusList(response),
      providesTags: [{ type: "IssuerHub", id: "REGULATORY_STATUS" }],
    }),
    exportIssuerHubRegulatoryStatus: build.mutation<
      { success: true },
      ListHubRegulatoryStatusParams | void
    >({
      query: (params) => {
        const p = params ?? {};
        return {
          ...hubListQuery("/issuer/hub/compliance/regulatory-status/export", {
            page: p.page,
            limit: p.limit,
            search: p.search,
            status: p.status,
            type: p.type,
            assetId: p.assetId,
          }),
          responseHandler: (response) =>
            exportCsvHandler(response, "compliance-report.csv"),
        };
      },
    }),
  }),
});

export const {
  useGetIssuerHubOverviewSummaryQuery,
  useGetIssuerHubCapitalVelocityQuery,
  useGetIssuerHubOverviewActivityQuery,
  useGetIssuerHubInvestorsSummaryQuery,
  useListIssuerHubAssetsQuery,
  useGetIssuerHubAssetsSummaryQuery,
  useGetIssuerHubCapTableSummaryQuery,
  useListIssuerHubCapTableQuery,
  useExportIssuerHubCapTableMutation,
  useListIssuerHubInvestorsQuery,
  useExportIssuerHubInvestorsMutation,
  useGetIssuerHubComplianceSummaryQuery,
  useListIssuerHubRegulatoryStatusQuery,
  useExportIssuerHubRegulatoryStatusMutation,
} = issuerHubApi;
