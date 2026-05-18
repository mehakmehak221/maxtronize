import {
  parseInvestorHubTabs,
  type InvestorHubTabsResult,
} from "@/lib/investorHubTabs";
import { baseApi } from "./baseApi";

export const investorHubTabsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getInvestorHubTabs: build.query<InvestorHubTabsResult, void>({
      query: () => ({
        url: "/investor/hub/tabs",
        method: "GET",
      }),
      transformResponse: (response: unknown) =>
        parseInvestorHubTabs(response),
      providesTags: [{ type: "InvestorHubTabs", id: "LIST" }],
    }),
  }),
});

export const { useGetInvestorHubTabsQuery } = investorHubTabsApi;
