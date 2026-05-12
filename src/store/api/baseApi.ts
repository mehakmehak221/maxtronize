import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: rawBaseUrl.replace(/\/$/, ""),
    prepareHeaders: (headers) => {
      if (typeof window !== "undefined") {
        const token = window.localStorage.getItem("access_token");
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),
  tagTypes: [],
  endpoints: () => ({}),
});
