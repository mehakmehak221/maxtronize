import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getStoredAccessToken } from "@/lib/authToken";

const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = getStoredAccessToken();
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "User",
    "Asset",
    "Onboarding",
    "IssuerDocuments",
    "IssuerDashboard",
    "InvestorDashboard",
    "InvestorDocuments",
    "InvestorHoldings",
    "InvestorHubAnalytics",
    "InvestorHubDistributions",
    "InvestorHubInvestmentDocuments",
    "InvestorHubOverview",
    "InvestorHubTabs",
    "InvestorHubTransactions",
    "InvestorTransactions",
    "InvestorMarketplace",
    "SecondaryMarket",
    "IssuerHub",
    "Portfolio",
    "Yield",
  ],
  endpoints: () => ({}),
});
