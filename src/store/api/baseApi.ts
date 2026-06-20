import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { getStoredAccessToken, clearAccessToken } from "@/lib/authToken";
import { signOut } from "@/lib/auth";

const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = getStoredAccessToken();
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    clearAccessToken();
    signOut();
    api.dispatch(baseApi.util.resetApiState());
    if (typeof window !== "undefined") {
      window.location.href = "/signin";
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
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
