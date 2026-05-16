import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl,
    // Backend auth uses an HttpOnly `access_token` cookie (set on login/register).
    credentials: "include",
  }),
  tagTypes: [
    "User",
    "Asset",
    "Onboarding",
    "IssuerDocuments",
    "IssuerDashboard",
    "IssuerHub",
    "Portfolio",
    "Yield",
  ],
  endpoints: () => ({}),
});
