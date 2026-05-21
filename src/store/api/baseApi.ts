import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = typeof window !== "undefined" ? window.localStorage.getItem("access_token") : null;
      if (token && token !== "demo-session") {
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
